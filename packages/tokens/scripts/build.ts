/**
 * Build dos design tokens da Maestro.
 *
 * Entrada: tokens no formato W3C DTCG em src/ (primitivos + semânticos por tema).
 * Saída em dist/:
 *   tokens.css  variáveis CSS (:root = light, .dark / [data-theme="dark"] = dark)
 *   theme.css   bloco @theme do Tailwind v4 apontando para as variáveis
 *   tokens.json valores do tema light, aninhados (documentação)
 *   index.js    objeto "vars" com as referências var(--maestro-...) para uso em JS
 *   index.d.ts  tipos literais do objeto "vars"
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import Color from 'colorjs.io';
import StyleDictionary from 'style-dictionary';
import type { Config, Dictionary, PlatformConfig, TransformedToken } from 'style-dictionary/types';

const ROOT = join(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const TMP = join(DIST, '.tmp');
const PREFIX = 'maestro';
const PRIMITIVES = 'src/primitives/**/*.json';
const HEADER = 'Gerado por @bigbrain-maestro/tokens — não editar manualmente.';
const DARK_SELECTOR = '.dark, [data-theme="dark"]';
const DARK_VARIANT = '&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *)';

/** Árvore aninhada de strings (formato do objeto "vars") */
type VarTree = { [key: string]: string | VarTree };

/** Token vindo de src/semantic (cores que mudam por tema) */
const isSemantic = (token: TransformedToken): boolean =>
  token.filePath.replaceAll('\\', '/').includes('/semantic/');

/** Nome da variável CSS do token, ex.: --maestro-color-primary */
const cssVarName = (token: TransformedToken): string => `--${[PREFIX, ...token.path].join('-')}`;

/**
 * Nome do token no tema do Tailwind. Só são expostos ao Tailwind:
 * cores semânticas, raios e famílias de fonte (primitivos de cor ficam de fora de propósito).
 */
function tailwindName(token: TransformedToken): string | undefined {
  const [category, ...rest] = token.path;
  if (category === 'color' && isSemantic(token)) {
    return `--color-${rest.join('-')}`;
  }
  if (category === 'radius') {
    return `--radius-${rest.join('-')}`;
  }
  if (category === 'font' && rest[0] === 'family') {
    return `--font-${rest.slice(1).join('-')}`;
  }
  return undefined;
}

/** Monta a árvore { color: { primary: 'var(--maestro-color-primary)' } } */
function buildVarTree(tokens: readonly TransformedToken[]): VarTree {
  const tree: VarTree = {};
  for (const token of tokens) {
    let node: VarTree = tree;
    const path = [...token.path];
    const leaf = path.pop();
    if (leaf === undefined) {
      continue;
    }
    for (const key of path) {
      const next = node[key];
      if (typeof next === 'object') {
        node = next;
      } else {
        const child: VarTree = {};
        node[key] = child;
        node = child;
      }
    }
    node[leaf] = `var(${cssVarName(token)})`;
  }
  return tree;
}

/** Converte a árvore em tipo TypeScript literal e somente leitura */
function toTypeLiteral(tree: VarTree, indent = '  '): string {
  const lines = Object.entries(tree).map(([key, value]) => {
    const type =
      typeof value === 'string' ? JSON.stringify(value) : toTypeLiteral(value, `${indent}  `);
    return `${indent}readonly ${JSON.stringify(key)}: ${type};`;
  });
  return `{\n${lines.join('\n')}\n${indent.slice(2)}}`;
}

/** Arredonda para no máximo `digits` casas decimais */
const round = (value: number, digits: number): number => Number(value.toFixed(digits));

/**
 * Converte cores em hexadecimal (#rgb, #rrggbb, #rrggbbaa) para oklch().
 * Valores já em outro formato (oklch, rgb...) passam sem alteração.
 */
function hexToOklch(value: string): string {
  if (!value.startsWith('#')) {
    return value;
  }
  const color = new Color(value).to('oklch');
  const [lightness, chroma, hue] = color.coords;
  const l = round(lightness ?? 0, 3);
  const c = round(chroma ?? 0, 3);
  // Cores sem saturação (cinzas) não têm matiz definido
  const h = c === 0 || hue === null || Number.isNaN(hue) ? 0 : round(hue, 3);
  const alpha = color.alpha ?? 1;
  const alphaPart = alpha < 1 ? ` / ${round(alpha * 100, 1)}%` : '';
  return `oklch(${l} ${c} ${h}${alphaPart})`;
}

