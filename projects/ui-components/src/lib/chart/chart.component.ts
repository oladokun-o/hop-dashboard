import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Chart.js imports (you'll need to install chart.js)
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  registerables,
} from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  borderColor?: string;
}

@Component({
  selector: 'hop-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      @if (title) {
      <h4 class="hop-chart__title">{{ title }}</h4>
      }

      <div class="hop-chart__canvas-container">
        <canvas #chartCanvas [attr.aria-label]="ariaLabel" role="img"> </canvas>

        @if (loading()) {
        <div class="hop-chart__loading">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <span>Loading chart data...</span>
          </div>
        </div>
        } @if (error()) {
        <div class="hop-chart__error">
          <span class="error-icon">⚠️</span>
          <span class="error-message">{{ error() }}</span>
        </div>
        }
      </div>

      @if (showLegend && customLegend) {
      <div class="hop-chart__legend">
        @for (item of customLegend; track item.label) {
        <div class="legend-item">
          <span class="legend-color" [style.background-color]="item.color">
          </span>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">{{ item.value }}</span>
        </div>
        }
      </div>
      }
    </div>
  `,
  styleUrls: ['./chart.component.scss'],
})
export class HopChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() config!: any;
  @Input() data: any[] = [];
  @Input() title?: string;
  @Input() type: ChartType = 'line';
  @Input() height: number = 300;
  @Input() responsive = true;
  @Input() maintainAspectRatio = false;
  @Input() ariaLabel?: string;
  @Input() showLegend = false;
  @Input() customLegend?: {
    label: string;
    color: string;
    value: string | number;
  }[];

  // Signals for reactive state
  loading = signal(false);
  error = signal<string | null>(null);

  private chart?: Chart;
  private resizeObserver?: ResizeObserver;

  containerClasses = computed(() => {
    const classes = ['hop-chart'];
    if (this.loading()) classes.push('hop-chart--loading');
    if (this.error()) classes.push('hop-chart--error');
    return classes.join(' ');
  });

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && (changes['data'] || changes['config'])) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    this.destroyChart();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private async initChart() {
    try {
      this.loading.set(true);
      this.error.set(null);

      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Prepare chart configuration
      const chartConfig: ChartConfiguration = {
        ...this.config,
        data: this.transformDataToChartJS(),
        options: {
          ...this.config.options,
          responsive: this.responsive,
          maintainAspectRatio: this.maintainAspectRatio,
          plugins: {
            ...this.config.options?.plugins,
            legend: {
              display: !this.showLegend, // Hide default legend if we show custom
              ...this.config.options?.plugins?.legend,
            },
          },
        },
      };

      this.chart = new Chart(ctx, chartConfig);

      // Setup resize observer for responsive behavior
      this.setupResizeObserver();

      this.loading.set(false);
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : 'Failed to initialize chart'
      );
      this.loading.set(false);
    }
  }

  private updateChart() {
    if (!this.chart) return;

    try {
      this.chart.data = this.transformDataToChartJS();
      this.chart.update('none'); // Use 'none' for better performance
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : 'Failed to update chart'
      );
    }
  }

  private transformDataToChartJS(): ChartData {
    if (!this.data || this.data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Transform based on chart type
    if (this.type === 'pie' || this.type === 'doughnut') {
      return {
        labels: this.data.map((d) => d.label),
        datasets: [
          {
            data: this.data.map((d) => d.value),
            backgroundColor: this.data.map(
              (d) => d.color || this.getDefaultColor()
            ),
            borderColor: this.data.map((d) => d.borderColor || '#ffffff'),
            borderWidth: 2,
          },
        ],
      };
    }

    // Line, bar, and other chart types
    return {
      labels: this.data.map((d) => d.label),
      datasets: [
        {
          label: this.title || 'Data',
          data: this.data.map((d) => d.value),
          backgroundColor: this.data.map(
            (d) => d.color || this.getDefaultColor()
          ),
          borderColor: this.data.map((d) => d.borderColor || '#3b82f6'),
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        },
      ],
    };
  }

  private getDefaultColor(): string {
    const colors = [
      '#3b82f6',
      '#ef4444',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#ec4899',
      '#14b8a6',
      '#f97316',
      '#6366f1',
      '#e11d48',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  private setupResizeObserver() {
    if (this.resizeObserver) return;

    this.resizeObserver = new ResizeObserver(() => {
      if (this.chart) {
        this.chart.resize();
      }
    });
  }
}
