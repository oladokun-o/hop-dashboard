import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  EdgeNode,
  Metrics,
  TrafficData,
  GeographicStats,
} from '../store/dashboard.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private mockEdgeNodes: EdgeNode[] = [
    {
      id: '1',
      location: 'New York',
      country: 'US',
      status: 'healthy',
      responseTime: 45,
      requestCount: 12500,
      bandwidthUsage: 850,
      lastUpdate: new Date(),
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: '2',
      location: 'London',
      country: 'GB',
      status: 'warning',
      responseTime: 78,
      requestCount: 8900,
      bandwidthUsage: 620,
      lastUpdate: new Date(),
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    {
      id: '3',
      location: 'Tokyo',
      country: 'JP',
      status: 'healthy',
      responseTime: 32,
      requestCount: 15200,
      bandwidthUsage: 1200,
      lastUpdate: new Date(),
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    {
      id: '4',
      location: 'Sydney',
      country: 'AU',
      status: 'error',
      responseTime: 156,
      requestCount: 3400,
      bandwidthUsage: 230,
      lastUpdate: new Date(),
      coordinates: { lat: -33.8688, lng: 151.2093 },
    },
    {
      id: '5',
      location: 'Frankfurt',
      country: 'DE',
      status: 'healthy',
      responseTime: 28,
      requestCount: 18700,
      bandwidthUsage: 1450,
      lastUpdate: new Date(),
      coordinates: { lat: 50.1109, lng: 8.6821 },
    },
    {
      id: '6',
      location: 'Singapore',
      country: 'SG',
      status: 'healthy',
      responseTime: 41,
      requestCount: 11800,
      bandwidthUsage: 890,
      lastUpdate: new Date(),
      coordinates: { lat: 1.3521, lng: 103.8198 },
    },
  ];

  private mockGeographicStats: GeographicStats[] = [
    {
      region: 'North America',
      requests: 125000,
      percentage: 35.2,
      avgResponseTime: 45,
    },
    {
      region: 'Europe',
      requests: 98000,
      percentage: 27.6,
      avgResponseTime: 52,
    },
    {
      region: 'Asia Pacific',
      requests: 87000,
      percentage: 24.5,
      avgResponseTime: 38,
    },
    {
      region: 'South America',
      requests: 28000,
      percentage: 7.9,
      avgResponseTime: 89,
    },
    {
      region: 'Africa',
      requests: 17000,
      percentage: 4.8,
      avgResponseTime: 102,
    },
  ];

  getEdgeNodes(): Observable<EdgeNode[]> {
    // Simulate network delay
    return of(this.mockEdgeNodes).pipe(delay(500));
  }

  getMetrics(timeRange: string): Observable<Metrics> {
    const mockMetrics: Metrics = {
      totalRequests: 355000,
      avgResponseTime: 48,
      cacheHitRate: 94.2,
      errorRate: 0.08,
      bandwidthUsed: 4240,
      peakRps: 8900,
      uptime: 99.97,
      timestamp: new Date(),
    };

    // Adjust metrics based on time range
    const multiplier = this.getTimeRangeMultiplier(timeRange);
    const adjustedMetrics = {
      ...mockMetrics,
      totalRequests: Math.round(mockMetrics.totalRequests * multiplier),
      bandwidthUsed: Math.round(mockMetrics.bandwidthUsed * multiplier),
    };

    return of(adjustedMetrics).pipe(delay(300));
  }

  getTrafficData(timeRange: string): Observable<TrafficData[]> {
    const dataPoints = this.getDataPointsForTimeRange(timeRange);
    const now = new Date();
    const trafficData: TrafficData[] = [];

    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(
        now.getTime() - i * this.getIntervalForTimeRange(timeRange)
      );
      trafficData.push({
        timestamp,
        requests: Math.floor(Math.random() * 5000) + 8000,
        bandwidth: Math.floor(Math.random() * 200) + 150,
        errors: Math.floor(Math.random() * 50) + 5,
      });
    }

    return of(trafficData).pipe(delay(400));
  }

  getGeographicStats(timeRange: string): Observable<GeographicStats[]> {
    return of(this.mockGeographicStats).pipe(delay(350));
  }

  getRandomStatusUpdate(): Observable<{
    nodeId: string;
    status: EdgeNode['status'];
    responseTime: number;
  }> {
    const randomNode =
      this.mockEdgeNodes[Math.floor(Math.random() * this.mockEdgeNodes.length)];
    const statuses: EdgeNode['status'][] = ['healthy', 'warning', 'error'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const responseTime =
      randomStatus === 'healthy'
        ? Math.floor(Math.random() * 50) + 20
        : randomStatus === 'warning'
        ? Math.floor(Math.random() * 100) + 60
        : Math.floor(Math.random() * 200) + 120;

    return of({
      nodeId: randomNode.id,
      status: randomStatus,
      responseTime,
    }).pipe(delay(100));
  }

  private getTimeRangeMultiplier(timeRange: string): number {
    switch (timeRange) {
      case '1h':
        return 0.042; // 1/24
      case '6h':
        return 0.25; // 6/24
      case '24h':
        return 1;
      case '7d':
        return 7;
      case '30d':
        return 30;
      default:
        return 1;
    }
  }

  private getDataPointsForTimeRange(timeRange: string): number {
    switch (timeRange) {
      case '1h':
        return 12; // 5-minute intervals
      case '6h':
        return 36; // 10-minute intervals
      case '24h':
        return 48; // 30-minute intervals
      case '7d':
        return 168; // 1-hour intervals
      case '30d':
        return 120; // 6-hour intervals
      default:
        return 24;
    }
  }

  private getIntervalForTimeRange(timeRange: string): number {
    switch (timeRange) {
      case '1h':
        return 5 * 60 * 1000; // 5 minutes
      case '6h':
        return 10 * 60 * 1000; // 10 minutes
      case '24h':
        return 30 * 60 * 1000; // 30 minutes
      case '7d':
        return 60 * 60 * 1000; // 1 hour
      case '30d':
        return 6 * 60 * 60 * 1000; // 6 hours
      default:
        return 30 * 60 * 1000;
    }
  }
}
