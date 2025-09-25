import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  EdgeNode,
  Metrics,
  TrafficData,
  GeographicStats,
} from './dashboard.state';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    // Edge Nodes
    'Load Edge Nodes': emptyProps(),
    'Load Edge Nodes Success': props<{ nodes: EdgeNode[] }>(),
    'Load Edge Nodes Failure': props<{ error: string }>(),

    // Metrics
    'Load Metrics': props<{ timeRange: string }>(),
    'Load Metrics Success': props<{ metrics: Metrics }>(),
    'Load Metrics Failure': props<{ error: string }>(),

    // Traffic Data
    'Load Traffic Data': props<{ timeRange: string }>(),
    'Load Traffic Data Success': props<{ data: TrafficData[] }>(),
    'Load Traffic Data Failure': props<{ error: string }>(),

    // Geographic Stats
    'Load Geographic Stats': props<{ timeRange: string }>(),
    'Load Geographic Stats Success': props<{ stats: GeographicStats[] }>(),
    'Load Geographic Stats Failure': props<{ error: string }>(),

    // Auto Refresh
    'Toggle Auto Refresh': emptyProps(),
    'Set Time Range': props<{
      timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
    }>(),
    'Refresh All Data': emptyProps(),

    // Real-time Updates
    'Update Node Status': props<{
      nodeId: string;
      status: EdgeNode['status'];
      responseTime: number;
    }>(),
    'Update Metrics': props<{ metrics: Partial<Metrics> }>(),

    // Clear State
    'Clear Error': emptyProps(),
    'Reset Dashboard': emptyProps(),
  },
});
