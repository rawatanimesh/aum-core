import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GridApi } from '@ag-grid-community/core';

import { PageComponent } from '@aum/ui/layout';
import { TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { ButtonComponent } from '@aum/ui/buttons';
import { DatePickerComponent } from '@aum/ui/form-controls';
import { AumGridComponent, AumGridFilterDirective, AumGridToolbarActionsDirective, AumGridFilterState } from '@aum/ui/grid';
import type { AumGridConfig, AumColumnDef, AumRowAction, AumBulkAction, AumActiveFilter } from '@aum/ui/grid';
import { SnackbarService } from '@aum/ui/utilities';
import { LanguageTranslationService } from '@aum/utils/services';

interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  salary: number;
  country: string;
  startDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Finance', 'HR'];
const COUNTRIES = ['USA', 'UK', 'Japan', 'India', 'Germany', 'Canada'];
const ROLES = ['Manager', 'Senior', 'Mid', 'Junior', 'Lead', 'Director'];
const STATUSES: Employee['status'][] = ['Active', 'Inactive', 'Pending'];

function makeEmployee(i: number): Employee {
  return {
    id: i + 1,
    name: `Employee ${i + 1}`,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    role: ROLES[i % ROLES.length],
    salary: 50000 + (i % 20) * 5000,
    country: COUNTRIES[i % COUNTRIES.length],
    startDate: `${2018 + (i % 6)}-0${(i % 9) + 1}-15`,
    status: STATUSES[i % STATUSES.length],
  };
}

const ALL_ROWS: Employee[] = Array.from({ length: 200 }, (_, i) => makeEmployee(i));

const BASE_COLUMNS: AumColumnDef<Employee>[] = [
  { field: 'id',         headerName: 'ID',         width: 70,  flex: 0, filter: 'agNumberColumnFilter', pinned: 'left' },
  { field: 'name',       headerName: 'Name',       minWidth: 160 },
  { field: 'department', headerName: 'Department', minWidth: 140 },
  { field: 'role',       headerName: 'Role',       minWidth: 120 },
  { field: 'salary',     headerName: 'Salary',     minWidth: 120, filter: 'agNumberColumnFilter',
    valueFormatter: (p: any) => p.value != null ? `$${p.value.toLocaleString()}` : '' },
  { field: 'country',    headerName: 'Country',    minWidth: 120 },
  { field: 'startDate',  headerName: 'Start Date', minWidth: 130 },
  { field: 'status',     headerName: 'Status',     minWidth: 110 },
];

@Component({
  selector: 'demo-grid',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PageComponent,
    TabGroupComponent,
    TabComponent,
    ButtonComponent,
    AumGridComponent,
    AumGridFilterDirective,
    AumGridToolbarActionsDirective,
    DatePickerComponent,
  ],
  providers: [AumGridFilterState],
  templateUrl: './grid-demo.html',
  styleUrl: './grid-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridDemo {
  private snackbar = inject(SnackbarService);
  private lang = inject(LanguageTranslationService);

  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'GRID_DEMO_TITLE', route: '/playground/grid' },
    ],
  };

  // ── Filter panel state (via AumGridFilterState) ──────────────────────────
  private basicGridApi: GridApi<Employee> | null = null;
  readonly filterState = inject(AumGridFilterState<Employee>);

  readonly statusOptions = [...new Set(ALL_ROWS.map(r => r.status))].sort();

  readonly filterStatuses = signal<string[]>([]);
  readonly filterDateFrom = signal('');
  readonly filterDateTo   = signal('');

  // FormControls for aum-date-picker — kept in sync with the signals above
  readonly dateFromControl = new FormControl<Date | null>(null);
  readonly dateToControl   = new FormControl<Date | null>(null);

  isLoading = signal(true);
  basicRowData = signal<Employee[] | null>(null);

  constructor() {
    this.filterState.register<string[]>(
      {
        key: '__statuses__',
        signal: this.filterStatuses,
        label: () => null,
        predicate: (row, statuses) => !statuses.length || statuses.includes(row.status),
      },
    );
    this.filterState.register<string>(
      {
        key: 'dateFrom',
        signal: this.filterDateFrom,
        label: v => v ? `From: ${v}` : null,
        predicate: (row, v) => !v || row.startDate >= v,
      },
      {
        key: 'dateTo',
        signal: this.filterDateTo,
        label: v => v ? `To: ${v}` : null,
        predicate: (row, v) => !v || row.startDate <= v,
      },
    );

    // Simulate a 2s API load before handing row data to the grid
    setTimeout(() => {
      this.basicRowData.set(ALL_ROWS.slice(0, 50));
      this.isLoading.set(false);
    }, 2000);
  }

  // Statuses need individual chips — computed on top of the service's activeFilters
  readonly activeFiltersWithStatusChips = computed<AumActiveFilter[]>(() => {
    const base = this.filterState.activeFilters().filter(c => c.key !== '__statuses__');
    const statusChips = this.filterStatuses().map(s => ({ key: `status:${s}`, label: `Status: ${s}` }));
    return [...base, ...statusChips];
  });

  onBasicGridReady(api: GridApi<Employee>): void {
    this.basicGridApi = api;
  }

  reloadBasicGrid(): void {
    this.isLoading.set(true);
    this.basicRowData.set(null);
    setTimeout(() => {
      this.basicRowData.set(ALL_ROWS.slice(0, 50));
      this.isLoading.set(false);
    }, 1000);
  }

  isStatusSelected(status: string): boolean {
    return this.filterStatuses().includes(status);
  }

  toggleStatus(status: string): void {
    this.filterStatuses.update(current =>
      current.includes(status) ? current.filter(s => s !== status) : [...current, status]
    );
  }

  onDateFromSelected(date: Date | null): void {
    this.filterDateFrom.set(date ? this.toIsoDate(date) : '');
  }

  onDateToSelected(date: Date | null): void {
    this.filterDateTo.set(date ? this.toIsoDate(date) : '');
  }

  private toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  onFilterApply(): void {
    if (!this.basicGridApi) return;
    this.filterState.applyToGrid(this.basicGridApi);
    this.snackbar.info(this.lang.instant('GRID_FILTERS_APPLIED'));
  }

  onFilterChipRemove(key: string): void {
    if (key.startsWith('status:')) {
      const status = key.slice('status:'.length);
      this.filterStatuses.update(s => s.filter(x => x !== status));
      if (this.basicGridApi) this.filterState.applyToGrid(this.basicGridApi);
    } else {
      if (key === 'dateFrom') this.dateFromControl.reset(null, { emitEvent: false });
      if (key === 'dateTo')   this.dateToControl.reset(null, { emitEvent: false });
      this.filterState.removeByKey(key, this.basicGridApi ?? undefined);
    }
  }

  onFilterReset(): void {
    this.filterStatuses.set([]);
    this.dateFromControl.reset(null, { emitEvent: false });
    this.dateToControl.reset(null, { emitEvent: false });
    this.filterState.clearAll(this.basicGridApi ?? undefined);
  }

  onFilterChipClearAll(): void {
    this.filterStatuses.set([]);
    this.dateFromControl.reset(null, { emitEvent: false });
    this.dateToControl.reset(null, { emitEvent: false });
    this.filterState.clearAll(this.basicGridApi ?? undefined);
  }

  onFilterClose(): void {
    // panel toggled closed — no action needed, chips persist
  }

  // ── Tab 1: Basic ──────────────────────────────────────────────────────────

  private bulkActions: AumBulkAction<Employee>[] = [
    {
      icon: 'download',
      label: 'Export',
      action: rows => this.snackbar.info(`Exporting ${rows.length} employee(s)`),
    },
    {
      icon: 'send',
      label: 'Notify',
      action: rows => this.snackbar.success(`Notification sent to ${rows.length} employee(s)`),
    },
    {
      icon: 'archive',
      label: 'Archive',
      action: rows => this.snackbar.info(`Archived ${rows.length} employee(s)`),
      disabled: rows => rows.every(r => r.status === 'Inactive'),
    },
    {
      icon: 'delete',
      label: 'Delete',
      action: rows => this.snackbar.error(`Deleted ${rows.length} employee(s)`),
      disabled: rows => rows.some(r => r.status === 'Active'),
    },
    {
      icon: 'edit_note',
      label: 'Bulk edit',
      action: rows => this.snackbar.info(`Bulk editing ${rows.length} employee(s)`),
    },
  ];

  private rowActions: AumRowAction<Employee>[] = [
    { icon: 'visibility',   label: 'View',      action: r => this.snackbar.info(`Viewing ${r.name}`) },
    { icon: 'edit',         label: 'Edit',      action: r => this.snackbar.info(`Editing ${r.name}`) },
    { icon: 'content_copy', label: 'Duplicate', action: r => this.snackbar.success(`Duplicated ${r.name}`) },
    { icon: 'delete',       label: 'Delete',    action: r => this.snackbar.error(`Deleted ${r.name}`),
      disabled: r => r.status === 'Active' },
  ];

  readonly basicConfig = computed<AumGridConfig<Employee>>(() => ({
    columns: BASE_COLUMNS,
    rowData: this.basicRowData() ?? [],
    rowSelection: 'multiple',
    pagination: true,
    pageSize: 10,
    rowActions: this.rowActions,
    bulkActions: this.bulkActions,
    toolbar: {
      countLabel: 'employees',
      search: true,
      csvExport: true,
      columnToggle: true,
      filterToggle: true,
    },
    csvFilename: 'employees',
  }));

  // ── Tab 2: Editable + Row Drag ────────────────────────────────────────────

  editableConfig: AumGridConfig<Employee> = {
    columns: [
      { field: 'id',         headerName: 'ID',         width: 70, flex: 0, editable: false, rowDrag: true },
      { field: 'name',       headerName: 'Name',       minWidth: 160, editable: true },
      { field: 'department', headerName: 'Department', minWidth: 140, editable: true,
        cellEditor: 'agSelectCellEditor', cellEditorParams: { values: DEPARTMENTS } },
      { field: 'role',       headerName: 'Role',       minWidth: 120, editable: true },
      { field: 'salary',     headerName: 'Salary',     minWidth: 120, editable: true, filter: 'agNumberColumnFilter' },
      { field: 'country',    headerName: 'Country',    minWidth: 120, editable: true,
        cellEditor: 'agSelectCellEditor', cellEditorParams: { values: COUNTRIES } },
    ],
    rowData: ALL_ROWS.slice(0, 20).map(r => ({ ...r })),
    rowDrag: true,
    editable: true,
    rowActions: this.rowActions,
    toolbar: { countLabel: 'Drag rows to reorder · Click cells to edit' },
  };

  onCellValueChanged(event: { data: Employee; colDef: { field?: string }; newValue: unknown }): void {
    this.snackbar.info(`${event.colDef.field} → "${event.newValue}"`, 2500);
  }

  // ── Tab 3: Virtual Scroll ─────────────────────────────────────────────────

  largeDataConfig: AumGridConfig<Employee> = {
    columns: BASE_COLUMNS,
    rowData: Array.from({ length: 100_000 }, (_, i) => makeEmployee(i)),
    rowSelection: 'none',
    rowActions: this.rowActions,
    toolbar: { countLabel: '100,000 rows — virtual scroll active', search: true },
  };
}
