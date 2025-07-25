import {
  Component,
  computed,
  EventEmitter,
  inject,
  OnInit,
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
export class ToolbarComponent implements OnInit {
  @Output() sideMenuToggle = new EventEmitter();
  protected themeService = inject(ThemeService);
  protected breadcrumbService = inject(BreadcrumbService);
  themeIcon = computed(() => this.themeService.themeIcon());
  aLogo = 'assets/svgs/A-logo.svg';
  aumAiLogo = 'assets/svgs/Agentic-AI-Platform.svg';

  ngOnInit() {
    const savedMode = localStorage.getItem('ui-scale-mode') as
      | 'compact'
      | 'default'
      | 'large';
    if (savedMode === 'compact' || savedMode === 'large') {
      document.body.classList.add(`scale-${savedMode}`);
    }
  }

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

  setUiScale(mode: 'compact' | 'default' | 'large') {
    const body = document.body;

    // Remove existing scale classes
    body.classList.remove('scale-compact', 'scale-large');

    // Only apply a class if it's not default
    if (mode === 'compact') {
      body.classList.add('scale-compact');
    } else if (mode === 'large') {
      body.classList.add('scale-large');
    }

    localStorage.setItem('ui-scale-mode', mode);
    console.log('Setting UI scale to:', mode);
  }
}
