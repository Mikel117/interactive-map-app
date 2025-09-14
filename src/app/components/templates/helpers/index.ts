import { TableMapInformation } from '../../molecules/table/table.component.model';
import { MarkerMapInformation } from '../../atoms/marker/marker.component.model';
import { v4 as uuid } from 'uuid';
import { PostalCodeInformation, PostalCodesResponse } from '../../../services/models/Countries';

/**
 * Maps postal code API data to marker information for the map.
 * @param data List of postal code records enriched with coordinates and UUIDs.
 * @returns List of `MarkerMapInformation` entries for markers.
 */
export const mapMarkerInformation = (data: PostalCodeInformation[]): MarkerMapInformation[] => {
  return data.map((information) => {
    const marker: MarkerMapInformation = {
      label: information.place_name,
      lat: information.coordinates.lat,
      lng: information.coordinates.lon,
      title: `${information.place_name} (${information.postal_code})`,
      zipCode: information.postal_code,
      uuid: information.uuid || '',
    };
    return marker;
  });
};

/**
 * Maps postal code API data to table information for the UI table.
 * @param data List of postal code records enriched with coordinates and UUIDs.
 * @returns List of `TableMapInformation` entries for the table.
 */
export const mapTableInformation = (data: PostalCodeInformation[]): TableMapInformation[] => {
  return data.map((information) => {
    const column: TableMapInformation = {
      zipCode: information.postal_code,
      countryCode: information.country_code,
      placeName: information.place_name,
      lat: information.coordinates.lat,
      lng: information.coordinates.lon,
      uuid: information.uuid || '',
    };
    return column;
  });
};

/**
 * Adds a UUID to each item in the postal codes response.
 * @param data Raw postal codes API response.
 * @returns Array of postal code records with UUID added.
 */
export const addUuidToData = (data: PostalCodesResponse): PostalCodeInformation[] => {
  return data.results.map((information) => {
    const updatedInformation: PostalCodeInformation = {
      ...information,
      uuid: uuid(),
    };
    return updatedInformation;
  });
};
