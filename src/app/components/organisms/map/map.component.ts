import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  effect,
  ElementRef,
  inject,
  Injector,
  ViewChild,
  ViewContainerRef,
  type OnInit,
  untracked,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MarkerComponent } from '../../atoms/marker/marker.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { CountriesService } from '../../../services/countries.service';
import { CountriesMapSearchComponent } from '../../molecules/countries-map-search/countries-map-search.component';
import { MapsService } from '../../../services/maps.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { MarkerMapInformation } from '../../atoms/marker/marker.component.model';
import { ErrorToastComponent } from '../../atoms/error-toast/error-toast.component';
import {
  INITIAL_CENTER_COORDINATES,
  INITIAL_ZOOM_LEVEL,
  MAX_HEIGHT_FOR_MARKERS_PHOTO,
  MAX_WIDTH_FOR_MARKERS_PHOTO,
  STROKE_COLOR_FOR_POLYLINES,
  STROKE_WEIGHT_FOR_POLYLINES,
  Z_INDEX_FOR_MARKERS,
} from '../helpers';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule, CountriesMapSearchComponent, ErrorToastComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLDivElement>;

  countriesService = inject(CountriesService);
  mapService = inject(MapsService);
  selectedDirection = toSignal(this.countriesService.selectedDirection);
  selectedCountry = toSignal(this.countriesService.selectedCountry);
  showCountrySelector = true;
  map: google.maps.Map | null = null;
  private advancedMarkers: any[] = [];
  private markerEntries: Array<{
    marker: google.maps.marker.AdvancedMarkerElement;
    ref: ComponentRef<MarkerComponent>;
    info: MarkerMapInformation;
  }> = [];
  private infoWindow: google.maps.InfoWindow | null = null;
  private placePhotoCache = new Map<string, string>();
  private lastInfoUuid: string | null = null;
  private directionsService: google.maps.DirectionsService | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;
  totalDistanceKm: number | null = null;
  isRouting = false;
  showError = false;
  errorMessage =
    'No fue posible trazar la ruta en vehículo. Prueba con otro país o selecciona puntos más cercanos.';

  get hasEnoughMarkers(): boolean {
    const list = this.countriesService.markers();
    return Array.isArray(list) && list.length >= 2;
  }

  constructor(
    private vcr: ViewContainerRef,
    private injector: Injector,
    private mapsLoader: GoogleMapsLoaderService,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      if (!this.hasSelectedCountry()) {
        this.cleanMarkers();
        this.resetRouteAndDistance();
        this.closeInfoWindowSafe();
        return;
      }
      this.generateMarkers();
    });
    effect(() => {
      const sel = this.selectedDirection();
      this.markerEntries.forEach((entry) => {
        entry.ref.instance.isSelected.set(entry.info.uuid === sel);
        entry.marker.zIndex = entry.info.uuid === sel ? 1000 : 10;
      });
      if (sel && sel !== this.lastInfoUuid) {
        const entry = this.markerEntries.find((e) => e.info.uuid === sel);
        if (entry) {
          this.openInfoForEntry(entry);
        }
      }
      if (!sel) {
        this.closeInfoWindowSafe();
      }
    });
  }

  /**
   * Initializes the Google Map after the view is ready.
   */
  ngAfterViewInit() {
    this.createMap();
  }

  ngOnInit(): void {}

  /**
   * Returns true when a country is currently selected.
   */
  private hasSelectedCountry(): boolean {
    return !!this.selectedCountry();
  }

  /**
   * Clears the current directions from the map and resets routing state.
   */
  private resetRouteAndDistance(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.set('directions', null as any);
    }
    this.totalDistanceKm = null;
    this.isRouting = false;
    this.cdr.markForCheck();
  }

  /**
   * Safely closes the currently open InfoWindow, if any.
   */
  private closeInfoWindowSafe(): void {
    try {
      this.infoWindow?.close();
    } catch {}
  }

  /**
   * Fits the map bounds to the provided list of marker coordinates.
   * @param markerList List of marker info with lat/lng.
   */
  private fitBoundsForMarkers(markerList: MarkerMapInformation[]): void {
    if (!markerList.length || !this.map) return;
    const bounds = new google.maps.LatLngBounds();
    markerList.forEach((m) => bounds.extend(new google.maps.LatLng(m.lat, m.lng)));
    this.map.fitBounds(bounds);
  }

  /**
   * Creates all map markers from the current data source and wires their interactions.
   */
  generateMarkers() {
    this.cleanMarkers();
    this.resetRouteAndDistance();
    if (!this.hasSelectedCountry()) return;
    const markerList = this.countriesService.markers() ?? [];
    const currentSelected = untracked(() => this.selectedDirection());
    markerList.forEach((markerInfo) => {
      const markerRef: ComponentRef<MarkerComponent> = this.vcr.createComponent(MarkerComponent, {
        injector: this.injector,
      });

      const markerElement = markerRef.location.nativeElement;
      markerRef.instance.isSelected.set(markerInfo.uuid === currentSelected);
      markerRef.instance.markerInformation.set(markerInfo);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat: markerInfo.lat, lng: markerInfo.lng },
        content: markerElement,
        zIndex: Z_INDEX_FOR_MARKERS,
        collisionBehavior: google.maps.CollisionBehavior.REQUIRED,
      });
      this.markerEntries.push({ marker, ref: markerRef, info: markerInfo });
      marker.addListener('gmp-click', async () => {
        this.countriesService.selectedDirection.next(markerInfo.uuid);
      });
      this.advancedMarkers.push(marker);
    });
    this.fitBoundsForMarkers(markerList);
  }

  cleanMarkers() {
    this.advancedMarkers.forEach((marker) => marker.setMap(null));
    this.markerEntries.forEach((entry) => {
      try {
        entry.ref.destroy();
      } catch {}
    });
    this.markerEntries = [];
    this.advancedMarkers = [];
  }

  /**
   * Loads the Google Maps script (if needed) and initializes the map and related services.
   */
  async createMap() {
    await this.mapsLoader.load();
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: INITIAL_CENTER_COORDINATES,
      zoom: INITIAL_ZOOM_LEVEL,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      rotateControl: false,
      mapId: this.mapService.getMapId(),
    });
    this.infoWindow = new google.maps.InfoWindow();
    this.map.addListener('click', () => this.infoWindow?.close());

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: STROKE_COLOR_FOR_POLYLINES,
        strokeWeight: STROKE_WEIGHT_FOR_POLYLINES,
      },
    });
  }

  /**
   * Handles back button click from the country selector overlay.
   */
  onBackButtonClick() {
    this.showCountrySelector = false;
    this.showError = false;
  }

  /**
   * Displays the country selector overlay.
   */
  showSelector() {
    this.showCountrySelector = true;
    this.showError = false;
  }

  /**
   * Builds the InfoWindow HTML content for a marker.
   * @param markerInfo Marker information with label and coordinates.
   * @param photoUrl Optional photo URL to include in the content.
   * @returns HTML string for the InfoWindow content.
   */
  private buildInfoContent(markerInfo: MarkerMapInformation, photoUrl?: string): string {
    const place = markerInfo.label ?? '';
    const lat = markerInfo.lat?.toFixed ? markerInfo.lat.toFixed(5) : markerInfo.lat;
    const lng = markerInfo.lng?.toFixed ? markerInfo.lng.toFixed(5) : markerInfo.lng;
    return `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 8px 10px;">
        ${photoUrl ? `<img src="${photoUrl}" alt="${place}" style="width: 240px; height: auto; border-radius: 8px; display:block; margin-bottom:8px;" />` : ''}
        <div style="font-weight: 700; margin-bottom: 4px;">${place}</div>
        <div style="font-size: 12px; color: #777; margin-top: 6px;">${lat}, ${lng}</div>
      </div>
    `;
  }

  /**
   * Opens the InfoWindow for the provided marker entry with optional nearby photo.
   * @param entry Marker entry containing marker instance and info.
   */
  private async openInfoForEntry(entry: {
    marker: google.maps.marker.AdvancedMarkerElement;
    info: MarkerMapInformation;
  }) {
    try {
      const { info, marker } = entry;
      const photoUrl = await this.getNearbyPhotoUrl(info.lat, info.lng);
      const html = this.buildInfoContent(info, photoUrl ?? undefined);
      this.infoWindow?.setContent(html);
      this.infoWindow?.open({ anchor: marker, map: this.map! });
      this.lastInfoUuid = info.uuid as any;
    } catch {
      const { info, marker } = entry;
      const html = this.buildInfoContent(info);
      try {
        this.infoWindow?.setContent(html);
        this.infoWindow?.open({ anchor: marker, map: this.map! });
      } catch {}
      this.lastInfoUuid = info.uuid as any;
    }
  }

  /**
   * Traces an optimized driving route through all current markers and computes total distance.
   */
  traceOptimizedRoute() {
    if (!this.hasSelectedCountry()) return;
    const markers = this.countriesService.markers() ?? [];
    if (!this.map || !this.directionsService || !this.directionsRenderer || markers.length < 2)
      return;

    const origin = { lat: markers[0].lat, lng: markers[0].lng };
    const destination = {
      lat: markers[markers.length - 1].lat,
      lng: markers[markers.length - 1].lng,
    };
    const waypoints = markers
      .slice(1, -1)
      .map((m) => ({ location: new google.maps.LatLng(m.lat, m.lng), stopover: true }));

    this.isRouting = true;
    this.cdr.markForCheck();
    this.directionsService
      .route({
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      })
      .then((res) => {
        this.directionsRenderer!.setDirections(res);
        let meters = 0;
        res.routes[0]?.legs?.forEach((leg) => (meters += leg.distance?.value ?? 0));
        this.totalDistanceKm = +(meters / 1000).toFixed(2);
        const bounds = res.routes[0]?.bounds;
        if (bounds) this.map!.fitBounds(bounds);
        this.isRouting = false;
        this.cdr.markForCheck();
      })
      .catch((err) => {
        console.error('Directions error', err);
        this.showError = true;
        this.errorMessage = 'Esta ruta no es posible en auto. Selecciona otro país.';
        this.isRouting = false;
        this.cdr.markForCheck();
      });
  }

  /**
   * Retrieves a nearby place photo URL for the provided coordinates using Places API.
   * Results are cached by coordinate key.
   * @param lat Latitude.
   * @param lng Longitude.
   * @returns A photo URL or null if none found/available.
   */
  private async getNearbyPhotoUrl(lat: number, lng: number): Promise<string | null> {
    try {
      const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      const cached = this.placePhotoCache.get(cacheKey);
      if (cached) return cached;

      const placesNS = (google.maps as any).places;
      if (!placesNS?.PlacesService) return null;

      return await new Promise((resolve) => {
        const service = new placesNS.PlacesService(this.map!);
        service.nearbySearch(
          { location: new google.maps.LatLng(lat, lng), radius: 250 },
          (results: any[], status: any) => {
            if (status !== placesNS.PlacesServiceStatus.OK || !results?.length)
              return resolve(null);
            const withPhoto = results.find(
              (r: any) => Array.isArray(r.photos) && r.photos.length > 0,
            );
            if (!withPhoto) return resolve(null);
            const url = withPhoto.photos[0].getUrl({
              maxWidth: MAX_WIDTH_FOR_MARKERS_PHOTO,
              maxHeight: MAX_HEIGHT_FOR_MARKERS_PHOTO,
            });
            this.placePhotoCache.set(cacheKey, url);
            resolve(url);
          },
        );
      });
    } catch {
      return null;
    }
  }
}
