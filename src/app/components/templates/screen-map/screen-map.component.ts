import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CountriesService } from '../../../services/countries.service';
import { SelectorComponent } from '../../atoms/selector/selector.component';
import { map, take } from 'rxjs';
import { MapComponent } from '../../organisms/map/map.component';
import { MarkerMapInformation } from '../../atoms/marker/marker.component.model';
import { SelectorComponentModel } from '../../atoms/selector/selector.components.model';
import { MapTableComponent } from '../../molecules/table/table.component';
import { mapMarkerInformation, mapTableInformation, addUuidToData } from '../helpers';
import { TableMapInformation } from '../../molecules/table/table.component.model';

@Component({
  selector: 'app-screen-map',
  imports: [SelectorComponent, MapComponent, MapTableComponent],
  standalone: true,
  providers: [CountriesService],
  templateUrl: './screen-map.component.html',
  styleUrl: './screen-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenMapComponent implements OnInit {
  ngOnInit() {
  }
}
