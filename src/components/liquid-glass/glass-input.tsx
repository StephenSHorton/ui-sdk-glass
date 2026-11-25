'use client'

// GlassInput — a text field made of liquid glass. You type on the glass; its rim bends the page
// behind it, and the words, the caret, the placeholder and the selection are plain DOM on top,
// so they stay sharp.
//
//   <GlassInput label="Email" type="email" placeholder="you@example.com" />
//   <GlassInput label="Merchant" type="search" placeholder="Search merchants" />   // magnifier + clear
//   <GlassInput aria-label="Search" type="search" />                               // no visible label
//
// `type="search"` puts a magnifier at the start and a clear button at the end, shown while there
// is text: it empties the field and gives focus back to it. The field is the same height and
// glass as GlassSelect's button (Button's clear glass), so the two sit side by side in a filter
// row. It is a surface, not a button: it holds still under the pointer and takes the engine's
// light alone (see the rule above GLOW in engine.ts).
//
// UI SDK owns the behaviour (the label, description and form wiring, the clear button, change
// reasons); the kit's engine owns the material. Needs @ui-sdk/core and @ui-sdk/react.
// Without WebGL2 it is a plain frosted field. COPY VERBATIM. MIT.

import { Field, FieldDescription, FieldLabel } from '@ui-sdk/react/field'
import { Input, InputClear, InputGroup } from '@ui-sdk/react/input'
import type { ComponentProps, ReactNode } from 'react'

import { GlassLayer } from './glass-layer'

export type GlassInputProps = {
  /** The visible label above the field. Leave it out only with an `aria-label`. */
  label?: ReactNode
  /** A line under the field, read out as its description. */
  description?: ReactNode
  /** The native input type. `search` adds a magnifier and a clear button. Default `text`. */
  type?: 'text' | 'search' | 'email' | 'url' | 'tel' | 'password' | 'number'
  /** An icon at the start (e.g. a lucide-react icon). A search field has a magnifier unless you give one. */
  icon?: ReactNode
  /** The clear button's name for screen readers. Default `Clear`. */
  clearLabel?: string
  /** How much tint covers the backdrop (0–1). Default 0.6, as GlassSelect's button. */
  tint?: number
  /** Frost what the glass shows, in px like CSS `blur()`. Default 0: sharp. */
  blur?: number
  /** Classes for the field (label, glass and description); it is 16rem wide by default. */
  className?: string
} & Omit<ComponentProps<typeof Input>, 'className' | 'render' | 'type' | 'children'>

// The look before the glass draws (first paint, and the permanent look without WebGL2): GlassSelect's
// button. Text follows the glass's own tone once it draws, so it reads on any backdrop.
const fallback =
  'border border-black/10 bg-white/60 text-neutral-900 dark:border-white/15 dark:bg-white/10 dark:text-white data-[glass-tone=dark]:text-white data-[glass-tone=light]:text-neutral-900'

// The focus ring is an outline on the glass, not a ring: once the glass draws, the host's own
// box-shadow is cleared (GLASS_CSS), and a ring is a box-shadow. A focused clear button keeps its own.
const focus = 'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#3291FF]'

// Placeholder, caret and selection follow the text colour, which follows the glass's tone.
// The native search field's own clear button is hidden: InputClear is the one.
const field =
  'h-full min-w-0 flex-1 bg-transparent text-inherit outline-none caret-current placeholder:text-current/65 selection:bg-[#3291FF]/35 selection:text-current disabled:cursor-not-allowed [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none'

const magnifier = (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export function GlassInput({
  label,
  description,
  type = 'text',
  icon,
  clearLabel = 'Clear',
  tint,
  blur,
  className = '',
  name,
  disabled,
  ...rest
}: GlassInputProps) {
  const search = type === 'search'
  const lead = icon ?? (search ? magnifier : null)
  return (
    <Field name={name} disabled={disabled} className={`flex w-64 flex-col gap-2 ${className}`}>
      {label != null && <FieldLabel className="text-sm font-medium text-neutral-900 dark:text-white">{label}</FieldLabel>}
      <InputGroup
        data-glass-host=""
        className={`flex h-12 w-full cursor-text items-center gap-2.5 rounded-full text-[15px] font-medium ${lead ? 'pl-4' : 'pl-5'} ${search ? 'pr-2.5' : 'pr-4'} data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 ${focus} ${fallback}`}
      >
        {/* The glass layer must be the host's first child. A field holds still: it is a surface, not a button. */}
        <GlassLayer material="clear" tint={tint} blur={blur} swell={false} />
        {lead && <span className="flex shrink-0 opacity-60 [&_svg]:size-[18px]">{lead}</span>}
        <Input type={type} className={field} {...rest} />
        {search && (
          <InputClear
            aria-label={clearLabel}
            data-glass-in=""
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-current/12 outline-none transition-[background-color,scale] duration-150 hover:bg-current/20 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#3291FF] motion-safe:active:scale-90"
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-3.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </InputClear>
        )}
      </InputGroup>
      {description != null && <FieldDescription className="text-[13px] text-neutral-600 dark:text-neutral-400">{description}</FieldDescription>}
    </Field>
  )
}

export default GlassInput
