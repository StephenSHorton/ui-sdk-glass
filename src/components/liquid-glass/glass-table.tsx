'use client'

// GlassTable — rows of data on one large sheet of glass. The sheet is GlassCard's glass (the
// same frost, tint and rim), so the numbers stay readable over any backdrop; inside it is a
// real HTML <table>: a header, rows, a totals row, and headers that sort when pressed.
//
//   const [sort, setSort] = useState<GlassTableSort>({ key: 'date', direction: 'descending' })
//
//   <GlassTable aria-label="Transactions" sort={sort} onSortChange={setSort} className="w-full">
//     <GlassTableHeader>
//       <GlassTableRow>
//         <GlassTableHead sortKey="date">Date</GlassTableHead>
//         <GlassTableHead>Payee</GlassTableHead>
//         <GlassTableHead sortKey="amount" numeric>Amount</GlassTableHead>
//       </GlassTableRow>
//     </GlassTableHeader>
//     <GlassTableBody>
//       {sortRows(rows, sort).map((r) => (
//         <GlassTableRow key={r.id}>
//           <GlassTableCell>{r.date}</GlassTableCell>
//           <GlassTableCell>{r.payee}</GlassTableCell>
//           <GlassTableCell numeric>{r.amount}</GlassTableCell>
//         </GlassTableRow>
//       ))}
//     </GlassTableBody>
//     <GlassTableFooter>…the totals row…</GlassTableFooter>
//   </GlassTable>
//
// The sheet is one glass however many rows it has: it draws when something changes and never
// at rest. A table wider than its sheet scrolls sideways inside it; the glass stays put.
// `className` and `style` are the sheet's (size, corners, a `bg-*` for tinted glass); every
// other attribute goes to the <table> (`aria-label`, `id`…). Glass controls (GlassButton,
// GlassTabs) can sit in its cells: they bend the sheet and the rows behind them.
// COPY VERBATIM. MIT — https://github.com/bilalgursen/liquid-glass

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react'

import { GlassCard } from './glass-card'
import type { GlassMaterial, GlassOptics } from './glass-layer'

export type GlassTableSortDirection = 'ascending' | 'descending'
/** Which column the rows are sorted by (a head's `sortKey`), and which way. */
export type GlassTableSort = { key: string; direction: GlassTableSortDirection }

