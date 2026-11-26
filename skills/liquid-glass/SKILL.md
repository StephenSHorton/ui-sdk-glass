---
name: liquid-glass
description: Add liquid glass UI to a React app with ui-sdk-glass (StephenSHorton/ui-sdk-glass, a fork of Liquid Glass UI by Bilal Gürşen) — copy-paste components, one verb each: glass buttons (press), async action buttons whose arrow droplet melts into the body when pressed (merge), tabs whose selection travels as a lens (travel), badges with text flowing through the glass (flow), slide-to-confirm tracks with a glass thumb (drag), glass cards that hold content over moving colour (hold), data tables on one sheet of glass whose heads sort (sort), button groups that share one body of glass (share), range sliders (slide), on/off switches (flip), checkboxes (tick), selects whose list stretches out of the button (stretch), dropdown menus that pour out of a button or a whole button group (open), text or search fields of glass with a label (type), date fields whose calendar swells out of the field (circle) and toasts: a short message on frosted glass after an action, which stays a moment and goes (rise). Use when the user asks for liquid glass, glassmorphism with real refraction, Apple-style glass, glass cards or widgets, glass tables, glass toasts / notifications / snackbars, glass sliders, switches / toggles or checkboxes, glass text inputs or search boxes, a glass date picker or From / To date fields, gooey/droplet buttons, slide to confirm / slide to pay / slide to unlock, or mentions ui-sdk-glass or Liquid Glass UI. Copies the real component files from the fork instead of re-implementing them.
---

# ui-sdk-glass

Copy-paste React components drawn in WebGL2, one verb each. **ui-sdk-glass is Stephen Horton's fork of [Liquid Glass UI](https://github.com/bilalgursen/liquid-glass) by Bilal Gürşen** (MIT): the engine, the components and their docs are Bilal's work. The fork runs on UI SDK `0.1.0-beta.17` (the original pins `0.1.0-beta.13`) and adds components of its own.

Source: https://github.com/StephenSHorton/ui-sdk-glass. The original's docs at https://onemorethink.dev describe the original's files; for this fork read `references/components.md`.

## Install

Copy `src/components/liquid-glass/` from https://github.com/StephenSHorton/ui-sdk-glass into the project as `components/liquid-glass/`, byte for byte:

```bash
npx degit StephenSHorton/ui-sdk-glass/src/components/liquid-glass components/liquid-glass
# or, without degit:
git clone --depth 1 https://github.com/StephenSHorton/ui-sdk-glass /tmp/ui-sdk-glass
cp -R /tmp/ui-sdk-glass/src/components/liquid-glass components/liquid-glass
```

Put the folder under the source root the `@/` alias points at (`src/components/liquid-glass/` when `@/` is `src/`). Then add the packages, UI SDK at exactly this version (it is in beta; both packages move together):

```bash
npm install @ui-sdk/core@0.1.0-beta.17 @ui-sdk/react@0.1.0-beta.17
npm install three   # RangeSlider, Switch and Checkbox; or leave the controls/ folder out
```

To take one component only, copy just the files its section in `references/components.md` lists. Never use the original's `npx shadcn@latest add https://onemorethink.dev/r/…` commands for this fork: that registry ships the original's files, pinned to UI SDK `0.1.0-beta.13`.

## Non-negotiable rules

1. **Copy, never re-implement.** Copy the files from https://github.com/StephenSHorton/ui-sdk-glass/tree/main/src/components/liquid-glass byte for byte, as above. Do not write your own shader, port the engine to another library, "simplify" it, or translate identifiers. The look depends on exact constants.
2. **Do not edit files in `components/liquid-glass/`.** Customise only through documented props, `className` (`bg-*`, `text-*`, sizes, position) and the `--glass-tint` CSS variable.
3. **Copy the examples as they are.** The code in `references/components.md` is the exact source of each live demo.
4. Requirements: React 19, Tailwind CSS v4, an `@/` import alias to the source folder. Files already start with `"use client"`.

## Which component

Pick by the verb. They never overlap.

