import { ApiRow } from '../shared/api-table/api-table';

export const GRID_META = {
  name: 'Grid',
  selector: '<aum-grid>',
  importFrom: '@aum/ui/grid',
  description:
    'Enterprise data grid wrapping AG Grid Community 32.x. Fully themed with Material Design 3 tokens — light/dark mode, all palettes, and display scales work automatically. Supports sorting, filtering, CSV export, column toggle, persistent state, row/bulk actions, infinite scroll, tree data, and inline editing.',
  status: 'stable' as const,
};

export const GRID_INPUTS: ApiRow[] = [
  {
    name: 'config',
    type: 'AumGridConfig<T>',
    default: '—',
    description: 'Required. Full grid configuration — columns, data, toolbar, actions, and persistence options.',
  },
  {
    name: 'activeFilters',
    type: 'AumActiveFilter[]',
    default: '[]',
    description: 'Filter chips rendered below the toolbar. Pass the array from AumGridFilterState.activeFilters().',
  },
];

export const GRID_OUTPUTS: ApiRow[] = [
  {
    name: 'gridReady',
    type: 'GridApi<T>',
    description: 'Emitted when the AG Grid API is initialised. Store the reference to call API methods.',
  },
  {
    name: 'selectionChange',
    type: 'T[]',
    description: 'Emitted whenever the row selection changes. Provides the full array of selected rows.',
  },
  {
    name: 'cellValueChange',
    type: 'CellValueChangedEvent<T>',
    description: 'Emitted after an inline cell edit is committed.',
  },
  {
    name: 'rowDragEnd',
    type: 'RowDragEndEvent<T>',
    description: 'Emitted when a drag-and-drop row reorder completes.',
  },
  {
    name: 'sortChange',
    type: 'SortChangedEvent<T>',
    description: 'Emitted when the column sort order changes.',
  },
  {
    name: 'filterApply',
    type: 'void',
    description: 'Emitted when the Apply button is clicked inside the filter panel.',
  },
  {
    name: 'filterReset',
    type: 'void',
    description: 'Emitted when the Reset button is clicked inside the filter panel.',
  },
  {
    name: 'filterChipRemove',
    type: 'string',
    description: 'Emitted with the chip key when a single active filter chip is removed.',
  },
  {
    name: 'filterChipClearAll',
    type: 'void',
    description: 'Emitted when the user clears all active filter chips at once.',
  },
];

export const GRID_INTERFACES = [
  {
    name: 'AumGridConfig<T>',
    definition: `interface AumGridConfig<T = any> {
  columns:       AumColumnDef<T>[];            // required — column definitions
  rowData?:      T[];                          // client-side data (default [])
  datasource?:   IDatasource;                  // used with mode: 'infinite'
  mode?:         'client' | 'infinite';        // default 'client'
  rowSelection?: 'single' | 'multiple' | 'none'; // default 'none'
  pagination?:   boolean;                      // default false
  pageSize?:     number;                       // default 25
  sortable?:     boolean;                      // default true
  filterable?:   boolean;                      // default false
  resizable?:    boolean;                      // default true
  reorderable?:  boolean;                      // default true
  editable?:     boolean;                      // default false
  rowDrag?:      boolean;                      // default false
  treeData?:     boolean;                      // default false
  getDataPath?:  (data: T) => string[];        // required when treeData: true
  rowActions?:   AumRowAction<T>[];
  bulkActions?:  AumBulkAction<T>[];
  height?:       string;                       // default '500px'
  loading?:      boolean;                      // default false
  noRowsMessage?: string;
  toolbar?:      AumGridToolbar;
  csvFilename?:  string;                       // default 'export'
  stateKey?:     string;                       // localStorage persistence key
  gridOptions?:  Partial<GridOptions<T>>;      // AG Grid passthrough
}`,
  },
  {
    name: 'AumGridToolbar',
    definition: `interface AumGridToolbar {
  countLabel?:   string;   // e.g. 'employees' → "Displaying 10 of 50 employees"
  search?:       boolean;  // quick-search input
  csvExport?:    boolean;  // CSV export button
  columnToggle?: boolean;  // column visibility panel
  filterToggle?: boolean;  // filter panel toggle button
}`,
  },
  {
    name: 'AumRowAction<T>',
    definition: `interface AumRowAction<T> {
  icon:      string;
  label:     string;
  action:    (row: T) => void;
  disabled?: (row: T) => boolean;
}`,
  },
  {
    name: 'AumBulkAction<T>',
    definition: `interface AumBulkAction<T> {
  icon:      string;
  label:     string;
  action:    (rows: T[]) => void;
  disabled?: (rows: T[]) => boolean;
}`,
  },
];

export const GRID_EXAMPLES = {
  importPath: `import { AumGridComponent } from '@aum/ui/grid';
import type { AumGridConfig } from '@aum/ui/grid';`,

  basicGrid: `config: AumGridConfig<User> = {
  columns: [
    { field: 'id',    headerNameKey: 'COL_ID',    width: 70, flex: 0 },
    { field: 'name',  headerNameKey: 'COL_NAME',  minWidth: 160 },
    { field: 'email', headerNameKey: 'COL_EMAIL', minWidth: 200 },
  ],
  rowData: this.users,
  pagination: true,
  pageSize: 25,
};

<!-- Template -->
<aum-grid [config]="config"></aum-grid>`,

  withToolbar: `config: AumGridConfig<Employee> = {
  columns: [...],
  rowData: this.employees,
  toolbar: {
    countLabel: 'employees',
    search: true,
    csvExport: true,
    columnToggle: true,
  },
  csvFilename: 'employees-export',
};

<!-- Template -->
<aum-grid [config]="config"></aum-grid>`,

  persistentState: `// Add stateKey — state saves to localStorage automatically
config: AumGridConfig<Employee> = {
  columns: [...],
  rowData: this.employees,
  stateKey: 'hr-employees-list',  // unique per grid instance
};

// Clear persisted state programmatically
onReset(): void {
  localStorage.removeItem('aum-grid:hr-employees-list');
}`,

  rowActions: `config: AumGridConfig<Employee> = {
  columns: [...],
  rowData: this.employees,
  rowSelection: 'multiple',
  rowActions: [
    { icon: 'visibility', label: 'View',   action: r => this.view(r) },
    { icon: 'edit',       label: 'Edit',   action: r => this.edit(r) },
    { icon: 'delete',     label: 'Delete', action: r => this.delete(r),
      disabled: r => r.status === 'Active' },
  ],
  bulkActions: [
    { icon: 'archive', label: 'Archive',
      action: rows => this.archive(rows),
      disabled: rows => rows.every(r => r.status === 'Inactive') },
    { icon: 'delete',  label: 'Delete',
      action: rows => this.deleteAll(rows) },
  ],
};`,

  infiniteScroll: `config: AumGridConfig<Product> = {
  mode: 'infinite',
  columns: [...],
  datasource: {
    getRows: (params: IGetRowsParams) => {
      this.api.getPage(params.startRow, params.endRow).subscribe(res => {
        params.successCallback(res.rows, res.totalCount);
      });
    },
  },
};`,
};
