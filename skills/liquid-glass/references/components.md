<!-- Generated from src/docs/content.ts by scripts/ai-files.ts. Do not edit by hand. -->

# GlassButton

> A button or link made of liquid glass, with a gooey icon droplet.

```tsx
import { ArrowRight } from 'lucide-react'

import { GlassButton } from '@/components/liquid-glass'

// Clear glass bends whatever is behind it: here, a few coloured stripes.
export default function Demo() {
  return (
    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl">
      <div aria-hidden className="absolute inset-0 flex flex-col">
        {['bg-rose-400', 'bg-amber-300', 'bg-emerald-400', 'bg-sky-400', 'bg-violet-400'].map((c) => (
          <div key={c} className={`flex-1 ${c}`} />
        ))}
      </div>
      <GlassButton size="lg" icon={<ArrowRight />}>
        Get started
      </GlassButton>
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/glass-button.json
```

## Materials

`clear` bends the page behind it. `tinted` is glass painted in the button's own background colour. `liquid` is that colour with no light at all: only the liquid shape. Colour tinted and liquid buttons with a normal class such as `bg-orange-500`.

```tsx
import { GlassButton } from '@/components/liquid-glass'

// Tinted and liquid glass take their colour from the button's own background class.
export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <GlassButton>Clear</GlassButton>
      <GlassButton material="tinted" className="bg-sky-500 text-white">
        Tinted
      </GlassButton>
      <GlassButton material="liquid" className="bg-orange-500 text-white">
        Liquid
      </GlassButton>
      <GlassButton material="tinted" className="border border-black/15 bg-white text-neutral-900">
        Outline
      </GlassButton>
    </div>
  )
}
```

## Gooey droplet

Give the button an `icon`. On hover the icon separates from the body as a droplet and melts back when the pointer leaves or presses. Touch screens keep the icon inside unless `droplet="always"`.

```tsx
import { ArrowRight, Plus } from 'lucide-react'

import { GlassButton } from '@/components/liquid-glass'

// Hover the buttons: the icon separates from the body as a gooey droplet.
export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <GlassButton material="liquid" className="bg-orange-500 text-white" size="lg" icon={<ArrowRight />}>
        Continue
      </GlassButton>
      <GlassButton material="tinted" className="bg-neutral-900 text-white" icon={<Plus />} iconPosition="start">
        New list
      </GlassButton>
      <GlassButton material="tinted" className="bg-sky-500 text-white" icon={<ArrowRight />} droplet="always">
        Always apart
      </GlassButton>
    </div>
  )
}
```

> Without WebGL2 (or before the first frame) the component keeps its plain CSS look. With reduced motion the glass stays still.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `material` | `'clear' \| 'tinted' \| 'liquid'` | `'clear'` | Glass look. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height 32, 40 or 48 px. |
| `icon` | `ReactNode` | — | An element that renders an `<svg>` (e.g. a lucide-react icon). |
| `iconPosition` | `'start' \| 'end'` | `'end'` | Which side the icon sits on. |
| `droplet` | `'hover' \| 'always' \| 'none'` | `'hover'` | When the icon separates as a droplet. |
| `tint` | `number` | `0.6` | Clear glass only: how much tint covers the backdrop (0–1). |
| `href` | `string` | — | Renders an `<a>` instead of a `<button>`. |
| `…rest` | `button / anchor attributes` | — | Passed to the element (`onClick`, `disabled`, `type`…). |

Source: https://liquid-glass-interface.pages.dev/docs/glass-button

# GlassTabs

> A segmented control whose selection slides as a liquid glass lens.

```tsx
import { useState } from 'react'

import { GlassTabs } from '@/components/liquid-glass'

// Click or drag: the selection slides as a lens that bends the labels it passes.
export default function Demo() {
  const [range, setRange] = useState('week')
  return (
    <GlassTabs
      aria-label="Range"
      value={range}
      onValueChange={setRange}
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
      ]}
    />
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/glass-tabs.json
```

When the selection changes the highlight leaves its option, swells into clear glass that bends and magnifies the labels it passes, and settles as a flat pill again. Press and hold to open the lens in place; drag and release to choose. Arrow keys move the selection.

### Icons and a coloured lens

