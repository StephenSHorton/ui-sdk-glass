# Liquid Glass UI — working on this repo

Open-source React liquid glass kit + its bilingual (EN/TR) docs site. MIT.
Agents that only *use* the kit in another project: read `skills/liquid-glass/SKILL.md` instead.

## Layout

| Path | What |
| --- | --- |
| `src/components/liquid-glass/` | Liquid components, zero dependencies: `engine.ts` (shared WebGL2 renderer + shader + springs), `dom-snapshot.ts`, `glass-layer.tsx`, `glass-lens.tsx`, `glass-button.tsx`, `glass-tabs.tsx`, `glass-badge.tsx`. Shipped to users verbatim. |
| `src/components/liquid-glass/controls/` | Canvas controls drawn by the three.js engine in `controls/glass/` (loaded lazily). Shipped verbatim. |
| `src/docs/content.ts` | **Single source of truth** for docs: pages (EN + TR), props tables, registry items. |
| `src/docs/demos/*.tsx` | Live examples. The code shown on a page is the file itself; write them as copy-ready user code importing from `@/components/...`. |
| `scripts/ai-files.ts` | Generates `llms.txt`, `llms-full.txt`, `/docs/*.md`, `/r/*.json` (shadcn registry) and `skills/liquid-glass/references/components.md` at build. |
| `src/site/`, `src/routes/` | Site chrome, i18n (`{-$locale}` route: `/` English, `/tr` Turkish), theme, head script. |
| `src/components/site/` | Landing sections (HowItWorks, layout SVGs). |

## Rules

- Files under `src/components/liquid-glass/` (including `controls/`) are copied into users' projects: only relative imports between them (the build fails on `#/` or `@/` there), no site code, keep `"use client"` on React files.
- Every user-facing string exists in English and Turkish (`src/site/ui.ts`, `src/docs/content.ts`, component `COPY` objects). Add both or neither.
- A new component = files + demo(s) + a page in `content.ts` + a registry entry. Nothing else to wire: routes, Markdown, llms files and registry are generated.
- Do not tune shader constants or spring values casually: they define the look and the docs promise copies match the demo.
- `pnpm build` must pass (prerenders every page in both languages and runs `scripts/verify-static-build.mjs`). Deploy: Cloudflare Pages, output `.output/public`.
- pnpm only. Generated: `src/routeTree.gen.ts`, `public/llms*.txt`, `public/docs`, `public/tr`, `public/r` (gitignored).

## Forge

The project also opens in Forge (`*.stories.json` next to components). Forge docs live in the `forge` MCP server: call `get_forge_docs` with topic `components`, `story-docs` or `site-meta` before Forge-specific work.
