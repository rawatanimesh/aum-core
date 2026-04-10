import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AumTemplate } from '@aum/templates/aum-template';
import { AumTemplate2 } from '@aum/templates/aum-template-2';
import { AppConfigService, AppEventBusService, AppEventType } from '@aum/utils/services';

@Component({
  selector: 'app-template-wrapper',
  imports: [AumTemplate, AumTemplate2],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (activeTemplate() === 'template-1') {
      <aum-template />
    } @else {
      <aum-template-2 />
    }
  `,
})
export class TemplateWrapperComponent {
  private appConfigService = inject(AppConfigService);
  private eventBus = inject(AppEventBusService);

  readonly activeTemplate = signal(
    localStorage.getItem('app-template') ||
    this.appConfigService.defaults()?.template ||
    'template-2'
  );

  constructor() {
    this.eventBus
      .on<{ template: string }>(AppEventType.TEMPLATE_CHANGED)
      .pipe(takeUntilDestroyed())
      .subscribe((payload) => {
        if (payload?.template) {
          this.activeTemplate.set(payload.template);
        }
      });
  }
}
