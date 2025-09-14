import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class MapsService {
  /**
   * Returns the Google Maps Map ID configured for styling features.
   */
  getMapId(): string {
    return environments.VITE_GOOGLE_MAPS_ID || '';
  }
}
