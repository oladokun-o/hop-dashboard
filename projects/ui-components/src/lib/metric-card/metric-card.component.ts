import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TrendDirection = 'up' | 'down' | 'stable' | 'none';

@Component({
  selector: 'hop-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      <div class="hop-metric-card__header">
        @if (icon) {
          <div class="hop-metric-card__icon">{{ icon }}</div>
        }
        <div class="hop-metric-card__title-section">
          <h4 class="hop-metric-card__title">{{ title }}</h4>
          @if (description) {
            <p class="hop-metric-card__description">{{ description }}</p>
          }
        </div>
      </div>

      <div class="hop-metric-card__content">
        @if (!loading) {
          <div class="hop-metric-card__value-section">
            <span class="hop-metric-card__value">
              {{ formatValue(value) }}
            </span>
            @if (unit) {
              <span class="hop-metric-card__unit">{{ unit }}</span>
            }
          </div>

          @if (trend !== 'none' && trendValue) {
            <div class="hop-metric-card__trend" [class]="trendClasses()">
              <span class="hop-metric-card__trend-icon">{{ getTrendIcon() }}</span>
              <span class="hop-metric-card__trend-value">{{ formatTrendValue() }}</span>
              @if (trendLabel) {
                <span class="hop-metric-card__trend-label">{{ trendLabel }}</span>
              }
            </div>
          }
        } @else {
          <div class="hop-metric-card__loading">
            <div class="loading-skeleton">
              <div class="skeleton-value"></div>
              <div class="skeleton-trend"></div>
            </div>
          </div>
        }
      </div>

      @if (hasFooter()) {
        <div class="hop-metric-card__footer">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      }

      @if (sparklineData && sparklineData.length > 0) {
        <div class="hop-metric-card__sparkline">
          <svg viewBox="0 0 100 20" class="sparkline-svg">
            <polyline
              [attr.points]="sparklinePoints()"
              [class]="sparklineClasses()">
            </polyline>
          </svg>
        </div>
      }
    </div>
  `,
  styleUrls: ['./metric-card.component.scss']
})
export class HopMetricCardComponent {
  @Input() title!: string;
  @Input() value!: number | string;
  @Input() unit?: string;
  @Input() icon?: string;
  @Input() description?: string;
  @Input() loading = false;
  @Input() trend: TrendDirection = 'none';
  @Input() trendValue?: number;
  @Input() trendLabel?: string;
  @Input() precision = 2;
  @Input() sparklineData?: number[];
  @Input() variant: 'default' | 'compact' | 'detailed' = 'default';
  @Input() color?: string;

  cardClasses = computed(() => {
    const classes = [
      'hop-metric-card',
      `hop-metric-card--${this.variant}`
    ];

    if (this.loading) classes.push('hop-metric-card--loading');
    if (this.trend !== 'none') classes.push(`hop-metric-card--trend-${this.trend}`);
    if (this.color) classes.push(`hop-metric-card--${this.color}`);

    return classes.join(' ');
  });

  trendClasses = computed(() => {
    const classes = ['hop-metric-card__trend'];
    if (this.trend !== 'none') {
      classes.push(`hop-metric-card__trend--${this.trend}`);
    }
    return classes.join(' ');
  });

  sparklineClasses = computed(() => {
    const classes = ['sparkline'];
    if (this.trend !== 'none') {
      classes.push(`sparkline--${this.trend}`);
    }
    return classes.join(' ');
  });

  formatValue(value: number | string): string {
    if (typeof value === 'string') return value;

    // Handle large numbers with appropriate suffixes
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B';
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }

    // For smaller numbers, use precision setting
    return typeof value === 'number' ? value.toFixed(this.precision) : (value as string).toString();
  }

  formatTrendValue(): string {
    if (!this.trendValue) return '';

    const prefix = this.trendValue > 0 ? '+' : '';
    return `${prefix}${this.trendValue.toFixed(1)}%`;
  }

  getTrendIcon(): string {
    switch (this.trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '';
    }
  }

  sparklinePoints(): string {
    if (!this.sparklineData || this.sparklineData.length === 0) return '';

    const data = this.sparklineData;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = range === 0 ? 10 : 20 - ((value - min) / range) * 20;
        return `${x},${y}`;
      })
      .join(' ');
  }

  hasFooter(): boolean {
    // This would need proper content projection detection
    // For now, return false as placeholder
    return false;
  }
}
