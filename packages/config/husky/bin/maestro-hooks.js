#!/usr/bin/env node
// @ts-check
/**
 * CLI de git hooks da Maestro.
 *
 * Uso:
 *   maestro-hooks init               cria os hooks do Husky e o commitlint.config.js no projeto
 *   maestro-hooks pre-commit         roda o Biome nos arquivos em stage
 *   maestro-hooks commit-msg <arq>   valida a mensagem de commit com o commitlint
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

/** No Windows, binários do node_modules/.bin são .cmd e precisam de shell */
const USE_SHELL = process.platform === 'win32';

/** Conteúdo de cada hook do Husky (o Husky 9 já coloca node_modules/.bin no PATH) */
const HOOKS = /** @type {const} */ ({
  'pre-commit': 'maestro-hooks pre-commit\n',
  'commit-msg': 'maestro-hooks commit-msg "$1"\n',
});

const COMMITLINT_CONFIG = `export default { extends: ['@bigbrain-maestro/config-husky/commitlint'] };\n`;

/**
 * Executa um comando herdando o terminal e retorna o código de saída.
 * @param {string} command
 * @param {readonly string[]} args
 * @returns {number}
 */
function run(command, args) {
  const result = spawnSync(command, [...args], {
    stdio: 'inherit',
    shell: USE_SHELL,
  });
  if (result.error) {
    console.error(`[maestro-hooks] Falha ao executar "${command}": ${result.error.message}`);
    return 1;
  }
  return result.status ?? 1;
}

/**
 * Cria a pasta .husky com os hooks e o commitlint.config.js, sem sobrescrever o que já existe.
 * @param {string} cwd
 * @returns {number}
 */
function init(cwd) {
  const huskyDir = join(cwd, '.husky');
  mkdirSync(huskyDir, { recursive: true });

  for (const [name, content] of Object.entries(HOOKS)) {
    const file = join(huskyDir, name);
    if (existsSync(file)) {
      console.warn(`[maestro-hooks] .husky/${name} já existe, mantido sem alterações.`);
      continue;
    }
    writeFileSync(file, content, { mode: 0o755 });
    console.warn(`[maestro-hooks] .husky/${name} criado.`);
  }

  const commitlintFile = join(cwd, 'commitlint.config.js');
  if (existsSync(commitlintFile)) {
    console.warn('[maestro-hooks] commitlint.config.js já existe, mantido sem alterações.');
  } else {
    writeFileSync(commitlintFile, COMMITLINT_CONFIG);
    console.warn('[maestro-hooks] commitlint.config.js criado.');
  }

  console.warn(
    '[maestro-hooks] Garanta o script "prepare": "husky" no package.json e rode a instalação.',
  );
  return 0;
}

/**
 * Formata e corrige com o Biome apenas os arquivos em stage e os adiciona de volta ao stage.
 * @returns {number}
 */
function preCommit() {
  const status = run('biome', [
    'check',
    '--staged',
    '--write',
    '--no-errors-on-unmatched',
    '--files-ignore-unknown=true',
  ]);
  if (status !== 0) {
    return status;
  }
  // Reindexa os arquivos que já estavam em stage, incluindo as correções do Biome
  return run('git', ['update-index', '--again']);
}

/**
 * Valida a mensagem de commit com o commitlint.
 * @param {string | undefined} messageFile
 * @returns {number}
 */
function commitMsg(messageFile) {
  if (!messageFile) {
    console.error('[maestro-hooks] Uso: maestro-hooks commit-msg <arquivo-da-mensagem>');
    return 1;
  }
  return run('commitlint', ['--edit', messageFile]);
}

const [command, arg] = process.argv.slice(2);

/** @type {Record<string, () => number>} */
const commands = {
  init: () => init(process.cwd()),
  'pre-commit': preCommit,
  'commit-msg': () => commitMsg(arg),
};

const handler = command ? commands[command] : undefined;
if (!handler) {
  console.error('[maestro-hooks] Comandos: init | pre-commit | commit-msg <arquivo>');
  process.exit(1);
}
process.exit(handler());
