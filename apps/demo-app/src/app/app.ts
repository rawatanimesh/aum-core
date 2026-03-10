import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import {
  ToolbarContentService,
  AppEventBusService,
  AppEventType,
  CustomMenuActionPayload,
} from '@aum/templates/aum-template';
import { ButtonComponent } from '@aum/ui/buttons';
import { MenuList, MenuItem } from '@aum/ui/navigation';
import { HelpDialog, ContactUsDialog } from '@demo/playground';

@Component({
  imports: [RouterModule, MatMenuModule, ButtonComponent, MenuList, TranslateModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private toolbarContentService = inject(ToolbarContentService);
  private eventBus = inject(AppEventBusService);
  private dialog = inject(MatDialog);

  // ViewChild for the custom toolbar menu template
  @ViewChild('moreOptionsMenu') moreOptionsMenuTemplate!: TemplateRef<unknown>;

  // Menu items for the 3-dot menu - using translation keys directly
  moreOptionsMenuItems: MenuItem[] = [
    {
      label: 'HELP',
      value: 'help',
      icon: 'help',
      showSelection: false,
    },
    {
      label: 'CONTACT_US',
      value: 'contact',
      icon: 'email',
      showSelection: false,
    },
  ];

  ngOnInit(): void {
    // Subscribe to custom menu events
    this.eventBus
      .on<CustomMenuActionPayload>(AppEventType.CUSTOM_MENU_ACTION)
      .subscribe((payload) => {
        if (!payload) return;
        console.log('Menu action received:', payload);
      });
  }

  ngAfterViewInit(): void {
    // Register the custom toolbar menu template after view is initialized
    if (this.moreOptionsMenuTemplate) {
      this.toolbarContentService.registerCustomTemplate({
        id: 'more-options-menu',
        template: this.moreOptionsMenuTemplate,
        order: 10, // Position between global actions and preferences
      });
    }
  }

  /**
   * Handle menu item selection from the custom toolbar menu
   *
   * Note: When help or contact actions are triggered, global events are emitted:
   * - Event Type: AppEventType.CUSTOM_MENU_ACTION
   * - Help Payload: { menuId: 'help-dialog', actionId: 'help-opened', data: { dialogType: 'help' } }
   * - Contact Payload: { menuId: 'contact-dialog', actionId: 'contact-opened', data: { dialogType: 'contact' } }
   *
   * Other components can listen to these events like this:
   * ```typescript
   * this.eventBus.on<CustomMenuActionPayload>(AppEventType.CUSTOM_MENU_ACTION)
   *   .pipe(
   *     filter(payload => payload?.menuId === 'help-dialog' && payload?.actionId === 'help-opened')
   *   )
   *   .subscribe(payload => {
   *     console.log('Help dialog was opened');
   *   });
   * ```
   */
  onMoreOptionsSelect(item: MenuItem): void {
    console.log('🎯 More options menu item selected:', item);

    // Emit event via event bus for global handling
    const payload: CustomMenuActionPayload = {
      menuId: 'more-options-menu',
      actionId: item.value || '',
      data: item,
    };
    this.eventBus.emit(AppEventType.CUSTOM_MENU_ACTION, payload);

    // Handle specific actions
    switch (item.value) {
      case 'help':
        console.log('ℹ️ Opening help dialog...');
        this.openHelpDialog();

        // Emit global event via event bus so other components can react
        this.eventBus.emit(AppEventType.CUSTOM_MENU_ACTION, {
          menuId: 'help-dialog',
          actionId: 'help-opened',
          data: {
            dialogType: 'help',
            timestamp: new Date().toISOString(),
          },
        });
        break;

      case 'contact':
        console.log('📧 Opening contact us dialog...');
        this.openContactUsDialog();

        // Emit global event via event bus so other components can react
        this.eventBus.emit(AppEventType.CUSTOM_MENU_ACTION, {
          menuId: 'contact-dialog',
          actionId: 'contact-opened',
          data: {
            dialogType: 'contact',
            timestamp: new Date().toISOString(),
          },
        });
        break;
    }
  }

  private openHelpDialog(): void {
    this.dialog.open(HelpDialog, {
      width: '600px',
      panelClass: 'aum-dialog-container',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  private openContactUsDialog(): void {
    this.dialog.open(ContactUsDialog, {
      width: '600px',
      panelClass: 'aum-dialog-container',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  ngOnDestroy(): void {
    this.toolbarContentService.unregisterCustomTemplate('more-options-menu');
  }
}
