import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';

import { AppConfigService, SideNavItem } from '@aum/utils/services';

@Component({
  selector: 'aum-sidebar-3',
  standalone: true,
  imports: [Icon, TranslateModule],
  templateUrl: './sidebar3.component.html',
  styleUrl: './sidebar3.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar3Component implements OnInit {
  readonly expanded = input(false);
  readonly mobileMode = input(false);

  @Output() menuItemClicked = new EventEmitter<void>();
  @Output() expandRequested = new EventEmitter<void>();

  readonly openParents = signal<string[]>([]);
  readonly activeItemValue = signal<string | null>(null);

  private appConfigService = inject(AppConfigService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  navItems = this.appConfigService.navItems;

  readonly isExpanded = computed(() => this.expanded() || this.mobileMode());

  readonly activeParentValue = computed(() => {
    const activeVal = this.activeItemValue();
    if (!activeVal) return null;
    const parent = this.navItems().find(
      (item) =>
        item.children?.length &&
        item.children.some(
          (c) => activeVal === c.value || activeVal.startsWith(c.value + '/')
        )
    );
    return parent?.value ?? null;
  });

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => {
        this.activeItemValue.set(this.router.url);
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    const url = this.router.url;
    this.activeItemValue.set(url);

    if (this.mobileMode()) {
      const activeParent = this.navItems().find(
        (item) =>
          item.children?.length &&
          item.children.some((c) => url === c.value || url.startsWith(c.value + '/'))
      );
      if (activeParent) this.openParents.set([activeParent.value]);
    }
  }

  onItemClick(item: SideNavItem): void {
    if (item.children?.length) {
      if (!this.isExpanded()) {
        this.openParents.set([item.value]);
        this.expandRequested.emit();
        return;
      }
      const open = this.openParents();
      this.openParents.set(
        open.includes(item.value)
          ? open.filter((v) => v !== item.value)
          : [...open, item.value]
      );
    } else {
      this.activeItemValue.set(item.value);
      this.router.navigateByUrl(item.value).then((success) => {
        if (success) this.menuItemClicked.emit();
      });
    }
  }

  isItemActive(item: SideNavItem): boolean {
    const active = this.activeItemValue();
    if (!active) return false;
    return active === item.value || active.startsWith(item.value + '/');
  }

  isParentOpen(item: SideNavItem): boolean {
    return this.openParents().includes(item.value);
  }

  isParentActive(item: SideNavItem): boolean {
    if (!item.children?.length) return false;
    if (!this.isExpanded()) return this.activeParentValue() === item.value;
    return !this.isParentOpen(item) && this.activeParentValue() === item.value;
  }
}
