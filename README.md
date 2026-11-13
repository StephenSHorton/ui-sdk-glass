# Liquid Glass UI

**Docs:** https://liquid-glass-interface.pages.dev · [Türkçe](https://liquid-glass-interface.pages.dev/tr) · **For AI:** [llms.txt](https://liquid-glass-interface.pages.dev/llms.txt)

Liquid glass components for React, drawn by one WebGL2 shader: clear lenses that bend what is behind them, swell under the pointer and separate icons as gooey droplets. Copy a file, get exactly what the demo shows. MIT.

## Install

```sh
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/liquid-glass.json
```

or copy `src/components/liquid-glass/` into your project as `components/liquid-glass/`. Requirements: React 19, Tailwind CSS v4, an `@/` alias.

```tsx
import { ArrowRight } from 'lucide-react'
import { GlassButton } from '@/components/liquid-glass'

<GlassButton material="liquid" className="bg-orange-500 text-white" icon={<ArrowRight />}>
  Continue
</GlassButton>
```

## What is inside

| | Components | Dependencies |
| --- | --- | --- |
| **Liquid glass** | GlassButton, GlassTabs, GlassBadge, GlassLayer, GlassLens | none |
| **Canvas controls** | Button, Switch, Checkbox, RadioGroup, SegmentedControl, RangeSlider, Progress, TextField, Card, Icon, LiquidGlass, GlassCard | `three` (loaded lazily) |

Every component has its own page, live examples, props and install command in the docs.

## AI assistants

Ask your assistant to use Liquid Glass UI and point it at `llms.txt`, or install the skill:

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
