import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { Subject } from 'rxjs';

import { PageComponent } from '@aum/ui/layout';
import { SlideToggle } from '@aum/ui/form-controls';
import { LanguageTranslationService } from '@aum/utils/services';

@Component({
  selector: 'playground-slide-toggle-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    PageComponent,
    SlideToggle,
    TranslateModule,
  ],
  templateUrl: './slide-toggle-demo.html',
  styleUrl: './slide-toggle-demo.scss',
})
export class SlideToggleDemo implements OnDestroy {
  private destroy$ = new Subject<void>();
  readonly languageService = inject(LanguageTranslationService);
  route = inject(Router);

  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'Slide Toggle', route: '/playground/slide-toggle' },
    ],
  };

  // Demo 1: Basic slide toggles
  basicToggleChecked = false;
  disabledToggleChecked = true;

  // Demo 2: Label positions
  labelBeforeChecked = false;
  labelAfterChecked = true;

  // Demo 3: Without labels
  noLabelChecked = false;

  onToggleChange(checked: boolean, toggleName: string): void {
    console.log(`${toggleName} changed:`, checked);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