```tsx
import { LayoutGrid, List, Rows3 } from 'lucide-react'
import { useState } from 'react'

import { GlassTabs } from '@/components/liquid-glass'

// Icons, a larger size and a coloured lens (the highlight's background is the lens colour).
export default function Demo() {
  const [layout, setLayout] = useState('grid')
  return (
    <GlassTabs
      aria-label="Layout"
      size="lg"
      value={layout}
      onValueChange={setLayout}
      highlightClassName="bg-sky-500"
      className="[&_[aria-checked=true]]:text-white"
      options={[
        { value: 'list', label: 'List', icon: <List /> },
        { value: 'grid', label: 'Grid', icon: <LayoutGrid /> },
        { value: 'rows', label: 'Rows', icon: <Rows3 /> },
      ]}
    />
  )
}
```

> Without WebGL2 (or before the first frame) the component keeps its plain CSS look. With reduced motion the glass stays still.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ value, label, icon?, aria-label? }[]` | — | The segments. |
| `value` | `string \| null` | — | Selected value (controlled). |
| `onValueChange` | `(value) => void` | — | Called with the new value. |
| `aria-label` | `string` | — | Required: names the group for screen readers. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Segment height 28, 32 or 40 px. |
| `highlightClassName` | `string` | `'bg-white shadow-sm dark:bg-neutral-700'` | Classes of the resting pill; its background is the lens colour. |

Source: https://liquid-glass-interface.pages.dev/docs/glass-tabs

# GlassBadge

> A tinted glass drop with text flowing through it.

```tsx
import { GlassBadge } from '@/components/liquid-glass'

