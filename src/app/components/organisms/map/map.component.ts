import {
  ChangeDetectionStrategy,
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

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule, CountriesMapSearchComponent],
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
  private markerEntries: Array<{ marker: any; ref: ComponentRef<MarkerComponent>; info: any }> = [];
  private infoWindow: google.maps.InfoWindow | null = null;

  constructor(private vcr: ViewContainerRef, private injector: Injector, private mapsLoader: GoogleMapsLoaderService) {
    effect(() => {
      this.generateMarkers();
    });
    effect(() => {
      const sel = this.selectedDirection();
      this.markerEntries.forEach((entry) => {
        entry.ref.instance.isSelected.set(entry.info.uuid === sel);
      });
    });
  }

  ngAfterViewInit() {
    this.createMap();
  }

  ngOnInit(): void {}

  generateMarkers() {
    this.cleanMarkers();
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
      });
  this.markerEntries.push({ marker, ref: markerRef, info: markerInfo });
      marker.addListener('gmp-click', () => {
        const html = this.buildInfoContent(markerInfo);
        this.infoWindow?.setContent(html);
        this.infoWindow?.open({ anchor: marker, map: this.map! });
        this.countriesService.selectedDirection.next(markerInfo.uuid);
      });
      this.advancedMarkers.push(marker);
    });
    if (markerList.length > 0 && this.map) {
      const bounds = new google.maps.LatLngBounds();
      markerList.forEach(marker => {
        bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
      });
      this.map.fitBounds(bounds);
    }
  }

  cleanMarkers() {
    this.advancedMarkers.forEach(marker => marker.setMap(null));
    this.markerEntries.forEach(entry => {
      try { entry.ref.destroy(); } catch {}
    });
    this.markerEntries = [];
    this.advancedMarkers = [];
  }

  async createMap() {
    await this.mapsLoader.load();
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: 40.4168, lng: -3.7038 },
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      rotateControl: false,
      mapId: this.mapService.getMapId(),
    });
  this.infoWindow = new google.maps.InfoWindow();
  this.map.addListener('click', () => this.infoWindow?.close());
  }

  onBackButtonClick() {
    this.showCountrySelector = false;
  }

  showSelector() {
    this.showCountrySelector = true;
  }

  private buildInfoContent(markerInfo: MarkerMapInformation): string {
    const place = markerInfo.label ?? '';
    const lat = markerInfo.lat?.toFixed ? markerInfo.lat.toFixed(5) : markerInfo.lat;
    const lng = markerInfo.lng?.toFixed ? markerInfo.lng.toFixed(5) : markerInfo.lng;
    return `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 8px 10px;">
        <div style="font-weight: 700; margin-bottom: 4px;">${place}</div>
        <div style="font-size: 12px; color: #777; margin-top: 6px;">${lat}, ${lng}</div>
      </div>
    `;
  }
}
