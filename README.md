# ui-sdk-glass

**ui-sdk-glass is Stephen Horton's fork of [Liquid Glass UI](https://github.com/bilalgursen/liquid-glass) by Bilal Gürşen.** The original kit, its engine, its components and its docs ([onemorethink.dev](https://onemorethink.dev)) are Bilal's work, released under the MIT license; this fork keeps that license and its copyright line (see `LICENSE`).

Glass components for React, drawn in WebGL2, with behaviour from [UI SDK](https://github.com/vercel-labs/ui). Each is named for the one thing it does: **press**, **merge**, **travel**, **flow**, **drag**, **hold**. Copy a file, get exactly what the demo shows.

## What this fork adds

- **The newest UI SDK beta.** `@ui-sdk/core` and `@ui-sdk/react` are pinned to `0.1.0-beta.17` (the original pins `0.1.0-beta.13`), the version used by the finance dashboard this fork is built for.
- **Components for a finance dashboard.** The fork exists to add the components a whole glass dashboard needs; they land here as they are built.

The docs site at onemorethink.dev and its `/r/…` registry belong to the original project and describe the original's files, not this fork's. The `liquid-glass` agent skill in this repo is the fork's: it copies the kit from here.

## Install

Copy `src/components/liquid-glass/` from this repo into your project as `components/liquid-glass/`. Requirements: React 19, Tailwind CSS v4, an `@/` alias. Components marked "Needs …" below also need those packages; for UI SDK use the exact versions this repo pins:

```sh
pnpm add @ui-sdk/core@0.1.0-beta.17 @ui-sdk/react@0.1.0-beta.17
pnpm add three   # only for RangeSlider, Switch and Checkbox
```

```tsx
import { GlassButton } from '@/components/liquid-glass'

<GlassButton>Get started</GlassButton>
<GlassButton material="tinted" className="bg-sky-500 text-white">Save</GlassButton>
<GlassButton asChild><Link href="/docs">Read the docs</Link></GlassButton>
```

## The set

One verb each. Nothing overlaps, so picking one takes a second.

| Verb | Component | What it does |
| --- | --- | --- |
| Press | `GlassButton` | Clear or tinted glass button that swells under the pointer. `asChild` puts it on your own `<Link>`. Needs `@ui-sdk/core` and `@ui-sdk/react`. |
| Merge | `GlassActionButton` | Async action button: its arrow is a separate droplet that melts into the body when pressed and stays merged through Deploying… → Deployed ✓. The kit's only gooey effect. |
| Travel | `GlassTabs` | Segmented control whose selection travels as a lens. Ships `GlassLens` for your own Radix Tabs. Needs `@ui-sdk/core` and `@ui-sdk/react`. |
| Flow | `GlassBadge` | One-word badge with its text flowing through the glass. |
| Drag | `GlassSlideToConfirm` | Slide-to-confirm track: drag the glass thumb to the end to run one deliberate action (Sending… → Sent ✓); let go early and it springs back. |
| Hold | `GlassCard` | A frosted glass card that holds your content while its rim bends what slides behind. `live` for moving backdrops. |
| Sort | `GlassTable` | Rows of data on one large sheet of glass: a header, a totals row, heads that sort when pressed, sideways scroll inside. |
| Share | `GlassButtonGroup` | Related actions in one body of glass, side by side or stacked, with separators and text. The whole body swells under the pointer. |
| Open | `GlassDropdownMenu` | Menu of actions that swells out of its button, or out of a whole `GlassButtonGroup`, as one body of glass. Needs `@ui-sdk/core` and `@ui-sdk/react`. |
| Unfold | `GlassPopover` | Small surface its button unfolds into, right where the button is. Needs `@ui-sdk/core` and `@ui-sdk/react`. |
| Grow | `GlassMenu` | Menu its button grows into, on any side, with submenus, checkbox and radio items, groups and shortcuts. Needs `@ui-sdk/core` and `@ui-sdk/react`. |
| Rise | `GlassToaster` | A short message on frosted glass after an action (Saved, Could not refresh): it rises, stays a moment and goes, and several gather into a stack. Plain and error forms, one action. Needs `@ui-sdk/core` and `@ui-sdk/react`. |
| Slide | `RangeSlider` | Range slider whose glass pill opens into a wide lens that bends the track while it is held. Needs `three`, `@ui-sdk/core` and `@ui-sdk/react`. |
| Flip | `Switch` | On/off switch whose knob swells into clear glass as it crosses the track. Needs `three`, `@ui-sdk/core` and `@ui-sdk/react`. |
| Tick | `Checkbox` | Checkbox under a cap of clear glass, at rest too. Needs `three`, `@ui-sdk/core` and `@ui-sdk/react`. |
| Stretch | `GlassSelect` | Select whose list swells out of its button as one body of glass, on a neck that stretches and snaps. Ships `GlassPopup` for your own menu or popover. Needs `@ui-sdk/core` and `@ui-sdk/react`. |
| Type | `GlassInput` | Text field of glass with a label above it: the page bends at its rim, the words stay sharp. `type="search"` adds a magnifier and a clear button. Same height and glass as `GlassSelect`'s button, for filter rows. Needs `@ui-sdk/core` and `@ui-sdk/react`. |
| Circle | `GlassDatePicker` | Date field to type into, whose calendar swells out of the whole field as one body of glass; the value is a plain `YYYY-MM-DD` date. Two side by side make a From and To pair. Needs `@ui-sdk/core` and `@ui-sdk/react`. |

No npm dependencies, except the components marked "Needs …". Every component has a page with live examples, the exact demo source, "use it for / not for" and props in this repo's docs site (`pnpm dev`); the original's pages are at onemorethink.dev.

## AI assistants

`pnpm build` writes `llms.txt` and `llms-full.txt` into `public/` for this repo's own docs. The `skills/liquid-glass/` skill tells agents which component to use, to copy `src/components/liquid-glass/` from this repo with UI SDK `0.1.0-beta.17`, and to copy files verbatim instead of re-implementing the glass.

## Develop

```sh
pnpm install
pnpm dev     # Vite dev server
pnpm build   # prerenders every page in English and Turkish, generates llms.txt, Markdown and the registry
```

See `AGENTS.md` for the repo layout and rules. Deploys to Cloudflare Pages (`.output/public`).

## License

MIT — see `LICENSE`. Copyright (c) 2026 Bilal Abdullah Gürşen, the original author; changes in this fork are released under the same license.
