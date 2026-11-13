// @ts-check
/**
 * Convenção de commit simplificada da Maestro.
 *
 * Obrigatório: "tipo: mensagem" (ex.: "feat: adiciona variante ghost").
 * Opcional:    escopo "feat(button): ...", breaking "feat!: ...", corpo e rodapé.
 * Não valida:  maiúscula no início da mensagem e ponto final.
 */

/** Tipos permitidos */
const TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
];

/** Níveis do commitlint: 0 = desligado, 1 = aviso (não bloqueia), 2 = erro (bloqueia) */
const ERROR = 2;

const WARNING = 1;

/** @type {import('@commitlint/types').UserConfig} */
const config = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
      breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
      issuePrefixes: ['#'],
    },
  },

  rules: {
    'type-empty': [ERROR, 'never'],
    'type-enum': [ERROR, 'always', TYPES],
    'type-case': [ERROR, 'always', 'lower-case'],
    'subject-empty': [ERROR, 'never'],
    'header-max-length': [WARNING, 'always', 100],
    'body-leading-blank': [WARNING, 'always'],
    'footer-leading-blank': [WARNING, 'always'],
  },

  helpUrl:
    'https://github.com/thiagosf-dev/bigbrain-maestro/tree/main/packages/config/husky#commit-convention',
};

export default config;
