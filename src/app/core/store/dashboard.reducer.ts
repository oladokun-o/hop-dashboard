import { createReducer, on } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import { DashboardState, initialDashboardState } from './dashboard.state';

export const dashboardReducer = createReducer(
  initialDashboardState,

  // Edge Nodes
  on(DashboardActions.loadEdgeNodes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DashboardActions.loadEdgeNodesSuccess, (state, { nodes }) => ({
    ...state,
    edgeNodes: nodes,
    loading: false,
    lastRefresh: new Date(),
  })),

  on(DashboardActions.loadEdgeNodesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Metrics
  on(DashboardActions.loadMetrics, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DashboardActions.loadMetricsSuccess, (state, { metrics }) => ({
    ...state,
    metrics,
    loading: false,
  })),

  on(DashboardActions.loadMetricsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Traffic Data
  on(DashboardActions.loadTrafficDataSuccess, (state, { data }) => ({
    ...state,
    trafficData: data,
  })),

  // Geographic Stats
  on(DashboardActions.loadGeographicStatsSuccess, (state, { stats }) => ({
    ...state,
    geographicStats: stats,
  })),

  // Settings
  on(DashboardActions.toggleAutoRefresh, (state) => ({
    ...state,
    autoRefresh: !state.autoRefresh,
  })),

  on(DashboardActions.setTimeRange, (state, { timeRange }) => ({
    ...state,
    selectedTimeRange: timeRange,
  })),

  // Real-time Updates
  on(
    DashboardActions.updateNodeStatus,
    (state, { nodeId, status, responseTime }) => ({
      ...state,
      edgeNodes: state.edgeNodes.map((node) =>
        node.id === nodeId
          ? { ...node, status, responseTime, lastUpdate: new Date() }
          : node
      ),
    })
  ),

  on(DashboardActions.updateMetrics, (state, { metrics }) => ({
    ...state,
    metrics: state.metrics ? { ...state.metrics, ...metrics } : null,
  })),

  // Utility Actions
  on(DashboardActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(DashboardActions.resetDashboard, () => initialDashboardState)
);
