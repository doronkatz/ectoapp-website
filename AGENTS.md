# Repository Guidelines

## Project Structure & Module Organization
Source lives in `src/`, with route definitions under `src/pages`, shared UI in `src/components`, and layout shells in `src/layouts`. Global styling resides in `src/styles` (Tailwind layers plus any custom CSS), while design tokens, helpers, and types sit in `src/utils`, `src/utils.ts`, and `src/types.ts`. Public, static assets (favicons, OpenGraph images, fonts) belong in `public/` because Astro copies that directory verbatim to `dist/`. Any Netlify-specific logic (Edge Functions, request rewrites) must go in `netlify/edge-functions`, and content served via the Blob API should be co-located with the file that fetches it for easier auditing.

## Build, Test, and Development Commands
Run `npm install` once to hydrate dependencies. Use `npm run dev` for the Astro dev server on `localhost:4321`, which also hydrates React islands. `npm run build` emits an optimized site in `dist/` and validates Netlify adapters. `npm run preview` serves the built output for smoke tests. For targeted checks—linting markup, TS types, and config—run `npm run astro check`. When iterating on Edge Functions, `netlify dev` mirrors the production routing stack; point it at the repo root.

## Coding Style & Naming Conventions
Stick to TypeScript modules with ES imports, two-space indentation, and trailing commas for multi-line literals. Components and layouts use `PascalCase.tsx`; page endpoints follow Astro’s file-based routing (e.g., `src/pages/blog/[slug].astro`). Keep utility files in `camelCase`, and prefer Tailwind utility classes over bespoke CSS unless a style is reused across pages. Run `npm run astro check` before committing to catch syntax, accessibility, and markdown issues automatically flagged by Astro.

## Testing Guidelines
This starter does not ship with a formal test runner yet. Until we add one, cover regressions via `npm run astro check`, manual Netlify previews, and targeted validation of any functions you add under `netlify/edge-functions`. When you introduce automated tests, colocate them next to the feature (e.g., `src/utils/__tests__/slug.spec.ts`) and ensure they can run through `npm test` so CI can hook in later.

## Commit & Pull Request Guidelines
Follow the repo’s concise, imperative subject style (e.g., `Add hero CTA animation`). Commit early, but keep each change focused: code + docs + resources that belong together. Every PR should explain the problem, the approach, and how to verify it (commands run, screenshots for visual tweaks, or Netlify preview links). Reference related issues, note any config migrations or environment variables, and confirm `npm run build` succeeds before requesting review.
