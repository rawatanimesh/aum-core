import { Component, inject, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { Subject } from 'rxjs';

import { PageComponent, ExpansionPanelComponent, ExpansionPanelItem, ExpansionPanelContentDirective } from '@aum/ui/layout';
import { ButtonComponent } from '@aum/ui/buttons';
import { CheckboxComponent, InputComponent } from '@aum/ui/form-controls';
import { LanguageTranslationService } from '@aum/utils/services';

@Component({
  selector: 'playground-expansion-panel-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    PageComponent,
    ExpansionPanelComponent,
    ExpansionPanelContentDirective,
    ButtonComponent,
    CheckboxComponent,
    InputComponent,
    TranslateModule,
  ],
  templateUrl: './expansion-panel-demo.html',
  styleUrl: './expansion-panel-demo.scss',
})
export class ExpansionPanelDemo implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  readonly languageService = inject(LanguageTranslationService);
  route = inject(Router);

  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'Expansion Panels', route: '/playground/expansion-panels' },
    ],
  };

  // Reference to multi-mode panel for expand/collapse all
  @ViewChild('multiModePanel') multiModePanel!: ExpansionPanelComponent;

  // Templates for advanced usage demo
  @ViewChild('buttonsTemplate', { static: true }) buttonsTemplate!: TemplateRef<any>;
  @ViewChild('checkboxesTemplate', { static: true }) checkboxesTemplate!: TemplateRef<any>;
  @ViewChild('inputsTemplate', { static: true }) inputsTemplate!: TemplateRef<any>;

  // Demo 1: Basic text content
  basicItems: ExpansionPanelItem[] = [
    {
      header: 'PANEL_1',
      content: 'PANEL_1_CONTENT',
      expanded: true,
    },
    {
      header: 'PANEL_2',
      content: 'PANEL_2_CONTENT',
    },
    {
      header: 'PANEL_3',
      content: 'PANEL_3_CONTENT',
      disabled: true,
    },
  ];

  // Demo 2: Content projection simple items
  projectionSimpleItems: ExpansionPanelItem[] = [
    { header: 'Buttons', expanded: true },
    { header: 'Checkboxes' },
    { header: 'Form Controls' },
  ];

  // Demo 3: Multi-mode accordion
  multiModeItems: ExpansionPanelItem[] = [
    {
      header: 'STEP_1',
      content: 'STEP_1_CONTENT',
      expanded: true,
    },
    {
      header: 'STEP_2',
      content: 'STEP_2_CONTENT',
      expanded: true,
    },
    {
      header: 'STEP_3',
      content: 'STEP_3_CONTENT',
    },
  ];

  // Demo 4: Single-mode items
  singleModeItems: ExpansionPanelItem[] = [
    {
      header: 'Personal Information',
      content: 'Enter your personal details here.',
      expanded: true,
    },
    {
      header: 'Contact Information',
      content: 'Provide your contact information.',
    },
    {
      header: 'Additional Details',
      content: 'Any additional information.',
    },
  ];

  // Demo 5: Advanced per-item templates
  advancedTemplateItems: ExpansionPanelItem[] = [];

  ngOnInit(): void {
    // Initialize advanced template items after view init
    this.advancedTemplateItems = [
      {
        header: 'Buttons Section',
        contentTemplate: this.buttonsTemplate,
        expanded: true,
      },
      {
        header: 'Checkboxes Section',
        contentTemplate: this.checkboxesTemplate,
      },
      {
        header: 'Form Inputs Section',
        contentTemplate: this.inputsTemplate,
      },
    ];
  }

  expandAll(): void {
    this.multiModePanel?.expandAll();
  }

  collapseAll(): void {
    this.multiModePanel?.collapseAll();
  }

  checkboxState(event: string, value: any): void {
    console.log('Checkbox event:', event, value);
  }

  handleButtonClick(label: string): void {
    console.log('Button clicked:', label);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
