import { Component, model, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonComponent } from '@aum/ui/buttons';
import { PageComponent } from '@aum/ui/layout';
import { ConfirmationDialogService } from '@aum/ui/dialogs';
import { CheckboxComponent, RadioButton } from '@aum/ui/form-controls';
import { SnackbarService, Spinner } from '@aum/ui/utilities';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { LanguageTranslationService } from '@aum/utils/services';
import { ToolbarContentService } from '@aum/templates/aum-template';

import { GenericDialogDemo } from '../generic-dialog-demo/generic-dialog-demo';

@Component({
  selector: 'playground-home',
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatMenuModule,
    ButtonComponent,
    PageComponent,
    CheckboxComponent,
    RadioButton,
    MenuList,
    Spinner,
    TranslateModule
  ],
  templateUrl: './playground.html',
  styleUrl: './playground.scss',
})
export class Playground implements OnInit, OnDestroy {
  readonly dialog = inject(ConfirmationDialogService);
  readonly dialogRef = inject(MatDialog);
  readonly snackbar = inject(SnackbarService);
  readonly languageService = inject(LanguageTranslationService);
  private toolbarContentService = inject(ToolbarContentService);
  route = inject(Router);
  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'CHILD_A', route: '/dashboard' },
      { title: 'CHILD_A2', route: '/dashboard' },
      // { title: 'Child A3', route: '/dashboard' },
      // { title: 'Child A4', route: '/A/childA4' },
      // { title: 'Child A5', route: '/dashboard' },
    ],
  };
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);

  nestedMenuItems: MenuItem[] = [
    { label: 'About', value: 'about', icon: 'info' },
    {
      label: 'Language',
      value: 'language',
      icon: 'language',
      children: [
        {
          label: 'English',
          value: 'en',
        },
        { label: '日本語', value: 'ja' },
      ],
    },
    {
      label: 'Mode',
      value: 'mode',
      icon: 'aspect_ratio',

      children: [
        { label: 'Compact', value: 'compact' },
        { label: 'Default', value: 'default' },
        { label: 'Large', value: 'large', disabled: true },
      ],
    },
    {
      label: 'Level 1',
      value: 'about',
      icon: 'info',

      children: [
        {
          label: 'Level 2',
          value: 'about',
          icon: 'info',
        },
        {
          label: 'Dont show selection',
          value: 'about',
          icon: 'info',
          showSelection: false,
        },
      ],
    },
  ];
  choiceMenuItems: MenuItem[] = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
    { label: 'Maybe', value: 'maybe' },
  ];

  // For Spinner demo
  showPageSpinner = false;

  // For Drawer demo
  isDrawerOpen = false;

  // For Browser Navigation Protection demo
  enableBrowserNavigationProtection = false;

  openMenu() {
    console.log('clicked');
  }
  openConfirmationDialog() {
    this.dialog
      .open({
        confirmationImage: 'assets/svgs/confirmation/info.svg',
        title: this.languageService.instant('NOTE'),
        message: this.languageService.instant('AUTHORIZATION_MESSAGE'),
        confirmText: this.languageService.instant('YES'),
        cancelText: this.languageService.instant('NO'),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          // User clicked confirm
          console.log('User confirmed the action');
        } else {
          // User clicked cancel
          console.log('User canceled the action');
        }
      });
  }

  openGenericDialog() {
    const dialogRef2 = this.dialogRef.open(GenericDialogDemo, {
      width: '800px',
      data: { name: 'Animesh' },
      panelClass: 'aum-dialog-container',
      disableClose: false, // Optional: allow clicking outside to close
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef2.afterClosed().subscribe((result) => {
      if (result) {
        console.log('User confirmed the action');
        this.snackbar.success(this.languageService.instant('PROFILE_UPDATED_SUCCESSFULLY'), 700000);
      } else {
        console.log('User canceled the action');
        this.snackbar.error(this.languageService.instant('FAILED_TO_SAVE_CHANGES'), 5000, {
          label: this.languageService.instant('RETRY'),
          callback: () => {
            console.log('snackbar open error');
          },
        });
      }
    });
  }
  openSnackbar(state: string) {
    switch (state) {
      case 'success':
        this.snackbar.success(this.languageService.instant('PROFILE_UPDATED_SUCCESSFULLY'));
        break;
      case 'error':
        this.snackbar.error(this.languageService.instant('PROFILE_NOT_UPDATED'), 5000, {
          label: this.languageService.instant('RETRY'),
          callback: () => {
            console.log('Snackbar retry method');
          },
        });
        break;
      case 'warning':
        this.snackbar.warning(this.languageService.instant('DUPLICATE_ENTRY_SAVED'));
        break;
      case 'info':
        this.snackbar.info(this.languageService.instant('PROFILE_CHANGE_WILL_REFLECT_SHORTLY'));
        break;
    }
  }

  checkboxState(event: any, state: any) {
    console.log(event, state);
  }
  radioChange(event: any) {
    console.log(event);
  }
  goToInputsDemo() {
    this.route.navigate(['/playground/inputs']);
  }
  goToErrorTest() {
    this.route.navigate(['/playground/error-test']);
  }
  goToChartsDemo() {
    this.route.navigate(['/playground/charts']);
  }
  goToTabsDemo() {
    this.route.navigate(['/playground/tabs']);
  }
  onMenuSelect(item: MenuItem) {
    console.log('selected', item);
    console.log('updated menu list', this.choiceMenuItems);
  }

  showPageModeSpinner() {
    this.showPageSpinner = true;
    setTimeout(() => {
      this.showPageSpinner = false;
    }, 3000);
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  toggleBrowserNavigationProtection() {
    this.enableBrowserNavigationProtection =
      !this.enableBrowserNavigationProtection;
    const status = this.enableBrowserNavigationProtection ? 'enabled' : 'disabled';
    this.snackbar.info(
      this.languageService.instant(`BROWSER_NAVIGATION_PROTECTION_${status.toUpperCase()}`),
      3000
    );
  }

  handleBrowserNavigation(event: {
    event: BeforeUnloadEvent | PopStateEvent;
    type: 'refresh' | 'back' | 'forward';
  }) {
    // Event handler for browser navigation
    // The page component handles showing the confirmation dialog automatically
    // This handler can be used for custom logic if needed
    console.log('Browser navigation detected:', event.type);
  }

  ngOnInit(): void {
    console.log('🎮 Playground: Registering page-specific toolbar actions');

    // Register page-specific Create action (only visible on playground page)
    // Pass translation keys, not translated strings - the toolbar component will handle translation
    this.toolbarContentService.registerGlobalAction(
      {
        id: 'playground-create',
        icon: 'add_circle_outline',
        value: 'CREATE',
        tooltip: 'CREATE_NEW_ITEM',
        type: 'filled',
        order: 0,  // Higher order to appear after global actions
      },
      () => this.handleCreate()
    );

    console.log('✅ Playground: Page-specific actions registered');
  }

  handleCreate(): void {
    console.log('Create button clicked from playground');
    this.snackbar.success(
      this.languageService.instant('CREATE_BUTTON_CLICKED'),
      3000
    );
  }

  ngOnDestroy(): void {
    console.log('🎮 Playground: Cleaning up page-specific toolbar actions');
    // Unregister toolbar actions when leaving the page
    this.toolbarContentService.unregisterGlobalAction('playground-create');
    this.toolbarContentService.unregisterGlobalAction('playground-export');
    console.log('✅ Playground: Page-specific actions removed');
  }
}
