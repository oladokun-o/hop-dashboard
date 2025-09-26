import type { Meta, StoryObj } from '@storybook/angular';
import { HopStatusIndicatorComponent } from '../lib/status-indicator/status-indicator.component';

const meta: Meta<HopStatusIndicatorComponent> = {
  title: 'Components/StatusIndicator',
  component: HopStatusIndicatorComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A status indicator component for displaying the health and state of edge nodes, services, and systems. Perfect for monitoring dashboards.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['healthy', 'warning', 'error', 'offline', 'unknown'],
      description: 'The status type to display',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the status indicator',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Display variant of the component',
    },
    label: {
      control: 'text',
      description: 'Primary label text',
    },
    sublabel: {
      control: 'text',
      description: 'Secondary label text',
    },
    showTimestamp: {
      control: 'boolean',
      description: 'Whether to show the last update timestamp',
    },
    showActions: {
      control: 'boolean',
      description: 'Whether to show action buttons',
    },
  },
  args: {
    status: 'healthy',
    size: 'md',
    variant: 'default',
    showTimestamp: false,
    showActions: false,
  },
};

export default meta;
type Story = StoryObj<HopStatusIndicatorComponent>;

export const Default: Story = {
  args: {
    status: 'healthy',
    label: 'Edge Node Status',
  },
};

export const AllStatuses: Story = {
  name: 'All Status Types',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; min-width: 300px;">
        <hop-status-indicator status="healthy" label="New York Edge Node" sublabel="Response time: 23ms"></hop-status-indicator>
        <hop-status-indicator status="warning" label="London Edge Node" sublabel="High latency detected"></hop-status-indicator>
        <hop-status-indicator status="error" label="Tokyo Edge Node" sublabel="Connection timeout"></hop-status-indicator>
        <hop-status-indicator status="offline" label="Sydney Edge Node" sublabel="Maintenance mode"></hop-status-indicator>
        <hop-status-indicator status="unknown" label="Frankfurt Edge Node" sublabel="Status checking..."></hop-status-indicator>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  name: 'Different Sizes',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start;">
        <hop-status-indicator size="sm" status="healthy" label="Small Status" sublabel="Compact view"></hop-status-indicator>
        <hop-status-indicator size="md" status="warning" label="Medium Status" sublabel="Default size"></hop-status-indicator>
        <hop-status-indicator size="lg" status="error" label="Large Status" sublabel="Prominent display"></hop-status-indicator>
      </div>
    `,
  }),
};

export const Variants: Story = {
  name: 'Display Variants',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4 style="margin-bottom: 12px; color: #64748b;">Default Variant</h4>
          <hop-status-indicator
            variant="default"
            status="healthy"
            label="API Gateway"
            sublabel="All services operational">
          </hop-status-indicator>
        </div>

        <div>
          <h4 style="margin-bottom: 12px; color: #64748b;">Compact Variant</h4>
          <hop-status-indicator
            variant="compact"
            status="warning"
            label="Cache Server">
          </hop-status-indicator>
        </div>

        <div>
          <h4 style="margin-bottom: 12px; color: #64748b;">Detailed Variant</h4>
          <hop-status-indicator
            variant="detailed"
            status="error"
            label="Database Connection"
            sublabel="Connection pool exhausted"
            [showTimestamp]="true"
            [lastUpdate]="mockDate">
          </hop-status-indicator>
        </div>
      </div>
    `,
    props: {
      mockDate: new Date(Date.now() - 5 * 60000) // 5 minutes ago
    }
  }),
};

