import {
  Component,
  computed,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

import {
  AppConfigService,
  AppEventBusService,
  AppEventType,
  ColorPalette,
  LanguageTranslationService,
  MenuConfigHelper,
  PaletteService,
  ThemeService,
} from '@aum/utils/services';
import {
  ButtonComponent,
  ButtonToggleComponent,
  ButtonToggleOption,
} from '@aum/ui/buttons';
import { TabGroupComponent, TabComponent } from '@aum/ui/layout';
import { GenericDialogComponent } from '@aum/ui/dialogs';
import { SnackbarService } from '@aum/ui/utilities';

export type ThemeMode = 'light' | 'dark' | 'system';
export type DisplayMode = 'compact' | 'default' | 'large';
export type Language = 'en' | 'ja' | 'hi';
export type Template = 'template-1' | 'template-2';

interface PreferencesDraft {
  theme: ThemeMode;
  palette: ColorPalette;
  displayMode: DisplayMode;
  language: Language;
  template: Template;
}

export interface PreferencesDialogData {
  initialTab?: 'appearance' | 'localization' | 'layout';
}

@Component({
  selector: 'aum-preferences-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatRadioModule,
    ButtonComponent,
    ButtonToggleComponent,
    TabGroupComponent,
    TabComponent,
    GenericDialogComponent,
    TranslateModule,
  ],
  templateUrl: './preferences-dialog.component.html',
  styleUrl: './preferences-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PreferencesDialogComponent implements OnInit {
  private themeService = inject(ThemeService);
  private paletteService = inject(PaletteService);
  private languageService = inject(LanguageTranslationService);
  private appConfigService = inject(AppConfigService);
  private eventBus = inject(AppEventBusService);
  private snackbarService = inject(SnackbarService);
  private dialogRef = inject(MatDialogRef<PreferencesDialogComponent>);
  private data = inject<PreferencesDialogData>(MAT_DIALOG_DATA, { optional: true });

  @ViewChild('themeToggle') themeToggle?: ButtonToggleComponent;
  @ViewChild('displayToggle') displayToggle?: ButtonToggleComponent;

  private config = this.appConfigService.toolbarMenus;
  private saved = false;

  activeTabIndex = 0;
  draft!: PreferencesDraft;
  private snapshot!: PreferencesDraft;

  readonly palettes: ColorPalette[] = ['purple', 'ocean-blue', 'sea-green'];

  // Config-driven visibility computed signals
  showTheme = computed(() => MenuConfigHelper.shouldShowPreferencesItem(this.config(), 'theme'));
  isThemeDisabled = computed(() => MenuConfigHelper.isPreferencesItemDisabled(this.config(), 'theme'));

  showPalette = computed(() => MenuConfigHelper.shouldShowPreferencesItem(this.config(), 'palette'));
  isPaletteDisabled = computed(() => MenuConfigHelper.isPreferencesItemDisabled(this.config(), 'palette'));

  showLanguage = computed(() => MenuConfigHelper.shouldShowPreferencesItem(this.config(), 'language'));
  isLanguageDisabled = computed(() => MenuConfigHelper.isPreferencesItemDisabled(this.config(), 'language'));

  showTemplate = computed(() => MenuConfigHelper.shouldShowPreferencesItem(this.config(), 'template'));
  isTemplateDisabled = computed(() => MenuConfigHelper.isPreferencesItemDisabled(this.config(), 'template'));

  showDisplay = computed(() => MenuConfigHelper.shouldShowPreferencesMenu(this.config()));
  isDisplayDisabled = computed(() => MenuConfigHelper.isPreferencesMenuDisabled(this.config()));

  showAppearanceTab = computed(() => this.showTheme() || this.showPalette() || this.showDisplay());
  showLocalizationTab = computed(() => this.showLanguage());
  showLayoutTab = computed(() => this.showTemplate());

  // ─── Toggle options (re-evaluated each CD cycle for translation + selection) ─

  get themeOptions(): ButtonToggleOption[] {
    return [
      { label: this.languageService.instant('AUM.LIGHT'),  value: 'light',  icon: 'light_mode', selected: this.draft?.theme === 'light' },
      { label: this.languageService.instant('AUM.DARK'),   value: 'dark',   icon: 'dark_mode',  selected: this.draft?.theme === 'dark' },
      { label: this.languageService.instant('AUM.SYSTEM'), value: 'system', icon: 'computer',   selected: this.draft?.theme === 'system' },
    ];
  }

  get displayOptions(): ButtonToggleOption[] {
    return [
      { label: this.languageService.instant('AUM.COMPACT'), value: 'compact', icon: 'density_small',  selected: this.draft?.displayMode === 'compact' },
      { label: this.languageService.instant('AUM.DEFAULT'), value: 'default', icon: 'density_medium', selected: this.draft?.displayMode === 'default' },
      { label: this.languageService.instant('AUM.LARGE'),   value: 'large',   icon: 'density_large',  selected: this.draft?.displayMode === 'large' },
    ];
  }

  constructor() {
    // Revert all instant-applied changes if the dialog is closed without saving
    this.dialogRef.beforeClosed()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (!this.saved) {
          this.revertToSnapshot();
        }
      });
  }

  ngOnInit(): void {
    this.snapshot = this.readCurrentValues();
    this.draft = { ...this.snapshot };
    this.setInitialTab();
  }

  // ─── Change handlers (instant apply) ────────────────────────────────────────

  onThemeChange(value: string): void {
    const theme = value as ThemeMode;
    const previous = this.draft.theme;
    this.draft = { ...this.draft, theme };
    this.themeService.setTheme(theme);
    this.eventBus.emit(AppEventType.THEME_CHANGED, { theme, previousTheme: previous });
  }

  onPaletteChange(value: ColorPalette): void {
    if (this.isPaletteDisabled()) return;
    const previous = this.draft.palette;
    this.draft = { ...this.draft, palette: value };
    this.paletteService.setPalette(value);
    this.eventBus.emit(AppEventType.PALETTE_CHANGED, { palette: value, previousPalette: previous });
  }

  onDisplayModeChange(value: string): void {
    const displayMode = value as DisplayMode;
    const previous = this.draft.displayMode;
    this.draft = { ...this.draft, displayMode };
    this.applyUiScale(displayMode);
    this.eventBus.emit(AppEventType.UI_SCALE_CHANGED, { scale: displayMode, previousScale: previous });
  }

  onLanguageChange(value: Language): void {
    const previous = this.draft.language;
    this.draft = { ...this.draft, language: value };
    this.languageService.setLanguage(value);
    this.eventBus.emit(AppEventType.LANGUAGE_CHANGED, { language: value, previousLanguage: previous });
  }

  onTemplateChange(value: Template): void {
    this.draft = { ...this.draft, template: value };
    localStorage.setItem('app-template', value);
    this.eventBus.emit(AppEventType.TEMPLATE_CHANGED, { template: value });
  }

  // ─── Footer actions ──────────────────────────────────────────────────────────

  onSave(): void {
    this.saved = true;
    this.dialogRef.close(true);
    setTimeout(() => {
      this.snackbarService.success(
        this.languageService.instant('AUM.PREFERENCES_SAVED'),
        3000
      );
    }, 100);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onReset(): void {
    const defaults = this.appConfigService.defaults();
    const reset: PreferencesDraft = {
      theme:       defaults?.theme       ?? 'light',
      palette:     defaults?.palette     ?? 'sea-green',
      displayMode: defaults?.displayMode ?? 'default',
      language:    defaults?.language    ?? 'en',
      template:    defaults?.template    ?? 'template-2',
    };

    if (reset.theme !== this.draft.theme) {
      this.onThemeChange(reset.theme);
      // ButtonToggleComponent.currentValue is only set in ngOnInit — sync it manually
      if (this.themeToggle) this.themeToggle.currentValue = reset.theme;
    }
    if (reset.palette !== this.draft.palette) this.onPaletteChange(reset.palette);
    if (reset.displayMode !== this.draft.displayMode) {
      this.onDisplayModeChange(reset.displayMode);
      if (this.displayToggle) this.displayToggle.currentValue = reset.displayMode;
    }
    if (reset.template !== this.draft.template) this.onTemplateChange(reset.template);
    // Language must be applied last per best practices
    if (reset.language !== this.draft.language) this.onLanguageChange(reset.language);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  getPaletteLabel(palette: ColorPalette): string {
    const map: Record<ColorPalette, string> = {
      'purple':     'AUM.PURPLE',
      'ocean-blue': 'AUM.OCEAN_BLUE',
      'sea-green':  'AUM.SEA_GREEN',
    };
    return map[palette];
  }

  private readCurrentValues(): PreferencesDraft {
    return {
      theme:       this.themeService.getTheme(),
      palette:     this.paletteService.getPalette(),
      displayMode: (localStorage.getItem('ui-scale-mode') as DisplayMode)
                    ?? this.appConfigService.defaults()?.displayMode
                    ?? 'default',
      language:    this.languageService.getLanguage() as Language,
      template:    (localStorage.getItem('app-template') as Template)
                    ?? this.appConfigService.defaults()?.template
                    ?? 'template-2',
    };
  }

  private revertToSnapshot(): void {
    const s = this.snapshot;
    const d = this.draft;

    if (s.theme !== d.theme) {
      this.themeService.setTheme(s.theme);
      this.eventBus.emit(AppEventType.THEME_CHANGED, { theme: s.theme, previousTheme: d.theme });
    }
    if (s.palette !== d.palette) {
      this.paletteService.setPalette(s.palette);
      this.eventBus.emit(AppEventType.PALETTE_CHANGED, { palette: s.palette, previousPalette: d.palette });
    }
    if (s.displayMode !== d.displayMode) {
      this.applyUiScale(s.displayMode);
      this.eventBus.emit(AppEventType.UI_SCALE_CHANGED, { scale: s.displayMode, previousScale: d.displayMode });
    }
    if (s.template !== d.template) {
      localStorage.setItem('app-template', s.template);
      this.eventBus.emit(AppEventType.TEMPLATE_CHANGED, { template: s.template });
    }
    // Language last per best practices
    if (s.language !== d.language) {
      this.languageService.setLanguage(s.language);
      this.eventBus.emit(AppEventType.LANGUAGE_CHANGED, { language: s.language, previousLanguage: d.language });
    }
  }

  private applyUiScale(mode: DisplayMode): void {
    localStorage.setItem('ui-scale-mode', mode);
    document.body.classList.remove('scale-compact', 'scale-default', 'scale-large');
    document.body.classList.add(`scale-${mode}`);
  }

  private setInitialTab(): void {
    const tab = this.data?.initialTab;
    if (!tab || tab === 'appearance') return;

    let index = this.showAppearanceTab() ? 1 : 0;
    if (tab === 'localization') {
      this.activeTabIndex = index;
    } else if (tab === 'layout') {
      if (this.showLocalizationTab()) index++;
      this.activeTabIndex = index;
    }
  }
}
