import {
  Component,
  computed,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { ThemeService } from '@aum/utils/services';
import { BreadcrumbService } from '@aum/utils/services';
import { BreadcrumbComponent } from '@aum/ui/navigation';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'aum-toolbar',
  imports: [
    CommonModule,

    MatToolbarModule,
    MatMenuModule,

    BreadcrumbComponent,
    ButtonComponent,
    MenuList,
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

  optionsMenuList: MenuItem[] = [
    // { label: 'About', value: 'about', icon: 'info' },
    {
      label: 'Language',
      value: 'language',
      icon: 'language',
      children: [
        {
          label: 'English',
          value: 'en',
          selected: true,
        },
        { label: '日本語', value: 'ja', disabled: true },
      ],
    },
    {
      label: 'Theme',
      value: 'theme',
      icon: 'contrast',
      children: [
        {
          label: 'Light',
          value: 'light',
          icon: 'light_mode',
        },
        {
          label: 'Dark',
          value: 'dark',
          icon: 'dark_mode',
        },
        {
          label: 'System',
          value: 'system',
          icon: 'computer',
        },
      ],
    },
    {
      label: 'Display',
      value: 'mode',
      icon: 'aspect_ratio',

      children: [
        { label: 'Compact', value: 'compact', icon: 'density_small' },
        { label: 'Default', value: 'default', icon: 'density_medium' },
        { label: 'Large', value: 'large', icon: 'density_large' },
      ],
    },
  ];

  profileMenuList: MenuItem[] = [
    {
      label: 'Profile',
      value: 'profile',
      icon: 'person',
      showSelection: false,
    },
    {
      label: 'Settings',
      value: 'settings',
      icon: 'settings',
      showSelection: false,
    },
    { label: 'Logout', value: 'logout', icon: 'logout', showSelection: false },
  ];

  ngOnInit() {
    const savedMode = localStorage.getItem('ui-scale-mode') as
      | 'compact'
      | 'default'
      | 'large';
    if (
      savedMode === 'compact' ||
      savedMode === 'large' ||
      savedMode === 'default'
    ) {
      document.body.classList.add(`scale-${savedMode}`);
    }
    // Update selected state for Display options
    this.setMenuSelection(this.optionsMenuList, 'mode', savedMode || 'default');

    const savedTheme = localStorage.getItem('app-theme-mode') as
      | 'light'
      | 'dark'
      | 'system';
    // Update selected state for Display options
    this.setMenuSelection(this.optionsMenuList, 'theme', savedTheme || 'light');
  }
  onMenuSelect(item: MenuItem) {
    if (
      item.value === 'compact' ||
      item.value === 'default' ||
      item.value === 'large'
    ) {
      this.setUiScale(item.value);
    }
    if (
      item.value === 'light' ||
      item.value === 'dark' ||
      item.value === 'system'
    ) {
      this.themeService.setTheme(item.value);
    }
  }
  setMenuSelection(menuList: MenuItem[], parent: string, value: string) {
    const parentMenu = menuList.find((menu) => menu.value === parent);
    if (parentMenu && parentMenu.children) {
      parentMenu.children.forEach((child) => {
        child.selected = child.value === value;
      });
    }
  }

  toggleMenu(): void {
    this.sideMenuToggle.emit();
  }

  setUiScale(mode: 'compact' | 'default' | 'large') {
    const body = document.body;

    // Remove existing scale classes
    body.classList.remove('scale-compact', 'scale-large', 'scale-default');

    // Only apply a class if it's not default
    if (mode === 'compact') {
      body.classList.add('scale-compact');
    } else if (mode === 'large') {
      body.classList.add('scale-large');
    } else if (mode === 'default') {
      body.classList.add('scale-default');
    }

    localStorage.setItem('ui-scale-mode', mode);
    console.log('Setting UI scale to:', mode);
  }
}
