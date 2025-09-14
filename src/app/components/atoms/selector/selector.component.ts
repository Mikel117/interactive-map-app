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
      multi: true,
    },
  ],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss',
})
export class SelectorComponent implements OnInit, ControlValueAccessor {
  value: string | null = null;
  options = input<SelectorComponentModel[]>([]);
  optionSelectedEvent = output<SelectorComponentModel | null>();
  optionSelected: SelectorComponentModel | null = null;

  dropdownOpen = signal(false);
  filteredOptions = signal<SelectorComponentModel[]>([]);

  showDropdown = computed(() => this.dropdownOpen() && this.filteredOptions().length > 0);

  /**
   * Initializes the filtered options with the provided options.
   */
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

  /**
   * Handles input typing and updates dropdown visibility and filtering.
   */
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.dropdownOpen.set(true);
    this.filterOptions();
  }

  /**
   * Opens the dropdown and resets the filtered options.
   */
  onFocus() {
    this.dropdownOpen.set(true);
    this.filteredOptions.set(this.options() ?? []);
  }

  /**
   * Closes the dropdown if focus moved outside the dropdown panel.
   */
  onBlur(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (!relatedTarget || !relatedTarget.closest('.selector-dropdown')) {
      this.dropdownOpen.set(false);
      this.filteredOptions.set(this.options() ?? []);
    }
  }

  /**
   * Filters options based on user input ignoring case, punctuation and diacritics.
   */
  filterOptions() {
    const query = this.normalize(this.value || '');
    this.filteredOptions.set(
      (this.options() ?? []).filter((option) => this.normalize(option.label).includes(query)),
    );
  }

  /**
   * Normalizes a string by removing diacritics and punctuation and lowercasing.
   * @param str Input string.
   */
  private normalize(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\p{P}\p{S}]/gu, '')
      .toLowerCase();
  }

  /**
   * Updates the selector value and emits the selected option.
   * @param option The selected option.
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
   * Clears value and selection when Backspace is pressed and an option is selected.
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
