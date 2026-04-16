import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartComponent } from '@aum/ui/charts';
import type { ChartConfig } from '@aum/ui/charts';
import { ScenarioCard } from '../../../shared/scenario-card/scenario-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'demo-chart-examples',
  standalone: true,
  imports: [ChartComponent, ScenarioCard, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-examples.html',
})
export class ChartExamples {
  readonly barChart: ChartConfig = {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ label: 'Monthly Revenue', data: [65, 78, 90, 81, 56, 95] }],
    },
    options: { responsive: true, plugins: { legend: { display: true } } },
    height: '300px',
  };

  readonly lineChart: ChartConfig = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: 'Users', data: [120, 145, 132, 178, 190, 220], tension: 0.4 },
        { label: 'Sessions', data: [200, 210, 195, 260, 280, 310], tension: 0.4 },
      ],
    },
    options: { responsive: true },
    height: '300px',
  };

  readonly doughnutChart: ChartConfig = {
    type: 'doughnut',
    data: {
      labels: ['Mobile', 'Desktop', 'Tablet'],
      datasets: [{ data: [55, 35, 10] }],
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
    height: '300px',
  };

  readonly customSizeChart: ChartConfig = {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{ label: 'Quarterly Sales', data: [45, 67, 89, 73] }],
    },
    options: { responsive: false, maintainAspectRatio: false },
    width: '400px',
    height: '200px',
  };
}