| Verb | Need | Use |
| --- | --- | --- |
| Press | One glass button, or a router link styled as one | `GlassButton` (`material`: `clear` \| `tinted`; `asChild` for `<Link>`; needs `@ui-sdk/core` and `@ui-sdk/react`) |
| Merge | One async action whose result shows on the button (Deploy → Deploying… → Deployed ✓) | `GlassActionButton` — its arrow is a gooey droplet |
| Travel | Tabs / segmented control with a sliding glass lens | `GlassTabs`; for your own Radix Tabs or radio group, `GlassLens` (ships with it); needs `@ui-sdk/core` and `@ui-sdk/react` |
| Flow | A one-word "New" badge with text flowing through glass | `GlassBadge` |
| Drag | A deliberate action a stray tap must not trigger (Slide to send $240 → Sending… → Sent ✓) | `GlassSlideToConfirm` (`fillClassName` colours the fill) |
| Hold | A small card of content over colour, imagery or motion (a weather widget, a now-playing card) | `GlassCard` (frosted: `blur` 3.5 px, `tint` 0.68 light / 0.79 dark; `live` when something moves behind it) |
| Sort | Rows of data on a dashboard (transactions, months, a budget) with a totals row and heads that sort | `GlassTable` with `GlassTableHeader`, `GlassTableBody`, `GlassTableFooter`, `GlassTableRow`, `GlassTableHead` (`sortKey`, `numeric`), `GlassTableCell` (`numeric`); `sort` + `onSortChange`, and `sortRows(rows, sort)` to sort your data |
| Share | Two to five related actions in one body of glass (a toolbar, map controls, a split button) | `GlassButtonGroup` with `GlassButtonGroupItem`, `GlassButtonGroupSeparator`, `GlassButtonGroupText` (`orientation`, `size`, `material`) |
| Slide | Picking a value on a range (volume, brightness) | `RangeSlider` from `controls/RangeSlider` (`value`, `onChange`, `min`, `max`, `step`, `label`; needs `three`, `@ui-sdk/core` and `@ui-sdk/react`) |
| Flip | An on/off setting that takes effect at once | `Switch` from `controls/Switch` (`checked`, `onChange`, `label`; needs `three`, `@ui-sdk/core` and `@ui-sdk/react`) |
| Tick | Choosing items in a list or a form | `Checkbox` from `controls/Checkbox` (`checked`, `onChange`, `label`; needs `three`, `@ui-sdk/core` and `@ui-sdk/react`) |
| Stretch | Picking one option from a list that opens out of its button | `GlassSelect` from `glass-select` (`label`, `options`, `value`, `onValueChange`; needs `@ui-sdk/core` and `@ui-sdk/react`); for your own menu or popover, `GlassPopup` (ships with it) |
| Open | A menu of actions out of a button or out of a button group's three dots | `GlassDropdownMenu` from `glass-dropdown-menu` with `GlassDropdownMenuTrigger` (`asChild` on a `GlassButtonGroupItem`), `GlassDropdownMenuContent`, `GlassDropdownMenuItem` (`onSelect`, `destructive`), `GlassDropdownMenuSeparator`; needs `@ui-sdk/core` and `@ui-sdk/react` |
| Unfold | A little more about one control, or a few choices for it, out of the button itself | `GlassPopover` from `glass-popover` with `GlassPopoverTrigger`, `GlassPopoverContent` (`over`, `align`), `GlassPopoverTitle`, `GlassPopoverDescription`, `GlassPopoverClose` (`variant="solid"`, `onClick`); needs `@ui-sdk/core` and `@ui-sdk/react` |
| Grow | A full menu out of a button, on any side: checkable options, one choice among a few, groups, shortcuts, submenus | `GlassMenu` from `glass-menu` with `GlassMenuTrigger`, `GlassMenuContent` (`side`, `align`), `GlassMenuItem` (`onSelect`, `destructive`, `shortcut`), `GlassMenuCheckboxItem` (`value`, `checked`, `onCheckedChange`), `GlassMenuRadioGroup` + `GlassMenuRadioItem`, `GlassMenuGroup` + `GlassMenuLabel`, `GlassMenuShortcut`, `GlassMenuSeparator`, `GlassMenuSub` + `GlassMenuSubTrigger` + `GlassMenuSubContent`; needs `@ui-sdk/core` and `@ui-sdk/react` |
| Type | A line of text on glass: a search box over a list or a table, or a labelled form field | `GlassInput` from `glass-input` (`label`, `type` — `search` adds a magnifier and a clear button —, `value`, `onValueChange`, `placeholder`, `description`, `name`; needs `@ui-sdk/core` and `@ui-sdk/react`) |
| Circle | One date typed or picked from a calendar (a due date, a From and To pair for an export) | `GlassDatePicker` from `glass-date-picker` (`label`, `value` / `onValueChange` as `YYYY-MM-DD` or `null`, `min`, `max`, `unavailable`, `name`, `labels`); needs `@ui-sdk/core` and `@ui-sdk/react` |
| Rise | A short message after an action (Saved, Could not refresh), stacking when several come | `GlassToaster` from `glass-toast` once near the root, then `toast()` / `toast.error()` / `toast.promise()` from anywhere (`description`, one `action`); needs `@ui-sdk/core` and `@ui-sdk/react` |

