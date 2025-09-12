import { Component, inject, model, OnInit } from '@angular/core';
import { TableMapInformation } from './table.component.model';
import { CountriesService } from '../../../services/countries.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-map-table',
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.scss'],
})

export class MapTableComponent implements OnInit {

    countriesService = inject(CountriesService);
    selectedDirection = toSignal(this.countriesService.selectedDirection);

    get data() {
        return this.countriesService.tableData() || [];
    }

    constructor() { }

    ngOnInit() { }

    selectDirection(item: TableMapInformation) {
        this.countriesService.selectedDirection.next(item.uuid);
    }
}