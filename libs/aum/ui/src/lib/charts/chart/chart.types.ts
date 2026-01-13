import { ChartConfiguration, ChartType } from 'chart.js';

/**
 * Chart component configuration interface
 * Extends Chart.js configuration with custom options
 */
export interface ChartConfig {
  /** Chart type (line, bar, pie, doughnut, etc.) */
  type: ChartType;

  /** Chart data configuration */
  data: ChartConfiguration['data'];

  /** Chart options configuration */
  options?: ChartConfiguration['options'];

  /** Custom width for the chart container */
  width?: string;

  /** Custom height for the chart container */
  height?: string;

  /** CSS class to apply to the canvas element */
  canvasClass?: string;
}
