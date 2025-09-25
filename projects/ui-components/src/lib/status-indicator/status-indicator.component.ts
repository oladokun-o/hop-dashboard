import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatusType =
  | 'healthy'
  | 'warning'
  | 'error'
  | 'offline'
  | 'unknown';

interface StatusConfig {
  color: string;
  icon: string;
  label: string;
  pulse?: boolean;
}

@Component({
  selector: 'hop-status-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()" [attr.aria-label]="accessibilityLabel()">
      <div class="hop-status-indicator__visual">
        <div
          class="hop-status-indicator__dot"
          [class.pulse]="statusConfig().pulse"
        ></div>
        <span
          class="hop-status-indicator__icon"
          [innerHTML]="statusConfig().icon"
        ></span>
      </div>

      <div class="hop-status-indicator__content">
        <span class="hop-status-indicator__label">{{
          label || statusConfig().label
        }}</span>

        @if (sublabel) {
        <span class="hop-status-indicator__sublabel">{{ sublabel }}</span>
        } @if (showTimestamp && lastUpdate) {
        <span class="hop-status-indicator__timestamp">
          Updated {{ formatTimestamp(lastUpdate) }}
        </span>
        }
      </div>

      @if (showActions) {
      <div class="hop-status-indicator__actions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
      }
    </div>
  `,
  styleUrls: ['./status-indicator.component.scss'],
})
export class HopStatusIndicatorComponent {
  @Input() status: StatusType = 'unknown';
  @Input() label?: string;
  @Input() sublabel?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'compact' | 'detailed' = 'default';
  @Input() showTimestamp = false;
  @Input() showActions = false;
  @Input() lastUpdate?: Date;

  private statusConfigs: Record<StatusType, StatusConfig> = {
    healthy: {
      color: '#22c55e',
      icon: '✓',
      label: 'Healthy',
      pulse: false,
    },
    warning: {
      color: '#f59e0b',
      icon: '⚠️',
      label: 'Warning',
      pulse: true,
    },
    error: {
      color: '#ef4444',
      icon: '✕',
      label: 'Error',
      pulse: true,
    },
    offline: {
      color: '#6b7280',
      icon: '○',
      label: 'Offline',
      pulse: false,
    },
    unknown: {
      color: '#9ca3af',
      icon: '?',
      label: 'Unknown',
      pulse: false,
    },
  };

  statusConfig = computed(() => this.statusConfigs[this.status]);

  containerClasses = computed(() => {
    const classes = [
      'hop-status-indicator',
      `hop-status-indicator--${this.status}`,
      `hop-status-indicator--${this.size}`,
      `hop-status-indicator--${this.variant}`,
    ];

    return classes.join(' ');
  });

  accessibilityLabel = computed(() => {
    const config = this.statusConfig();
    const label = this.label || config.label;
    return `Status: ${config.label}${label ? ` - ${label}` : ''}`;
  });

  formatTimestamp(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  }
}
