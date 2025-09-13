import { TestBed } from '@angular/core/testing';
import { CountriesMapSearchComponent } from './countries-map-search.component';
import { CountriesService } from '../../../services/countries.service';
import { of, BehaviorSubject } from 'rxjs';

class CountriesServiceMock {
  selectedDirection = new BehaviorSubject<string | null>(null);
  selectedCountry = new BehaviorSubject<any>(null);
  markers = { set: jest.fn() } as any;
  tableData = { set: jest.fn() } as any;
  getCountries = jest.fn().mockReturnValue(of({ results: [{ name: 'Spain', iso2_code: 'ES' }] }));
  getPostalCodesInfo = jest.fn().mockReturnValue(of({ results: [] }));
}

describe('CountriesMapSearchComponent', () => {
  it('should clear data when country is deselected', () => {
    const svc = new CountriesServiceMock();
    const fixture = TestBed.configureTestingModule({
      providers: [{ provide: CountriesService, useValue: svc }],
      imports: [CountriesMapSearchComponent],
    }).createComponent(CountriesMapSearchComponent);
    const comp = fixture.componentInstance;
    comp.onCountrySelected(null);
    expect(svc.markers.set).toHaveBeenCalledWith([]);
    expect(svc.tableData.set).toHaveBeenCalledWith([]);
  });
});
