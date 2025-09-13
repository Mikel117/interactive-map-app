import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';

@Injectable({providedIn: 'root'})
export class MapsService {
    getMapId() {
       return environments.VITE_GOOGLE_MAPS_ID || '';
    }
}