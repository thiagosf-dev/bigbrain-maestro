import axeCore, { type AxeResults, type RunOptions } from 'axe-core';

/**
 * Regras desligadas por padrão nos testes unitários:
 * - color-contrast: o jsdom não calcula cores (o contraste é auditado no Storybook, em navegador real)
 * - region: componentes são testados isolados, fora de landmarks da página
 */
const DEFAULT_OPTIONS: RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
  },
};

/** Roda a auditoria de acessibilidade do axe-core sobre um elemento renderizado */
export async function axe(element: Element, options: RunOptions = {}): Promise<AxeResults> {
  return axeCore.run(element, {
    ...DEFAULT_OPTIONS,
    ...options,
    rules: { ...DEFAULT_OPTIONS.rules, ...options.rules },
  });
}

/** Matcher: expect(await axe(container)).toHaveNoViolations() */
export function toHaveNoViolations(results: AxeResults): { pass: boolean; message: () => string } {
  const { violations } = results;
  return {
    pass: violations.length === 0,
    message: () =>
      violations.length === 0
        ? 'Esperava violações de acessibilidade, mas nenhuma foi encontrada.'
        : `Violações de acessibilidade encontradas:\n\n${violations
            .map((v) => `• [${v.id}] ${v.help}\n  ${v.nodes.map((n) => n.html).join('\n  ')}`)
            .join('\n\n')}`,
  };
}
