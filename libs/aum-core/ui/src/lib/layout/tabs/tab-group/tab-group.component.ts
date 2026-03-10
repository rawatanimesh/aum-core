import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'aum-tab-group',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.scss',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'aumTabGroup',
})
export class TabGroupComponent implements AfterContentInit {
  // Get all child tabs
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  // Core functionality - selection control
  @Input() selectedIndex = 0;
  @Output() selectedIndexChange = new EventEmitter<number>();
  @Output() selectedTabChange = new EventEmitter<MatTabChangeEvent>();

  // Common configuration
  @Input() animationDuration = '300ms';
  @Input() headerPosition: 'above' | 'below' = 'above';
  @Input() preserveContent = false;

  ngAfterContentInit(): void {
    // Initialization logic if needed
  }

  onSelectedTabChange(event: MatTabChangeEvent): void {
    this.selectedIndex = event.index;
    this.selectedIndexChange.emit(event.index);
    this.selectedTabChange.emit(event);
  }
}
