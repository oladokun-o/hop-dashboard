import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

import { DashboardActions } from '../../core/store/dashboard.actions';
import {
  selectDashboardSummary,
  selectEdgeNodes,
  selectNodeStatusCounts,
  selectRecentTraffic,
  selectTopRegions,
  selectLoading,
  selectError,
  selectAutoRefresh,
  selectTimeRange,
} from '../../core/store/dashboard.selectors';

// Import UI Components
import { HopButtonComponent } from '../../../../projects/ui-components/src/lib/button/button.component';
import { HopCardComponent } from '../../../../projects/ui-components/src/lib/card/card.component';
import { HopStatusIndicatorComponent } from '../../../../projects/ui-components/src/lib/status-indicator/status-indicator.component';
import { HopChartComponent } from '../../../../projects/ui-components/src/lib/chart/chart.component';
// import { HopMetricCardComponent } from '../../../../projects/ui-components/src/lib/metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HopButtonComponent,
    HopCardComponent,
    HopStatusIndicatorComponent,
    HopChartComponent,
    // HopMetricCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  // Signal selectors
  summary = this.store.selectSignal(selectDashboardSummary);
  edgeNodes = this.store.selectSignal(selectEdgeNodes);
  nodeStatusCounts = this.store.selectSignal(selectNodeStatusCounts);
  recentTraffic = this.store.selectSignal(selectRecentTraffic);
  topRegions = this.store.selectSignal(selectTopRegions);
  loading = this.store.selectSignal(selectLoading);
  error = this.store.selectSignal(selectError);
  autoRefresh = this.store.selectSignal(selectAutoRefresh);
  selectedTimeRange = this.store.selectSignal(selectTimeRange);

  // Chart configurations
  trafficChartConfig = {
    type: 'line',
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Requests per Second',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Time',
          },
        },
      },
    },
  };

  performanceChartConfig = {
    type: 'bar',
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Response Time (ms)',
          },
        },
      },
    },
  };

  // Computed properties
  performanceData = computed(() => {
    return this.edgeNodes().map((node) => ({
      label: node.location,
      value: node.responseTime,
      color: this.getColorForStatus(node.status),
    }));
  });

  ngOnInit() {
    // Initialize dashboard data
    this.store.dispatch(DashboardActions.loadEdgeNodes());
    this.store.dispatch(
      DashboardActions.loadMetrics({ timeRange: this.selectedTimeRange() })
    );
    this.store.dispatch(
      DashboardActions.loadTrafficData({ timeRange: this.selectedTimeRange() })
    );
    this.store.dispatch(
      DashboardActions.loadGeographicStats({
        timeRange: this.selectedTimeRange(),
      })
    );
  }

  onTimeRangeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const timeRange = target.value as '1h' | '6h' | '24h' | '7d' | '30d';
    this.store.dispatch(DashboardActions.setTimeRange({ timeRange }));
  }

  toggleAutoRefresh() {
    this.store.dispatch(DashboardActions.toggleAutoRefresh());
  }

  refreshDashboard() {
    this.store.dispatch(DashboardActions.refreshAllData());
  }

  clearError() {
    this.store.dispatch(DashboardActions.clearError());
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  private getColorForStatus(status: string): string {
    switch (status) {
      case 'healthy':
        return '#22c55e';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      case 'offline':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  }
}
