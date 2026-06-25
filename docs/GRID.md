# AUM Grid — Implementation Guide

`<aum-grid>` is the standard enterprise data grid component for all AUM apps. It wraps **AG Grid Community 32.x** (MIT licence) and is fully themed using Material Design system tokens — light/dark mode, all three palettes, and all display scales work automatically with no extra configuration.

**Import from:** `@aum/ui/grid`  
**Selector:** `<aum-grid>`  
**Location:** `libs/aum-core/ui/src/lib/grid/`

---

## Quick Start

```typescript
import { AumGridComponent, AumGridConfig } from '@aum/ui/grid';

@Component({
  imports: [AumGridComponent],
  template: `<aum-grid [config]="config"></aum-grid>`,
})
export class MyComponent {
  config: AumGridConfig<User> = {
    columns: [
      { field: 'id',    headerNameKey: 'COL_ID' },
      { field: 'name',  headerNameKey: 'COL_NAME' },
      { field: 'email', headerNameKey: 'COL_EMAIL' },
    ],
    rowData: this.users,
    pagination: true,
    pageSize: 25,
  };
}
```

---

## AumGridConfig Reference

| Property | Type | Default | Description |
|---|---|---|---|
| `columns` | `AumColumnDef<T>[]` | required | Column definitions |
| `rowData` | `T[]` | `[]` | Client-side row data |
| `datasource` | `IDatasource` | — | Used in `mode: 'infinite'` only |
| `mode` | `'client' \| 'infinite'` | `'client'` | Data source mode |
| `rowSelection` | `'single' \| 'multiple' \| 'none'` | `'none'` | Row selection behaviour |
| `pagination` | `boolean` | `false` | Enable pagination bar |
| `pageSize` | `number` | `25` | Rows per page |
| `sortable` | `boolean` | `true` | Enable column sorting |
| `filterable` | `boolean` | `false` | Enable column filtering |
| `resizable` | `boolean` | `true` | Enable column resizing |
| `reorderable` | `boolean` | `true` | Enable column drag reorder |
| `editable` | `boolean` | `false` | Enable cell editing (all columns) |
| `rowDrag` | `boolean` | `false` | Enable row drag-and-drop |
| `treeData` | `boolean` | `false` | Enable tree data mode |
| `getDataPath` | `(data: T) => string[]` | — | Required when `treeData: true` |
| `rowActions` | `AumRowAction<T>[]` | — | Per-row three-dot actions menu |
| `bulkActions` | `AumBulkAction<T>[]` | — | Toolbar actions shown when rows are selected |
| `height` | `string` | `'500px'` | CSS height of the grid container |
| `loading` | `boolean` | `false` | Show loading overlay |
| `noRowsMessage` | `string` | i18n `AUM.GRID_NO_ROWS` | Empty state message |
| `toolbar` | `AumGridToolbar` | — | Toolbar configuration object |
| `csvExport` | `boolean` | `false` | Show CSV export button (alias for `toolbar.csvExport`) |
| `csvFilename` | `string` | `'export'` | Default filename for CSV export |
| `stateKey` | `string` | — | Unique key for persisting column state in `localStorage` |
| `gridOptions` | `Partial<GridOptions<T>>` | — | AG Grid passthrough for advanced use |

---

## AumGridToolbar Reference

Configure the toolbar by passing a `toolbar` object inside `AumGridConfig`:

| Property | Type | Default | Description |
|---|---|---|---|
| `countLabel` | `string` | — | Label shown top-left e.g. `'employees'` — renders as "Displaying X of Y employees" |
| `search` | `boolean` | `false` | Show quick search input |
| `csvExport` | `boolean` | `false` | Show CSV export button |
| `columnToggle` | `boolean` | `false` | Show column visibility toggle panel |
| `filterToggle` | `boolean` | `false` | Show filter toggle button (requires `aumGridFilter` content child) |

---

