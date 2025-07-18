import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeService } from '@aum/utils/services';
import { BreadcrumbService } from '@aum/utils/services';
import { BreadcrumbComponent } from '@aum/ui/navigation';

@Component({
  selector: 'aum-toolbar',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    BreadcrumbComponent,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Output() sideMenuToggle = new EventEmitter();
  protected themeService = inject(ThemeService);
  protected breadcrumbService = inject(BreadcrumbService);
  themeIcon = computed(() => this.themeService.themeIcon());
  rLogo = 'assets/svgs/R-logo.svg';
  aumAiLogo = 'assets/svgs/Agentic-AI-Platform.svg';

  toggleMenu(): void {
    this.sideMenuToggle.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  getThemeTooltip(): string {
    return localStorage.getItem('app-theme') === 'dark'
      ? 'Light mode'
      : 'Dark mode';
  }
}
