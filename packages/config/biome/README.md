# @bigbrain-maestro/config-biome

Shared [Biome](https://biomejs.dev) configuration (lint + format) for **Maestro**, BigBrain's design system.

## Install

```bash
pnpm add -D @biomejs/biome @bigbrain-maestro/config-biome
```

## Usage

Create a `biome.jsonc` at the project root:

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "root": true,
  // React + Tailwind projects
  "extends": ["@bigbrain-maestro/config-biome/react"]
  // Plain TypeScript projects: "@bigbrain-maestro/config-biome/base"
}
```

## Presets

| Preset  | Includes                                                                     |
| ------- | ---------------------------------------------------------------------------- |
| `base`  | Formatting, import sorting, recommended rules, strict TypeScript style       |
| `react` | `base` + React hooks rules, accessibility (a11y), Tailwind CSS class sorting |
