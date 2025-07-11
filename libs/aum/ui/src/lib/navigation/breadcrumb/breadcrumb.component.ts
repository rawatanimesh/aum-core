import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

import { BreadcrumbService } from '@aum/utils/services';
import { BreadcrumbItem } from '@aum/utils/interfaces';

@Component({
  selector: 'aum-breadcrumb',
  imports: [CommonModule, RouterModule, MatMenuModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  exportAs: 'BreadcrumbComponent',
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
