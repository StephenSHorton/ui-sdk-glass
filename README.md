# Liquid Glass UI

**Docs:** https://liquid-glass-interface.pages.dev · [Türkçe](https://liquid-glass-interface.pages.dev/tr) · **For AI:** [llms.txt](https://liquid-glass-interface.pages.dev/llms.txt)

Glass components for React, drawn by one zero-dependency WebGL2 shader. Each is named for the one thing it does: **press**, **merge**, **travel**, **flow**, **drag**, **hold**. Copy a file, get exactly what the demo shows. MIT.

## Install

```sh
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/liquid-glass.json
```

or copy `src/components/liquid-glass/` into your project as `components/liquid-glass/`. Requirements: React 19, Tailwind CSS v4, an `@/` alias.

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
| Press | `GlassButton` | Clear or tinted glass button that swells under the pointer. `asChild` puts it on your own `<Link>`. |
| Merge | `GlassActionButton` | Async action button: its arrow is a separate droplet that melts into the body when pressed and stays merged through Deploying… → Deployed ✓. The kit's only gooey effect. |
| Travel | `GlassTabs` | Segmented control whose selection travels as a lens. Ships `GlassLens` for your own Radix Tabs. |
| Flow | `GlassBadge` | One-word badge with its text flowing through the glass. |
| Drag | `GlassSlideToConfirm` | Slide-to-confirm track: drag the glass thumb to the end to run one deliberate action (Sending… → Sent ✓); let go early and it springs back. |
| Hold | `GlassCard` | A frosted glass card that holds your content while its rim bends what slides behind. `live` for moving backdrops. |
| Slide | `RangeSlider` | Range slider whose glass pill opens into a wide lens that bends the track while it is held. Needs `three`. |
| Flip | `Switch` | On/off switch whose knob swells into clear glass as it crosses the track. Needs `three`. |
| Tick | `Checkbox` | Checkbox under a cap of clear glass, at rest too. Needs `three`. |
| Stretch | `GlassSelect` | Select whose list swells out of its button as one body of glass, on a neck that stretches and snaps. Ships `GlassPopup` for your own menu or popover. Needs `@ui-sdk/core` and `@ui-sdk/react`. |

No npm dependencies, except the components marked "Needs …". Every component has its own docs page with live examples, the exact demo source, "use it for / not for", props and an install command.

## AI assistants

Point your assistant at `llms.txt`, or install the skill:

```sh
npx skills add bilalgursen/liquid-glass
```

The skill (`skills/liquid-glass/`) tells agents which component to use, how to install it, and to copy files verbatim instead of re-implementing the glass.

## Develop

```sh
pnpm install
pnpm dev     # Vite dev server
pnpm build   # prerenders every page in English and Turkish, generates llms.txt, Markdown and the registry
```

See `AGENTS.md` for the repo layout and rules. Deploys to Cloudflare Pages (`.output/public`).

## License

MIT — see `LICENSE`.
