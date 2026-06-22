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
    height: '500px',
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
| `filterable` | `boolean` | `true` | Enable column filtering |
| `resizable` | `boolean` | `true` | Enable column resizing |
| `reorderable` | `boolean` | `true` | Enable column drag reorder |
| `editable` | `boolean` | `false` | Enable cell editing (all columns) |
| `rowDrag` | `boolean` | `false` | Enable row drag-and-drop |
| `treeData` | `boolean` | `false` | Enable tree data mode |
| `getDataPath` | `(data: T) => string[]` | — | Required when `treeData: true` |
| `height` | `string` | `'500px'` | CSS height of the grid container |
| `loading` | `boolean` | `false` | Show loading overlay |
| `noRowsMessage` | `string` | i18n `GRID_NO_ROWS` | Empty state message |
| `csvExport` | `boolean` | `false` | Reserved — use `exportCsv()` method |
| `csvFilename` | `string` | `'export.csv'` | Filename for CSV export |
| `gridOptions` | `Partial<GridOptions<T>>` | — | AG Grid passthrough for advanced use |

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

```typescript
<aum-grid
  [config]="config"
  (selectionChange)="onSelect($event)"        // T[]
  (cellValueChange)="onEdit($event)"          // CellValueChangedEvent<T>
  (rowDragEnd)="onDrop($event)"               // RowDragEndEvent<T>
  (sortChange)="onSort($event)"               // SortChangedEvent<T>
  (filterChange)="onFilter($event)"           // FilterChangedEvent<T>
  (paginationChange)="onPage($event)"         // PaginationChangedEvent
  (gridReady)="onReady($event)"               // GridApi<T>
></aum-grid>
```

---

## Public API (via ViewChild)

```typescript
@ViewChild('myGrid') grid!: AumGridComponent<Employee>;

// Export current view to CSV
this.grid.exportCsv();

// Get currently selected rows
const rows = this.grid.getSelectedRows();

// Force-refresh all visible cells
this.grid.refreshData();

// Show / hide overlays manually
this.grid.showLoading();
this.grid.hideOverlay();
```

---

## Feature Examples

### Sorting, Filtering, Pagination

Enabled by default. Disable per-column or globally:

```typescript
config: AumGridConfig = {
  sortable: true,        // default: true
  filterable: true,      // default: true
  pagination: true,
  pageSize: 50,
};
```

### Column Pinning

```typescript
{ field: 'id', pinned: 'left', width: 80, flex: 0 }
```

### Row Selection

```typescript
config: AumGridConfig = {
  rowSelection: 'multiple',
};
// subscribe via (selectionChange) output or getSelectedRows()
```

### Inline Cell Editing

```typescript
config: AumGridConfig = {
  editable: true,                     // enables for all columns
  columns: [
    { field: 'status', editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Active', 'Inactive', 'Pending'] } },
    { field: 'id', editable: false }, // override per column
  ],
};
```

### Row Drag & Drop

```typescript
config: AumGridConfig = {
  rowDrag: true,
  columns: [
    { field: 'id', rowDrag: true },   // drag handle on this column
  ],
};
```

### CSV Export

```typescript
@ViewChild('grid') grid!: AumGridComponent<T>;

exportCsv() {
  this.grid.exportCsv();   // uses config.csvFilename or 'export.csv'
}
```

### Virtual Scroll (large datasets)

Virtual scroll is automatic — AG Grid uses a virtualised DOM by default. Simply pass all rows:

```typescript
config: AumGridConfig = {
  rowData: Array.from({ length: 100_000 }, (_, i) => makeRow(i)),
  pagination: false,   // disable pagination for virtual scroll UX
};
```

### Infinite Scroll (server-side)

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

```typescript
// Pass reactively via config signal
config = signal<AumGridConfig>({ loading: true, ... });

// After data loads:
this.config.update(c => ({ ...c, loading: false, rowData: result }));
```

### Server-side loading (manual via ViewChild)

```typescript
this.grid.showLoading();
this.api.getData().subscribe(data => {
  this.rowData.set(data);
  this.grid.hideOverlay();
});
```

---

## Setup: CSS Import (required once per app)

AG Grid's base styles ship in a separate package. Add these two imports to **each app's `styles.scss`** — they are NOT loaded by the component itself:

```scss
// apps/<your-app>/src/styles.scss
@import '@ag-grid-community/styles/ag-grid.css';        // structural base
@import '@ag-grid-community/styles/ag-theme-quartz.css'; // quartz visual theme
```

This is a one-time setup per app. `aum-grid` handles all Material token overrides in its own component SCSS after these are loaded.

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

To customise the theme for a specific use case, pass `gridOptions` with a custom theme:

```typescript
import { themeQuartz } from '@ag-grid-community/core';

const myTheme = themeQuartz.withParams({ rowHeight: 32 });

config: AumGridConfig = {
  gridOptions: { theme: myTheme },
  ...
};
```

---

## No Enterprise Features

This component uses only `@ag-grid-community/*` packages (MIT licence). **Never install `@ag-grid-enterprise/*`** — doing so triggers a licence watermark in production for all users.

Missing enterprise features and their workarounds:

| Enterprise feature | Workaround |
|---|---|
| Excel export | Use `exportCsv()` + ask users to open in Excel, or add SheetJS |
| Row grouping | Pre-aggregate data on the server; use tree data for hierarchy |
| Set filters | Use `agTextColumnFilter` or `agNumberColumnFilter` |

---

## Keyboard Navigation

AG Grid's keyboard navigation is enabled by default:
- `Tab` / `Shift+Tab` — move between cells
- `Arrow keys` — navigate cells
- `Enter` — start editing (when `editable: true`)
- `Escape` — cancel edit
- `Space` — toggle row selection
