'use client'

// GlassDatePicker — a date field of glass: type a date into it, or press its calendar and a month
// swells out of the whole field as one body of glass with it, held on by a neck that thins and
// snaps (GlassPopup, `glass-popup.tsx`, the motion GlassSelect's list has). The day chosen is
// circled; the value is a plain ISO date, `YYYY-MM-DD`, or `null`.
//
//   <GlassDatePicker label="From" value={from} onValueChange={setFrom} max={to ?? undefined} />
//   <GlassDatePicker label="To" value={to} onValueChange={setTo} min={from ?? undefined} />
//
// UI SDK owns the behaviour (reading a typed date in the page's language, the calendar's keyboard,
// focus, the top layer, positioning, forms, ARIA); the kit's engine owns the material. Needs
// @ui-sdk/core and @ui-sdk/react. Without WebGL2 it is a plain frosted field and calendar.

import {
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
  type DateMatchers,
} from '@ui-sdk/react/date-picker'
import { useId, useState, type ReactNode } from 'react'

import { GlassPopupAnchor, GlassPopupSurface, useGlassPopup } from './glass-popup'

export type GlassDatePickerProps = {
  label: ReactNode
  /** The date (controlled): `YYYY-MM-DD`, or `null` for none. */
  value?: string | null
  /** The date it starts with when it keeps its own state. */
  defaultValue?: string | null
  /** Called with the new date, `YYYY-MM-DD`, or `null` once the field is emptied. */
  onValueChange?: (value: string | null) => void
  /** The earliest and latest dates that can be typed or picked, `YYYY-MM-DD`. */
  min?: string
  max?: string
  /** Dates that can't be picked: ISO dates, `{ from, to }`, `{ weekday: [0, 6] }`, `{ before }`, `{ after }` or a function. */
  unavailable?: DateMatchers
  /** Shown while the field is empty. Defaults to the format to type, in the page's language (MM/DD/YYYY, GG.AA.YYYY). */
  placeholder?: string
  /** Submits the date with a form under this name, as `YYYY-MM-DD`. */
  name?: string
  required?: boolean
  disabled?: boolean
  /** The language of the format, the month and the day names. Defaults to the page's `lang`. */
  locale?: string
  /** The names screen readers hear for the calendar button and the month steps, in your language. */
  labels?: { open?: string; previous?: string; next?: string }
  className?: string
}

const icon = { 'aria-hidden': true, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Previous and Next: small round steps in the surface's own tone. */
const STEP =
  'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full outline-hidden transition-[background-color,scale] duration-150 select-none hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#3291FF] active:scale-[0.94] data-[disabled]:pointer-events-none data-[disabled]:opacity-30 [&_svg]:size-4'

/**
 * A day: a round cell. The chosen one is circled in the surface's ink (dark on light glass, white
 * on dark), today is set in bold, and a day that can't be picked is faint and struck through.
 */
const DAY =
  'relative size-9 cursor-pointer rounded-full p-0 text-center align-middle text-sm font-medium tabular-nums outline-hidden transition-[background-color,color] duration-100 select-none hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-[#3291FF] data-[today]:font-bold data-[outside]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-30 data-[disabled]:hover:bg-transparent data-[unavailable]:line-through data-[selected]:bg-neutral-900 data-[selected]:text-white data-[selected]:hover:bg-neutral-900 group-data-[glass-tone=dark]/glass:data-[selected]:bg-white group-data-[glass-tone=dark]/glass:data-[selected]:text-neutral-900'

export function GlassDatePicker({
  label,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  unavailable,
  placeholder,
  name,
  required,
  disabled,
  locale,
  labels,
  className = '',
}: GlassDatePickerProps) {
  const popup = useGlassPopup()
  const id = useId()
  // The calendar opens out of the whole field, not just its button: it is the popup's anchor.
  const [field, setField] = useState<HTMLDivElement | null>(null)
  const controlled = value !== undefined ? { value } : {}
  const initial = defaultValue !== undefined ? { defaultValue } : {}

  return (
    <DatePicker
      {...controlled}
      {...initial}
      onValueChange={(next) => onValueChange?.(typeof next === 'string' ? next : null)}
      min={min}
      max={max}
      unavailable={unavailable}
      name={name}
      required={required}
      disabled={disabled}
      locale={locale}
      fixedWeeks
      className={`flex w-64 flex-col gap-2 ${className}`}
    >
      <label htmlFor={id} className="text-sm font-medium text-neutral-900 dark:text-white">
        {label}
      </label>
      <div
        ref={setField}
        data-glass-host=""
        // Outlines, not rings: once the glass draws, the field's own border and shadows give way to it.
        className="relative flex h-12 w-full items-center rounded-full border border-black/10 bg-white/60 pr-1.5 pl-5 text-[15px] font-medium text-neutral-900 outline-offset-2 has-[[data-invalid]]:outline-2 has-[[data-invalid]]:outline-red-500 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#3291FF] has-[[data-disabled]]:opacity-40 dark:border-white/15 dark:bg-white/10 dark:text-white data-[glass-tone=dark]:text-white data-[glass-tone=light]:text-neutral-900"
      >
        <GlassPopupAnchor popup={popup} />
        <DatePickerInput
          id={id}
          // A space keeps `:placeholder-shown` true while empty, so the format can stand in for it.
          placeholder={placeholder ?? ' '}
          className="peer h-full min-w-0 flex-1 bg-transparent tabular-nums outline-none placeholder:text-current/45 disabled:cursor-not-allowed"
        />
        {placeholder === undefined && (
          <DatePickerHint className="pointer-events-none absolute left-5 hidden tabular-nums opacity-45 peer-placeholder-shown:block" />
        )}
        <DatePickerTrigger
          aria-label={labels?.open}
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-[background-color,scale] duration-150 select-none hover:bg-current/10 active:scale-[0.94] disabled:cursor-not-allowed [&_svg]:size-[18px]"
        >
          <svg {...icon}>
            <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
            <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
          </svg>
        </DatePickerTrigger>
      </div>
      <DatePickerContent
        anchor={field}
        align="start"
        sideOffset={12}
        data-glass-popup=""
        data-glass-skip=""
        className="group/glass w-[19rem] max-w-[calc(100vw-1rem)] rounded-[28px] p-3 text-[15px] text-neutral-900 outline-none data-[glass-tone=dark]:text-white data-[glass-tone=light]:text-neutral-900"
      >
        <GlassPopupSurface popup={popup} />
        <div data-glass-list="" className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2 pb-1">
            <CalendarPrevious aria-label={labels?.previous} className={STEP}>
              <svg {...icon}>
                <path d="m15 18-6-6 6-6" />
              </svg>
            </CalendarPrevious>
            <CalendarHeading className="text-[15px] font-semibold tracking-tight" />
            <CalendarNext aria-label={labels?.next} className={STEP}>
              <svg {...icon}>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </CalendarNext>
          </div>
          <CalendarGrid className="mx-auto border-separate border-spacing-0.5">
            <CalendarWeekdays>{(index) => <CalendarWeekday index={index} className="h-7 text-center text-xs font-medium opacity-55" />}</CalendarWeekdays>
            {/* A press on a day lights the surface where it lands, as a choice in a list does. */}
            <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} data-glass-pick="" className={DAY} />}</CalendarWeeks>
          </CalendarGrid>
        </div>
      </DatePickerContent>
    </DatePicker>
  )
}

export default GlassDatePicker