## AumColumnDef Reference

`AumColumnDef` extends AG Grid's `ColDef`. Use `headerNameKey` (an i18n key) instead of `headerName` wherever possible.

```typescript
columns: [
  {
    field: 'salary',
    headerNameKey: 'COL_SALARY',           // i18n key — auto-translated at render time
    minWidth: 120,
    filter: 'agNumberColumnFilter',
    valueFormatter: (p) => `$${p.value.toLocaleString()}`,
    pinned: 'left',                        // pin to left/right
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['Low', 'Mid', 'High'] },
  },
]
```

---

## Outputs / Events

```html
<aum-grid
  [config]="config"
  (selectionChange)="onSelect($event)"        <!-- T[] -->
  (cellValueChange)="onEdit($event)"          <!-- CellValueChangedEvent<T> -->
  (rowDragEnd)="onDrop($event)"               <!-- RowDragEndEvent<T> -->
  (sortChange)="onSort($event)"               <!-- SortChangedEvent<T> -->
  (filterChange)="onFilter($event)"           <!-- FilterChangedEvent<T> -->
  (paginationChange)="onPage($event)"         <!-- PaginationChangedEvent -->
  (gridReady)="onReady($event)"               <!-- GridApi<T> -->
></aum-grid>
```

---

## Public API (via ViewChild)

```typescript
@ViewChild('myGrid') grid!: AumGridComponent;

// Get currently selected rows
const rows = this.grid.getSelectedRows();

// Force-refresh all visible cells
this.grid.refreshData();
```

---

## Feature Examples

### Sorting, Filtering, Pagination

```typescript
config: AumGridConfig = {
  sortable: true,        // default: true
  filterable: true,      // enable AG Grid column filters
  pagination: true,
  pageSize: 50,
};
```

### Column Pinning

```typescript
{ field: 'id', pinned: 'left', width: 80, flex: 0 }
```

### Row Selection + Bulk Actions

```typescript
config: AumGridConfig<Employee> = {
  rowSelection: 'multiple',
  bulkActions: [
    {
      icon: 'download',
      label: 'Export',
      action: rows => exportRows(rows),
    },
    {
      icon: 'delete',
      label: 'Delete',
      action: rows => deleteRows(rows),
      disabled: rows => rows.some(r => r.status === 'Active'),
    },
  ],
};
```

Up to 4 bulk actions appear inline in the toolbar when rows are selected; extras overflow into a `...` menu.

### Per-Row Actions Menu

```typescript
config: AumGridConfig<Employee> = {
  rowActions: [
    { icon: 'visibility', label: 'View',   action: r => viewRow(r) },
    { icon: 'edit',       label: 'Edit',   action: r => editRow(r) },
    { icon: 'delete',     label: 'Delete', action: r => deleteRow(r),
      disabled: r => r.status === 'Active' },
  ],
};
```

### Inline Cell Editing

```typescript
config: AumGridConfig = {
  editable: true,
  columns: [
    { field: 'status', editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Active', 'Inactive', 'Pending'] } },
    { field: 'id', editable: false },
  ],
};
```

### Row Drag & Drop

```typescript
config: AumGridConfig = {
  rowDrag: true,
  columns: [
    { field: 'id', rowDrag: true },   // drag handle appears on this column
  ],
};
// Subscribe to (rowDragEnd) output to persist the new order
```

### CSV Export

The export button opens a dialog where the user can confirm the filename and choose to export all rows or filtered rows only.

```typescript
config: AumGridConfig = {
  csvFilename: 'employees-export',   // default filename in the dialog
  toolbar: { csvExport: true },
};
```

### Virtual Scroll (large datasets)

Virtual scroll is automatic — AG Grid virtualises the DOM by default. Simply pass all rows:

```typescript
config: AumGridConfig = {
  rowData: Array.from({ length: 100_000 }, (_, i) => makeRow(i)),
  pagination: false,   // disable pagination for virtual scroll UX
};
```

