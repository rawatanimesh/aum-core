import { ApiRow } from '../shared/api-table/api-table';

export const CHART_META = {
  name: 'Chart',
  selector: '<aum-chart>',
  importFrom: '@aum/ui/charts',
  description:
    'A Chart.js wrapper component. Pass a ChartConfig with type, data, and optional options/width/height. Supports all Chart.js chart types including bar, line, doughnut, pie, and radar.',
  status: 'stable' as const,
};

export const CHART_INPUTS: ApiRow[] = [
  {
    name: 'config',
    type: 'ChartConfig',
    default: '—',
    description: 'Required setter input. Accepts a ChartConfig object containing type, data, options, width, height, and an optional canvasClass.',
  },
];

export const CHART_OUTPUTS: ApiRow[] = [];

export const CHART_INTERFACES = [
  {
    name: 'ChartConfig',
    definition: `interface ChartConfig {
  type: ChartType;                          // 'bar' | 'line' | 'doughnut' | 'pie' | 'radar' | etc.
  data: ChartConfiguration['data'];         // Chart.js data object with labels and datasets
  options?: ChartConfiguration['options']; // Chart.js options (responsive, plugins, scales, etc.)
  width?: string;                           // CSS width of the chart container (e.g. '400px')
  height?: string;                          // CSS height of the chart container (e.g. '300px')
  canvasClass?: string;                     // optional CSS class applied to the <canvas> element
}`,
  },
];

export const CHART_EXAMPLES = {
  importPath: `import { ChartComponent } from '@aum/ui/charts';
import type { ChartConfig } from '@aum/ui/charts';`,

  barChart: `readonly barChart: ChartConfig = {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Monthly Revenue', data: [65, 78, 90, 81, 56, 95] }],
  },
  options: { responsive: true, plugins: { legend: { display: true } } },
  height: '300px',
};

<!-- Template -->
<aum-chart [config]="barChart"></aum-chart>`,

  lineChart: `readonly lineChart: ChartConfig = {
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

<!-- Template -->
<aum-chart [config]="lineChart"></aum-chart>`,

  doughnutChart: `readonly doughnutChart: ChartConfig = {
  type: 'doughnut',
  data: {
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [{ data: [55, 35, 10] }],
  },
  options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
  height: '300px',
};

<!-- Template -->
<aum-chart [config]="doughnutChart"></aum-chart>`,

  customSize: `readonly customSizeChart: ChartConfig = {
  type: 'bar',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{ label: 'Quarterly Sales', data: [45, 67, 89, 73] }],
  },
  options: { responsive: false, maintainAspectRatio: false },
  width: '400px',
  height: '200px',
};

<!-- Template — fixed dimensions, not responsive -->
<aum-chart [config]="customSizeChart"></aum-chart>`,
};
