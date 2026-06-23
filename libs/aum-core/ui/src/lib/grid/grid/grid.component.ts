import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  OnDestroy,
  AfterContentInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
  ContentChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { AgGridAngular } from '@ag-grid-community/angular';
import {
  GridApi,
  GridReadyEvent,
  ColDef,
  ModuleRegistry,
  SelectionChangedEvent,
  CellValueChangedEvent,
  RowDragEndEvent,
  SortChangedEvent,
  FilterChangedEvent,
  PaginationChangedEvent,
  IDatasource,
  ModelUpdatedEvent,
} from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { CsvExportModule } from '@ag-grid-community/csv-export';

import { ButtonComponent } from '../../buttons/button/button.component';
import { MenuList, MenuItem } from '../../navigation/menu-list/menu-list';
import { Spinner } from '../../utilities/spinner/spinner';
import { AumChipComponent } from '../../utilities/chip/chip';
import { CheckboxComponent } from '../../form-controls/checkbox/checkbox';
import { AumGridConfig, AumGridEvents, AumColumnDef, AumRowAction, AumBulkAction, AumActiveFilter } from './grid.types';
import { AumGridFilterDirective } from './grid-filter.directive';
import { AumGridToolbarActionsDirective } from './grid-toolbar-actions.directive';
import { AumCsvExportDialogComponent, AumCsvExportDialogData, AumCsvExportDialogResult } from './dialogs/csv-export-dialog.component';
import { AumFilterChipsDialogComponent, AumFilterChipsDialogData } from './dialogs/filter-chips-dialog.component';
import { ConfirmationImageComponent } from '@aum/common';

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const MAX_INLINE_BULK_ACTIONS = 4;
const MAX_VISIBLE_CHIPS = 4;

