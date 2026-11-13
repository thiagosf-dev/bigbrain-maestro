# @bigbrain-maestro/react

React components for **Maestro**, BigBrain's design system — accessible, themeable (light/dark) and built on Tailwind CSS v4 and shadcn/ui.

> 🚧 Under construction. The first component (`Button`) ships in the next release.

## Install

```bash
pnpm add @bigbrain-maestro/react
```

Requires React 18.3+ or 19.

## Styles

### Option A — apps without Tailwind

Import the precompiled stylesheet once, at the root of your app:

```ts
import '@bigbrain-maestro/react/styles.css';
```

### Option B — apps with Tailwind CSS v4

Install the tokens and add Maestro to your Tailwind entry CSS:

```bash
pnpm add @bigbrain-maestro/tokens
```

```css
@import "tailwindcss";
@import "@bigbrain-maestro/tokens/tokens.css";
@import "@bigbrain-maestro/tokens/theme.css";
/* Path from this CSS file to node_modules */
@source "../node_modules/@bigbrain-maestro/react/dist";
```

## Dark mode

Add the `dark` class (or `data-theme="dark"`) to `<html>`.

## Utilities

```ts
import { cn } from '@bigbrain-maestro/react';

cn('px-2 py-1', isActive && 'bg-primary', 'px-4'); // → "py-1 bg-primary px-4"
```
