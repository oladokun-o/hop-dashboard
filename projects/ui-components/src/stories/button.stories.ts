import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
// import { Procedure } from 'storybook-addon-playwright';
import { HopButtonComponent } from '../lib/button/button.component';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HopButtonComponent> = {
  title: 'Example/Button',
  component: HopButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
    icon: { control: 'text' },
    badge: { control: 'text' },
    ariaLabel: { control: 'text' },
    fullWidth: { control: 'boolean' },
    disabledState: { control: 'boolean' },
    click: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<HopButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    type: 'button',
    icon: '',
    badge: '',
    ariaLabel: 'Primary Button',
    fullWidth: false,
    disabledState: false,
  },
  play: async ({ args, canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.addEventListener('click', () => {
        // fn(Procedure.CLICK)();
      });
    }
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
    ariaLabel: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    ...Primary.args,
    variant: 'outline',
    ariaLabel: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    ...Primary.args,
    variant: 'ghost',
    ariaLabel: 'Ghost Button',
  },
};

export const Danger: Story = {
  args: {
    ...Primary.args,
    variant: 'danger',
    ariaLabel: 'Danger Button',
  },
};

export const WithIcon: Story = {
  args: {
    ...Primary.args,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>',
    ariaLabel: 'Button with Icon',
  },
};

export const Loading: Story = {
  args: {
    ...Primary.args,
    disabledState: true,
    ariaLabel: 'Loading Button',
  },
};

export const FullWidth: Story = {
  args: {
    ...Primary.args,
    fullWidth: true,
    ariaLabel: 'Full Width Button',
  },
};

export const Small: Story = {
  args: {
    ...Primary.args,
    size: 'sm',
    ariaLabel: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    ...Primary.args,
    size: 'lg',
    ariaLabel: 'Large Button',
  },
};

export const ExtraLarge: Story = {
  args: {
    ...Primary.args,
    size: 'xl',
    ariaLabel: 'Extra Large Button',
  },
};

export const ExtraSmall: Story = {
  args: {
    ...Primary.args,
    size: 'xs',
    ariaLabel: 'Extra Small Button',
  },
};