### Infinite Scroll (server-side paging)

```typescript
config: AumGridConfig = {
  mode: 'infinite',
  datasource: {
    getRows: (params: IGetRowsParams) => {
      this.api.getPage(params.startRow, params.endRow).subscribe(result => {
        params.successCallback(result.rows, result.totalCount);
      });
    },
  },
};
```

### Tree Data

```typescript
interface OrgNode {
  name: string;
  orgHierarchy: string[];  // path array: ['CEO', 'CTO', 'Frontend Dev']
}

config: AumGridConfig<OrgNode> = {
  treeData: true,
  getDataPath: (data) => data.orgHierarchy,
  rowData: orgNodes,
  columns: [
    { field: 'name', headerNameKey: 'COL_NAME', minWidth: 220 },
  ],
};
```

### Loading Overlay

Pass `loading` reactively via a signal config:

```typescript
config = signal<AumGridConfig>({ loading: true, rowData: [], columns: [...] });

// After data loads:
this.config.update(c => ({ ...c, loading: false, rowData: result }));
```

---

## Persistent Column State

Use `stateKey` to automatically save and restore column state (widths, order, visibility, sort direction) across page refreshes. State is persisted to `localStorage` under the key `aum-grid:<stateKey>`.

### When to use

- Any grid where users customise columns and expect their layout to survive navigation or reloads.
- Grids that are part of a list/detail flow where re-ordering columns is common.

### Setup

Add a single `stateKey` to your config — use a stable, app-unique string per grid:

```typescript
config: AumGridConfig<Employee> = {
  columns: [...],
  rowData: employees,
  stateKey: 'hr-employees-list',   // ← unique key per grid
};
```

Multiple grids on the same page each need their own key:

```typescript
// Tab 1
activeEmployeesConfig: AumGridConfig = { ..., stateKey: 'hr-active-employees' };

// Tab 2
archivedEmployeesConfig: AumGridConfig = { ..., stateKey: 'hr-archived-employees' };
```

### What is persisted

| Interaction | Saved? |
|---|---|
| Column resize (drag edge) | ✅ on mouse-up |
| Column reorder (drag header) | ✅ on drop |
| Column visibility toggle (panel) | ✅ immediately |
| Sort direction | ✅ on change |
| Column pinning | ✅ (part of column state) |

### What is NOT persisted

- Filter values — those are app-managed state (use `AumGridFilterState` or your own signals)
- Row selection
- Scroll position
- Page number

### Naming convention

Use a dash-separated, descriptive, globally unique key. Pattern: `<module>-<entity>-<context>`:

```
hr-employees-list
hr-employees-archived
products-catalog
orders-pending
```

Avoid generic names like `grid-1` or `table` — they will collide if the same app ever has two grids of the same type.

### Clearing persisted state

To reset a user's saved layout programmatically (e.g. a "Reset to defaults" button):

```typescript
localStorage.removeItem('aum-grid:hr-employees-list');
```

Or subscribe to `(gridReady)` and clear before applying:

```typescript
onGridReady(api: GridApi): void {
  localStorage.removeItem('aum-grid:hr-employees-list');
}
```

---

## Filter Panel (AumGridFilterDirective)

Project a custom filter panel using `*aumGridFilter`. The panel slides in over the grid when the filter toggle button is clicked.

```html
<aum-grid
  [config]="config"
  [activeFilters]="filterState.activeFilters()"
  (filterApply)="onFilterApply()"
  (filterReset)="onFilterReset()"
  (filterChipRemove)="onChipRemove($event)"
  (filterChipClearAll)="onChipClearAll()"
>
  <ng-template aumGridFilter>
    <!-- Your filter form goes here -->
    <aum-select-box label="Status" [options]="statusOptions" ...></aum-select-box>
    <aum-date-picker label="From" ...></aum-date-picker>
  </ng-template>
</aum-grid>
```

