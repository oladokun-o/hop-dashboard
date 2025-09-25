import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, timer } from 'rxjs';
import {
  map,
  exhaustMap,
  catchError,
  switchMap,
  takeUntil,
  filter,
} from 'rxjs/operators';

import { DashboardActions } from './dashboard.actions';
import { DashboardService } from '../services/dashboard.service';
import { selectAutoRefresh } from './dashboard.selectors';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dashboardService = inject(DashboardService);
  private store = inject(Store);

  // Load Edge Nodes
  loadEdgeNodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadEdgeNodes),
      exhaustMap(() =>
        this.dashboardService.getEdgeNodes().pipe(
          map((nodes) => DashboardActions.loadEdgeNodesSuccess({ nodes })),
          catchError((error) =>
            of(DashboardActions.loadEdgeNodesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Load Metrics
  loadMetrics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadMetrics),
      exhaustMap(({ timeRange }) =>
        this.dashboardService.getMetrics(timeRange).pipe(
          map((metrics) => DashboardActions.loadMetricsSuccess({ metrics })),
          catchError((error) =>
            of(DashboardActions.loadMetricsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Load Traffic Data
  loadTrafficData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadTrafficData),
      exhaustMap(({ timeRange }) =>
        this.dashboardService.getTrafficData(timeRange).pipe(
          map((data) => DashboardActions.loadTrafficDataSuccess({ data })),
          catchError((error) =>
            of(
              DashboardActions.loadTrafficDataFailure({ error: error.message })
            )
          )
        )
      )
    )
  );

  // Load Geographic Stats
  loadGeographicStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadGeographicStats),
      exhaustMap(({ timeRange }) =>
        this.dashboardService.getGeographicStats(timeRange).pipe(
          map((stats) =>
            DashboardActions.loadGeographicStatsSuccess({ stats })
          ),
          catchError((error) =>
            of(
              DashboardActions.loadGeographicStatsFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  // Auto Refresh Effect
  autoRefresh$ = createEffect(() =>
    timer(0, 30000).pipe(
      // Refresh every 30 seconds
      switchMap(() =>
        this.store.select(selectAutoRefresh).pipe(
          filter((autoRefresh) => autoRefresh),
          map(() => DashboardActions.refreshAllData())
        )
      )
    )
  );

  // Refresh All Data
  refreshAllData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.refreshAllData),
      switchMap(() => [
        DashboardActions.loadEdgeNodes(),
        DashboardActions.loadMetrics({ timeRange: '24h' }),
        DashboardActions.loadTrafficData({ timeRange: '24h' }),
        DashboardActions.loadGeographicStats({ timeRange: '24h' }),
      ])
    )
  );

  // Time Range Change Effect
  timeRangeChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.setTimeRange),
      switchMap(({ timeRange }) => [
        DashboardActions.loadMetrics({ timeRange }),
        DashboardActions.loadTrafficData({ timeRange }),
        DashboardActions.loadGeographicStats({ timeRange }),
      ])
    )
  );

  // Real-time Updates Simulation
  simulateRealTimeUpdates$ = createEffect(() =>
    timer(5000, 10000).pipe(
      // Start after 5s, then every 10s
      switchMap(() =>
        this.dashboardService.getRandomStatusUpdate().pipe(
          map((update) =>
            DashboardActions.updateNodeStatus({
              nodeId: update.nodeId,
              status: update.status,
              responseTime: update.responseTime,
            })
          ),
          catchError(() => of({ type: 'NO_ACTION' }))
        )
      )
    )
  );
}
