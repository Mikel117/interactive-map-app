export interface CountriesResponse {
    total_count: number;
    results: CountrieInformation[];
}

export interface CountrieInformation {
  label_sp: string;
  iso2_code: string;
  iso3_code: string;
  name: string;
}
