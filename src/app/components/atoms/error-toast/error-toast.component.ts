import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-toast.component.html',
  styleUrls: ['./error-toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorToastComponent {
  message = input<string>('Ha ocurrido un error.');
  autoHideMs = input<number>(5000);
  closed = output<void>();

  private timeoutId: any;

  ngAfterViewInit() {
    const ms = this.autoHideMs();
    if (ms && ms > 0) {
      this.timeoutId = setTimeout(() => this.onClose(), ms);
    }
  }

  onClose() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.closed.emit();
  }
}
