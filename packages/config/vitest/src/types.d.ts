// Tipos dos matchers do jest-dom e do axe para o editor e o tsc
/// <reference types="@testing-library/jest-dom/vitest" />
import 'vitest';

declare module 'vitest' {
  interface Matchers<T = unknown> {
    toHaveNoViolations(): T;
  }
}
