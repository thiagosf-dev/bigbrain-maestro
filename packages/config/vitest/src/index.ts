import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig, type ViteUserConfig } from 'vitest/config';

/** Caminho absoluto do setup, resolvido a partir deste arquivo */
const SETUP_FILE = fileURLToPath(new URL('./setup.ts', import.meta.url));

/** Arquivos fora da conta de coverage */
export const COVERAGE_EXCLUDE = [
  '**/*.test.{ts,tsx}',
  '**/*.stories.{ts,tsx}',
  // Model do MVVM: só tipagens, sem código executável
  '**/*.model.ts',
  // Barrels: só reexportam
  '**/index.ts',
  '**/*.d.ts',
];

/**
 * Configuração de testes da Maestro: jsdom, setup com matchers e coverage de 100% por arquivo.
 * Use com mergeConfig(viteConfig, defineMaestroTestConfig()) para herdar a resolução do Vite.
 */
export function defineMaestroTestConfig(overrides: ViteUserConfig = {}): ViteUserConfig {
  const base = defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: [SETUP_FILE],
      include: ['src/**/*.test.{ts,tsx}'],
      // Restaura mocks e spies entre os testes: um teste nunca vaza estado para outro
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: COVERAGE_EXCLUDE,
        reporter: ['text', 'html', 'lcov', 'json-summary'],
        reportsDirectory: 'coverage',
        // 100% em tudo, verificado arquivo por arquivo (a média geral não esconde arquivos fracos)
        thresholds: { lines: 100, branches: 100, functions: 100, statements: 100, perFile: true },
      },
    },
  });
  return mergeConfig(base, overrides);
}