### AumGridFilterState helper

`AumGridFilterState` is a provided service that manages predicate-based filtering, active filter chips, and applies them to the AG Grid API. Provide it at the component level:

```typescript
@Component({ providers: [AumGridFilterState] })
export class MyComponent {
  readonly filterState = inject(AumGridFilterState<Employee>);

  constructor() {
    this.filterState.register(
      {
        key: 'status',
        signal: this.filterStatus,
        label: v => v ? `Status: ${v}` : null,
        predicate: (row, v) => !v || row.status === v,
      },
    );
  }

  onFilterApply(): void {
    this.filterState.applyToGrid(this.gridApi);
  }
}
```

---

## Custom Toolbar Actions

Project additional buttons into the toolbar right-hand slot using `*aumGridToolbarActions`:

```html
<aum-grid [config]="config">
  <ng-template aumGridToolbarActions>
    <aum-button type="outlined" icon="refresh" value="Refresh" (clickButton)="reload()"></aum-button>
  </ng-template>
</aum-grid>
```

Custom actions are rendered to the left of the built-in search/export/column-toggle buttons, separated by a divider.

---

## Setup: CSS Import (required once per app)

AG Grid's base styles ship in a separate package. Add these two imports to **each app's `styles.scss`** — they are NOT loaded by the component itself:

```scss
// apps/<your-app>/src/styles.scss
@import '@ag-grid-community/styles/ag-grid.css';         // structural base
@import '@ag-grid-community/styles/ag-theme-quartz.css'; // quartz visual theme
```

This is a one-time setup per app.

---

## Theming

The grid theme uses CSS variable overrides on `.ag-theme-quartz`. It reads Material Design system tokens at runtime:

| AG Grid param | Material token used |
|---|---|
| `backgroundColor` | `--mat-sys-surface` |
| `foregroundColor` | `--mat-sys-on-surface` |
| `headerBackgroundColor` | `--mat-sys-surface-container` |
| `rowHoverColor` | `--mat-sys-surface-container-low` |
| `selectedRowBackgroundColor` | `--mat-sys-primary-container` |
| `accentColor` | `--mat-sys-primary` |
| `borderColor` | `--mat-sys-outline-variant` |
| `fontFamily` | `inherit` (picks up app font) |

**Dark mode, palette switching, and display scale changes propagate automatically** — no extra setup needed.

To customise the theme for a specific grid, pass `gridOptions` with a custom theme:

```typescript
import { themeQuartz } from '@ag-grid-community/core';

const myTheme = themeQuartz.withParams({ rowHeight: 32 });

config: AumGridConfig = {
  gridOptions: { theme: myTheme },
};
```

---

## No Enterprise Features

This component uses only `@ag-grid-community/*` packages (MIT licence). **Never install `@ag-grid-enterprise/*`** — doing so triggers a licence watermark in production for all users.

Missing enterprise features and their workarounds:

| Enterprise feature | Workaround |
|---|---|
| Excel export | Use CSV export + ask users to open in Excel, or add SheetJS |
| Row grouping | Pre-aggregate data on the server; use tree data for hierarchy |
| Set filters | Use `agTextColumnFilter` or `agNumberColumnFilter` |
| Server-side row model | Use `mode: 'infinite'` with `IDatasource` |

---

## Keyboard Navigation

AG Grid's keyboard navigation is enabled by default:
- `Tab` / `Shift+Tab` — move between cells
- `Arrow keys` — navigate cells
- `Enter` — start editing (when `editable: true`)
- `Escape` — cancel edit
- `Space` — toggle row selection

---

## Full Example

