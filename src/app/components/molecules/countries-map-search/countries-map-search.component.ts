import { Component, inject, OnInit, signal } from '@angular/core';
import { SelectorComponentModel } from '../../atoms/selector/selector.components.model';
import { take, map } from 'rxjs';
import { CountriesService } from '../../../services/countries.service';
import { addUuidToData, mapMarkerInformation, mapTableInformation } from '../../templates/helpers';
import { SelectorComponent } from '../../atoms/selector/selector.component';

@Component({
  standalone: true,
  imports: [SelectorComponent],
  selector: 'countries-map-search',
  templateUrl: 'countries-map-search.component.html',
  styleUrls: ['countries-map-search.component.scss'],
})
export class CountriesMapSearchComponent implements OnInit {
  countriesService = inject(CountriesService);
  countriesList = signal<SelectorComponentModel[]>([]);
  selectedCountry = signal<SelectorComponentModel | null>(null);

  constructor() {}

  ngOnInit() {
    this.getCountries();
  }

  getCountries() {
    this.countriesService
      .getCountries()
      .pipe(
        take(1),
        map((countries) =>
          countries.results.map((country) => ({
            label: country.name,
            value: country.iso2_code,
          }))
        )
      )
      .subscribe((countries) => {
        this.countriesList.set(countries);
      });
  }

  onCountrySelected(country: SelectorComponentModel | null) {
    this.selectedCountry.set(country);
    if (country) {
      this.countriesService
        .getPostalCodesInfo(country.value)
        .pipe(
          take(1),
          map((data) => addUuidToData(data)),
          map((data) => ({
            markers: mapMarkerInformation(data),
            tableData: mapTableInformation(data),
          }))
        )
        .subscribe((data) => {
          this.countriesService.markers.set(data.markers);
          this.countriesService.tableData.set(data.tableData);
        });
    } else {
    }
  }
}
