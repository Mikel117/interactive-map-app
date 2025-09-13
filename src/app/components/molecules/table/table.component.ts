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

    isTableVisible = true;
    private dragStartY: number | null = null;
    private touchStartY: number | null = null;
    dragOffsetY: number = 0;
    dragging: boolean = false;

    get data() {
        return this.countriesService.tableData() || [];
    }

    constructor() { }

    ngOnInit() { }

    selectDirection(item: TableMapInformation) {
        this.countriesService.selectedDirection.next(item.uuid);
    }


    onBarMouseDown(event: MouseEvent) {
        this.dragStartY = event.clientY;
        this.dragging = true;
        window.addEventListener('mousemove', this.onBarMouseMove);
        window.addEventListener('mouseup', this.onBarMouseUp);
    }

    onBarMouseMove = (event: MouseEvent) => {
        if (this.dragStartY !== null && this.dragging) {
            const deltaY = event.clientY - this.dragStartY;
            this.dragOffsetY = Math.max(0, deltaY);
        }
    };

    onBarMouseUp = () => {
        if (this.dragOffsetY > 60) {
            this.isTableVisible = false;
        }
        this.dragStartY = null;
        this.dragging = false;
        this.dragOffsetY = 0;
        this.removeBarListeners();
    };

    onBarTouchStart(event: TouchEvent) {
        if (event.touches.length === 1) {
            this.touchStartY = event.touches[0].clientY;
            this.dragging = true;
            window.addEventListener('touchmove', this.onBarTouchMove);
            window.addEventListener('touchend', this.onBarTouchEnd);
        }
    }

    onBarTouchMove = (event: TouchEvent) => {
        if (this.touchStartY !== null && event.touches.length === 1 && this.dragging) {
            const deltaY = event.touches[0].clientY - this.touchStartY;
            this.dragOffsetY = Math.max(0, deltaY);
        }
    };

    onBarTouchEnd = () => {
        if (this.dragOffsetY > 60) {
            this.isTableVisible = false;
        }
        this.touchStartY = null;
        this.dragging = false;
        this.dragOffsetY = 0;
        this.removeBarTouchListeners();
    };

    removeBarListeners() {
        window.removeEventListener('mousemove', this.onBarMouseMove);
        window.removeEventListener('mouseup', this.onBarMouseUp);
    }

    removeBarTouchListeners() {
        window.removeEventListener('touchmove', this.onBarTouchMove);
        window.removeEventListener('touchend', this.onBarTouchEnd);
    }

    showTable() {
        this.isTableVisible = true;
    }
}