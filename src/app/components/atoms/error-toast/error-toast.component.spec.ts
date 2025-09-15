import { TestBed } from '@angular/core/testing';
import { ErrorToastComponent } from './error-toast.component';

describe('ErrorToastComponent', () => {
  it('should render custom message', () => {
    const fixture = TestBed.configureTestingModule({}).createComponent(ErrorToastComponent);
    const msg = 'No se pudo trazar la ruta';
    fixture.componentRef.setInput('message', msg);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(msg);
  });

  it('should emit closed on button click', () => {
    const fixture = TestBed.configureTestingModule({}).createComponent(ErrorToastComponent);
    const spy = jest.fn();
    fixture.componentInstance.closed.subscribe(spy);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button.close');
    btn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should auto hide after given timeout', () => {
    jest.useFakeTimers();
    const fixture = TestBed.configureTestingModule({}).createComponent(ErrorToastComponent);
    const spy = jest.fn();
    fixture.componentRef.setInput('autoHideMs', 100);
    fixture.componentInstance.closed.subscribe(spy);
    fixture.detectChanges();
    (fixture.componentInstance as any).ngAfterViewInit?.();
    jest.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
