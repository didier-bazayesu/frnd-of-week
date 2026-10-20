# Project Coding Rules

## 1. Code Quality and Reusability
- Write clean, readable, maintainable, and strictly typed TypeScript.
- Follow SOLID principles where appropriate and keep components focused on a single responsibility.
- Reuse existing components, hooks, utilities, and services before creating new ones.
- Avoid duplicated code (DRY principle).
- Extract reusable logic into custom hooks or utility functions when appropriate.
- Avoid unnecessary abstractions, overengineering, and oversized components.
- Use meaningful, descriptive names for variables, functions, components, and files.
- Avoid `any`; prefer explicit types, interfaces, and safe type guards.
- Keep business logic separate from UI components.
- Remove unused imports, dead code, unnecessary comments, and debugging statements.

## 2. Sensitive Data and Environment Variables
- Never hardcode secrets, passwords, API keys, access tokens, private credentials, or sensitive configuration in application code.
- Store sensitive configuration in environment variables and provide an `.env.example` containing placeholders only.
- Never commit `.env` files, credentials, private keys, or other sensitive data.
- Ensure `.gitignore` excludes environment files, build outputs, dependencies, and other generated or private files.
- Never expose private environment variables in frontend code. Variables prefixed with `VITE_` are publicly accessible in the browser and must never contain secrets.
- Validate environment variables and fail clearly when required configuration is missing.
- Do not log passwords, tokens, personal information, or other sensitive data.
- Treat participant phone numbers and other personal information as confidential.
- Never assume frontend validation, hidden UI elements, or localStorage provide secure authentication or authorization.

## 3. React and TypeScript
- Use functional components and React hooks.
- Define explicit types for component props, function parameters, and return values when needed.
- Use stable keys when rendering lists.
- Avoid unnecessary re-renders and effects.
- Clean up subscriptions, event listeners, and other resources when necessary.
- Handle loading, success, empty, and error states.
- Use semantic HTML and accessible form labels.
- Keep components responsive and consistent with the existing design system.
- Follow the existing project architecture and dependency conventions.

## 4. Testing and Validation
- Inspect the project and existing tests before making changes.
- After every logical code change, run relevant tests.
- Before committing, run all available required checks, including:
  - Automated tests
  - TypeScript type checking
  - Linting
  - Production build
- Add or update tests when implementing features or fixing bugs.
- Fix failures introduced by the changes before committing.
- Never claim that a check passed unless it was actually executed successfully.
- If required checks cannot run or fail, explain the issue and do not commit until it is resolved.

## 5. Git and Commit Style
Always use Conventional Commits.

Format:

`<type>: <short description>`

Allowed commit types:

- `feat`: Add a new feature.
- `fix`: Fix a bug.
- `docs`: Update documentation.
- `style`: Change formatting or visual styling without changing functionality.
- `refactor`: Improve code structure without changing behavior.
- `test`: Add or update tests.
- `chore`: Perform maintenance tasks or update dependencies.
- `perf`: Improve performance.
- `build`: Change build tools or configuration.
- `ci`: Update CI/CD workflows.
- `revert`: Revert a previous commit.

Examples:

- `feat: add weekly friend matching`
- `fix: validate participant phone numbers`
- `docs: document local development setup`
- `style: improve friend reveal page`
- `refactor: extract matching utilities`
- `test: cover reciprocal matching`
- `chore: update dependencies`
- `perf: optimize participant lookup`
- `build: configure production build`
- `ci: add automated test workflow`

Commit rules:
- Use lowercase types and concise descriptions.
- Start descriptions with an imperative verb where possible.
- Do not end descriptions with a period.
- Make each commit represent one logical change.
- Avoid vague messages such as `update`, `changes`, or `fixes`.
- Inspect `git diff` before committing.
- Stage only files relevant to the current task.
- Never commit secrets, generated files that should be ignored, or unrelated user changes.
- Never bypass hooks or required checks.
- Never force-push or perform destructive Git operations without explicit authorization.
- Do not push changes unless explicitly requested.

## 6. Automatic Commit Workflow
For every coding task, follow this workflow:

**Inspect → Implement → Test → Fix → Validate → Review → Commit → Report**

After all required checks pass:
1. Review the Git status and final diff.
2. Verify that no secrets or unrelated changes are staged.
3. Stage only the relevant files.
4. Create a Conventional Commit with an appropriate type.
5. Verify that the commit succeeded.
6. Report the changes, checks performed, and commit hash.

If validation fails, sensitive information is detected, or unrelated changes cannot be safely separated, do not commit. Explain the blocker instead.

## 7. General Principles
- Prefer simple, reusable solutions over unnecessary complexity.
- Preserve existing functionality unless a change is explicitly required.
- Follow established naming conventions, folder structure, and coding patterns.
- Avoid introducing dependencies without a clear need.
- Do not silently remove existing features or weaken validation to make tests pass.
- Update documentation when behavior, configuration, or setup instructions change.
- Make only changes necessary to complete the requested task.

**Golden rule:** Every change must be maintainable, reusable where appropriate, secure by design, tested, reviewed, and committed using Conventional Commit conventions.
