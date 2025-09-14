import { TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { CountriesService } from '../../../services/countries.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { MapsService } from '../../../services/maps.service';
import { BehaviorSubject } from 'rxjs';

class CountriesServiceMock {
  selectedDirection = new BehaviorSubject<string | null>(null);
  selectedCountry = new BehaviorSubject<any>(null);
  markers = () => [] as any[];
}

class GoogleMapsLoaderServiceMock {
  load = jest.fn().mockResolvedValue(undefined);
}

class MapsServiceMock {
  getMapId = () => '';
}

describe('MapComponent', () => {
  it('should not generate markers when no country selected', async () => {
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
    await Promise.resolve();

    expect((comp as any).markerEntries.length).toBe(0);
  });
});
