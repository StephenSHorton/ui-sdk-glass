---
name: liquid-glass
description: Add liquid glass UI to a React app with Liquid Glass UI (bilalgursen/liquid-glass) — glass buttons with gooey icon droplets, sliding glass tabs, glass badges, clear glass that bends the page, plus canvas glass controls (switch, slider, segmented control). Use when the user asks for liquid glass, glassmorphism with real refraction, Apple-style glass, gooey/droplet buttons, or mentions Liquid Glass UI. Installs the real component files instead of re-implementing them.
---

# Liquid Glass UI

Copy-paste React components drawn by one WebGL2 glass shader. Docs: https://liquid-glass-interface.pages.dev — every page also exists as Markdown (`/docs/<page>.md`), and `https://liquid-glass-interface.pages.dev/llms-full.txt` holds everything.

## Non-negotiable rules

1. **Install, never re-implement.** Use the shadcn command below, or copy files from https://github.com/bilalgursen/liquid-glass/tree/main/src/components byte for byte. Do not write your own shader, port the engine to another library, "simplify" it, or translate identifiers. The look depends on exact constants.
2. **Do not edit files in `components/liquid-glass/` (canvas controls live in `components/liquid-glass/controls/`).** Customise only through documented props, `className` (`bg-*`, `text-*`, sizes, position) and the `--glass-tint` CSS variable.
3. **Copy the examples as they are.** The code in `references/components.md` is the exact source of each live demo.
4. Requirements: React 19, Tailwind CSS v4, an `@/` import alias to the source folder. Files already start with `"use client"`.

## Which component

| Need | Use | Install |
| --- | --- | --- |
| A button or link with a gooey icon droplet | `GlassButton` (`material`: `clear` \| `tinted` \| `liquid`) | `npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/glass-button.json` |
| Make an existing element glass (Next.js `<Link>`, shadcn `<Button>`) | `GlassLayer` as first child + `data-glass-host` on the element | `…/r/glass-layer.json` |
| Tabs / segmented control with a sliding glass lens | `GlassTabs` | `…/r/glass-tabs.json` |
| Sliding lens for your own Radix Tabs / radio group | `GlassLens` | `…/r/glass-lens.json` |
| "New" badge with flowing text | `GlassBadge` | `…/r/glass-badge.json` |
| All of the above | — | `…/r/liquid-glass.json` |
| Canvas controls: Switch, RangeSlider, SegmentedControl, Checkbox, RadioGroup, Progress, TextField, Button | `@/components/liquid-glass/controls/<Name>` (needs `three`) | `…/r/<kebab-name>.json` |

`…` = `npx shadcn@latest add https://liquid-glass-interface.pages.dev`. Prefer the liquid components (zero dependencies, wrap your own DOM). Use canvas controls only when the user wants those specific glass controls.

## Essentials

```tsx
import { ArrowRight } from 'lucide-react'
import { GlassButton, GlassTabs } from '@/components/liquid-glass'

// Colour comes from the button's own background class.
<GlassButton material="liquid" className="bg-orange-500 text-white" icon={<ArrowRight />}>Continue</GlassButton>

// Clear glass bends whatever is behind it.
<GlassButton icon={<ArrowRight />}>Get started</GlassButton>

<GlassTabs aria-label="Range" value={v} onValueChange={setV}
  options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }]} />
```

- The droplet icon must render an `<svg>` and be the first or last child. It separates on hover (mouse); `droplet="always"` also on touch.
- Without WebGL2 or before the first frame, components show their plain CSS look. Reduced motion freezes the glass. Do not add your own fallbacks.
- Dark mode: liquid glass reads colours from CSS (any theme system works). Canvas controls follow `data-theme="dark"` or `class="dark"` on `<html>`.

## Reference

- `references/components.md` — every component page: live example source, props table.
- Turkish docs: https://liquid-glass-interface.pages.dev/tr/docs
