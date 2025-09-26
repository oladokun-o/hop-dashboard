import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
// import { themes } from '@storybook/theming';

// Import your global styles
import '../src/styles/main.scss';

// Import compodoc generated documentation (if available)
// import docJson from '../documentation.json';
// setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'bunny',
          value: '#f8fafc',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
        large: {
          name: 'Large Desktop',
          styles: {
            width: '1600px',
            height: '1000px',
          },
        },
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', left: '☀️' },
          { value: 'dark', title: 'Dark', left: '🌙' },
        ],
      },
    },
  },

  decorators: [
    (story, context) => {
      const theme = context.globals["theme"] || 'light';
      return {
        ...story(),
        moduleMetadata: {
          ...story().moduleMetadata,
        },
        template: `
          <div class="storybook-wrapper" data-theme="${theme}">
            <style>
              .storybook-wrapper {
                min-height: 100vh;
                padding: 2rem;
                background: ${theme === 'dark' ? '#0f172a' : '#ffffff'};
                color: ${theme === 'dark' ? '#f1f5f9' : '#1e293b'};
              }
              .storybook-wrapper[data-theme="dark"] {
                --hop-bg-primary: #0f172a;
                --hop-bg-secondary: #1e293b;
                --hop-text-primary: #f1f5f9;
                --hop-text-secondary: #94a3b8;
              }
            </style>
            ${story().template || '<ng-container></ng-container>'}
          </div>
        `,
      };
    },
  ],

  tags: ['autodocs'],
};

export default preview;
