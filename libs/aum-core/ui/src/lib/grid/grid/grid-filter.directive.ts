import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[aumGridFilter]',
  standalone: true,
})
export class AumGridFilterDirective {
  readonly templateRef = inject(TemplateRef<void>);
}