StyleDictionary.registerTransform({
  name: 'maestro/color/oklch',
  type: 'value',
  filter: (token: TransformedToken) => token.$type === 'color',
  transform: (token: TransformedToken) => hexToOklch(String(token.$value)),
});

StyleDictionary.registerFileHeader({ name: 'maestro/header', fileHeader: () => [HEADER] });

StyleDictionary.registerFormat({
  name: 'maestro/tailwind-theme',
  format: ({ dictionary }: { dictionary: Dictionary }) => {
    const lines = dictionary.allTokens.flatMap((token) => {
      const name = tailwindName(token);
      return name ? [`  ${name}: var(${cssVarName(token)});`] : [];
    });
    return [
      `/* ${HEADER} */`,
      '',
      '/* Variante dark: segue a classe .dark ou o atributo data-theme="dark" */',
      `@custom-variant dark (${DARK_VARIANT});`,
      '',
      '@theme inline {',
      ...lines,
      '}',
      '',
    ].join('\n');
  },
});

StyleDictionary.registerFormat({
  name: 'maestro/vars-js',
  format: ({ dictionary }: { dictionary: Dictionary }) =>
    `/* ${HEADER} */\nexport const vars = ${JSON.stringify(buildVarTree(dictionary.allTokens), null, 2)};\n`,
});

StyleDictionary.registerFormat({
  name: 'maestro/vars-dts',
  format: ({ dictionary }: { dictionary: Dictionary }) =>
    `/* ${HEADER} */\nexport declare const vars: ${toTypeLiteral(buildVarTree(dictionary.allTokens))};\n`,
});

/** Configuração comum às plataformas: nomes em kebab-case com prefixo maestro e cores em oklch */
const platformBase: Pick<PlatformConfig, 'transforms' | 'prefix'> = {
  transforms: ['name/kebab', 'maestro/color/oklch'],
  prefix: PREFIX,
};

/** Tema light: primitivos + semânticos light. Gera também os artefatos que não dependem de tema */
const light: Config = {
  source: [PRIMITIVES, 'src/semantic/light.json'],
  platforms: {
    css: {
      ...platformBase,
      buildPath: `${TMP}/`,
      files: [
        {
          destination: 'light.css',
          format: 'css/variables',
          options: { selector: ':root', outputReferences: true, fileHeader: 'maestro/header' },
        },
      ],
    },
    artifacts: {
      ...platformBase,
      buildPath: `${DIST}/`,
      files: [
        { destination: 'theme.css', format: 'maestro/tailwind-theme' },
        { destination: 'index.js', format: 'maestro/vars-js' },
        { destination: 'index.d.ts', format: 'maestro/vars-dts' },
        { destination: 'tokens.json', format: 'json/nested' },
      ],
    },
  },
};

/** Tema dark: só redefine os semânticos; os primitivos entram apenas para resolver referências */
const dark: Config = {
  include: [PRIMITIVES],
  source: ['src/semantic/dark.json'],
  // O aviso de "referências filtradas" é esperado: os primitivos já existem no :root
  log: { warnings: 'disabled' },
  platforms: {
    css: {
      ...platformBase,
      buildPath: `${TMP}/`,
      files: [
        {
          destination: 'dark.css',
          format: 'css/variables',
          filter: (token: TransformedToken) => token.isSource,
          options: {
            selector: DARK_SELECTOR,
            outputReferences: true,
            fileHeader: 'maestro/header',
          },
        },
      ],
    },
  },
};

rmSync(DIST, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

await new StyleDictionary(light).buildAllPlatforms();
await new StyleDictionary(dark).buildAllPlatforms();

// Junta light e dark num único tokens.css
const css = ['light.css', 'dark.css'].map((file) => readFileSync(join(TMP, file), 'utf8'));
writeFileSync(join(DIST, 'tokens.css'), css.join('\n'));
rmSync(TMP, { recursive: true, force: true });
