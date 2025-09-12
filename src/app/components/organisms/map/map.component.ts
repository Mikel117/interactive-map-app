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
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MarkerMapInformation } from '../../atoms/marker/marker.component.model';
import { MarkerComponent } from '../../atoms/marker/marker.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { CountriesService } from '../../../services/countries.service';
import { CountriesMapSearchComponent } from '../../molecules/countries-map-search/countries-map-search.component';

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
  selectedDirection = toSignal(this.countriesService.selectedDirection);
  map: google.maps.Map | null = null;
  private advancedMarkers: any[] = [];

  constructor(private vcr: ViewContainerRef, private injector: Injector) {
    effect(() => {
      this.generateMarkers();
    });
  }

  ngAfterViewInit() {
    this.createMap();
  }

  ngOnInit(): void {}

  generateMarkers() {
    this.cleanMarkers();
    const markerList = this.countriesService.markers() ?? [];
    markerList.forEach((markerInfo) => {
      const markerRef: ComponentRef<MarkerComponent> = this.vcr.createComponent(MarkerComponent, {
        injector: this.injector,
      });
      
      const markerElement = markerRef.location.nativeElement;
      markerRef.instance.isSelected.set(markerInfo.uuid === this.selectedDirection());
      markerRef.instance.markerInformation.set(markerInfo);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: { lat: markerInfo.lat, lng: markerInfo.lng },
        content: markerElement,
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
    this.advancedMarkers = [];
  }

  createMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: 40.4168, lng: -3.7038 },
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      rotateControl: false,
      mapId: '32167039027b2e4995be9915',
    });
  }
}