@Component({
  selector: 'aum-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular, TranslateModule, MatMenuModule, ButtonComponent, MenuList, Spinner, AumChipComponent, CheckboxComponent, ConfirmationImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class AumGridComponent implements AfterContentInit, OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  // Render AG Grid popups at document.body to prevent clipping by overflow:hidden containers
  readonly popupParent: HTMLElement = document.body;

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @ViewChild('menuTrigger', { read: ElementRef }) menuTriggerEl!: ElementRef<HTMLElement>;
  @ContentChild(AumGridFilterDirective) filterDirective?: AumGridFilterDirective;
  @ContentChild(AumGridToolbarActionsDirective) toolbarActionsDirective?: AumGridToolbarActionsDirective;

  config = input.required<AumGridConfig<any>>();
  events = input<AumGridEvents<any>>({});
  height = input<string>('500px');
  activeFilters = input<AumActiveFilter[]>([]);
  loading = input<boolean>(false);
  error = input<boolean>(false);

  selectionChange = output<any[]>();
  filterApply = output<void>();
  filterReset = output<void>();
  filterClose = output<void>();
  filterChipRemove = output<string>();
  filterChipClearAll = output<void>();
  cellValueChange = output<CellValueChangedEvent<any>>();
  rowDragEnd = output<RowDragEndEvent<any>>();
  sortChange = output<SortChangedEvent<any>>();
  filterChange = output<FilterChangedEvent<any>>();
  paginationChange = output<PaginationChangedEvent>();
  gridReady = output<GridApi<any>>();

  private gridApi = signal<GridApi<any> | null>(null);
  readonly activeRow = signal<any>(null);
  readonly filterPanelOpen = signal(false);
  readonly columnPanelOpen = signal(false);
  readonly hasFilterPanel = signal(false);
  readonly hasToolbarActions = signal(false);

  // Column visibility panel — snapshot taken at gridReady, used by Reset to default
  readonly columnPanelItems = signal<{ field: string; label: string; visible: boolean }[]>([]);
  private columnVisibilityDefaults: Record<string, boolean> = {};

  readonly canHideMoreColumns = computed(() =>
    this.columnPanelItems().filter(c => c.visible).length > 1
  );

  // Max chips shown inline before "+N" overflow
  readonly maxVisibleChips = input<number>(MAX_VISIBLE_CHIPS);

  // Snapshot of applied filters — only updated when Apply is clicked or chip removed/cleared.
  // Prevents unapplied pending changes from showing chips prematurely.
  readonly appliedFilters = signal<AumActiveFilter[]>([]);

  readonly visibleChips = computed(() =>
    this.appliedFilters().slice(0, this.maxVisibleChips())
  );
  readonly overflowChips = computed(() =>
    this.appliedFilters().slice(this.maxVisibleChips())
  );
  readonly hasChips = computed(() => this.appliedFilters().length > 0);

  // Row counts — updated via onModelUpdated / onPaginationChanged
  readonly displayedCount = signal(0);
  readonly totalRowCount = signal(0);
  readonly filteredRowCount = signal(0);
  readonly visibleSelectedCount = signal(0);
  readonly hasSelection = computed(() => this.visibleSelectedCount() > 0);

  // gridReadyFired gates showEmpty to avoid flashing the empty overlay on init
  private readonly gridReadyFired = signal(false);
  // filterYieldsEmpty is set only from onFilterChanged — not onModelUpdated (transient)
  private readonly filterYieldsEmpty = signal(false);
  readonly showEmpty = computed(() =>
    this.gridReadyFired() && !this.loading() && !this.error() &&
    (this.totalRowCount() === 0 || this.filterYieldsEmpty())
  );

  readonly countLabel = computed(() => {
    const label = this.config().toolbar?.countLabel ?? '';
    const pageRows = this.displayedCount();
    const filtered = this.filteredRowCount();
    const total = this.totalRowCount();
    if (!label || total === 0) return label;
    const denominator = filtered < total ? filtered : total;
    return `Displaying ${pageRows} of ${denominator} ${label}`;
  });

  // Pagination state
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly pageStartRow = signal(0);
  readonly pageEndRow = signal(0);
  readonly currentPageSize = signal(25);

  readonly isFirstPage = computed(() => this.currentPage() === 0);
  readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);

  readonly pageSizeMenuItems = computed<MenuItem[]>(() =>
    [10, 25, 50, 100].map(size => ({
      label: String(size),
      value: String(size),
      showSelection: true,
      selected: this.currentPageSize() === size,
    }))
  );

  // Selected rows
  readonly selectedRows = signal<any[]>([]);

  readonly inlineBulkActions = computed<AumBulkAction<any>[]>(() =>
    (this.config().bulkActions ?? []).slice(0, MAX_INLINE_BULK_ACTIONS)
  );
  readonly overflowBulkActions = computed<AumBulkAction<any>[]>(() =>
    (this.config().bulkActions ?? []).slice(MAX_INLINE_BULK_ACTIONS)
  );
  readonly hasBulkActions = computed(() => (this.config().bulkActions?.length ?? 0) > 0);

  readonly overflowBulkMenuItems = computed<MenuItem[]>(() =>
    this.overflowBulkActions().map((a: AumBulkAction<any>) => ({
      label: a.label,
      value: a.label,
      icon: a.icon,
      disabled: a.disabled?.(this.selectedRows()) ?? false,
      showSelection: false,
    }))
  );

  readonly columnDefs = computed<ColDef<any>[]>(() => {
    const cols = this.config().columns.map((col: AumColumnDef<any>) => this.buildColDef(col));
    if (this.config().rowActions?.length) cols.push(this.buildActionsColDef());
    return cols;
  });

  readonly defaultColDef = computed<ColDef<any>>(() => ({
    sortable: this.config().sortable ?? true,
    filter: this.config().filterable ?? false,
    resizable: this.config().resizable ?? true,
    editable: this.config().editable ?? false,
    suppressMovable: !(this.config().reorderable ?? true),
    minWidth: 80,
    flex: 1,
  }));

  readonly rowSelection = computed(() => {
    const sel = this.config().rowSelection ?? 'none';
    if (sel === 'none') return undefined;
    return { mode: sel === 'single' ? ('singleRow' as const) : ('multiRow' as const) };
  });

  readonly pagination = computed(() => this.config().pagination ?? false);
  readonly paginationPageSize = computed(() => this.config().pageSize ?? 25);
  readonly rowModelType = computed(() =>
    this.config().mode === 'infinite' ? ('infinite' as const) : ('clientSide' as const)
  );
  readonly treeData = computed(() => this.config().treeData ?? false);
  readonly hasToolbar = computed(() => !!this.config().toolbar);
  readonly showSearch = computed(() => this.config().toolbar?.search ?? false);
  readonly showCsvExport = computed(() => this.config().toolbar?.csvExport ?? this.config().csvExport ?? false);
  readonly showColumnToggle = computed(() =>
    (this.config().toolbar?.columnToggle ?? false) && this.columnPanelItems().length > 0
  );
  readonly showFilterToggle = computed(() =>
    (this.config().toolbar?.filterToggle ?? false) && this.hasFilterPanel()
  );
  readonly hasAnyBuiltinAction = computed(() =>
    this.showSearch() || this.showCsvExport() || this.showColumnToggle()
  );
  readonly hasRowActions = computed(() => (this.config().rowActions?.length ?? 0) > 0);

  readonly visibleRowActions = computed<AumRowAction<any>[]>(() => {
    const row = this.activeRow();
    if (!row) return this.config().rowActions ?? [];
    return (this.config().rowActions ?? []).filter((a: AumRowAction<any>) => !a.hidden?.(row));
  });

  readonly rowActionMenuItems = computed<MenuItem[]>(() =>
    this.visibleRowActions().map((a: AumRowAction<any>) => ({
      label: a.label,
      value: a.label,
      icon: a.icon,
      disabled: this.activeRow() ? (a.disabled?.(this.activeRow()) ?? false) : false,
      showSelection: false,
    }))
  );

  // ── Grid events ───────────────────────────────────────────────────────────

  onGridReady(event: GridReadyEvent<any>): void {
    this.gridApi.set(event.api);
    this.gridReady.emit(event.api);
    event.api.setGridOption('suppressNoRowsOverlay', true);
    if (this.config().mode === 'infinite' && this.config().datasource) {
      event.api.setGridOption('datasource', this.config().datasource as IDatasource);
    }
    this.currentPageSize.set(this.config().pageSize ?? 25);
    const extra = this.config().gridOptions;
    if (extra) {
      for (const [key, value] of Object.entries(extra)) {
        event.api.setGridOption(key as any, value);
      }
    }
    this.gridReadyFired.set(true);
    this.initColumnPanel(event.api);
  }

  onModelUpdated(event: ModelUpdatedEvent<any>): void {
    const api = event.api;
    let total = 0;
    api.forEachLeafNode(() => total++);
    let filtered = 0;
    api.forEachNodeAfterFilter(node => { if (!node.group) filtered++; });
    // Ignore transient onModelUpdated with total=0 from AG Grid internal re-init
    if (total > 0) {
      this.totalRowCount.set(total);
      this.filteredRowCount.set(filtered);
      if (!this.pagination()) this.displayedCount.set(filtered);
    }
    let visibleSelected = 0;
    api.forEachNodeAfterFilter(node => { if (node.isSelected()) visibleSelected++; });
    this.visibleSelectedCount.set(visibleSelected);
  }

  onSelectionChanged(event: SelectionChangedEvent<any>): void {
    const rows = event.api.getSelectedRows();
    this.selectedRows.set(rows);
    this.selectionChange.emit(rows);
    this.events().selectionChanged?.(rows);
    let visibleSelected = 0;
    event.api.forEachNodeAfterFilter(node => { if (node.isSelected()) visibleSelected++; });
    this.visibleSelectedCount.set(visibleSelected);
  }

  onCellValueChanged(event: CellValueChangedEvent<any>): void {
    this.cellValueChange.emit(event);
    this.events().cellValueChanged?.(event);
  }

  onRowDragEnd(event: RowDragEndEvent<any>): void {
    this.rowDragEnd.emit(event);
    this.events().rowDragEnd?.(event);
  }

  onSortChanged(event: SortChangedEvent<any>): void {
    this.sortChange.emit(event);
    this.events().sortChanged?.(event);
  }

  onFilterChanged(event: FilterChangedEvent<any>): void {
    let filtered = 0;
    event.api.forEachNodeAfterFilter(node => { if (!node.group) filtered++; });
    this.filterYieldsEmpty.set(filtered === 0);
    this.filterChange.emit(event);
    this.events().filterChanged?.(event);
  }

  onPaginationChanged(event: PaginationChangedEvent): void {
    const api = event.api;
    this.currentPage.set(api.paginationGetCurrentPage());
    this.totalPages.set(api.paginationGetTotalPages());
    const filteredTotal = api.paginationGetRowCount();
    this.filteredRowCount.set(filteredTotal);
    const start = api.paginationGetCurrentPage() * api.paginationGetPageSize();
    const end = Math.min(start + api.paginationGetPageSize(), filteredTotal);
    this.pageStartRow.set(start + 1);
    this.pageEndRow.set(end);
    this.displayedCount.set(end - start);
    this.paginationChange.emit(event);
    this.events().paginationChanged?.(event);
  }

  // ── Pagination controls ───────────────────────────────────────────────────

  goToFirstPage(): void  { this.gridApi()?.paginationGoToFirstPage(); }
  goToPrevPage(): void   { this.gridApi()?.paginationGoToPreviousPage(); }
  goToNextPage(): void   { this.gridApi()?.paginationGoToNextPage(); }
  goToLastPage(): void   { this.gridApi()?.paginationGoToLastPage(); }

  onPageSizeSelected(item: MenuItem): void {
    const size = parseInt(item.value as string, 10);
    this.currentPageSize.set(size);
    this.gridApi()?.setGridOption('paginationPageSize', size);
  }

  // ── Toolbar actions ───────────────────────────────────────────────────────

  onSearchInput(value: string): void {
    this.gridApi()?.setGridOption('quickFilterText', value);
  }

  toggleFilters(): void {
    const opening = !this.filterPanelOpen();
    if (opening) this.columnPanelOpen.set(false);
    this.filterPanelOpen.set(opening);
  }

  applyFilters(): void {
    this.appliedFilters.set(this.activeFilters());
    this.filterPanelOpen.set(false);
    this.filterApply.emit();
  }

  resetFilters(): void {
    this.appliedFilters.set([]);
    this.filterPanelOpen.set(false);
    this.filterReset.emit();
  }

  closeFilterPanel(): void {
    this.filterPanelOpen.set(false);
    this.filterClose.emit();
  }

  removeFilterChip(key: string): void {
    this.appliedFilters.update(chips => chips.filter(c => c.key !== key));
    this.filterChipRemove.emit(key);
  }

  clearAllFilterChips(): void {
    this.appliedFilters.set([]);
    this.filterChipClearAll.emit();
  }

  openOverflowDialog(): void {
    const all = this.appliedFilters();
    const ref = this.dialog.open<AumFilterChipsDialogComponent, AumFilterChipsDialogData>(
      AumFilterChipsDialogComponent,
      {
        data: {
          chips: all,
          appliedCount: all.length,
          onRemove: (key: string) => this.removeFilterChip(key),
        } satisfies AumFilterChipsDialogData,
        width: '400px',
        panelClass: 'aum-dialog-container',
        autoFocus: false,
      }
    );
    ref.afterClosed().subscribe(result => {
      if (result?.action === 'clearAll') this.clearAllFilterChips();
    });
  }

  // ── CSV Export ─────────────────────────────────────────────────────────────

  openCsvExportDialog(): void {
    const total = this.totalRowCount();
    const filtered = this.filteredRowCount();
    const filterActive = filtered < total && total > 0;

    const ref = this.dialog.open<AumCsvExportDialogComponent, AumCsvExportDialogData, AumCsvExportDialogResult>(
      AumCsvExportDialogComponent,
      {
        data: {
          defaultFilename: this.config().csvFilename ?? 'export',
          totalRows: total,
          filteredRows: filterActive ? filtered : total,
          filterActive,
        },
        width: '420px',
        autoFocus: 'input',
        panelClass: 'aum-dialog-container',
      }
    );

    ref.afterClosed().subscribe(result => {
      if (!result?.filename) return;
      this.gridApi()?.exportDataAsCsv({ fileName: result.filename });
    });
  }

  // ── Bulk actions ──────────────────────────────────────────────────────────

  triggerBulkAction(action: AumBulkAction<any>): void {
    const rows = this.selectedRows();
    if (!action.disabled?.(rows)) action.action(rows);
  }

  onBulkOverflowSelected(item: MenuItem): void {
    const action = (this.config().bulkActions ?? []).find((a: AumBulkAction<any>) => a.label === item.value);
    if (action) this.triggerBulkAction(action);
  }

  clearSelection(): void {
    this.gridApi()?.deselectAll();
    this.selectedRows.set([]);
    this.visibleSelectedCount.set(0);
  }

  // ── Column panel ──────────────────────────────────────────────────────────

  toggleColumnPanel(): void {
    const opening = !this.columnPanelOpen();
    if (opening) this.filterPanelOpen.set(false);
    this.columnPanelOpen.set(opening);
  }

  setColumnVisible(field: string, visible: boolean): void {
    const api = this.gridApi();
    if (!api) return;
    if (!visible && this.columnPanelItems().filter(c => c.visible).length <= 1) return;
    api.setColumnsVisible([field], visible);
    this.columnPanelItems.update(items =>
      items.map(c => c.field === field ? { ...c, visible } : c)
    );
  }

  resetColumnVisibility(): void {
    const api = this.gridApi();
    if (!api) return;
    const show = Object.keys(this.columnVisibilityDefaults).filter(f => this.columnVisibilityDefaults[f]);
    const hide = Object.keys(this.columnVisibilityDefaults).filter(f => !this.columnVisibilityDefaults[f]);
    if (show.length) api.setColumnsVisible(show, true);
    if (hide.length) api.setColumnsVisible(hide, false);
    this.columnPanelItems.update(items =>
      items.map(c => ({ ...c, visible: this.columnVisibilityDefaults[c.field] ?? true }))
    );
  }

  closeColumnPanel(): void {
    this.columnPanelOpen.set(false);
  }

  // ── Row actions ───────────────────────────────────────────────────────────

  onMenuItemSelected(item: MenuItem): void {
    const action = (this.config().rowActions ?? []).find((a: AumRowAction<any>) => a.label === item.value);
    if (action) this.triggerRowAction(action);
  }

  triggerRowAction(action: AumRowAction<any>): void {
    const row = this.activeRow();
    if (row && !action.disabled?.(row)) action.action(row);
  }

  isActionDisabled(action: AumRowAction<any>): boolean {
    const row = this.activeRow();
    return row ? (action.disabled?.(row) ?? false) : false;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  getSelectedRows(): any[] {
    return this.selectedRows();
  }

  refreshData(): void {
    this.gridApi()?.refreshCells({ force: true });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngAfterContentInit(): void {
    this.hasFilterPanel.set(!!this.filterDirective);
    this.hasToolbarActions.set(!!this.toolbarActionsDirective);
  }

  ngOnDestroy(): void {
    this.gridApi()?.destroy();
    this.gridReadyFired.set(false);
    this.filterYieldsEmpty.set(false);
  }

  // ── Internal helpers ──────────────────────────────────────────────────────

  private initColumnPanel(api: GridApi<any>): void {
    const items = (api.getColumns() ?? [])
      .filter(col => {
        const field = col.getColDef().field;
        return field && field !== '__actions__' && col.getColDef().pinned == null;
      })
      .map(col => {
        const field = col.getColDef().field!;
        const label = col.getColDef().headerName ?? field;
        const visible = col.isVisible();
        this.columnVisibilityDefaults[field] = visible;
        return { field, label, visible };
      });
    this.columnPanelItems.set(items);
  }

  private buildColDef(col: AumColumnDef<any>): ColDef<any> {
    const { headerNameKey, cellTemplate, headerTemplate, ...rest } = col;
    const colDef: ColDef<any> = { ...rest };
    if (headerNameKey && !col.headerName) {
      colDef.headerName = this.translate.instant(headerNameKey);
    }
    return colDef;
  }

  private buildActionsColDef(): ColDef<any> {
    return {
      field: '__actions__',
      headerName: '',
      width: 48,
      flex: 0,
      pinned: 'right',
      sortable: false,
      filter: false,
      resizable: false,
      suppressMovable: true,
      cellClass: 'aum-actions-cell',
      cellRenderer: (params: any) => {
        const btn = document.createElement('button');
        btn.className = 'aum-grid-action-btn';
        btn.title = this.translate.instant('AUM.GRID_ROW_ACTIONS');
        btn.innerHTML = '<span class="material-icons">more_vert</span>';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openRowMenu(params.data, btn);
        });
        return btn;
      },
    };
  }

  private openRowMenu(row: any, triggerEl: HTMLElement): void {
    this.activeRow.set(row);
    // Reposition the fixed span to the button's location so the menu opens beside it
    const rect = triggerEl.getBoundingClientRect();
    const span = this.menuTriggerEl?.nativeElement;
    if (span) {
      span.style.left = `${rect.left + rect.width / 2}px`;
      span.style.top = `${rect.top + rect.height / 2}px`;
    }
    setTimeout(() => this.menuTrigger?.openMenu(), 0);
  }
}
