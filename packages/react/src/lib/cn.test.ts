import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('junta classes', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('ignora valores falsos', () => {
    expect(cn('px-2', false, null, undefined, 0, '', 'py-1')).toBe('px-2 py-1');
  });

  it('resolve conflitos do tailwind mantendo a última', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
