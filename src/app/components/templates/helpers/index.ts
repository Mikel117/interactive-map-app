import { TableMapInformation } from '../../molecules/table/table.component.model';
import { MarkerMapInformation } from '../../atoms/marker/marker.component.model';
import { v4 as uuid } from 'uuid';
import { PostalCodeInformation, PostalCodesResponse } from '../../../services/models/Countries';

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

export const addUuidToData = (data: PostalCodesResponse): PostalCodeInformation[] => {
  return data.results.map((information) => {
    const updatedInformation: PostalCodeInformation = {
      ...information,
      uuid: uuid()
    };
    return updatedInformation;
  });
};
