// Matchers de DOM: toBeInTheDocument, toHaveAttribute, toBeDisabled...
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import { toHaveNoViolations } from './axe';

// Matcher de acessibilidade
expect.extend({ toHaveNoViolations });

// Desmonta o que foi renderizado ao fim de cada teste (sem globals, o Testing Library não faz sozinho)
afterEach(() => {
  cleanup();
});
