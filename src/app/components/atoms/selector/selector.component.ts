import { Component, computed, forwardRef, input, OnInit, output, signal } from '@angular/core';
import { SelectorComponentModel } from './selector.components.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-atom-selector',
  imports: [CommonModule],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true
    }
  ],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss',
})
export class SelectorComponent implements OnInit, ControlValueAccessor {
  value: string | null = null;
  options = input<SelectorComponentModel[]>([]);
  optionSelectedEvent = output<SelectorComponentModel|null>();
  optionSelected: SelectorComponentModel | null = null;

  dropdownOpen = signal(false);
  filteredOptions = signal<SelectorComponentModel[]>([]);

  showDropdown = computed(() => this.dropdownOpen() && this.filteredOptions().length > 0);

  ngOnInit(): void {
    this.filteredOptions.set(this.options() ?? []);
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.dropdownOpen.set(true);
    this.filterOptions();
  }

  onFocus() {
    this.dropdownOpen.set(true);
    this.filteredOptions.set(this.options() ?? []);
  }

  onBlur(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (!relatedTarget || !relatedTarget.closest('.selector-dropdown')) {
      this.dropdownOpen.set(false);
      this.filteredOptions.set(this.options() ?? []);
    }
  }

  /**
   * Filtra las opciones basándose en la entrada del usuario,
   * ignorando mayúsculas, minúsculas,
   * signos de puntuación y tildes.
   */
  filterOptions() {
    const normalize = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\p{P}\p{S}]/gu, '')
        .toLowerCase();

    const query = normalize(this.value || '');
    this.filteredOptions.set((this.options() ?? []).filter(option =>
      normalize(option.label).includes(query)
    ));
  }

  /**
   * 
   * @param option La opción seleccionada
   * Actualiza el valor del selector y emite el evento de opción seleccionada.
   */
  selectOption(option: SelectorComponentModel) {
    const value = option.label;
    this.value = value;
    this.optionSelected = option;
    this.optionSelectedEvent.emit(option);
    this.onChange(value);
    this.onTouched();
    this.dropdownOpen.set(false);
    this.filteredOptions.set(this.options() ?? []);
  }

  /**
   * Borra el valor y la opción seleccionada si se pulsa Backspace y hay una opción seleccionada
   */
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.optionSelected) {
      this.value = '';
      this.optionSelected = null;
      this.optionSelectedEvent.emit(null);
      this.onChange(this.value);
      this.filteredOptions.set(this.options() ?? []);
      event.preventDefault();
    }
  }
}
