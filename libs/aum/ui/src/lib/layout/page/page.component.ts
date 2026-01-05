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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['openDrawer'] && this.Drawer) {
      if (this.openDrawer) {
        this.Drawer?.open();
      } else {
        this.Drawer?.close();
      }
    }
  }

  ngOnInit() {
    if (this.pageInfo?.breadcrumbs) {
      this.breadcrumbService.setBreadcrumbs(this.pageInfo.breadcrumbs);
    }
  }

  ngOnDestroy(): void {
    this.breadcrumbService.clear();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
