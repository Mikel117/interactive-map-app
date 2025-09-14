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

  constructor() {}

  /**
   * Lifecycle hook that can be used to initialize data.
   */
  ngOnInit() {}

  /**
   * Emits the selected row's UUID to synchronize selection with the map.
   */
  selectDirection(item: TableMapInformation) {
    this.countriesService.selectedDirection.next(item.uuid);
  }

  /**
   * Starts mouse drag to hide the table by tracking initial Y.
   */
  onBarMouseDown(event: MouseEvent) {
    this.dragStartY = event.clientY;
    this.dragging = true;
    window.addEventListener('mousemove', this.onBarMouseMove);
    window.addEventListener('mouseup', this.onBarMouseUp);
  }

  /**
   * Updates drag offset during mouse movement.
   */
  onBarMouseMove = (event: MouseEvent) => {
    if (this.dragStartY !== null && this.dragging) {
      const deltaY = event.clientY - this.dragStartY;
      this.dragOffsetY = Math.max(0, deltaY);
    }
  };

  /**
   * Ends mouse drag, hides table if threshold exceeded, and cleans listeners.
   */
  onBarMouseUp = () => {
    if (this.dragOffsetY > 60) {
      this.isTableVisible = false;
    }
    this.dragStartY = null;
    this.dragging = false;
    this.dragOffsetY = 0;
    this.removeBarListeners();
  };

  /**
   * Starts touch drag gesture to hide the table.
   */
  onBarTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.touchStartY = event.touches[0].clientY;
      this.dragging = true;
      window.addEventListener('touchmove', this.onBarTouchMove);
      window.addEventListener('touchend', this.onBarTouchEnd);
    }
  }

  /**
   * Updates drag offset during touch movement.
   */
  onBarTouchMove = (event: TouchEvent) => {
    if (this.touchStartY !== null && event.touches.length === 1 && this.dragging) {
      const deltaY = event.touches[0].clientY - this.touchStartY;
      this.dragOffsetY = Math.max(0, deltaY);
    }
  };

  /**
   * Ends touch drag, hides table if threshold exceeded, and cleans listeners.
   */
  onBarTouchEnd = () => {
    if (this.dragOffsetY > 60) {
      this.isTableVisible = false;
    }
    this.touchStartY = null;
    this.dragging = false;
    this.dragOffsetY = 0;
    this.removeBarTouchListeners();
  };

  /**
   * Removes mouse listeners for drag.
   */
  removeBarListeners() {
    window.removeEventListener('mousemove', this.onBarMouseMove);
    window.removeEventListener('mouseup', this.onBarMouseUp);
  }

  /**
   * Removes touch listeners for drag.
   */
  removeBarTouchListeners() {
    window.removeEventListener('touchmove', this.onBarTouchMove);
    window.removeEventListener('touchend', this.onBarTouchEnd);
  }

  /**
   * Shows the table again.
   */
  showTable() {
    this.isTableVisible = true;
  }
}
