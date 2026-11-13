# @bigbrain-maestro/tokens

Design tokens for **Maestro**, BigBrain's design system: CSS variables with light/dark themes, a Tailwind CSS v4 theme and typed JS references.

## Install

```bash
pnpm add @bigbrain-maestro/tokens
```

## Usage

### With Tailwind CSS v4

```css
@import "tailwindcss";
@import "@bigbrain-maestro/tokens/tokens.css";
@import "@bigbrain-maestro/tokens/theme.css";
```

Utilities such as `bg-primary`, `text-muted-foreground`, `border-border`, `ring-ring` and `rounded-md` now use Maestro tokens.

### Without Tailwind

```css
@import "@bigbrain-maestro/tokens/tokens.css";

.card {
  background: var(--maestro-color-background);
  color: var(--maestro-color-foreground);
  border-radius: var(--maestro-radius-lg);
}
```

### In JavaScript

```ts
import { vars } from '@bigbrain-maestro/tokens';

vars.color.primary; // "var(--maestro-color-primary)"
```

## Dark mode

Add the `dark` class (or `data-theme="dark"`) to `<html>`. Semantic tokens switch automatically — no `dark:` utilities needed.

## Exports

| Path                                   | Content                                                |
| -------------------------------------- | ------------------------------------------------------ |
| `@bigbrain-maestro/tokens/tokens.css`  | CSS variables (`:root` = light, `.dark` = dark)        |
| `@bigbrain-maestro/tokens/theme.css`   | Tailwind CSS v4 `@theme` + `dark` variant              |
| `@bigbrain-maestro/tokens`             | `vars` object with typed `var(--maestro-*)` references |
| `@bigbrain-maestro/tokens/tokens.json` | Light theme values (nested)                            |
