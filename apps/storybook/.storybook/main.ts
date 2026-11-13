import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { defaultClientConditions, mergeConfig } from 'vite';

export const stories: StorybookConfig['stories'] = [
  '../src/**/*.mdx',
  '../src/**/*.stories.@(ts|tsx)',
  '../../../packages/react/src/**/*.mdx',
  '../../../packages/react/src/**/*.stories.@(ts|tsx)',
];

export const addons: StorybookConfig['addons'] = [
  '@storybook/addon-docs',
  '@storybook/addon-a11y',
  '@storybook/addon-themes',
];

export const framework: StorybookConfig['framework'] = '@storybook/react-vite';

export const core: StorybookConfig['core'] = { disableTelemetry: true };

export const viteFinal: StorybookConfig['viteFinal'] = (viteConfig) =>
  mergeConfig(viteConfig, {
    plugins: [tailwindcss()],
    resolve: { conditions: ['@bigbrain-maestro/source', ...defaultClientConditions] },
  });
