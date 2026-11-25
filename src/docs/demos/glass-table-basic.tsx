import { useState } from 'react'

import {
  GlassTable,
  GlassTableBody,
  GlassTableCell,
  GlassTableFooter,
  GlassTableHead,
  GlassTableHeader,
  GlassTableRow,
  sortRows,
  type GlassTableSort,
} from '@/components/liquid-glass'

// A month's budget on one sheet of glass, over the month itself drawn as a bar chart: flat
// columns of colour, plain DOM. Press a head to sort by it; press it again to turn it round.
const budget = [
  { category: 'Rent', planned: 1850, spent: 1850, colour: '#0a84ff' },
  { category: 'Groceries', planned: 600, spent: 472.4, colour: '#30d158' },
  { category: 'Transport', planned: 240, spent: 268.9, colour: '#ff9f0a' },
  { category: 'Eating out', planned: 300, spent: 341.25, colour: '#ff375f' },
  { category: 'Utilities', planned: 210, spent: 188.6, colour: '#bf5af2' },
  { category: 'Software', planned: 120, spent: 96, colour: '#64d2ff' },
].map((row) => ({ ...row, left: row.planned - row.spent }))

// Heights in px: the taller columns rise above the sheet, the shorter ones stay behind it.
const bars = [220, 350, 270, 420, 310, 450, 370, 260, 400, 300]
const barColours = ['#0a84ff', '#30d158', '#ff9f0a', '#ff375f', '#bf5af2', '#ffd60a', '#64d2ff', '#ff6b3d', '#5e5ce6', '#30d158']

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function Demo() {
  const [sort, setSort] = useState<GlassTableSort>({ key: 'spent', direction: 'descending' })
  const total = (key: 'planned' | 'spent' | 'left') => budget.reduce((sum, row) => sum + row[key], 0)
  return (
    <div className="relative isolate flex w-full max-w-xl justify-center px-2 pt-28 pb-6">
      {/* The backdrop: a bar chart of flat columns. Their feet stand behind the sheet, the tallest rise above it. */}
      <div aria-hidden className="absolute inset-x-0 bottom-12 -z-10 flex items-end justify-center gap-3 overflow-hidden">
        {bars.map((height, i) => (
          <span key={i} className="w-9 shrink-0 rounded-t-xl" style={{ height, background: barColours[i] }} />
        ))}
      </div>

      <GlassTable aria-label="Budget for November" sort={sort} onSortChange={setSort} className="w-full max-w-[520px]">
        <GlassTableHeader>
          <GlassTableRow>
            <GlassTableHead sortKey="category">Category</GlassTableHead>
            <GlassTableHead sortKey="planned" numeric>
              Planned
            </GlassTableHead>
            <GlassTableHead sortKey="spent" numeric>
              Spent
            </GlassTableHead>
            <GlassTableHead sortKey="left" numeric>
              Left
            </GlassTableHead>
          </GlassTableRow>
        </GlassTableHeader>
        <GlassTableBody>
          {sortRows(budget, sort).map((row) => (
            <GlassTableRow key={row.category}>
              <GlassTableCell className="font-medium">
                <span className="mr-2.5 inline-block size-2 rounded-full align-middle" style={{ background: row.colour }} />
                {row.category}
              </GlassTableCell>
              <GlassTableCell numeric className="opacity-60">
                {money.format(row.planned)}
              </GlassTableCell>
              <GlassTableCell numeric>{money.format(row.spent)}</GlassTableCell>
              <GlassTableCell numeric className={row.left < 0 ? 'text-[#d70015] dark:text-[#ff6961]' : ''}>
                {money.format(row.left)}
              </GlassTableCell>
            </GlassTableRow>
          ))}
        </GlassTableBody>
        <GlassTableFooter>
          <GlassTableRow>
            <GlassTableCell>Total</GlassTableCell>
            <GlassTableCell numeric>{money.format(total('planned'))}</GlassTableCell>
            <GlassTableCell numeric>{money.format(total('spent'))}</GlassTableCell>
            <GlassTableCell numeric>{money.format(total('left'))}</GlassTableCell>
          </GlassTableRow>
        </GlassTableFooter>
      </GlassTable>
    </div>
  )
}
