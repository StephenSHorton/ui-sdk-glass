'use client'

// GlassToast — the short message that rises after an action ("Saved", "Could not refresh"),
// on a pane of frosted glass. It comes up from the edge, stays a few seconds and goes; several
// gather into one stack, the newest in front and the rest peeking out behind it, and the stack
// fans out while the pointer or focus is in it. Swipe one away, press its ×, or press Escape on it.
//
//   <GlassToaster />                                            // once, near the root of your app
//
//   toast('Mark saved')                                         // plain
//   toast('Mark saved', { description: 'AAPL · $231.40', action: { label: 'Undo', onAction: undo } })
//   toast.error('Could not refresh', { action: { label: 'Retry', onAction: refresh } })
//   toast.promise(refresh, { loading: 'Refreshing…', success: 'Prices refreshed', error: 'Could not refresh' })
//
// UI SDK owns the behaviour (the queue and its timers, the stack's measurements, swiping, F6 and
// Escape, the top layer, and the live regions that announce each toast to screen readers without
// moving focus); the kit's engine draws the glass. Each toast is a surface, Card's frosted glass,
// and its action and × light it where they are pressed (`data-glass-pick`). An error is the same
// glass with a red tint and a red mark. Needs @ui-sdk/core and @ui-sdk/react.
// Without WebGL2 a toast is a plain frosted panel. COPY VERBATIM.
// MIT — https://github.com/bilalgursen/liquid-glass

import { ToastAction, ToastClose, ToastDescription, ToastRegion, ToastTitle, Toast, type ToastType } from '@ui-sdk/react/toast'
import type { ComponentProps, ReactNode } from 'react'

import { GlassLayer, type GlassOptics } from './glass-layer'

export { createToaster, toast, type Toaster, type ToastData, type ToastType } from '@ui-sdk/react/toast'

export type GlassToasterProps = Omit<ComponentProps<typeof ToastRegion>, 'children'> & {
  /** The × that dismisses a toast: its accessible name, in your page's language (default `Dismiss`). */
  closeLabel?: string
  /** Clear glass: how much tint covers the backdrop (0–1, default 0.7). */
  tint?: number
  /** Clear glass: how much the backdrop is frosted, in px like CSS `blur()` (default 5). */
  blur?: number
}

// Card's glass (glass-card.tsx): the rim pulls the backdrop towards the centre, a 5 px frost, a
// 70% tint and a 1.3 px white line (25% on dark glass). No light of its own: a toast is a surface.
const TOAST_OPTICS: GlassOptics = {
  bendMode: 'radial',
  borderColor: '#ffffff',
  borderAlpha: 0.6,
  borderWidth: 1.3,
  frostMix: 1,
  frostEdge: 1,
  saturation: 1,
  refraction: 1,
  bendDepth: 1.35,
  bendCurve: 9.75,
  dispersion: 0,
  magnify: 0,
  light: 0,
  cursorLight: false,
  shadow: 0,
  dark: { borderAlpha: 0.25 },
}
const SHADOW = '0 10px 28px rgba(0, 0, 0, 0.1), 0 18px 44px rgba(0, 0, 0, 0.08)'
const TINT = 0.7
const BLUR = 5

/**
 * The stack, in plain CSS on the parts UI SDK measures (--toast-index, --toast-offset,
 * --toast-height, --toast-front-height, --toast-swipe-x/y). Unlayered, so it wins over UI SDK's
 * own defaults (`@layer ui-sdk`); change it through the variables: `--glass-toast-width` (22rem),
 * `--glass-toast-offset` from the viewport's edge (1rem), `--glass-toast-gap` in a fanned-out
 * stack (8px) and `--glass-toast-peek` behind a gathered one (10px). `interpolate-size` is held at
 * `numeric-only`: UI SDK measures a toast by setting its height to `auto` for a moment, and a page
 * that lets `auto` animate (`allow-keywords`) would hand it the old height instead.
 */
