import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';

export const selectDashboardState =
  createFeatureSelector<DashboardState>('dashboard');

// Basic selectors
export const selectEdgeNodes = createSelector(
  selectDashboardState,
  (state) => state.edgeNodes
);

export const selectMetrics = createSelector(
  selectDashboardState,
  (state) => state.metrics
);

export const selectTrafficData = createSelector(
  selectDashboardState,
  (state) => state.trafficData
);

export const selectGeographicStats = createSelector(
  selectDashboardState,
  (state) => state.geographicStats
);

export const selectLoading = createSelector(
  selectDashboardState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectDashboardState,
  (state) => state.error
);

export const selectAutoRefresh = createSelector(
  selectDashboardState,
  (state) => state.autoRefresh
);

export const selectTimeRange = createSelector(
  selectDashboardState,
  (state) => state.selectedTimeRange
);

// Computed selectors
export const selectHealthyNodes = createSelector(selectEdgeNodes, (nodes) =>
  nodes.filter((node) => node.status === 'healthy')
);

export const selectUnhealthyNodes = createSelector(selectEdgeNodes, (nodes) =>
  nodes.filter((node) => node.status === 'error' || node.status === 'offline')
);

export const selectWarningNodes = createSelector(selectEdgeNodes, (nodes) =>
  nodes.filter((node) => node.status === 'warning')
);

export const selectNodeStatusCounts = createSelector(
  selectEdgeNodes,
  (nodes) => ({
    healthy: nodes.filter((n) => n.status === 'healthy').length,
    warning: nodes.filter((n) => n.status === 'warning').length,
    error: nodes.filter((n) => n.status === 'error').length,
    offline: nodes.filter((n) => n.status === 'offline').length,
    total: nodes.length,
  })
);

export const selectAverageResponseTime = createSelector(
  selectEdgeNodes,
  (nodes) => {
    if (nodes.length === 0) return 0;
    const total = nodes.reduce((sum, node) => sum + node.responseTime, 0);
    return Math.round(total / nodes.length);
  }
);

export const selectTotalBandwidth = createSelector(selectEdgeNodes, (nodes) =>
  nodes.reduce((sum, node) => sum + node.bandwidthUsage, 0)
);

export const selectTopRegions = createSelector(selectGeographicStats, (stats) =>
  stats.slice(0, 5).sort((a, b) => b.requests - a.requests)
);

export const selectRecentTraffic = createSelector(
  selectTrafficData,
  (data) => data.slice(-24) // Last 24 data points
);

export const selectDashboardSummary = createSelector(
  selectMetrics,
  selectNodeStatusCounts,
  selectAverageResponseTime,
  selectTotalBandwidth,
  (metrics, statusCounts, avgResponseTime, totalBandwidth) => ({
    totalRequests: metrics?.totalRequests || 0,
    cacheHitRate: metrics?.cacheHitRate || 0,
    errorRate: metrics?.errorRate || 0,
    uptime: metrics?.uptime || 0,
    healthyNodes: statusCounts.healthy,
    totalNodes: statusCounts.total,
    avgResponseTime,
    totalBandwidth,
  })
);
