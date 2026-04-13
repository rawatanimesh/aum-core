import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Icon } from '@aum/ui/utilities';
import { TranslateModule } from '@ngx-translate/core';

import { AppConfigService } from '@aum/utils/services';

@Component({
  selector: 'aum-tab-nav-2',
  imports: [CommonModule, RouterModule, Icon, MatTooltipModule, TranslateModule],
  templateUrl: './tab-nav.component.html',
  styleUrl: './tab-nav.component.scss',
})
export class TabNavComponent {
  private appConfigService = inject(AppConfigService);
  navItems = this.appConfigService.navItems;
}
