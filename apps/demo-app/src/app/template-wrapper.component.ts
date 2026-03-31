import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AumTemplate } from '@aum/templates/aum-template';
import { AumTemplate2 } from '@aum/templates/aum-template-2';
import { AppEventBusService, AppEventType } from '@aum/templates/aum-template';

@Component({
  selector: 'app-template-wrapper',
  imports: [AumTemplate, AumTemplate2],
  template: `
    @if (activeTemplate === 'template-1') {
      <aum-template />
    } @else {
      <aum-template-2 />
    }
  `,
})
export class TemplateWrapperComponent implements OnInit, OnDestroy {
  activeTemplate = localStorage.getItem('app-template') || 'template-2';

  private eventBus = inject(AppEventBusService);
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.eventBus
      .on<{ template: string }>(AppEventType.TEMPLATE_CHANGED)
      .subscribe((payload) => {
        if (payload?.template) {
          this.activeTemplate = payload.template;
        }
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