// The badge sits on the card's corner; the card shows through the glass, blurred.
export default function Demo() {
  return (
    <div className="relative w-64 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
      <p className="text-sm font-semibold text-neutral-900 dark:text-white">Release notes</p>
      <p className="mt-1 text-[13px] text-neutral-500">Liquid glass tabs and badges.</p>
      <GlassBadge className="absolute -top-2.5 -right-2.5" dotColor="#f97316">
        New
      </GlassBadge>
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/glass-badge.json
```

The text is drawn beneath the glass, so the rim bends the letters as they pass. Whatever sits behind the badge shows through, softly blurred. Hovering the badge's positioned parent speeds the flow up. With reduced motion the text stands still, centred.

> Without WebGL2 (or before the first frame) the component keeps its plain CSS look. With reduced motion the glass stays still.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string` | — | The text. |
| `dotColor` | `string` | `currentColor` | Separator colour between repeats. |
| `speed` | `number` | `0.4` | Loops per second at rest. |
| `tint` | `number` | `0.82` | Opacity of the badge colour over the backdrop. |
| `className` | `string` | — | Position and colour (`bg-*`, `text-*`). |

Source: https://liquid-glass-interface.pages.dev/docs/glass-badge

# GlassLayer

> Turn any element — a router link, a pill, your own button — into liquid glass.

```tsx
import { ArrowUpRight } from 'lucide-react'

import { GlassLayer } from '@/components/liquid-glass'

// Any element can be glass: mark it `data-glass-host`, put <GlassLayer /> first.
// Works with router links too (Next.js <Link>, TanStack <Link>…).
export default function Demo() {
  return (
    <a
      href="https://github.com/bilalgursen/liquid-glass"
      target="_blank"
      rel="noreferrer"
      data-glass-host
      className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-white"
    >
      <GlassLayer material="tinted" />
      Star on GitHub
      <ArrowUpRight className="size-4" />
    </a>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/glass-layer.json
```

GlassButton is GlassLayer plus sizes. When you already have the element — a Next.js `<Link>`, a shadcn `<Button>` — add the layer yourself:

- Mark the host with `data-glass-host` (it becomes `relative isolate`).
- Put `<GlassLayer />` as its first child.
- For a droplet, make the icon a direct `<svg>` child, first or last.

The host keeps its CSS look until the glass draws its first frame; then it gets `data-glass-ready` and drops its background, border and shadow.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `material` | `'clear' \| 'tinted' \| 'liquid'` | `'clear'` | See GlassButton. |
| `droplet` | `'hover' \| 'always' \| 'none'` | `'hover'` | When the icon separates. |
| `tint` | `number` | `0.6` | Clear glass tint (0–1). Set `--glass-tint` on the host to change its colour. |
| `backdrop` | `string` | — | CSS selector of the ancestor to refract (default: the page). |
| `live` | `boolean` | `false` | Repaint the backdrop every frame (animated content behind). |
| `trigger` | `string` | — | Listen for hover/press on this ancestor (e.g. a whole card). |
| `disabled` | `boolean` | `false` | Keep the CSS look. |

Source: https://liquid-glass-interface.pages.dev/docs/glass-layer

# GlassLens

> The sliding lens of GlassTabs, for your own tabs or radio group.

```tsx
import { useState } from 'react'

import { GlassLens } from '@/components/liquid-glass'

const plans = ['Monthly', 'Yearly']

// Your own segmented control: role="radio" options and a `data-glass-highlight` pill.
export default function Demo() {
  const [plan, setPlan] = useState('Yearly')
  return (
    <div role="radiogroup" aria-label="Billing" className="relative isolate inline-flex gap-1 rounded-xl bg-neutral-900 p-1">
      <GlassLens value={plan} />
      {plans.map((p) => (
        <button
          key={p}
          type="button"
          role="radio"
          aria-checked={p === plan}
          onClick={() => setPlan(p)}
          className={`relative h-9 rounded-lg px-4 text-sm font-semibold ${
            p === plan ? 'text-neutral-900 [[data-glass-traveling]_&]:text-white/60' : 'text-white/60'
          }`}
        >
          {p === plan && <span data-glass-highlight className="absolute inset-0 rounded-lg bg-white [[data-glass-moving]_&]:opacity-0" />}
          <span className="relative z-20">{p}</span>
        </button>
      ))}
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/glass-lens.json
```

- The container is `relative isolate` and `<GlassLens value={value} />` is its first child.
- Options carry `role="radio"` or `role="tab"` (Radix Tabs works as is).
- The selected option contains the resting pill, marked `data-glass-highlight`. Its background colour is the lens colour.
- Hide the pill while the lens moves: `[[data-glass-moving]_&]:opacity-0`.
- Optionally style the selected label as unselected during travel: `[[data-glass-traveling]_&]:…`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number \| null` | — | The selected value; any change slides the lens. |
| `disabled` | `boolean` | `false` | No lens; the pill simply jumps. |

Source: https://liquid-glass-interface.pages.dev/docs/glass-lens

# Button

> A clear or frosted glass button that swells on press.

```tsx
import { Button } from '@/components/liquid-glass/controls/Button'

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button>Glass</Button>
      <Button variant="frosted">Frosted</Button>
      <Button size="lg" trailingIcon="arrow-right">
        Get started
      </Button>
      <Button icon="settings" iconOnly>
        Settings
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/button.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'glass' \| 'frosted' \| 'ghost'` | `'glass'` | Glass look. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. |
| `icon / trailingIcon` | `IconName` | — | Leading / trailing icon from the kit set. |
| `iconOnly` | `boolean` | `false` | Round icon button; `children` becomes the aria-label. |
| `swell` | `number` | `1.08` | Lens growth while pressed. |
| `onClick` | `() => void` | — | Click handler. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `theme` | `'light' \| 'dark'` | — | Override the page theme for this control. |

Source: https://liquid-glass-interface.pages.dev/docs/button

# SegmentedControl

> Segments with a frosted pill that turns into a magnifying lens.

```tsx
import { useState } from 'react'

import { SegmentedControl } from '@/components/liquid-glass/controls/SegmentedControl'

// Hold and drag the frosted pill: it turns into a magnifying lens.
export default function Demo() {
  const [view, setView] = useState('week')
  return (
    <SegmentedControl
      ariaLabel="Range"
      value={view}
      onChange={setView}
      options={[
        { value: 'day', label: 'Day', icon: 'sun' },
        { value: 'week', label: 'Week', icon: 'sparkle' },
        { value: 'month', label: 'Month', icon: 'moon' },
      ]}
    />
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/segmented-control.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ value, label, icon? }[]` | — | The segments. |
| `value / onChange` | `string / (v) => void` | — | Selected value. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. |
| `stretch` | `boolean` | `false` | Fill the container width. |
| `showIcons / showLabels` | `boolean` | `true` | What each segment shows. |
| `ariaLabel` | `string` | — | Group name for screen readers. |
| `magnify` | `number` | `0.12` | Zoom of the labels through the pressed lens. |
| `theme` | `'light' \| 'dark'` | — | Override the page theme for this control. |

Source: https://liquid-glass-interface.pages.dev/docs/segmented-control

# Switch

> A toggle whose knob lifts into clear glass while held.

```tsx
import { useState } from 'react'

import { Switch } from '@/components/liquid-glass/controls/Switch'

export default function Demo() {
  const [on, setOn] = useState(true)
  return <Switch label="Notifications" description="Banners and sounds" checked={on} onChange={setOn} />
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/switch.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked / onChange` | `boolean / (v) => void` | — | On or off. |
| `label / description` | `string` | — | Text beside the switch. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. |
| `labelSide` | `'left' \| 'right'` | `'right'` | Label position. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `theme` | `'light' \| 'dark'` | — | Override the page theme for this control. |

Source: https://liquid-glass-interface.pages.dev/docs/switch

# Checkbox

> A checkbox drawn by the glass shader.

```tsx
import { useState } from 'react'

import { Checkbox } from '@/components/liquid-glass/controls/Checkbox'

export default function Demo() {
  const [remember, setRemember] = useState(true)
  return (
    <div className="flex flex-col gap-4">
      <Checkbox label="Remember this device" checked={remember} onChange={setRemember} />
      <Checkbox label="Circle" shape="circle" checked={false} />
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/checkbox.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked / onChange` | `boolean / (v) => void` | — | Checked state. |
| `label / description` | `string` | — | Text beside the box. |
| `shape` | `'rounded' \| 'circle'` | `'rounded'` | Box shape. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `theme` | `'light' \| 'dark'` | — | Override the page theme for this control. |

Source: https://liquid-glass-interface.pages.dev/docs/checkbox

# RadioGroup

> Radio options with glass dots.

```tsx
import { useState } from 'react'

import { RadioGroup } from '@/components/liquid-glass/controls/RadioGroup'

export default function Demo() {
  const [plan, setPlan] = useState('pro')
  return (
    <RadioGroup
      ariaLabel="Plan"
      value={plan}
      onChange={setPlan}
      options={[
        { value: 'free', label: 'Free', description: 'For personal projects' },
        { value: 'pro', label: 'Pro', description: 'For teams' },
      ]}
    />
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/radio-group.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ value, label, description? }[]` | — | The options. |
| `value / onChange` | `string / (v) => void` | — | Selected value. |
| `layout` | `'list' \| 'cards'` | `'list'` | Plain list or bordered cards. |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Flow direction. |
| `ariaLabel` | `string` | — | Group name. |
| `theme` | `'light' \| 'dark'` | — | Override the page theme for this control. |

Source: https://liquid-glass-interface.pages.dev/docs/radio-group

# RangeSlider

> A slider with a glass thumb over the accent fill.

```tsx
import { useState } from 'react'

import { RangeSlider } from '@/components/liquid-glass/controls/RangeSlider'

export default function Demo() {
  const [brightness, setBrightness] = useState(40)
  return (
    <div className="w-full max-w-sm">
      <RangeSlider label="Brightness" value={brightness} onChange={setBrightness} startIcon="moon" endIcon="sun" />
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/range-slider.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / onChange` | `number / (v) => void` | `50` | Current value. |
| `min / max / step` | `number` | `0 / 100 / 1` | Range. |
| `label` | `string` | — | Label above the track. |
| `startIcon / endIcon` | `IconName` | — | Icons at the ends. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Control size. |
| `restFrost` | `number` | `0` | 0 = clear resting thumb, 1 = frosted. |
| `theme` | `'light' \| 'dark'` | — | Override the page theme for this control. |

Source: https://liquid-glass-interface.pages.dev/docs/range-slider

# Progress

> A progress bar in a clear glass tube.

```tsx
import { Progress } from '@/components/liquid-glass/controls/Progress'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress label="Uploading" value={64} />
      <Progress label="Syncing" indeterminate />
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/progress.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `64` | 0–100. |
| `label` | `string` | — | Label above the bar. |
| `indeterminate` | `boolean` | `false` | Unknown duration. |
| `tube` | `boolean` | `true` | Encase the track in glass. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. |
| `theme` | `'light' \| 'dark'` | — | Override the page theme for this control. |

Source: https://liquid-glass-interface.pages.dev/docs/progress

# TextField

> A text input in a glass capsule.

```tsx
import { useState } from 'react'

import { TextField } from '@/components/liquid-glass/controls/TextField'

export default function Demo() {
  const [email, setEmail] = useState('')
  return (
    <div className="w-full max-w-sm">
      <TextField label="Email" placeholder="you@example.com" icon="search" clearable value={email} onChange={setEmail} />
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/text-field.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / onChange` | `string / (v) => void` | — | Field value. |
| `label / placeholder / hint / error` | `string` | — | Texts around the field. |
| `type` | `'text' \| 'email' \| 'password' \| 'search'` | `'text'` | Input type. |
| `icon` | `IconName` | — | Leading icon. |
| `clearable` | `boolean` | `false` | Show a clear button. |
| `size` | `'md' \| 'lg'` | `'md'` | Control size. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `theme` | `'light' \| 'dark'` | — | Override the page theme for this control. |

Source: https://liquid-glass-interface.pages.dev/docs/text-field

# Card

> A plain panel for grouping controls.

```tsx
import { Card } from '@/components/liquid-glass/controls/Card'
import { Switch } from '@/components/liquid-glass/controls/Switch'

export default function Demo() {
  return (
    <Card title="Display" description="Adjust how surfaces look on this device.">
      <Switch label="Reduce transparency" />
    </Card>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/card.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title / description` | `string` | — | Header texts. |
| `children / footer` | `ReactNode` | — | Body and footer. |
| `padding` | `'compact' \| 'comfortable' \| 'spacious'` | `'comfortable'` | Inner spacing. |
| `theme` | `'light' \| 'dark'` | — | Override the page theme for this control. |

Source: https://liquid-glass-interface.pages.dev/docs/card

# Icon

> The 24×24 stroke icon set shared by DOM and canvas.

```tsx
import { Icon, iconNames } from '@/components/liquid-glass/controls/Icon'

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-4 text-neutral-700 dark:text-neutral-300">
      {iconNames.map((name) => (
        <Icon key={name} name={name} size={18} />
      ))}
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/icon.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `IconName` | `'sparkle'` | One of `iconNames`. |
| `size` | `number` | `15` | Pixel size. |
| `strokeWidth` | `number` | `2` | Line width. |

Source: https://liquid-glass-interface.pages.dev/docs/icon

# LiquidGlass

> A bare glass pane you can put behind anything.

```tsx
import { LiquidGlassPreview } from '@/components/liquid-glass/controls/LiquidGlass'

// One clear lens over a track and a line of type: drag the offset to see it bend.
export default function Demo() {
  return (
    <div className="w-full overflow-x-auto">
      <LiquidGlassPreview offset={0.35} />
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/liquid-glass-pane.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width / height` | `number` | — | Glass size in px. |
| `x / y` | `number` | `0` | Offset inside the positioned parent. |
| `frost` | `number` | `0` | 0 clear … 1 frosted. |
| `pressed / hovered` | `boolean` | — | Drive the press and hover springs. |
| `drawBackdrop` | `(ctx, tokens, glass) => void` | — | Paint what lies beneath the glass. |

Source: https://liquid-glass-interface.pages.dev/docs/liquid-glass-pane

# GlassCard

> A card that bends the page behind it (Chromium; frosted elsewhere).

```tsx
import { GlassCardExamples } from '@/components/liquid-glass/controls/GlassCard'

// Chromium bends the rims; Safari, Firefox and phones show plain frosted glass.
export default function Demo() {
  return (
    <div className="w-full">
      <GlassCardExamples />
    </div>
  )
}
```

```bash
npx shadcn@latest add https://liquid-glass-interface.pages.dev/r/glass-card.json
```

> Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'light' \| 'dark' \| 'custom'` | `'light'` | Colour preset. |
| `width / height / radius` | `number` | `500 / 120 / 40` | Size and corners. |
| `shape` | `'rounded' \| 'rectangle' \| 'circle' \| 'ellipse'` | `'rounded'` | Outline. |
| `refractStrength` | `number` | `0.065` | Rim refraction. |
| `frostedRadius` | `number` | `10` | Blur radius in px. |
| `children` | `ReactNode` | — | Card content. |

Source: https://liquid-glass-interface.pages.dev/docs/glass-card