Everything wraps your own DOM. `GlassButton`, `GlassTabs`, `GlassSelect`, `GlassDropdownMenu`, `GlassPopover`, `GlassMenu`, `GlassInput`, `GlassDatePicker`, `GlassToaster`, `RangeSlider`, `Switch` and `Checkbox` take their behaviour from UI SDK and need `@ui-sdk/core` and `@ui-sdk/react` (in beta: keep them at exactly `0.1.0-beta.17`); `RangeSlider`, `Switch` and `Checkbox` also need `three`. The rest have zero npm dependencies.

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
- `GlassActionButton`'s arrow is a gooey droplet. Return the real promise from `onAction`; use `resetAfter` (ms) if it should split off again after success. At most one per screen.
- `GlassButtonGroup` is the glass; its items are plain buttons (`GlassButtonGroupItem`). Never put a `GlassButton` inside it. It is tinted white by default: colour it with a `bg-*` class on the group, or pass `material="clear"`. Nest groups to set some actions apart.
- `GlassDropdownMenu` is imported from `glass-dropdown-menu`, not the index, and needs `@ui-sdk/core` and `@ui-sdk/react`. To open it from a button group, wrap that one `GlassButtonGroup` and the content in it and put `GlassDropdownMenuTrigger asChild` around one `GlassButtonGroupItem`.
- `GlassPopover` is imported from `glass-popover`, not the index, and needs `@ui-sdk/core` and `@ui-sdk/react`. Its button is hidden while the popover is out (it has become it), so always leave a way to close: `GlassPopoverClose`, or the press outside. It opens from its button's edge by itself (`over="center"`: around the button); do not add a `sideOffset` unless you mean to place it. For your own surface with the same motion: `useGlassPopup({ opening: 'morph' })`, with the content wrapped in a `data-glass-list` element and laid over its control.
- `GlassMenu` is imported from `glass-menu`, not the index, and needs `@ui-sdk/core` and `@ui-sdk/react`. Its button is hidden while the menu is out (its glass has become the menu) and it closes on a press outside, a choice or Escape. Say where the menu lies with `side` and `align` on `GlassMenuContent`; never offset it over the button. Use it for menus with structure (checkbox and radio items, groups, submenus) or a set side; a few plain actions, or a menu out of a `GlassButtonGroup`, are `GlassDropdownMenu`. For your own surface with the same motion: `useGlassPopup({ opening: 'grow' })`, with the content's children wrapped in a `data-glass-list` element.
- `GlassDatePicker` is imported from `glass-date-picker`, not the index, and needs `@ui-sdk/core` and `@ui-sdk/react`. Its value is always a plain `YYYY-MM-DD` string or `null`; it reads typed dates in the page's language (`lang`) and shows the format while empty. For a From and To pair use two of them and bound each by the other: `max={to ?? undefined}` on From, `min={from ?? undefined}` on To. Do not swap in a native `<input type="date">`.
- `GlassToaster` is placed once, near the app's root; call `toast()` from anywhere (both from `glass-toast` or the index). Each toast is Card's frosted glass; `toast.error` tints it red. For a separate queue pass `toaster={createToaster()}`. Do not style the toasts' stack with your own CSS: change it through `--glass-toast-width`, `--glass-toast-offset`, `--glass-toast-gap` and `--glass-toast-peek`.
- `GlassSelect` is imported from `glass-select`, not the index, and needs `@ui-sdk/core` and `@ui-sdk/react` (UI SDK is in beta: keep it at exactly `0.1.0-beta.17`). It is clear glass: give it something to bend. For your own menu or popover use `GlassPopup` (`useGlassPopup`, `GlassPopupAnchor`, `GlassPopupSurface`): the content must carry `data-open` / `data-ending-style` and stay mounted while it animates out, as UI SDK's popups do.
- Without WebGL2 or before the first frame, components show their plain CSS look. Reduced motion freezes the glass. Do not add your own fallbacks.
- Dark mode: the glass reads colours from CSS (any theme system works); clear glass picks its text colour from its own tone.

## Reference

- `references/components.md` — every component page: live example source, the files to copy, props table.
- The original project: https://github.com/bilalgursen/liquid-glass, docs at https://onemorethink.dev (Turkish: https://onemorethink.dev/tr/docs).
