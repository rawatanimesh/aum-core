import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  HostListener,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDrawer } from '@angular/material/sidenav';

import { Subject } from 'rxjs';
import { BreadcrumbService } from '../../navigation/breadcrumb/breadcrumb.service';
@Component({
  standalone: true,
  selector: 'aum-page',
  imports: [MatSidenavModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  exportAs: 'PageComponent',
})
export class PageComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('Drawer') Drawer!: MatDrawer;
  protected breadcrumbService = inject(BreadcrumbService);
  private destroy$ = new Subject<void>();
  private allowNavigation = false;
  // @Input() icons = {
  //   plus: false,
  //   download: false,
  //   upload: false,
  //   print: false,
  //   min: false,
  //   close: false,
  // };
  // @Input() actions = [];
  @Input() pageInfo: any;
  // @Input() pageName = '';
  // @Input() showSide = false;
  // @Input() sideMode: 'side' | 'over' | 'push' = 'side';
  // @Input() pageHeader = Environment.pageHeader;
  @Input() pageHeader = false;
  @Input() pageFooter = false;
  // @Input() pageHeaderLeft = true;
  // @Input() sideMargin = '0';
  // @Input() sideRadius = '0';
  // @Input() sidePosition: 'start' | 'end' = 'start';
  // @Input() sideAutofocus = false;
  // @Input() sideDisableClose = false;
  // @Input() sideOverlay = true;
  // @Input() showBackDrop = true;
  @Input() pageType: 'default' | 'form' = 'default';
  // @Output() actionPage = new EventEmitter();
  // @Output() showSideChange = new EventEmitter();
  // @Output() clickBreadCrumb = new EventEmitter<any>();
  // @Output() clickMenuItem = new EventEmitter<any>();
  @Output() clickBackButton = new EventEmitter<any>();
  @Input() drawerWidth = 25;
  @Input() drawerPosition: 'start' | 'end' = 'end';
  @Input() drawerMode: 'over' | 'push' | 'side' = 'over';
  @Output() toggleDrawer = new EventEmitter<true | false>();

  @Input() openDrawer?: boolean;

  // Browser navigation events
  @Input() enableBrowserNavigation = false;
  @Input() navigationWarningMessage = 'You have unsaved changes. Are you sure you want to leave?';
  @Output() beforeBrowserNavigation = new EventEmitter<{
    event: BeforeUnloadEvent | PopStateEvent;
    type: 'refresh' | 'back' | 'forward';
  }>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['openDrawer'] && this.Drawer) {
      if (this.openDrawer) {
        this.Drawer?.open();
      } else {
        this.Drawer?.close();
      }
    }

    if (changes['enableBrowserNavigation']) {
      if (this.enableBrowserNavigation) {
        this.setupNavigationProtection();
      } else {
        this.teardownNavigationProtection();
      }
    }
  }

  ngOnInit() {
    if (this.pageInfo?.breadcrumbs) {
      this.breadcrumbService.setBreadcrumbs(this.pageInfo.breadcrumbs);
    }

    if (this.enableBrowserNavigation) {
      this.setupNavigationProtection();
    }
  }

  private setupNavigationProtection(): void {
    // Push a dummy state to intercept back/forward navigation
    const state = { navigationProtection: true, timestamp: Date.now() };
    history.pushState(state, '', location.href);
  }

  private teardownNavigationProtection(): void {
    // Clean up if needed
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): string | undefined {
    if (this.enableBrowserNavigation) {
      // Must call preventDefault IMMEDIATELY to show browser's native confirmation dialog
      event.preventDefault();
      event.returnValue = ''; // Required for Chrome and modern browsers

      // Emit event so parent component can be notified
      this.beforeBrowserNavigation.emit({ event, type: 'refresh' });

      return '';
    }
    return undefined;
  }

  @HostListener('window:popstate', ['$event'])
  handlePopState(event: PopStateEvent) {
    if (this.enableBrowserNavigation && !this.allowNavigation) {
      // Re-push state immediately to prevent navigation
      const state = { navigationProtection: true, timestamp: Date.now() };
      history.pushState(state, '', location.href);

      // Show confirmation dialog
      const confirmed = confirm(this.navigationWarningMessage);

      if (confirmed) {
        // User wants to leave - allow next navigation and trigger back
        this.allowNavigation = true;
        console.log('Browser navigation: User confirmed navigation');

        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          window.history.back();
        }, 0);
      } else {
        console.log('Browser navigation: User cancelled navigation');
      }

      // Emit event so parent component can be notified
      const type = event.state?.navigationDirection || 'back';
      this.beforeBrowserNavigation.emit({ event, type });
    } else if (this.allowNavigation) {
      // Reset the flag after navigation is allowed
      this.allowNavigation = false;
    }
  }

  ngOnDestroy(): void {
    this.breadcrumbService.clear();
    this.teardownNavigationProtection();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
