import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { BreadcrumbService } from '@aum/utils/services';
import { Subject } from 'rxjs';
@Component({
  standalone: true,
  selector: 'aum-page',
  imports: [],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  exportAs: 'PageComponent',
})
export class PageComponent implements OnInit, OnDestroy {
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
