# AGENTS

## Project Structure
- `src/` – Core library source.
  - `api/` – HTTP utilities.
  - `hooks/` – React hooks for ClickHouse Cloud API. Tests live in `hooks/tests`.
  - `schemas/` – Zod schemas and accompanying tests.
  - `utils/` – Shared helpers for tests and examples.
  - `main.ts` – Library entry point.
- `doc/` – OpenAPI specification. The hooks located in `src/hooks` should follow this specification for the API calls.
- `example/` – Vite example app demonstrating library usage.
- `eslint.config.js`, `vite.config.ts`, `vitest.config.ts`, and `tsconfig*.json` configure linting, build, and tests.
- `README.md` – Project overview and usage.

## Coding Conventions
- TypeScript with ES modules.
- Follow ESLint rules from `eslint.config.js`.
- Two-space indentation, double quotes, and semicolons.
- Prefer named exports; React hooks must start with `use`.
- Use Yarn for dependency management.
- In the example app do not use inline CSS. Put all CSS into `example/src/App.css` if element is used in more than one page, or into the page-specific CSS files (create them if needed).

## Testing
- Unit tests use [Vitest](https://vitest.dev) and React Testing Library.
- Lint with `yarn lint`.
- Run tests with `yarn test` (`yarn test:watch` for watch mode).
- Build with `yarn build` to validate the library compiles.
- Ensure lint and tests pass before committing.

## PR Guidelines
- Write commit messages in the imperative mood.
- Every PR description must include:
  - **Summary** – what changed and why.
  - **Testing** – commands run and their outcomes.
- Run `yarn lint` and `yarn test` before opening a PR.
- Reference related issues when applicable.
