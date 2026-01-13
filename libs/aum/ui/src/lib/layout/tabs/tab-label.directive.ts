import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive to mark a template as a tab label template
 * Usage: <ng-template aum-tab-label>Custom Label</ng-template>
 */
@Directive({
  selector: '[aum-tab-label]',
  standalone: true,
})
export class TabLabelDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
