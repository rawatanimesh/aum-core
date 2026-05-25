import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
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

import {
  AppConfigService,
  SideNavItem,
} from '@aum/utils/services';

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

  readonly openParent = signal<SideNavItem | null>(null);
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
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.syncActiveItem();
        this.cdr.markForCheck();
      });

    effect(() => {
      if (!this.isExpanded()) {
        this.openParent.set(null);
      }
    });
  }

  ngOnInit(): void {
    this.syncActiveItem();
  }

  private syncActiveItem(): void {
    const url = this.router.url;
    this.activeItemValue.set(url);

    if (this.mobileMode()) {
      const parent =
        this.navItems().find(
          (item) =>
            item.children?.length &&
            item.children.some(
              (c) => url === c.value || url.startsWith(c.value + '/')
            )
        ) ?? null;
      if (parent) this.openParent.set(parent);
    }
  }

  onItemClick(item: SideNavItem): void {
    if (item.children?.length) {
      if (!this.isExpanded()) {
        this.openParent.set(item);
        this.expandRequested.emit();
        return;
      }
      const isSame = this.openParent()?.value === item.value;
      this.openParent.set(isSame ? null : item);
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

  isParentActive(item: SideNavItem): boolean {
    if (!item.children?.length) return false;
    if (this.isExpanded()) return false;
    return this.activeParentValue() === item.value;
  }
}
