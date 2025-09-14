import { TestBed } from '@angular/core/testing';
import { MapTableComponent } from './table.component';
import { CountriesService } from '../../../services/countries.service';
import { BehaviorSubject, of } from 'rxjs';

class CountriesServiceMock {
  selectedDirection = new BehaviorSubject<string | null>(null);
  tableData = () => [
    { zipCode: '1000', countryCode: 'ES', placeName: 'Madrid', lat: 0, lng: 0, uuid: 'a' },
    { zipCode: '2000', countryCode: 'ES', placeName: 'Barcelona', lat: 0, lng: 0, uuid: 'b' },
  ];
}

describe('MapTableComponent', () => {
  it('should emit selection when selecting a row', () => {
    const svc = new CountriesServiceMock();
    const nextSpy = jest.spyOn(svc.selectedDirection, 'next');
    const fixture = TestBed.configureTestingModule({
      providers: [{ provide: CountriesService, useValue: svc }],
    }).createComponent(MapTableComponent);
    const comp = fixture.componentInstance;
    comp.selectDirection({
      zipCode: '2000',
      countryCode: 'ES',
      placeName: 'Barcelona',
      lat: 0,
      lng: 0,
      uuid: 'b',
    });
    expect(nextSpy).toHaveBeenCalledWith('b');
  });
});
