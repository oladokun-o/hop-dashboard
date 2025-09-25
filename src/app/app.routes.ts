import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  // {
  //   path: 'analytics',
  //   loadComponent: () =>
  //     import('./features/analytics/analytics.component').then(
  //       (m) => m.AnalyticsComponent
  //     ),
  // },
  // {
  //   path: 'monitoring',
  //   loadComponent: () =>
  //     import('./features/monitoring/monitoring.component').then(
  //       (m) => m.MonitoringComponent
  //     ),
  // },
  {
    path: '**',
    redirectTo: '/',
  },
];
