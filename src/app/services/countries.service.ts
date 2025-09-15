import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountriesResponse, FacetsResponse, PostalCodesResponse } from './models/Countries';
import { BehaviorSubject, forkJoin, map } from 'rxjs';
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
    const base = environments.VITE_COUNTRIES_API_URL;
    const countries$ = this.http.get<CountriesResponse>(
      `${base}/countries-codes/records?select=label_sp%20as%20name,iso2_code,iso3_code&group_by=label_sp,iso2_code,iso3_code&order_by=label_sp&where=label_sp%20IS%20NOT%20NULL%20AND%20iso2_code%20IS%20NOT%20NULL`,
    );
    const facets$ = this.http.get<FacetsResponse>(
      `${base}/geonames-postal-code/facets?facet=country_code`,
    );

    return forkJoin({ countries: countries$, facets: facets$ }).pipe(
      map(({ countries, facets }) => {
        const facetBlock = Array.isArray(facets?.facets)
          ? facets.facets.find((f) => f?.name === 'country_code') || facets.facets[0]
          : null;
        const entries = Array.isArray(facetBlock?.facets) ? facetBlock.facets : [];
        const available = new Set<string>();
        for (const it of entries) {
          const code = String(it?.name || '').toUpperCase();
          const count = Number(it?.count || 0);
          if (code && count > 0) available.add(code);
        }

        const filteredResults = (countries.results || []).filter((c: any) =>
          available.has(String(c?.iso2_code || '').toUpperCase()),
        );
        return { total_count: filteredResults.length, results: filteredResults };
      }),
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
