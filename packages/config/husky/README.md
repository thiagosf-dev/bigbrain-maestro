# @bigbrain-maestro/config-husky

Git hooks for **Maestro**, BigBrain's design system: [Husky](https://typicode.github.io/husky/) + [commitlint](https://commitlint.js.org/) + [Biome](https://biomejs.dev).

- **pre-commit:** runs `biome check --write` on staged files only.
- **commit-msg:** validates the message against the commit convention below.

## Install

```bash
pnpm add -D husky @commitlint/cli @biomejs/biome @bigbrain-maestro/config-husky
```

Add the `prepare` script to your `package.json`:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

Then:

```bash
pnpm install
pnpm exec maestro-hooks init
```

`init` creates `.husky/pre-commit`, `.husky/commit-msg` and `commitlint.config.js` (existing files are never overwritten).

## Commit convention

Required format: **`type: message`**

```bash
git commit -m "feat: add ghost variant"
```

| Rule                                                                                                                                  | Level       |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Type is required, lower-case, and one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert` | Error       |
| `:` (colon + space) after the type, followed by a non-empty message                                                                   | Error       |
| Scope `feat(button): ...`, breaking marker `feat!: ...`, body and footer                                                              | Optional    |
| Message case and trailing period                                                                                                      | Not checked |
| Header longer than 100 characters, missing blank line before body/footer                                                              | Warning     |

To extend the convention in your own `commitlint.config.js`:

```js
export default { extends: ['@bigbrain-maestro/config-husky/commitlint'] };
```
