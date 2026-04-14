import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from '@aum/ui/layout';
import { ButtonComponent } from '@aum/ui/buttons';

@Component({
  selector: 'demo-button',
  imports: [CommonModule, PageComponent, ButtonComponent],
  templateUrl: './button-demo.html',
  styleUrl: './button-demo.scss',
})
export class ButtonDemo {
  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'BUTTONS', route: '/playground/buttons' },
    ],
  };

  onButtonClick(label: string) {
    console.log(`[ButtonDemo] clicked: ${label}`);
  }
}