export type GlassTableProps = {
  children?: ReactNode
  /** The sort, controlled. `null`: not sorted. */
  sort?: GlassTableSort | null
  /** The sort to start with, uncontrolled. */
  defaultSort?: GlassTableSort | null
  /** A sortable head was pressed: the new sort. Sort your rows by it (`sortRows`). */
  onSortChange?: (sort: GlassTableSort) => void
  /** Glass look, as GlassCard's. Default `clear`: frosts and bends what is behind. */
  material?: GlassMaterial
  /** Clear glass: how much tint covers the backdrop (0–1, default 0.7). */
  tint?: number
  /** Clear glass: how much the backdrop is frosted, in px like CSS `blur()` (default 5). */
  blur?: number
  /** Repaint the backdrop every frame, for content that moves behind the table. */
  live?: boolean
  /** Fine-tuning of the glass, merged over the card's own. */
  optics?: GlassOptics
  /** The sheet's classes: size, corners, margin; `bg-*` with `material="tinted"`. */
  className?: string
  /** The sheet's style. */
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLTableElement>, 'children' | 'className' | 'style'>

type SortContext = { sort: GlassTableSort | null; press: (key: string) => void }
const Sorting = createContext<SortContext | null>(null)

export function GlassTable({
  children,
  sort: controlled,
  defaultSort = null,
  onSortChange,
  material = 'clear',
  tint,
  blur,
  live,
  optics,
  className = '',
  style,
  ...table
}: GlassTableProps) {
  const [own, setOwn] = useState<GlassTableSort | null>(defaultSort)
  const sort = controlled !== undefined ? controlled : own
  const press = (key: string) => {
    // A new column starts ascending; the sorted one turns round.
    const next: GlassTableSort =
      sort?.key === key ? { key, direction: sort.direction === 'ascending' ? 'descending' : 'ascending' } : { key, direction: 'ascending' }
    if (controlled === undefined) setOwn(next)
    onSortChange?.(next)
  }

  // Rows that move (a sort, a filter) carry any glass in them to a new place, where something
  // else lies behind it. Glass reads what is behind it again when the page scrolls, so a change
  // of rows tells it the same way a scroll would: one `scroll` event on the table itself (it
  // does not bubble, and the table never scrolls, so no listener of yours mistakes it). Changes
  // inside a cell (a label, a tab's highlight) move nothing and say nothing.
  const tableRef = useRef<HTMLTableElement>(null)
  useEffect(() => {
    const el = tableRef.current
    if (!el) return
    const mo = new MutationObserver((changes) => {
      if (changes.some((c) => c.target === el || /^(THEAD|TBODY|TFOOT)$/.test((c.target as Element).tagName))) el.dispatchEvent(new Event('scroll'))
    })
    mo.observe(el, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])

  return (
    <GlassCard material={material} tint={tint} blur={blur} live={live} optics={optics} className={className} style={style}>
      {/* Wider than the sheet, the table scrolls sideways in here; the sheet's corners clip it. */}
      <div className="relative overflow-x-auto overscroll-x-contain rounded-[inherit]">
        <table ref={tableRef} {...table} className="w-full min-w-max border-collapse text-left text-[14px]">
          <Sorting.Provider value={{ sort, press }}>{children}</Sorting.Provider>
        </table>
      </div>
    </GlassCard>
  )
}

type Section = HTMLAttributes<HTMLTableSectionElement>

/** The header rows (`<thead>`). */
export function GlassTableHeader({ className = '', ...rest }: Section) {
  return <thead className={className} {...rest} />
}

/** The rows of data (`<tbody>`). A thin line runs between rows. */
export function GlassTableBody({ className = '', ...rest }: Section) {
  return <tbody className={`[&>tr]:border-t [&>tr]:border-current/10 ${className}`} {...rest} />
}

/** The totals (`<tfoot>`): set apart by a stronger line, in bold. */
export function GlassTableFooter({ className = '', ...rest }: Section) {
  return <tfoot className={`border-t border-current/25 font-semibold ${className}`} {...rest} />
}

/** A row (`<tr>`). */
export function GlassTableRow({ className = '', ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={className} {...rest} />
}

/** A title for the table (`<caption>`), read first by screen readers. Hide it visually with `sr-only`. */
export function GlassTableCaption({ className = '', ...rest }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={`px-5 pt-4 text-left text-[13px] font-semibold ${className}`} {...rest} />
}

// The cells' room: 16 px between columns, 20 px at the sheet's sides.
const pad = 'px-4 first:pl-5 last:pr-5'

export type GlassTableHeadProps = {
  /** Makes the head a button that sorts the rows by this key. */
  sortKey?: string
  /** A column of numbers: right-aligned, in figures of one width. */
  numeric?: boolean
} & ThHTMLAttributes<HTMLTableCellElement>

/**
 * A column head (`<th scope="col">`). With `sortKey` it holds a button: pressed, it sorts the
 * rows by that key, and the head says which way with `aria-sort` and an arrow.
 */
export function GlassTableHead({ sortKey, numeric = false, className = '', children, ...rest }: GlassTableHeadProps) {
  const ctx = useContext(Sorting)
  const active = sortKey !== undefined && ctx?.sort?.key === sortKey ? ctx.sort.direction : null
  const align = numeric ? 'text-right' : 'text-left'
  const base = `h-11 ${pad} ${align} align-middle text-[12px] font-semibold whitespace-nowrap`
  if (sortKey === undefined || !ctx)
    return (
      <th scope="col" className={`${base} opacity-60 ${className}`} {...rest}>
        {children}
      </th>
    )
  return (
    <th scope="col" aria-sort={active ?? undefined} className={`${base} ${className}`} {...rest}>
      <button
        type="button"
        onClick={() => ctx.press(sortKey)}
        // On a column of numbers the arrow goes first, so the label lines up with the figures.
        className={`group/sort -mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 font-semibold whitespace-nowrap outline-none select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-[#3291FF] ${
          numeric ? 'flex-row-reverse' : ''
        } ${active ? '' : 'opacity-60 hover:opacity-100'} transition-opacity duration-150`}
      >
        {children}
        <SortArrow direction={active} />
      </button>
    </th>
  )
}

/** Up for ascending, down for descending; both, faint, on a column that can be sorted but is not. */
function SortArrow({ direction }: { direction: GlassTableSortDirection | null }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {direction === null ? (
        <path d="M3.5 4.75 6 2.25l2.5 2.5M3.5 7.25 6 9.75l2.5-2.5" opacity={0.6} />
      ) : direction === 'ascending' ? (
        <path d="M6 9.75v-7.5M3 5.25l3-3 3 3" />
      ) : (
        <path d="M6 2.25v7.5M3 6.75l3 3 3-3" />
      )}
    </svg>
  )
}

export type GlassTableCellProps = {
  /** A number: right-aligned, in figures of one width. */
  numeric?: boolean
} & TdHTMLAttributes<HTMLTableCellElement>

/** A cell (`<td>`). */
export function GlassTableCell({ numeric = false, className = '', ...rest }: GlassTableCellProps) {
  return <td className={`h-12 ${pad} align-middle whitespace-nowrap ${numeric ? 'text-right tabular-nums' : ''} ${className}`} {...rest} />
}

/**
 * Your rows in the order `sort` asks for, as a new array (the rows you pass stay as they are).
 * Numbers and dates compare by value, text as people read it ("Item 2" before "Item 10").
 * `value` reads a row's value for a key; by default `row[key]`.
 */
export function sortRows<T>(rows: readonly T[], sort: GlassTableSort | null | undefined, value: (row: T, key: string) => unknown = (row, key) => (row as Record<string, unknown>)[key]): T[] {
  if (!sort) return [...rows]
  const sign = sort.direction === 'ascending' ? 1 : -1
  return [...rows].sort((a, b) => {
    const va = value(a, sort.key)
    const vb = value(b, sort.key)
    // Empty values go last, whichever way the column is sorted.
    const ea = va === null || va === undefined || va === ''
    const eb = vb === null || vb === undefined || vb === ''
    if (ea || eb) return ea === eb ? 0 : ea ? 1 : -1
    return sign * compare(va, vb)
  })
}

const collator = typeof Intl !== 'undefined' ? new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }) : null

function compare(a: unknown, b: unknown): number {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'number' && typeof b === 'number') return a - b
  const sa = String(a)
  const sb = String(b)
  return collator ? collator.compare(sa, sb) : sa < sb ? -1 : sa > sb ? 1 : 0
}

export default GlassTable
