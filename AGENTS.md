# AGENTS.md

## Purpose

This repository publishes a tiny TypeScript utility, `promise-tuple`.
The package exposes one function that converts a promise into a Go-style
error/result tuple.

Agents working here should optimize for:

- preserving the tiny public API
- keeping runtime behavior minimal and dependency-free
- protecting TypeScript type precision
- keeping the package consumable from both ESM and CommonJS

## Repository Layout

- `index.ts`: library source and public API
- `index.test.ts`: Vitest coverage for runtime and type-oriented cases
- `README.md`: user-facing documentation and examples
- `tsup.config.ts` and `tsconfig.json`: build and compiler config
- `.github/workflows/publish.yml`: publish workflow

## Build Commands

- Install dependencies: `npm ci`
- Full build: `npm run build`
- Clean output directory only: `npm run clean`
- Publish validation path: `npm run prepublishOnly`

## Test Commands

- Run all tests: `npm test`
- Run Vitest directly: `npx vitest run`
- Run the single test file: `npx vitest run index.test.ts`
- Run a single test by name: `npx vitest run index.test.ts -t "Basic Success Case"`
- Run all tests matching a pattern: `npx vitest run -t "Return Type Validation"`

Preferred single-test command when iterating:

```bash
npx vitest run index.test.ts -t "test name here"
```

Notes:

- The repository currently has one test file, `index.test.ts`
- There is no dedicated watch script in `package.json`
- There is no dedicated lint script in `package.json`
- There is no dedicated typecheck script in `package.json`

## Linting And Formatting

There is no configured linter or formatter in this repository, so agents should:

- follow the existing file-local style instead of introducing a new style system
- avoid mass reformatting unrelated lines
- keep diffs narrow and intentional
- only normalize formatting in files they already touch for a good reason

## Current Code Style

The codebase uses a small, readable TypeScript style with strict compiler settings.
Match the dominant style of the file you edit and keep diffs narrow.

### Imports

- Prefer ESM syntax
- Keep imports minimal
- Use relative imports for local modules
- In tests, import Vitest helpers from `vitest`
- Do not add unused imports

### Formatting

- `index.ts` currently uses semicolons and 2-space indentation
- `index.test.ts` currently uses semicolons and 2-space indentation
- `tsup.config.ts` and `tsconfig.json` use a different spacing style; do not reformat
  them unless you are already making a meaningful change there
- Prefer one statement per line
- Wrap chained calls when it improves readability

### Types

- Preserve strict TypeScript compatibility
- Keep generic signatures explicit when they are part of the public API
- Favor precise return types over broad ones
- Do not weaken exported types without a strong reason
- Use `unknown` as a safe default when the API is intentionally generic
- Use narrow tuple unions when modeling success vs. failure states
- Evaluate any `promiseTuple` change for declaration output impact
- Update tests when changing generic behavior or tuple inference

### Naming

- Use `camelCase` for variables and functions
- Use `PascalCase` for interfaces and type-like constructs
- Keep names short but descriptive
- Test names use readable title case strings, which is the existing pattern

### Error Handling

- Do not throw from `promiseTuple`; preserve tuple-based error handling behavior
- Rejections should map to `[error, undefined]`
- Resolutions should map to `[undefined, result]`
- Keep callback side effects aligned with the correct branch only
- Maintain support for arbitrary rejection values, not just `Error` instances

### Tests

- Add or update tests for every behavioral change to the public API
- Cover both success and failure branches
- Prefer explicit assertions on tuple positions
- Preserve coverage for edge cases like `null`, `undefined`, primitives, objects,
  and custom error values
- When type behavior changes, add tests that prove the intended runtime shape and,
  where possible, preserve generic usage examples

### Documentation

- Update `README.md` when the public API, examples, or supported behavior changes
- Keep install and usage examples aligned with the shipped package
- Keep CommonJS and ESM examples accurate if build output changes

## Build And Release Expectations

The package is published from `main` via `.github/workflows/publish.yml`.
Current workflow behavior: trigger on pushes to `main`, run `npm ci`, then run `npm publish`.

Because the workflow publishes directly, agents should be conservative about:

- changing package entry points
- changing declaration output
- changing `package.json` export fields
- changing version numbers unless explicitly requested

## Repository-Specific Guidance For Agents

- Keep the package tiny; avoid introducing runtime dependencies
- Prefer small, targeted edits over broad refactors
- Preserve default export behavior unless explicitly changing the API
- Preserve dual-module packaging unless explicitly asked to redesign distribution
- Run at least the relevant Vitest command after code changes
- Prefer running a single targeted test first, then the full suite if the change
  affects public behavior broadly
- When modifying behavior, usually inspect `index.ts`, `index.test.ts`,
  `README.md`, and `package.json` together
- If build behavior changes, also inspect `tsup.config.ts` and `tsconfig.json`

## Environment Notes

- Package manager: npm
- Test runner: Vitest
- Bundler: tsup
- Consumer runtime target: Node.js >= 16
- CI publish environment: Node.js 24

## Cursor And Copilot Rules

Checked for repository-local agent instructions:

- `.cursorrules`: not present
- `.cursor/rules/`: not present
- `.github/copilot-instructions.md`: not present

There are currently no additional Cursor or GitHub Copilot instruction files in
this repository.

## Safe Default Workflow For Future Agents

1. Read `index.ts`, `index.test.ts`, and `package.json`
2. Make the smallest change that solves the task
3. Run a targeted Vitest command if possible
4. Run `npm test` if the change affects exported behavior
5. Update `README.md` if user-facing behavior changed
6. Avoid unrelated formatting churn
