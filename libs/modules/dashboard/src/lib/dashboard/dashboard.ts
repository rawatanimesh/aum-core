import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PageComponent } from '@aum/ui/layout';

@Component({
  selector: 'aum-dashboard',
  imports: [CommonModule, PageComponent, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  pageInfo = {
    breadcrumbs: [
      { title: 'DASHBOARD', route: '/dashboard' },
      // { title: 'Child A', route: '/A/childA' },
      // { title: 'Child A2', route: '/playground' },
      // { title: 'Child A3', route: '/A/childA3' },
      // { title: 'Child A4', route: '/A/childA4' },
      // { title: 'Child A5', route: '/A/childA5' },
    ],
  };
}
