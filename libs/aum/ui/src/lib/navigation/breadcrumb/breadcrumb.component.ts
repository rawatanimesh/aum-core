import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbItem } from './breadcrumb';

@Component({
  selector: 'aum-breadcrumb',
  imports: [CommonModule, RouterModule, MatMenuModule, MatIconModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
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
