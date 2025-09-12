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

export interface PostalCodesResponse {
  total_count: number;
  results: PostalCodeInformation[];
}

export interface PostalCodeInformation {
  country_code: string;
  postal_code:  string;
  place_name:   string;
  admin_name1:  string;
  admin_code1:  string;
  admin_name2:  string;
  admin_code2:  string;
  admin_name3:  string;
  admin_code3:  string;
  latitude:     number;
  longitude:    number;
  accuracy:     number;
  coordinates:  Coordinates;
  uuid?: string;
}

export interface Coordinates {
  lon: number;
  lat: number;
}
