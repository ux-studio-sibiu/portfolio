# web-portfolio

Personal portfolio site — Next.js (App Router) + TypeScript + SCSS + GSAP.

```bash
npm run dev
```

## Structure

- `app/layout.tsx` — root layout, fonts (`next/font`), global styles
- `app/page.tsx` — home page
- `app/components/<name>/<name>.tsx` + `.scss` — one folder per component
- `app/styles/` — `globals.scss`, `_breakpoints.scss`, `_modern-normalize.scss`

## Conventions

Follows the workspace style guide: `nsc-` prefix on component roots only, plain
variant classes and `is-` state classes (no BEM `__` / `--`), colour tokens via
`--color-*` custom properties, and the `respond-to` / `respond-to-max` mixins for
breakpoints.

GSAP animations run through `useGSAP` from `@gsap/react`, scoped to a component
ref, and bail out under `prefers-reduced-motion`.
