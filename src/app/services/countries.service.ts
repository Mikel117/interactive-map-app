import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountriesResponse, PostalCodesResponse } from './models/Countries';
import { BehaviorSubject } from 'rxjs';
import { MarkerMapInformation } from '../components/atoms/marker/marker.component.model';
import { TableMapInformation } from '../components/molecules/table/table.component.model';
import { SelectorComponentModel } from '../components/atoms/selector/selector.components.model';
import { environments } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private http = inject(HttpClient);

  selectedDirection = new BehaviorSubject<null | string>(null);
  selectedCountry = new BehaviorSubject<null | SelectorComponentModel>(null);
  markers = signal<MarkerMapInformation[]>([]);
  tableData = signal<TableMapInformation[]>([]);

  /**
   * Retrieves the list of countries with ISO codes to populate the selector.
   * @returns Observable with countries response.
   */
  getCountries() {
    return this.http.get<CountriesResponse>(
      `${environments.VITE_COUNTRIES_API_URL}/countries-codes/records?select=label_sp%20as%20name,iso2_code,iso3_code&group_by=label_sp,iso2_code,iso3_code&order_by=label_sp&where=label_sp%20IS%20NOT%20NULL%20AND%20iso2_code%20IS%20NOT%20NULL`,
    );
  }

  /**
   * Retrieves postal codes info for the provided country code.
   * @param countryCode ISO2 country code.
   * @returns Observable with postal codes response.
   */
  getPostalCodesInfo(countryCode: string) {
    return this.http.get<PostalCodesResponse>(
      `${environments.VITE_COUNTRIES_API_URL}/geonames-postal-code/records?refine=country_code:"${countryCode}"`,
    );
  }
}
