import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CountriesService } from '../../../services/countries.service';
import { MapComponent } from '../../organisms/map/map.component';
import { MapTableComponent } from '../../molecules/table/table.component';

@Component({
  selector: 'app-screen-map',
  imports: [MapComponent, MapTableComponent],
  standalone: true,
  providers: [CountriesService],
  templateUrl: './screen-map.component.html',
  styleUrl: './screen-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenMapComponent implements OnInit {
  /**
   * Lifecycle hook for potential initialization of the screen component.
   */
  ngOnInit() {}
}
