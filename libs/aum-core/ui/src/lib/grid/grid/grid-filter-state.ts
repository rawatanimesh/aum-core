import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { GridApi } from '@ag-grid-community/core';
import { AumActiveFilter } from './grid.types';

export interface AumFilterDescriptor<TRow, TValue> {
  /** Unique key matching AumActiveFilter.key, e.g. 'dateFrom' or 'status:Active' */
  key: string;
  /** The writable signal holding the current filter value */
  signal: WritableSignal<TValue>;
  /** Return a chip label string when this filter is active, null/undefined when inactive */
  label: (value: TValue) => string | null | undefined;
  /** AG Grid row-level predicate — return false to hide the row */
  predicate: (row: TRow, value: TValue) => boolean;
}

/**
 * Per-component service (NOT providedIn:'root') that manages an arbitrary set of
 * filter signals, derives the active-chip array, and applies/clears the AG Grid
 * external filter.
 *
 * Usage:
 *   providers: [AumGridFilterState]
 *
 * Then register descriptors in the constructor/ngOnInit:
 *   this.filterState.register(descriptor1, descriptor2, ...);
 */
@Injectable()
export class AumGridFilterState<TRow = unknown> {
  private readonly descriptors: AumFilterDescriptor<TRow, any>[] = [];

  // Incremented whenever any signal changes to invalidate the computed
  private readonly _version = signal(0);

  readonly activeFilters = computed<AumActiveFilter[]>(() => {
    this._version(); // take dependency so computed re-runs on mutation
    const chips: AumActiveFilter[] = [];
    for (const d of this.descriptors) {
      const val = d.signal();
      const lbl = d.label(val);
      if (lbl) chips.push({ key: d.key, label: lbl });
    }
    return chips;
  });

  register<TValue>(...descriptors: AumFilterDescriptor<TRow, TValue>[]): void {
    this.descriptors.push(...descriptors);
  }

  isActive(): boolean {
    return this.descriptors.some(d => {
      const val = d.signal();
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'string') return val !== '';
      return val != null;
    });
  }

  applyToGrid(api: GridApi<TRow>): void {
    const snapshot = this.descriptors.map(d => ({ d, val: d.signal() }));
    api.setGridOption('isExternalFilterPresent', () => snapshot.some(({ val }) => {
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'string') return val !== '';
      return val != null;
    }));
    api.setGridOption('doesExternalFilterPass', node => {
      const row = node.data;
      if (!row) return true;
      return snapshot.every(({ d, val }) => d.predicate(row, val));
    });
    api.onFilterChanged();
    this._version.update(v => v + 1);
  }

  clearAll(api?: GridApi<TRow>): void {
    for (const d of this.descriptors) {
      d.signal.set(this.emptyValue(d.signal()));
    }
    if (api) {
      api.setGridOption('isExternalFilterPresent', () => false);
      api.setGridOption('doesExternalFilterPass', () => true);
      api.onFilterChanged();
    }
    this._version.update(v => v + 1);
  }

  removeByKey(key: string, api?: GridApi<TRow>): void {
    const descriptor = this.descriptors.find(d => d.key === key);
    if (descriptor) {
      descriptor.signal.set(this.emptyValue(descriptor.signal()));
      this._version.update(v => v + 1);
    }
    if (api) this.applyToGrid(api);
  }

  private emptyValue<V>(current: V): V {
    if (typeof current === 'string') return '' as V;
    if (Array.isArray(current)) return [] as V;
    if (typeof current === 'number') return 0 as V;
    if (typeof current === 'boolean') return false as V;
    return null as V;
  }
}
