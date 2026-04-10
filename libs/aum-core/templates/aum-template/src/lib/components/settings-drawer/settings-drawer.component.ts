import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import {
  AppConfigService,
  AppEventBusService,
  AppEventType,
  AuthService,
  LanguageTranslationService,
  MenuConfigHelper,
} from '@aum/utils/services';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { PreferencesDialogService } from '@aum/common';
import { ToolbarAction, ToolbarContentService } from '../../services/toolbar-content.service';

@Component({
  selector: 'aum-settings-drawer',
  imports: [CommonModule, MatIconModule, MatMenuModule, TranslateModule, MenuList],
  templateUrl: './settings-drawer.component.html',
  styleUrl: './settings-drawer.component.scss',
})
export class SettingsDrawerComponent {
  @Output() closeDrawer = new EventEmitter<void>();

  private appConfigService = inject(AppConfigService);
  private languageService = inject(LanguageTranslationService);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(AuthService);
  private router = inject(Router);
  private eventBus = inject(AppEventBusService);
  private toolbarContentService = inject(ToolbarContentService);
  private preferencesDialogService = inject(PreferencesDialogService);

  toolbarMenusConfig = this.appConfigService.toolbarMenus;

  protected shouldShowPreferencesMenu = computed(() =>
    MenuConfigHelper.shouldShowPreferencesMenu(this.toolbarMenusConfig())
  );
  protected isPreferencesMenuDisabled = computed(() =>
    MenuConfigHelper.isPreferencesMenuDisabled(this.toolbarMenusConfig())
  );
  protected shouldShowProfileMenu = computed(() =>
    MenuConfigHelper.shouldShowProfileMenu(this.toolbarMenusConfig())
  );
  protected isProfileMenuDisabled = computed(() =>
    MenuConfigHelper.isProfileMenuDisabled(this.toolbarMenusConfig())
  );

  profileMenuList: MenuItem[] = [];
  globalActions: ToolbarAction[] = [];

  private menusInitialized = false;

  constructor() {
    effect(() => {
      this.languageService.currentLanguage();
      if (this.menusInitialized) {
        this.buildProfileMenu();
        this.cdr.markForCheck();
      }
    });

    this.languageService.get('LANGUAGE')
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.buildProfileMenu();
        this.menusInitialized = true;
        this.cdr.markForCheck();
      });

    this.toolbarContentService.getGlobalActions()
      .pipe(takeUntilDestroyed())
      .subscribe((actions) => {
        this.globalActions = actions;
        this.cdr.markForCheck();
      });
  }

  private buildProfileMenu(): void {
    const config = this.toolbarMenusConfig();
    const items: MenuItem[] = [];

    if (MenuConfigHelper.shouldShowProfileItem(config, 'profile')) {
      items.push({
        label: this.languageService.instant('AUM.PROFILE'),
        value: 'profile',
        icon: 'person',
        disabled: MenuConfigHelper.isProfileItemDisabled(config, 'profile'),
        showSelection: false,
      });
    }
    if (MenuConfigHelper.shouldShowProfileItem(config, 'settings')) {
      items.push({
        label: this.languageService.instant('AUM.SETTINGS'),
        value: 'settings',
        icon: 'settings',
        disabled: MenuConfigHelper.isProfileItemDisabled(config, 'settings'),
        showSelection: false,
      });
    }
    if (MenuConfigHelper.shouldShowProfileItem(config, 'logout')) {
      items.push({
        label: this.languageService.instant('AUM.LOGOUT'),
        value: 'logout',
        icon: 'logout',
        disabled: MenuConfigHelper.isProfileItemDisabled(config, 'logout'),
        showSelection: false,
      });
    }

    this.profileMenuList = items;
  }

  onMenuSelect(item: MenuItem): void {
    if (item.value === 'logout') {
      this.logout();
    }
  }

  onMenuOpening(): void {
    if (this.menusInitialized) {
      this.buildProfileMenu();
    }
  }

  openPreferences(): void {
    this.preferencesDialogService.open();
  }

  onGlobalActionClick(actionId: string): void {
    this.toolbarContentService.executeAction(actionId);
  }

  logout(): void {
    this.eventBus.emit(AppEventType.LOGOUT);
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
