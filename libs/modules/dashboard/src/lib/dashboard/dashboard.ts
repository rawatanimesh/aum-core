import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponent } from '@aum/ui/layout';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'aum-dashboard',
  imports: [CommonModule, PageComponent, ButtonComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  pageInfo = {
    breadcrumbs: [
      { title: 'Dashboard', route: '/dashboard' },
      // { title: 'Child A', route: '/A/childA' },
      // { title: 'Child A2', route: '/playground' },
      // { title: 'Child A3', route: '/A/childA3' },
      // { title: 'Child A4', route: '/A/childA4' },
      // { title: 'Child A5', route: '/A/childA5' },
    ],
  };
}
