import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive to mark a template as expansion panel content template
 *
 * Usage:
 * ```html
 * <aum-expansion-panel [items]="items">
 *   <ng-template aumExpansionPanelContent let-item let-index="index">
 *     <!-- Custom content with access to item and index -->
 *   </ng-template>
 * </aum-expansion-panel>
 * ```
 *
 * The template receives two context variables:
 * - `item`: The current ExpansionPanelItem
 * - `index`: The index of the current panel
 */
@Directive({
  selector: '[aumExpansionPanelContent]',
  standalone: true,
})
export class ExpansionPanelContentDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
