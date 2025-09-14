import { TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { CountriesService } from '../../../services/countries.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { MapsService } from '../../../services/maps.service';
import { BehaviorSubject, of } from 'rxjs';

class CountriesServiceMock {
  selectedDirection = new BehaviorSubject<string | null>(null);
  selectedCountry = new BehaviorSubject<any>({ label: 'ES', value: 'ES' });
  markers = () => [{ lat: 40.1, lng: -3.7, label: 'A', title: 'A', zipCode: '1', uuid: 'a' }];
  getCountries = () => of({ results: [] });
}

class GoogleMapsLoaderServiceMock {
  load = jest.fn().mockResolvedValue(undefined);
}
class MapsServiceMock {
  getMapId = () => '';
}

describe('MapComponent InfoWindow', () => {
  it('should open info window when selection changes', async () => {
    const svc = new CountriesServiceMock();
    const fixture = TestBed.configureTestingModule({
      providers: [
        { provide: CountriesService, useValue: svc },
        { provide: GoogleMapsLoaderService, useClass: GoogleMapsLoaderServiceMock },
        { provide: MapsService, useClass: MapsServiceMock },
      ],
      imports: [MapComponent],
    }).createComponent(MapComponent);
    const comp = fixture.componentInstance;
    comp.ngAfterViewInit();
    // Garantizar inicialización completa del mapa e InfoWindow
    await (comp as any).createMap();
    fixture.detectChanges();

    // generar markers
    (comp as any).generateMarkers();

    // abrir info del primer marker directamente
    const entry = (comp as any).markerEntries[0];
    await (comp as any).openInfoForEntry(entry);
    expect((comp as any).lastInfoUuid).toBe('a');
  });
});
