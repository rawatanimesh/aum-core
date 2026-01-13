import { Component } from '@angular/core';
import { ChartComponent, ChartConfig } from '@aum/ui/charts';
import { PageComponent } from '@aum/ui/layout';

@Component({
  selector: 'aum-charts-demo',
  standalone: true,
  imports: [ChartComponent, PageComponent],
  templateUrl: './charts-demo.html',
  styleUrl: './charts-demo.scss',
})
export class ChartsDemo {
  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'Charts', route: '/playground/charts' },
    ],
  };

  // Bar Chart Configuration
  barChartConfig: ChartConfig = {
    type: 'bar',
    data: {
      labels: [
        'Translation',
        'Classification',
        'Prioritization',
        'Assessment',
        'Infra',
        'Application',
        'User Story',
      ],
      datasets: [
        {
          data: [162, 66, 132, 84, 106, 52, 132],
          backgroundColor: '#5B8FF9',
          borderRadius: 4,
          barThickness: 40,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#000',
          bodyColor: '#000',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 200,
          ticks: {
            stepSize: 50,
            color: '#666',
          },
          grid: {
            color: '#f0f0f0',
          },
        },
        x: {
          ticks: {
            color: '#666',
          },
          grid: {
            display: false,
          },
        },
      },
    },
    height: '300px',
  };

  // Pie Chart Configuration
  pieChartConfig: ChartConfig = {
    type: 'pie',
    data: {
      labels: ['Control', 'Test A', 'Test B', 'Test C', 'Test D', 'Test E'],
      datasets: [
        {
          data: [50, 10, 10, 10, 10, 10],
          backgroundColor: [
            '#52C41A', // Green
            '#FF7A45', // Orange
            '#597EF7', // Blue
            '#F5222D', // Red
            '#FAAD14', // Yellow
            '#13C2C2', // Cyan
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 15,
            color: '#000',
            font: {
              size: 13,
            },
            generateLabels: (chart) => {
              const data = chart.data;
              if (data.labels?.length && data.datasets?.length) {
                return data.labels.map((label, i) => ({
                  text: `${label}     ${data.datasets[0].data[i]}%`,
                  fillStyle: (data.datasets[0].backgroundColor as string[])[
                    i
                  ],
                  hidden: false,
                  index: i,
                }));
              }
              return [];
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.label}: ${context.parsed}%`;
            },
          },
        },
      },
    },
    height: '300px',
  };

  // Line Chart Configuration
  lineChartConfig: ChartConfig = {
    type: 'line',
    data: {
      labels: ['00:00', '05:00', '10:00', '15:00', '20:00', '25:00', '30:00'],
      datasets: [
        {
          label: 'Target',
          data: [5, 5, 4, 7, 4, 12, 12],
          borderColor: '#52C41A',
          backgroundColor: '#52C41A',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'Actual',
          data: [5, 10, 6, 18, 12, 18, 40],
          borderColor: '#597EF7',
          backgroundColor: '#597EF7',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            color: '#000',
          },
        },
        title: {
          display: true,
          text: 'Ticket Flow (Last 24 Hours)',
          align: 'start',
          color: '#000',
          font: {
            size: 16,
            weight: 'bold',
          },
          padding: {
            bottom: 10,
          },
        },
        subtitle: {
          display: true,
          text: 'Created vs Resolved tickets over time',
          align: 'start',
          color: '#666',
          font: {
            size: 13,
          },
          padding: {
            bottom: 20,
          },
        },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#000',
          bodyColor: '#000',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 12,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 50,
          ticks: {
            stepSize: 10,
            color: '#666',
            callback: function (tickValue) {
              return tickValue;
            },
          },
          title: {
            display: true,
            text: 'Counts',
            color: '#666',
          },
          grid: {
            color: '#f0f0f0',
          },
        },
        x: {
          ticks: {
            color: '#666',
          },
          grid: {
            display: false,
          },
        },
      },
    },
    height: '400px',
  };
}
