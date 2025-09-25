export interface EdgeNode {
  id: string;
  location: string;
  country: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  responseTime: number;
  requestCount: number;
  bandwidthUsage: number;
  lastUpdate: Date;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Metrics {
  totalRequests: number;
  avgResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  bandwidthUsed: number;
  peakRps: number;
  uptime: number;
  timestamp: Date;
}

export interface TrafficData {
  timestamp: Date;
  requests: number;
  bandwidth: number;
  errors: number;
}

export interface GeographicStats {
  region: string;
  requests: number;
  percentage: number;
  avgResponseTime: number;
}

export interface DashboardState {
  edgeNodes: EdgeNode[];
  metrics: Metrics | null;
  trafficData: TrafficData[];
  geographicStats: GeographicStats[];
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  autoRefresh: boolean;
  selectedTimeRange: '1h' | '6h' | '24h' | '7d' | '30d';
}

export const initialDashboardState: DashboardState = {
  edgeNodes: [],
  metrics: null,
  trafficData: [],
  geographicStats: [],
  loading: false,
  error: null,
  lastRefresh: null,
  autoRefresh: true,
  selectedTimeRange: '24h',
};
