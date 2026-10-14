import {
  Component,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InputComponent } from '../input/input';

@Component({
  selector: 'aum-search-input',
  imports: [InputComponent],
  template: `
    <aum-input
      [label]="label"
      [required]="required"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readonly]="readonly"
      [size]="size"
      [boldLabel]="boldLabel"
      [control]="control"
      [data]="data"
      [customErrorMessages]="customErrorMessages"
      type="text"
      suffixIcon="search"
      (suffixClick)="onSearchEmit()"
      (enterKey)="onSearchEmit()"
      (dataChange)="onValueChange($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SearchInputComponent extends InputComponent {
  @Output() search = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() searchClear = new EventEmitter<void>();

  private searchSubject = new Subject<string>();

  constructor() {
    super();
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => {
        this.searchChange.emit(value);
        if (!value) this.searchClear.emit();
      });
  }

  onValueChange(value: string): void {
    this.dataChange.emit(value);
    this.searchSubject.next(value);
  }

  onSearchEmit(): void {
    const value = this.control ? this.control.value : (this.data as string);
    this.search.emit(value ?? '');
  }
}
