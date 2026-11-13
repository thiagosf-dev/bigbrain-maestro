import { defineMaestroTestConfig } from '@bigbrain-maestro/config-vitest';
import { mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

// Herda do vite.config a resolução dos subpath imports (#lib, #ui) e aplica o preset de testes
export default mergeConfig(viteConfig, defineMaestroTestConfig());
