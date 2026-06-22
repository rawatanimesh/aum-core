import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[aumGridToolbarActions]',
  standalone: true,
})
export class AumGridToolbarActionsDirective {
  readonly templateRef = inject(TemplateRef<void>);
}
