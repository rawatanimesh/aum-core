import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbService, BreadcrumbItem } from '@aum/ui/navigation';
import { ButtonComponent } from '@aum/ui/buttons';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'demo-breadcrumb-examples',
  standalone: true,
  imports: [BreadcrumbComponent, ButtonComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumb-examples.html',
})
export class BreadcrumbExamples implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);

  readonly preset1: BreadcrumbItem[] = [
    { title: 'Home', route: '#' },
    { title: 'Products', route: '#' },
    { title: 'Laptop', route: '#' },
  ];

  readonly preset2: BreadcrumbItem[] = [
    { title: 'Dashboard', route: '#' },
    { title: 'Users', route: '#' },
    { title: 'Profile', route: '#' },
    { title: 'Settings', route: '#' },
  ];

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs(this.preset1);
  }

  loadPreset(items: BreadcrumbItem[]): void {
    this.breadcrumbService.setBreadcrumbs(items);
  }

  clear(): void {
    this.breadcrumbService.clear();
  }
}
