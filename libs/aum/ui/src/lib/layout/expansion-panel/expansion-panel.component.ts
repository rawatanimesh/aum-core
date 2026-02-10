import { Component, Input, ViewEncapsulation, TemplateRef, ContentChild, AfterContentInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ExpansionPanelContentDirective } from './expansion-panel-content.directive';

export interface ExpansionPanelItem {
  header: string;
  content?: any;
  expanded?: boolean;
  disabled?: boolean;
  contentTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'aum-expansion-panel',
  standalone: true,
  imports: [MatExpansionModule, CommonModule, MatIconModule, TranslateModule],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ExpansionPanelComponent implements AfterContentInit {
  @Input() items: ExpansionPanelItem[] = [];
  @Input() width: string = '100%';
  @Input() multi: boolean = false;

  // Content projection: allows parent to provide a single template for all panels
  @ContentChild(ExpansionPanelContentDirective, { read: TemplateRef })
  projectedContent?: TemplateRef<any>;

  ngAfterContentInit(): void {
    // Lifecycle hook for content initialization if needed
  }

  expandAll(): void {
    if (!this.multi) {
      console.info('Cannot expand all items in single-mode expansion panel');
    } else {
      this.items.forEach((item) => {
        if (!item.disabled) {
          item.expanded = true;
        }
      });
    }
  }

  collapseAll(): void {
    this.items.forEach((item) => {
      if (!item.disabled) {
        item.expanded = false;
      }
    });
  }
}
