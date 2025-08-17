import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Interface for menu item structure
export interface MenuItem {
  label: string;
  value?: string;
  icon?: string;
  disabled?: boolean;
  selected?: boolean;
  showSelection?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'aum-menu-list',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './menu-list.html',
  styleUrl: './menu-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'aumMenu',
})
export class MenuList {
  /**
   * The list of menu items to display. Can include nested items.
   */
  @Input({ required: true }) list: MenuItem[] = [];
  @Output() itemSelected = new EventEmitter<MenuItem>();

  @ViewChild(MatMenu, { static: true }) childMenu!: MatMenu;

  onItemClick(item: MenuItem) {
    // If item has children, just open submenu and exit
    if (item.children?.length) {
      return;
    }

    // Emit event for leaf items
    this.itemSelected.emit(item);

    // Skip applying selected if sibling has children
    if (this.siblingsHaveChildren(item)) {
      return;
    }

    // Apply selection
    this.clearSelection(this.list);
    item.selected = true;
  }

  shouldApplySelected(item: MenuItem): boolean {
    //  condition to skip selection styling
    if (item.showSelection === false) {
      return false;
    }
    return !!item.selected && !this.siblingsHaveChildren(item);
  }

  private siblingsHaveChildren(item: MenuItem): boolean {
    const siblings = this.list.filter((i) => i !== item);
    return siblings.some((i) => i.children?.length);
  }

  clearSelection(items: MenuItem[]) {
    for (const i of items) {
      i.selected = false;
      if (i.children?.length) {
        this.clearSelection(i.children);
      }
    }
  }
}
