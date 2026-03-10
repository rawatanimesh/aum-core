import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabLabelDirective } from '../tab-label.directive';

@Component({
  selector: 'aum-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'aumTab',
})
export class TabComponent {
  // Basic label (string)
  @Input() label = '';

  // State
  @Input() disabled = false;

  // Custom label template (detected via directive)
  @ContentChild(TabLabelDirective, { read: TemplateRef })
  customLabel?: TemplateRef<any>;

  // Tab content template
  @ViewChild('contentTemplate', { static: true })
  content!: TemplateRef<any>;
}
