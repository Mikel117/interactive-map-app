import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { CountriesResponse } from './models/Countries';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  http = inject(HttpClient);

  getCountries() {
    return this.http.get<CountriesResponse>(
        `${environment.VITE_COUNTRIES_API_URL}/countries-codes/records?select=label_sp%20as%20name,iso2_code,iso3_code&group_by=label_sp,iso2_code,iso3_code&order_by=label_sp&where=label_sp%20IS%20NOT%20NULL%20AND%20iso2_code%20IS%20NOT%20NULL`
    );
  }
}
