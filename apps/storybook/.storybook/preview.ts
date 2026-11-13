import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

export const decorators: Preview['decorators'] = [
  withThemeByClassName({ themes: { Claro: '', Escuro: 'dark' }, defaultTheme: 'Claro' }),
];

export const parameters: Preview['parameters'] = {
  backgrounds: { disable: true },
  a11y: { test: 'error' },
  controls: { matchers: { color: /(background|color)$/i } },
  options: { storySort: { order: ['Introdução', 'Fundamentos', 'UI', 'Componentes'] } },
};
