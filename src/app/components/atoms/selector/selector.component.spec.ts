import { TestBed } from '@angular/core/testing';
import { SelectorComponent } from './selector.component';
import { SelectorComponentModel } from './selector.components.model';

describe('SelectorComponent', () => {
  it('should filter options ignoring diacritics and punctuation', () => {
    const fixture = TestBed.configureTestingModule({}).createComponent(SelectorComponent);
    const comp = fixture.componentInstance;
    const opts: SelectorComponentModel[] = [
      { label: 'España', value: 'ES' },
      { label: 'Mexico', value: 'MX' },
      { label: 'Côte d’Ivoire', value: 'CI' },
    ];
    fixture.componentRef.setInput('options', opts);
    comp.ngOnInit();
  comp.value = 'cote divoire';
    comp.filterOptions();
    const labels = comp.filteredOptions().map(o => o.label);
    expect(labels).toContain('Côte d’Ivoire');
  });
});
