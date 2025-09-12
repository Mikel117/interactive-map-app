import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { MarkerMapInformation } from './marker.component.model';
import { CommonModule } from '@angular/common';
import { CountriesService } from '../../../services/countries.service';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.scss'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkerComponent {

  countriesService = inject(CountriesService);
  isSelected = model<boolean>(false);
  markerInformation = model<MarkerMapInformation | null>(null);

  onClick() {
    this.countriesService.selectedDirection.next(this.markerInformation()?.uuid || '');
  }
}
