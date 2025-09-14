import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/templates/screen-map/screen-map.component').then(
        (m) => m.ScreenMapComponent,
      ),
  },
];
