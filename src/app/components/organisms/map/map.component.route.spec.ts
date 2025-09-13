import { TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { CountriesService } from '../../../services/countries.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { MapsService } from '../../../services/maps.service';
import { BehaviorSubject } from 'rxjs';

class CountriesServiceMock {
  selectedDirection = new BehaviorSubject<string | null>(null);
  selectedCountry = new BehaviorSubject<any>({ label: 'ES', value: 'ES' });
  markers = () => ([
    { lat: 40.1, lng: -3.7, label: 'A', title: 'A', zipCode: '1', uuid: 'a' },
    { lat: 40.2, lng: -3.6, label: 'B', title: 'B', zipCode: '2', uuid: 'b' },
  ]);
}

class GoogleMapsLoaderServiceMock { load = jest.fn().mockResolvedValue(undefined); }
class MapsServiceMock { getMapId = () => ''; }

describe('MapComponent routing', () => {
  it('should compute route and set totalDistanceKm', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [
        { provide: CountriesService, useClass: CountriesServiceMock },
        { provide: GoogleMapsLoaderService, useClass: GoogleMapsLoaderServiceMock },
        { provide: MapsService, useClass: MapsServiceMock },
      ],
      imports: [MapComponent],
    }).createComponent(MapComponent);
    const comp = fixture.componentInstance;
    comp.ngAfterViewInit();
    await Promise.resolve();

    comp.traceOptimizedRoute();
    await Promise.resolve();

    expect((comp as any).directionsService!.route).toHaveBeenCalled();
    expect(comp.totalDistanceKm).not.toBeNull();
  });
});
