import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))', '../libs/**/*.@(mdx|stories.@(js|jsx|ts|tsx))', '../stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-backgrounds'
  ],

  framework: {
    name: '@storybook/angular',
    options: {}
  },

  typescript: {
    check: false,
    checkOptions: {},
    // reactDocgen: 'react-docgen-typescript',
    // reactDocgenTypescriptOptions: {
    //   shouldExtractLiteralValuesFromEnum: true,
    //   propFilter: (prop: any) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    // },
  },

  docs: {
    // autodocs: 'tag',
    defaultName: 'Documentation',

    autodocs: true
  },

  staticDirs: ['../src/assets'],

  core: {
    disableTelemetry: true
  }
};

export default config;
