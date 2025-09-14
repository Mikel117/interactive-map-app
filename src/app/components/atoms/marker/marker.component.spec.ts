import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MarkerComponent } from './marker.component';
import { CountriesService } from '../../../services/countries.service';

class CountriesServiceMock {
  selectedDirection = new BehaviorSubject<string | null>(null);
}

describe('MarkerComponent', () => {
  it('should emit selection on click', () => {
    const svc = new CountriesServiceMock();
    const nextSpy = jest.spyOn(svc.selectedDirection, 'next');
    const fixture = TestBed.configureTestingModule({
      providers: [{ provide: CountriesService, useValue: svc }],
    }).createComponent(MarkerComponent);
    fixture.componentInstance.markerInformation.set({
      lat: 0,
      lng: 0,
      label: 'X',
      title: 'X',
      zipCode: '000',
      uuid: 'u-1',
    });
    fixture.componentInstance.onClick();
    expect(nextSpy).toHaveBeenCalledWith('u-1');
  });
});
