import type { Meta, StoryObj } from '@storybook/angular';
import { HopButtonComponent } from '../lib/button/button.component';

const meta: Meta<HopButtonComponent> = {
  title: 'Components/Button',
  component: HopButtonComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible and accessible button component with multiple variants and states. Inspired by bunny.net\'s modern design principles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the button shows loading state',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button takes full width',
    },
    icon: {
      control: 'text',
      description: 'Icon to display (emoji or HTML)',
    },
    badge: {
      control: 'text',
      description: 'Badge text to display',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    isDisabled: false,
    isLoading: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<HopButtonComponent>;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<hop-button [variant]="variant" [size]="size" [isDisabled]="isDisabled" [isLoading]="isLoading" [fullWidth]="fullWidth" [icon]="icon" [badge]="badge">Hop Forward</hop-button>`,
  }),
};

export const Variants: Story = {
  name: 'All Variants',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <hop-button variant="primary">Primary</hop-button>
        <hop-button variant="secondary">Secondary</hop-button>
        <hop-button variant="outline">Outline</hop-button>
        <hop-button variant="ghost">Ghost</hop-button>
        <hop-button variant="danger">Danger</hop-button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  name: 'All Sizes',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <hop-button size="xs">Extra Small</hop-button>
        <hop-button size="sm">Small</hop-button>
        <hop-button size="md">Medium</hop-button>
        <hop-button size="lg">Large</hop-button>
        <hop-button size="xl">Extra Large</hop-button>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  name: 'With Icons',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <hop-button icon="🐇" variant="primary">Hop Now</hop-button>
        <hop-button icon="📊" variant="secondary">Analytics</hop-button>
        <hop-button icon="⚡" variant="outline">Fast Deploy</hop-button>
        <hop-button icon="🔄" variant="ghost">Refresh</hop-button>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  name: 'Icon Only',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <hop-button icon="🐇" variant="primary" size="sm"></hop-button>
        <hop-button icon="⚙️" variant="secondary"></hop-button>
        <hop-button icon="❤️" variant="outline" size="lg"></hop-button>
      </div>
    `,
  }),
};

export const WithBadges: Story = {
  name: 'With Badges',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <hop-button badge="New" variant="primary">Features</hop-button>
        <hop-button badge="3" variant="secondary">Notifications</hop-button>
        <hop-button badge="99+" variant="outline">Messages</hop-button>
      </div>
    `,
  }),
};

export const States: Story = {
  name: 'Button States',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <hop-button variant="primary">Normal</hop-button>
        <hop-button variant="primary" [isDisabled]="true">Disabled</hop-button>
        <hop-button variant="primary" [isLoading]="true">Loading</hop-button>
      </div>
    `,
  }),
};

export const FullWidth: Story = {
  name: 'Full Width',
  render: () => ({
    template: `
      <div style="width: 400px;">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <hop-button variant="primary" [fullWidth]="true">Full Width Primary</hop-button>
          <hop-button variant="secondary" [fullWidth]="true">Full Width Secondary</hop-button>
          <hop-button variant="outline" [fullWidth]="true">Full Width Outline</hop-button>
        </div>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  name: 'Interactive Demo',
  args: {
    variant: 'primary',
    size: 'md',
    icon: '🐇',
    isDisabled: false,
    isLoading: false,
    fullWidth: false,
    badge: '',
  },
  render: (args) => ({
    props: {
      ...args,
      onClick: () => alert('Button clicked! Ready to hop forward? 🐇'),
    },
    template: `
      <hop-button
        [variant]="variant"
        [size]="size"
        [isDisabled]="isDisabled"
        [isLoading]="isLoading"
        [fullWidth]="fullWidth"
        [icon]="icon"
        [badge]="badge"
        (click)="onClick()">
        Hop Dashboard Action
      </hop-button>
    `,
  }),
};

export const BunnyThemed: Story = {
  name: '🐇 Bunny.net Themed',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px;">
        <h3 style="margin: 0; color: #1e293b;">Hop Dashboard Controls</h3>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <hop-button icon="🐇" variant="primary">Deploy Edge</hop-button>
          <hop-button icon="📊" variant="secondary">Analytics</hop-button>
          <hop-button icon="⚡" variant="outline">CDN Status</hop-button>
          <hop-button icon="🌍" variant="ghost" badge="Live">Global Nodes</hop-button>
        </div>

        <div style="display: flex; gap: 8px;">
          <hop-button icon="🔄" size="sm" variant="outline">Auto Refresh</hop-button>
          <hop-button icon="⚙️" size="sm" variant="ghost">Settings</hop-button>
          <hop-button icon="📥" size="sm" variant="ghost">Export</hop-button>
        </div>
      </div>
    `,
  }),
};
