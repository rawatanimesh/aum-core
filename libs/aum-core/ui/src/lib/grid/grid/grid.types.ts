import { TemplateRef } from '@angular/core';
import type {
  ColDef,
  GridOptions,
  IDatasource,
  IGetRowsParams,
  RowDragEndEvent,
  CellValueChangedEvent,
  SortChangedEvent,
  FilterChangedEvent,
  PaginationChangedEvent,
} from '@ag-grid-community/core';

export type AumRowSelection = 'single' | 'multiple' | 'none';
export type AumGridMode = 'client' | 'infinite';

export interface AumColumnDef<T = unknown> extends Omit<ColDef<any>, 'headerName'> {
  field: string;
  headerNameKey?: string;
  headerName?: string;
  cellTemplate?: TemplateRef<{ data: T; value: unknown }>;
  headerTemplate?: TemplateRef<{ column: AumColumnDef<T> }>;
}

export interface AumRowAction<T = unknown> {
  /** Material Symbol icon name */
  icon: string;
  label: string;
  action: (row: T) => void;
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface AumBulkAction<T = unknown> {
  /** Material Symbol icon name */
  icon?: string;
  label: string;
  action: (rows: T[]) => void;
  disabled?: (rows: T[]) => boolean;
}

export interface AumActiveFilter {
  /** Unique key identifying this filter (e.g. 'status:Active', 'dateFrom') */
  key: string;
  /** Human-readable chip label */
  label: string;
}

export interface AumGridToolbar {
  /** Label shown top-left e.g. "Displaying 17 of 26 Workorders" */
  countLabel?: string;
  /** Show quick search input */
  search?: boolean;
  /** Show CSV export button */
  csvExport?: boolean;
  /** Show column visibility toggle panel */
  columnToggle?: boolean;
  /** Show filter toggle button (requires aumGridFilter content child) */
  filterToggle?: boolean;
}

export interface AumGridConfig<T = unknown> {
  columns: AumColumnDef<T>[];

  // Data
  rowData?: T[];
  datasource?: IDatasource;
  mode?: AumGridMode;

  // Features
  rowSelection?: AumRowSelection;
  pagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  editable?: boolean;
  rowDrag?: boolean;
  treeData?: boolean;
  getDataPath?: (data: T) => string[];

  // Per-row three-dot actions menu
  rowActions?: AumRowAction<T>[];

  // Bulk actions — shown in toolbar when rows are selected
  bulkActions?: AumBulkAction<T>[];

  // Display
  height?: string;
  loading?: boolean;
  noRowsMessage?: string;
  toolbar?: AumGridToolbar;

  // CSV Export
  csvExport?: boolean;
  csvFilename?: string;

  // Passthrough for advanced use
  gridOptions?: Partial<GridOptions<T>>;
}

export interface AumGridEvents<T = unknown> {
  selectionChanged?: (rows: T[]) => void;
  cellValueChanged?: (event: CellValueChangedEvent<T>) => void;
  rowDragEnd?: (event: RowDragEndEvent<T>) => void;
  sortChanged?: (event: SortChangedEvent<T>) => void;
  filterChanged?: (event: FilterChangedEvent<T>) => void;
  paginationChanged?: (event: PaginationChangedEvent) => void;
  getRows?: (params: IGetRowsParams) => void;
}

export type { IGetRowsParams };