```typescript
import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { GridApi } from '@ag-grid-community/core';
import { AumGridComponent, AumGridFilterDirective, AumGridFilterState } from '@aum/ui/grid';
import type { AumGridConfig, AumColumnDef, AumRowAction, AumBulkAction } from '@aum/ui/grid';
import { SnackbarService } from '@aum/ui/utilities';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Discontinued';
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AumGridComponent, AumGridFilterDirective],
  providers: [AumGridFilterState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aum-grid
      [config]="config()"
      [activeFilters]="filterState.activeFilters()"
      (gridReady)="onGridReady($event)"
      (filterApply)="onFilterApply()"
      (filterReset)="onFilterReset()"
      (filterChipRemove)="onChipRemove($event)"
      (filterChipClearAll)="onFilterReset()"
      (selectionChange)="onSelect($event)"
    >
      <ng-template aumGridFilter>
        <!-- filter form here -->
      </ng-template>
    </aum-grid>
  `,
})
export class ProductsComponent {
  private readonly snackbar = inject(SnackbarService);
  readonly filterState = inject(AumGridFilterState<Product>);
  private gridApi: GridApi<Product> | null = null;

  readonly filterStatus = signal('');
  readonly rowData = signal<Product[]>([]);
  readonly isLoading = signal(true);

  constructor() {
    this.filterState.register({
      key: 'status',
      signal: this.filterStatus,
      label: v => v ? `Status: ${v}` : null,
      predicate: (row, v) => !v || row.status === v,
    });

    // Simulate data fetch
    setTimeout(() => {
      this.rowData.set(/* your data */[]);
      this.isLoading.set(false);
    }, 500);
  }

  private rowActions: AumRowAction<Product>[] = [
    { icon: 'edit',   label: 'Edit',   action: p => this.snackbar.info(`Editing ${p.name}`) },
    { icon: 'delete', label: 'Delete', action: p => this.snackbar.error(`Deleted ${p.name}`),
      disabled: p => p.status === 'Active' },
  ];

  private bulkActions: AumBulkAction<Product>[] = [
    { icon: 'archive', label: 'Archive', action: rows => this.snackbar.info(`Archived ${rows.length}`) },
  ];

  readonly config = computed<AumGridConfig<Product>>(() => ({
    columns: [
      { field: 'id',       headerName: 'ID',       width: 70, flex: 0, pinned: 'left' },
      { field: 'name',     headerNameKey: 'COL_PRODUCT_NAME',     minWidth: 180 },
      { field: 'category', headerNameKey: 'COL_CATEGORY',         minWidth: 140 },
      { field: 'price',    headerNameKey: 'COL_PRICE',            minWidth: 110,
        filter: 'agNumberColumnFilter',
        valueFormatter: p => `$${p.value?.toLocaleString()}` },
      { field: 'stock',    headerNameKey: 'COL_STOCK',            minWidth: 100 },
      { field: 'status',   headerNameKey: 'COL_STATUS',           minWidth: 120 },
    ] satisfies AumColumnDef<Product>[],
    rowData: this.rowData(),
    loading: this.isLoading(),
    rowSelection: 'multiple',
    pagination: true,
    pageSize: 25,
    rowActions: this.rowActions,
    bulkActions: this.bulkActions,
    toolbar: {
      countLabel: 'products',
      search: true,
      csvExport: true,
      columnToggle: true,
      filterToggle: true,
    },
    csvFilename: 'products',
    stateKey: 'products-catalog',   // persist column layout across page refreshes
  }));

  onGridReady(api: GridApi<Product>): void {
    this.gridApi = api;
  }

  onFilterApply(): void {
    if (this.gridApi) this.filterState.applyToGrid(this.gridApi);
  }

  onFilterReset(): void {
    this.filterStatus.set('');
    this.filterState.clearAll(this.gridApi ?? undefined);
  }

  onChipRemove(key: string): void {
    if (key === 'status') this.filterStatus.set('');
    this.filterState.removeByKey(key, this.gridApi ?? undefined);
  }

  onSelect(rows: Product[]): void {
    console.log('Selected:', rows);
  }
}
```
