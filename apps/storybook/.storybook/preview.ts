import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

const preview: Preview = {
  decorators: [
    // Seletor de tema na barra: aplica (ou remove) a classe .dark no <html>
    withThemeByClassName({ themes: { Claro: '', Escuro: 'dark' }, defaultTheme: 'Claro' }),
  ],
  parameters: {
    // O fundo vem do tema (tokens), não do seletor de fundo do Storybook
    backgrounds: { disable: true },
    // Violação de acessibilidade aparece como erro, não como aviso
    a11y: { test: 'error' },
    controls: { matchers: { color: /(background|color)$/i } },
    // Ordem da sidebar (seção 11.3 do documento de arquitetura)
    options: { storySort: { order: ['Introdução', 'Fundamentos', 'UI', 'Componentes'] } },
  },
};

export default preview;
