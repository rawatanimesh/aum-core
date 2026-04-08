import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export interface TocSection {
  id: string;
  labelKey: string;
}

@Component({
  selector: 'demo-toc',
  imports: [RouterModule, TranslateModule],
  templateUrl: './toc.html',
  styleUrl: './toc.scss',
})
export class TocComponent {
  @Input() sections: TocSection[] = [];
  @Input() activeId = '';
  @Output() sectionClick = new EventEmitter<string>();

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    this.sectionClick.emit(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
