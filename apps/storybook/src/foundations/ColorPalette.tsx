import { vars } from '@bigbrain-maestro/tokens';

type Swatch = { name: string; value: string };

/** Cores semânticas: entradas de vars.color que são valores diretos (primary, border...) */
const semantic: Swatch[] = Object.entries(vars.color).flatMap(([name, value]) =>
  typeof value === 'string' ? [{ name, value }] : [],
);

/** Cores primitivas: entradas de vars.color que são grupos (neutral, red...) */
const primitives: Swatch[] = Object.entries(vars.color).flatMap(([group, value]) =>
  typeof value === 'string'
    ? []
    : Object.entries(value).map(([step, v]) => ({ name: `${group}-${step}`, value: v })),
);

/** Paleta de cores dos tokens (componente de documentação, não faz parte da lib) */
export function ColorPalette({ kind }: { kind: 'semantic' | 'primitive' }) {
  const swatches = kind === 'semantic' ? semantic : primitives;
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {swatches.map(({ name, value }) => (
        <li key={name} className="flex flex-col gap-2">
          <span className="border-border h-16 rounded-md border" style={{ background: value }} />
          <code className="text-sm">{name}</code>
          <code className="text-muted-foreground text-xs">{value}</code>
        </li>
      ))}
    </ul>
  );
}
