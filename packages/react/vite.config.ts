import { globSync, readFileSync } from 'node:fs';
import { defaultClientConditions, defineConfig } from 'vite';

// Dependências e peerDependencies ficam fora do bundle: quem instala a lib as resolve
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const externals = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const isExternal = (id: string): boolean =>
  externals.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default defineConfig({
  // Condição customizada: dentro do monorepo, os subpath imports (#lib, #ui) apontam para src/
  resolve: { conditions: ['@bigbrain-maestro/source', ...defaultClientConditions] },
  build: {
    target: 'es2023',
    sourcemap: true,
    // Lib não é minificada: quem minifica é o bundler do app consumidor
    minify: false,
    lib: {
      // Uma entrada por componente: preserva os index.js usados nos imports por subpath
      entry: [
        'src/index.ts',
        ...globSync('src/components/**/index.ts').map((file) => file.replaceAll('\\', '/')),
      ],
      formats: ['es'],
    },
    rolldownOptions: {
      external: isExternal,
      output: {
        // Um arquivo de saída por arquivo-fonte: tree-shaking por componente
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // Componentes são Client Components (React Server Components / Next.js)
        banner: (chunk) => (chunk.name.startsWith('components/') ? "'use client';" : ''),
      },
    },
  },
});
