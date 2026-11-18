---
name: liquid-glass
description: Add liquid glass UI to a React app with Liquid Glass UI (bilalgursen/liquid-glass) — zero-dependency components, one verb each: glass buttons (press), async action buttons whose arrow droplet melts into the body when pressed (merge), tabs whose selection travels as a lens (travel), badges with text flowing through the glass (flow), slide-to-confirm tracks with a glass thumb (drag), glass cards that hold content over moving colour (hold), range sliders (slide), on/off switches (flip) and checkboxes (tick). Use when the user asks for liquid glass, glassmorphism with real refraction, Apple-style glass, glass cards or widgets, glass sliders, switches / toggles or checkboxes, gooey/droplet buttons, slide to confirm / slide to pay / slide to unlock, or mentions Liquid Glass UI. Installs the real component files instead of re-implementing them.
---

# Liquid Glass UI

Copy-paste React components drawn by one zero-dependency WebGL2 glass shader, one verb each. Docs: https://liquid-glass-interface.pages.dev — every page also exists as Markdown (`/docs/<page>.md`), and `https://liquid-glass-interface.pages.dev/llms-full.txt` holds everything.

## Non-negotiable rules

1. **Install, never re-implement.** Use the shadcn command below, or copy files from https://github.com/bilalgursen/liquid-glass/tree/main/src/components byte for byte. Do not write your own shader, port the engine to another library, "simplify" it, or translate identifiers. The look depends on exact constants.
2. **Do not edit files in `components/liquid-glass/`.** Customise only through documented props, `className` (`bg-*`, `text-*`, sizes, position) and the `--glass-tint` CSS variable.
3. **Copy the examples as they are.** The code in `references/components.md` is the exact source of each live demo.
4. Requirements: React 19, Tailwind CSS v4, an `@/` import alias to the source folder. Files already start with `"use client"`.

## Which component

Pick by the verb. They never overlap.

| Verb | Need | Use | Install |
| --- | --- | --- | --- |
| Press | One glass button, or a router link styled as one | `GlassButton` (`material`: `clear` \| `tinted`; `asChild` for `<Link>`) | `…/r/button.json` |
| Merge | One async action whose result shows on the button (Deploy → Deploying… → Deployed ✓) | `GlassActionButton` — the only gooey droplet in the kit | `…/r/action-button.json` |
| Travel | Tabs / segmented control with a sliding glass lens | `GlassTabs`; for your own Radix Tabs or radio group, `GlassLens` (ships with it) | `…/r/tabs.json` |
| Flow | A one-word "New" badge with text flowing through glass | `GlassBadge` | `…/r/badge.json` |
| Drag | A deliberate action a stray tap must not trigger (Slide to send $240 → Sending… → Sent ✓) | `GlassSlideToConfirm` (`fillClassName` colours the fill) | `…/r/slide-to-confirm.json` |
| Hold | A small card of content over colour, imagery or motion (a weather widget, a now-playing card) | `GlassCard` (frosted: `blur` 3.5 px, `tint` 0.68 light / 0.79 dark; `live` when something moves behind it) | `…/r/card.json` |
| Slide | Picking a value on a range (volume, brightness) | `RangeSlider` from `controls/RangeSlider` (`value`, `onChange`, `min`, `max`, `step`, `label`; needs `three`) | `…/r/slider.json` |
| Flip | An on/off setting that takes effect at once | `Switch` from `controls/Switch` (`checked`, `onChange`, `label`; needs `three`) | `…/r/switch.json` |
| Tick | Choosing items in a list or a form | `Checkbox` from `controls/Checkbox` (`checked`, `onChange`, `label`; needs `three`) | `…/r/checkbox.json` |
| — | All of them | — | `…/r/liquid-glass.json` |

`…` = `npx shadcn@latest add https://liquid-glass-interface.pages.dev`. Everything has zero npm dependencies (except `RangeSlider`, `Switch` and `Checkbox`, which need `three`) and wraps your own DOM.

## Essentials

```tsx
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { GlassActionButton, GlassButton, GlassTabs } from '@/components/liquid-glass'

// Clear glass bends whatever is behind it; tinted glass takes the background class.
<GlassButton icon={<ArrowRight />}>Get started</GlassButton>
<GlassButton material="tinted" className="bg-orange-500 text-white">Continue</GlassButton>

// The glass on your own element (keeps its navigation).
<GlassButton asChild><Link href="/docs">Read the docs</Link></GlassButton>

// The arrow floats apart as a droplet; pressed, it melts in and stays merged.
<GlassActionButton material="tinted" className="bg-neutral-900 text-white"
  pendingLabel="Deploying" successLabel="Deployed" onAction={deploy}>
  Deploy
</GlassActionButton>

<GlassTabs aria-label="Range" value={v} onValueChange={setV}
  options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }]} />
```

- `GlassSlideToConfirm` takes its instruction as `children` (a string) and fills its container: `<GlassSlideToConfirm pendingLabel="Sending" successLabel="Sent" onConfirm={send}>Slide to send $240</GlassSlideToConfirm>`. Return the real promise from `onConfirm`; a rejection springs the thumb back and shows `errorLabel`.
- The gooey droplet lives only in `GlassActionButton`. Return the real promise from `onAction`; use `resetAfter` (ms) if it should split off again after success. At most one per screen.
- Without WebGL2 or before the first frame, components show their plain CSS look. Reduced motion freezes the glass. Do not add your own fallbacks.
- Dark mode: the glass reads colours from CSS (any theme system works); clear glass picks its text colour from its own tone.

## Reference

- `references/components.md` — every component page: live example source, props table.
- Turkish docs: https://liquid-glass-interface.pages.dev/tr/docs
