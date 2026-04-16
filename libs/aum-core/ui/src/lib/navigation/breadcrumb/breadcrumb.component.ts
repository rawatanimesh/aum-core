import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { Icon } from '../../utilities/icon/icon';

import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbItem } from './breadcrumb';

@Component({
  selector: 'aum-breadcrumb',
  imports: [CommonModule, RouterModule, MatMenuModule, Icon, TranslateModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  exportAs: 'BreadcrumbComponent',
  encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbComponent {
  protected breadcrumbService = inject(BreadcrumbService);
  breadcrumbs$ = this.breadcrumbService.breadcrumbs$;

  constructor() {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }

  trackByFn(_: number, item: BreadcrumbItem) {
    return item.route;
  }
}
