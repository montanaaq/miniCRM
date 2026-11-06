# Project conventions

## UI imports

- Import shared UI components from `@/shared/ui`. Keep `src/shared/ui/index.ts` updated when adding public components.
- Inside `src/shared/ui`, use direct relative imports between primitives to avoid circular dependencies through the barrel.

## Reactuse

- Use `@siberiacancode/reactuse` for common React state, browser, lifecycle and async behavior when a suitable hook simplifies the code.
- Apply the `reactuse` skill at `/Users/amir/.agents/skills/reactuse/SKILL.md` for React development. Check the skill before implementing custom hook logic.
- Read the relevant hook reference and inspect installed types and behavior before use. Skill references may be in `rules/` instead of `references/`. If the skill and installed package differ, follow the installed API and official documentation. Never guess signatures.
- Keep feature logic in colocated `useComponentName.ts` hooks. Group view-model results into `states`, `functions` and `forms`; consumers access members through those groups.
- Use TanStack Router file routes in `src/routes` and TanStack Query for server state. Prefer `useLockCallback` for simultaneous submission protection, and `useMount` for mount-only setup. Evaluate `useQuery` and `useMutation` for async flows; keep Supabase requests and response validation in the API layer.
- Use `useStep` for linear multi-step flows and `useWizard` for branching flows. Keep the current step in one source of truth with the draft.
- Name mutation objects with the `Mutation` suffix and call their methods through the object.
- Do not add speculative hooks or wrappers, and do not replace shadcn/Base UI behavior that already handles focus, dialogs or other interactions. Keep authorization and status transitions enforced by Supabase.
- Do not use the non-production Humor hooks `useFul`, `useLess` or `useOnce`.

## Routing and feature structure

- Keep navigation paths in `src/shared/constants/routes.const.ts`. File-route declaration strings belong to the TanStack generator; `ROUTES` is checked against its generated types.
- Restore the user in the root route `beforeLoad`, enforce roles in protected routes, and load server data with Query options in route loaders. Configure pending components and delays globally in `src/router.ts`.
- Keep `UserProvider` a context provider for the resolved user. Supabase Auth subscriptions belong to app lifecycle setup.
- Keep object and task management in their own components and hooks. Share mutation infrastructure and confirmation UI, rather than combining different entity state in a single page hook.
- Prefer readable `&&` branches in JSX over nested ternaries. Use Hugeicons for arrows and other icons, not Unicode symbols.
- Keep shared types, constants, UI, and CSS variables in `src/shared`. Reuse spacing, typography and layout tokens from `src/shared/styles/variables.css`; CSS media-query breakpoints must remain literals.
- Theme persistence and animation belong to `useTheme`, using Reactuse `useLocalStorage`; context consumers use `useThemeContext`.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
