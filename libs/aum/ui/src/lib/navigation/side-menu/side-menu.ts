import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

export interface SideMenuItem {
  label: string;
  value: string;
  icon?: string;
  selected?: boolean;
  expanded?: boolean;
  children?: SideMenuItem[];
}

@Component({
  selector: 'aum-side-menu',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SideMenu implements OnInit {
  @Input({ required: true }) items: SideMenuItem[] = [];

  // @Input() expandedByDefault = false;

  @Output() itemSelected = new EventEmitter<SideMenuItem>();
  @Output() routeChanged = new EventEmitter<void>();

  selected: string | null = null;

  private router = inject(Router);

  ngOnInit() {
    const currentRoute = this.router.url;
    // Initialize items based on the current route and set the selected item and expanded state
    this.initializeItems(this.items, currentRoute);
  }

  initializeItems(items: SideMenuItem[], currentRoute: string): boolean {
    let hasMatch = false;

    for (const item of items) {
      const isMatch =
        currentRoute === item.value ||
        currentRoute.startsWith(item.value + '/');

      // Preserve manual expand if explicitly set to true
      item.expanded = !!item.expanded;

      if (isMatch) {
        item.selected = true;
        item.expanded = true;
        this.selected = item.value;
        hasMatch = true;
      }

      if (item.children?.length) {
        const childMatched = this.initializeItems(item.children, currentRoute);
        if (childMatched) {
          item.expanded = true; // Ensure parent expands if any child matches
          hasMatch = true;
        }
      }
    }

    return hasMatch;
  }

  onItemClick(item: SideMenuItem, event: Event) {
    event.stopPropagation();

    if (item.children?.length) {
      // Toggle expand/collapse
      item.expanded = !item.expanded;
    } else {
      // Mark selected and emit
      this.selected = item.value;
      this.itemSelected.emit(item);

      // Navigate if it's a leaf item
      this.router.navigateByUrl(item.value).then((success) => {
        if (success) {
          // Optionally close sidenav on success
          console.log('Navigation successful to:', item.value);
          this.routeChanged.emit();
        }
      });
    }
  }
}