export const TOAST_CSS = `
[data-glass-toaster]{interpolate-size:numeric-only;--glass-toast-gap:8px;--glass-toast-peek:10px;width:min(var(--glass-toast-width,22rem),calc(100vw - 2 * var(--glass-toast-offset,1rem)));margin:var(--glass-toast-offset,1rem);height:var(--toast-front-height);transition:height .45s cubic-bezier(.22,1,.36,1)}
[data-glass-toaster][data-expanded]{height:calc(var(--toast-stack-height) + (var(--toast-count) - 1) * var(--glass-toast-gap))}
[data-glass-toaster] [data-slot=toast]{--y:calc(var(--toast-index) * var(--glass-toast-peek) * -1);position:absolute;inset-inline:0;bottom:0;z-index:calc(100 - var(--toast-index));height:var(--toast-height);translate:var(--toast-swipe-x,0px) calc(var(--y) + var(--toast-swipe-y,0px));scale:calc(1 - var(--toast-index) * .05);transition-property:translate,scale,opacity,height;transition-duration:.45s;transition-timing-function:cubic-bezier(.22,1,.36,1);-webkit-user-select:none;user-select:none}
[data-glass-toaster][data-side=top] [data-slot=toast]{top:0;bottom:auto;--y:calc(var(--toast-index) * var(--glass-toast-peek))}
[data-glass-toaster] [data-slot=toast]:not([data-front],[data-expanded]){height:var(--toast-front-height)}
[data-glass-toaster] [data-slot=toast][data-expanded]{--y:calc(-1 * (var(--toast-offset) + var(--toast-index) * var(--glass-toast-gap)));scale:1}
[data-glass-toaster][data-side=top] [data-slot=toast][data-expanded]{--y:calc(var(--toast-offset) + var(--toast-index) * var(--glass-toast-gap))}
[data-glass-toaster] [data-slot=toast][data-starting-style]{transition:none;opacity:0}
[data-glass-toaster] [data-slot=toast][data-starting-style][data-front]{--y:calc(100% + var(--glass-toast-offset,1rem))}
[data-glass-toaster][data-side=top] [data-slot=toast][data-starting-style][data-front]{--y:calc(-100% - var(--glass-toast-offset,1rem))}
[data-glass-toaster] [data-slot=toast][data-ending-style]{opacity:0;scale:calc(.92 - var(--toast-index) * .05)}
[data-glass-toaster] [data-slot=toast][data-ending-style][data-swipe-direction=right]{translate:calc(var(--toast-swipe-x,0px) + 40%) calc(var(--y) + var(--toast-swipe-y,0px))}
[data-glass-toaster] [data-slot=toast][data-ending-style][data-swipe-direction=left]{translate:calc(var(--toast-swipe-x,0px) - 40%) calc(var(--y) + var(--toast-swipe-y,0px))}
[data-glass-toaster] [data-slot=toast][data-ending-style][data-swipe-direction=down]{translate:var(--toast-swipe-x,0px) calc(var(--y) + var(--toast-swipe-y,0px) + 60%)}
[data-glass-toaster] [data-slot=toast][data-ending-style][data-swipe-direction=up]{translate:var(--toast-swipe-x,0px) calc(var(--y) + var(--toast-swipe-y,0px) - 60%)}
[data-glass-toaster] [data-slot=toast][data-swiping]{transition:none}
[data-glass-toaster] [data-glass-toast-body]{transition:opacity .3s}
[data-glass-toaster] [data-slot=toast]:not([data-front],[data-expanded]) [data-glass-toast-body]{opacity:0}
@media (prefers-reduced-motion:reduce){[data-glass-toaster],[data-glass-toaster] [data-slot=toast]{transition-property:opacity}}
`

