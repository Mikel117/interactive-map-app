import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CountriesService } from '../../../services/countries.service';
import { SelectorComponent } from '../../atoms/selector/selector.component';
import { SelectorComponentModel } from '../../atoms/selector/selector.components.model';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-screen-map',
  imports: [SelectorComponent],
  standalone: true,
  providers: [CountriesService],
  templateUrl: './screen-map.component.html',
  styleUrl: './screen-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenMapComponent implements OnInit {
  countriesService = inject(CountriesService);
  countriesList = signal<SelectorComponentModel[]>([]);

  ngOnInit() {
    this.getCountries();
  }

  getCountries() {
    this.countriesService
      .getCountries()
      .pipe(
        take(1),
        map((countries) =>
          countries.results.map((country) => ({
            label: country.name,
            value: country.iso2_code,
          }))
        )
      )
      .subscribe((countries) => {
        this.countriesList.set(countries);
      });
  }
}
