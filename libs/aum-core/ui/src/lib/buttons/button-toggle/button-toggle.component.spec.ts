import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonToggleComponent } from './button-toggle.component';

describe('ButtonToggleComponent', () => {
  let component: ButtonToggleComponent;
  let fixture: ComponentFixture<ButtonToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonToggleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set currentValue to empty string when no option is selected (single)', () => {
    component.options = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ];
    fixture.detectChanges();
    expect(component.currentValue).toBe('');
  });

  it('should set currentValue to the selected option value (single)', () => {
    component.options = [
      { label: 'A', value: 'a', selected: true },
      { label: 'B', value: 'b' },
    ];
    fixture.detectChanges();
    expect(component.currentValue).toBe('a');
  });

  it('should set currentValue to array of selected values (multiple)', () => {
    component.multiple = true;
    component.options = [
      { label: 'A', value: 'a', selected: true },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c', selected: true },
    ];
    fixture.detectChanges();
    expect(component.currentValue).toEqual(['a', 'c']);
  });

  it('should update currentValue and emit on toggle change', () => {
    component.options = [{ label: 'A', value: 'a' }];
    fixture.detectChanges();

    const emitted: (string | string[])[] = [];
    component.selectionChange.subscribe((v) => emitted.push(v));

    component.onToggleChange('a');

    expect(component.currentValue).toBe('a');
    expect(emitted).toEqual(['a']);
  });

  it('should apply large size class by default', () => {
    fixture.detectChanges();
    expect(component.sizeClass).toEqual({
      'aum-button-toggle-large': true,
      'aum-button-toggle-small': false,
    });
  });

  it('should apply small size class when size is small', () => {
    component.size = 'small';
    fixture.detectChanges();
    expect(component.sizeClass).toEqual({
      'aum-button-toggle-large': false,
      'aum-button-toggle-small': true,
    });
  });
});