/** Its own mark for each kind of toast; a plain one has none. Inline, so the kit needs no icon set. */
const svg = (children: ReactNode, className = '') => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`size-5 shrink-0 ${className}`}
  >
    {children}
  </svg>
)
const MARKS: Partial<Record<ToastType, ReactNode>> = {
  success: svg(
    <>
      <circle cx="12" cy="12" r="10" />
      <path data-glass-draw="" d="m9 12 2 2 4-4" />
    </>,
  ),
  error: svg(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </>,
    'text-red-600 dark:text-red-400 group-data-[glass-tone=dark]/toast:text-red-400 group-data-[glass-tone=light]/toast:text-red-600',
  ),
  warning: svg(
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </>,
    'text-amber-600 dark:text-amber-400 group-data-[glass-tone=dark]/toast:text-amber-400 group-data-[glass-tone=light]/toast:text-amber-600',
  ),
  info: svg(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>,
  ),
  // Turns on the kit's own spin (GLASS_CSS), which stops under reduced motion.
  loading: (
    <span aria-hidden data-glass-spin="" className="flex size-5 shrink-0 opacity-70">
      {svg(<path d="M21 12a9 9 0 1 1-6.22-8.56" />)}
    </span>
  ),
}

// The look before the glass draws, and without WebGL2: the same tint and frost in CSS. An error's
// glass is tinted red (`--glass-tint`, which the glass reads), pale on a light page, deep on a dark one.
const PANE =
  'border border-white/60 text-neutral-900 backdrop-blur-[5px] dark:border-white/25 dark:text-white data-[glass-tone=dark]:text-white data-[glass-tone=light]:text-neutral-900'
const FILL = {
  plain: 'bg-white/70 dark:bg-black/70',
  error: 'bg-[#ffe4e6]/70 [--glass-tint:#ffe4e6] dark:bg-[#3a0b13]/70 dark:[--glass-tint:#3a0b13]',
}

const BUTTON =
  'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-[background-color,opacity,scale] duration-150 select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#3291FF] active:scale-[0.96]'

/**
 * Shows the toasts. Place it once (near your app's root) and call `toast()` from anywhere. For a
 * queue of its own, pass `toaster={createToaster()}`. `side` (`bottom`) and `align` (`end`) say
 * where the stack sits; `maxVisible` (3) how many show at once.
 */
export function GlassToaster({ closeLabel = 'Dismiss', tint = TINT, blur = BLUR, className = '', ...rest }: GlassToasterProps) {
  return (
    <>
      <style href="liquid-glass-toast" precedence="default">
        {TOAST_CSS}
      </style>
      {/* The toasts leave each other out of what their glass bends (data-glass-skip). */}
      <ToastRegion data-glass-toaster="" data-glass-skip="" className={className} {...rest}>
        {(item) => (
          <Toast data-glass-host="" className={`group/toast rounded-[22px] outline-none ${PANE} ${FILL[item.type === 'error' ? 'error' : 'plain']}`}>
            {/* The glass layer must be the host's first child. */}
            <GlassLayer material="clear" tint={tint} blur={blur} swell={false} optics={TOAST_OPTICS} />
            {/* The drop shadow, under the glass: an outer box-shadow never paints inside its own box. */}
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ zIndex: -2, boxShadow: SHADOW }} />
            <div data-glass-toast-body="" className="flex min-h-14 items-center gap-3 py-2.5 ps-4 pe-2.5">
              {MARKS[item.type ?? 'default']}
              <div className="flex min-w-0 flex-1 flex-col py-1">
                <ToastTitle className="text-sm leading-5 font-semibold tracking-[-0.01em]" />
                <ToastDescription className="text-[13px] leading-[18px] opacity-70" />
              </div>
              <ToastAction data-glass-pick="" className={`h-8 px-3.5 text-[13px] font-semibold whitespace-nowrap bg-current/10 hover:bg-current/15 data-pending:opacity-60 ${BUTTON}`} />
              {item.dismissible !== false && (
                <ToastClose data-glass-pick="" aria-label={closeLabel} className={`size-8 opacity-55 hover:bg-current/10 hover:opacity-100 ${BUTTON}`}>
                  {svg(<path d="M18 6 6 18M6 6l12 12" />, 'size-4')}
                </ToastClose>
              )}
            </div>
          </Toast>
        )}
      </ToastRegion>
    </>
  )
}

export default GlassToaster