export const WithTimestamps: Story = {
  name: 'With Timestamps',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; min-width: 350px;">
        <hop-status-indicator
          status="healthy"
          label="Load Balancer"
          sublabel="Traffic distributed normally"
          [showTimestamp]="true"
          [lastUpdate]="justNow">
        </hop-status-indicator>

        <hop-status-indicator
          status="warning"
          label="CDN Cache"
          sublabel="Cache hit rate below threshold"
          [showTimestamp]="true"
          [lastUpdate]="fiveMinutesAgo">
        </hop-status-indicator>

        <hop-status-indicator
          status="error"
          label="Origin Server"
          sublabel="HTTP 503 Service Unavailable"
          [showTimestamp]="true"
          [lastUpdate]="oneHourAgo">
        </hop-status-indicator>
      </div>
    `,
    props: {
      justNow: new Date(),
      fiveMinutesAgo: new Date(Date.now() - 5 * 60000),
      oneHourAgo: new Date(Date.now() - 60 * 60000)
    }
  }),
};

export const EdgeNodeDashboard: Story = {
  name: '🌍 Edge Node Dashboard',
  render: () => ({
    template: `
      <div style="padding: 24px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; min-width: 500px;">
        <h3 style="margin: 0 0 20px 0; color: #1e293b;">🐇 Global Edge Network Status</h3>

        <div style="display: grid; gap: 16px;">
          <!-- Healthy Nodes -->
          <hop-status-indicator
            status="healthy"
            label="New York, US"
            sublabel="23ms • 12.5K req/s • 850GB/h"
            [showTimestamp]="true"
            [lastUpdate]="recent1">
          </hop-status-indicator>

          <hop-status-indicator
            status="healthy"
            label="London, UK"
            sublabel="31ms • 8.9K req/s • 620GB/h"
            [showTimestamp]="true"
            [lastUpdate]="recent2">
          </hop-status-indicator>

          <hop-status-indicator
            status="healthy"
            label="Frankfurt, DE"
            sublabel="28ms • 18.7K req/s • 1.45TB/h"
            [showTimestamp]="true"
            [lastUpdate]="recent3">
          </hop-status-indicator>

          <!-- Warning Node -->
          <hop-status-indicator
            status="warning"
            label="Tokyo, JP"
            sublabel="89ms • 15.2K req/s • High Latency"
            [showTimestamp]="true"
            [lastUpdate]="recent4">
          </hop-status-indicator>

          <!-- Error Node -->
          <hop-status-indicator
            status="error"
            label="Sydney, AU"
            sublabel="Connection timeout • 3.4K req/s"
            [showTimestamp]="true"
            [lastUpdate]="recent5">
          </hop-status-indicator>

          <!-- Offline Node -->
          <hop-status-indicator
            status="offline"
            label="São Paulo, BR"
            sublabel="Scheduled maintenance"
            [showTimestamp]="true"
            [lastUpdate]="recent6">
          </hop-status-indicator>
        </div>

        <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.6); border-radius: 8px; font-size: 14px; color: #64748b;">
          <strong>Network Summary:</strong> 5/6 nodes healthy • 97.2% uptime • 58.7K total req/s
        </div>
      </div>
    `,
    props: {
      recent1: new Date(Date.now() - 30000), // 30s ago
      recent2: new Date(Date.now() - 45000), // 45s ago
      recent3: new Date(Date.now() - 15000), // 15s ago
      recent4: new Date(Date.now() - 2 * 60000), // 2min ago
      recent5: new Date(Date.now() - 8 * 60000), // 8min ago
      recent6: new Date(Date.now() - 2 * 60 * 60000), // 2h ago
    }
  }),
};

export const CompactList: Story = {
  name: 'Compact Status List',
  render: () => ({
    template: `
      <div style="width: 300px; background: white; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h4 style="margin: 0 0 16px 0; color: #1e293b;">Service Health</h4>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <hop-status-indicator variant="compact" status="healthy" label="API Gateway"></hop-status-indicator>
          <hop-status-indicator variant="compact" status="healthy" label="Load Balancer"></hop-status-indicator>
          <hop-status-indicator variant="compact" status="healthy" label="CDN Cache"></hop-status-indicator>
          <hop-status-indicator variant="compact" status="warning" label="Database Pool"></hop-status-indicator>
          <hop-status-indicator variant="compact" status="error" label="Background Jobs"></hop-status-indicator>
          <hop-status-indicator variant="compact" status="offline" label="Analytics Engine"></hop-status-indicator>
        </div>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  name: 'Interactive Demo',
  args: {
    status: 'healthy',
    label: 'Edge Node Status',
    sublabel: 'All systems operational',
    size: 'md',
    variant: 'default',
    showTimestamp: true,
    lastUpdate: new Date(Date.now() - 2 * 60000), // 2 minutes ago
  },
};
