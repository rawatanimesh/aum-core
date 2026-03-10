import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ChartConfig } from './chart.types';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'aum-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  private configSignal = signal<ChartConfig | null>(null);

  /**
   * Chart configuration input
   * Can be updated dynamically to re-render the chart
   */
  @Input({ required: true }) set config(value: ChartConfig) {
    this.configSignal.set(value);
  }

  constructor() {
    // Effect to update chart when config changes
    effect(() => {
      const config = this.configSignal();
      if (config && this.canvasRef) {
        this.updateChart(config);
      }
    });
  }

  ngAfterViewInit(): void {
    const config = this.configSignal();
    if (config) {
      this.createChart(config);
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  /**
   * Creates a new Chart.js instance
   */
  private createChart(config: ChartConfig): void {
    if (!this.canvasRef) {
      return;
    }

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas 2D context');
      return;
    }

    const chartConfig: ChartConfiguration = {
      type: config.type,
      data: config.data,
      options: config.options || {},
    };

    this.chart = new Chart(ctx, chartConfig);
  }

  /**
   * Updates existing chart or creates new one
   */
  private updateChart(config: ChartConfig): void {
    if (!this.chart) {
      this.createChart(config);
      return;
    }

    // If chart type changed, recreate the chart
    // Store current type for comparison
    const currentType = (this.chart.config as ChartConfiguration).type;
    if (currentType !== config.type) {
      this.destroyChart();
      this.createChart(config);
      return;
    }

    // Update chart data
    this.chart.data = config.data;

    // Update chart options if provided
    if (config.options) {
      this.chart.options = config.options;
    }

    // Update existing chart
    this.chart.update();
  }

  /**
   * Destroys the Chart.js instance
   */
  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  /**
   * Get container styles based on config
   */
  get containerStyles(): Record<string, string> {
    const config = this.configSignal();
    const styles: Record<string, string> = {};

    if (config?.width) {
      styles['width'] = config.width;
    }

    if (config?.height) {
      styles['height'] = config.height;
    }

    return styles;
  }

  /**
   * Get canvas class from config
   */
  get canvasClass(): string {
    return this.configSignal()?.canvasClass || '';
  }
}
