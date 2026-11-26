import { createFileRoute, notFound } from '@tanstack/react-router'
import { Paperclip } from 'lucide-react'
import { useMemo, useState } from 'react'

import { GlassButton, GlassTable, GlassTableBody, GlassTableCell, GlassTableHead, GlassTableHeader, GlassTableRow, GlassTabs, sortRows, type GlassTableSort } from '@/components/liquid-glass'

// Development only (a 404 in production): a GlassTable of thousands of rows, each with a
// GlassTabs of three choices and a GlassButton, over the transactions demo's backdrop repeated
// down the page. It is the table a dashboard shows for a year of payments: the sheet must keep its
// frost and the page must scroll smoothly. `?rows=` sets how many (3,000 by default).
export const Route = createFileRoute('/{-$locale}/table-lab')({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  head: () => ({ meta: [{ title: 'Table lab — Liquid Glass UI' }, { name: 'robots', content: 'noindex' }] }),
  component: TableLab,
})

type Kind = 'personal' | 'business' | 'split'
type Row = { id: number; date: string; payee: string; category: string; amount: number; kind: Kind }

const payees = ['Northwind Coffee', 'Cloudframe Hosting', 'Greenleaf Market', 'Metro Transit', 'Acme Design Ltd.', 'Paper & Pixel', 'City Power', 'Harbor Books', 'Sunrise Bakery', 'Railway Express', 'Hilltop Hotel', 'Workbench Co-op']
const categories = ['Eating out', 'Software', 'Groceries', 'Transport', 'Income', 'Office', 'Utilities', 'Education', 'Travel']
const kinds: Kind[] = ['personal', 'business', 'split']
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', signDisplay: 'exceptZero' })

function makeRows(count: number): Row[] {
  const rows: Row[] = []
  const start = Date.UTC(2026, 10, 24)
  for (let i = 0; i < count; i++) {
    const d = new Date(start - Math.floor(i / 8) * 86_400_000)
    rows.push({
      id: i + 1,
      date: d.toISOString().slice(0, 10),
      payee: payees[(i * 7) % payees.length],
      category: categories[(i * 5) % categories.length],
      amount: i % 11 === 0 ? 1200 + ((i * 37) % 3000) : -Math.round(((i * 7919) % 40000) / 100 + 3),
      kind: kinds[i % 3],
    })
  }
  return rows
}

// The transactions demo's coins of flat colour, one band of them every BAND px down the page.
const BAND = 720
const coins = [
  { left: '2%', top: 40, size: 220, colour: '#ffd60a' },
  { left: '30%', top: 420, size: 300, colour: '#0a84ff' },
  { left: '62%', top: -30, size: 260, colour: '#ff375f' },
  { left: '84%', top: 340, size: 240, colour: '#30d158' },
  { left: '12%', top: 560, size: 160, colour: '#bf5af2' },
]

function TableLab() {
  const query = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search)
  const count = Number(query?.get('rows')) || 3000
  // `?controls=plain`: the rows' tabs and buttons without glass, to measure the table and page alone
  // (`tabs` or `buttons`: only those of glass).
  const controls = query?.get('controls')
  const plainTabs = controls === 'plain' || controls === 'buttons'
  const plainButtons = controls === 'plain' || controls === 'tabs'
  const [rows, setRows] = useState(() => makeRows(count))
  const [sort, setSort] = useState<GlassTableSort>({ key: 'date', direction: 'descending' })
  const sorted = useMemo(() => sortRows(rows, sort), [rows, sort])
  const setKind = (id: number, kind: Kind) => setRows((all) => all.map((r) => (r.id === id ? { ...r, kind } : r)))
  return (
    <div className="relative isolate overflow-hidden px-3 py-14 sm:px-8">
      <div aria-hidden className="absolute inset-0 -z-10">
        {Array.from({ length: Math.ceil((count * 48 + 400) / BAND) }, (_, b) => (
          <div key={b} className="absolute inset-x-0" style={{ top: b * BAND, height: BAND }}>
            {coins.map((c, i) => (
              <span key={i} className="absolute rounded-full" style={{ left: c.left, top: c.top, width: c.size, height: c.size, background: c.colour }} />
            ))}
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] leading-none font-bold tracking-[-0.06em] whitespace-nowrap text-black/55 tabular-nums dark:text-white/55">
              +$4,860
            </p>
          </div>
        ))}
      </div>
      <GlassTable aria-label={`${count} transactions`} sort={sort} onSortChange={setSort} className="mx-auto w-full max-w-[1000px]" data-table-lab="">
        <GlassTableHeader>
          <GlassTableRow>
            <GlassTableHead sortKey="date">Date</GlassTableHead>
            <GlassTableHead sortKey="payee">Payee</GlassTableHead>
            <GlassTableHead sortKey="category">Category</GlassTableHead>
            <GlassTableHead sortKey="kind">Expense</GlassTableHead>
            <GlassTableHead>Receipt</GlassTableHead>
            <GlassTableHead sortKey="amount" numeric>
              Amount
            </GlassTableHead>
          </GlassTableRow>
        </GlassTableHeader>
        <GlassTableBody>
          {sorted.map((r) => (
            <GlassTableRow key={r.id}>
              <GlassTableCell className="tabular-nums opacity-60">{r.date}</GlassTableCell>
              <GlassTableCell className="font-medium">{r.payee}</GlassTableCell>
              <GlassTableCell>{r.category}</GlassTableCell>
              <GlassTableCell>
                {plainTabs ? (
                  <span className="inline-flex gap-1 rounded-full bg-black/5 p-1 text-xs">
                    <span className="px-3 py-1">Personal</span>
                    <span className="px-3 py-1">Business</span>
                    <span className="px-3 py-1">Split</span>
                  </span>
                ) : (
                <GlassTabs
                  aria-label={`${r.payee}, ${r.date}: expense type`}
                  size="sm"
                  value={r.kind}
                  onValueChange={(kind) => setKind(r.id, kind)}
                  options={[
                    { value: 'personal', label: 'Personal' },
                    { value: 'business', label: 'Business' },
                    { value: 'split', label: 'Split' },
                  ]}
                />
                )}
              </GlassTableCell>
              <GlassTableCell>
                {plainButtons ? <button type="button" className="h-8 rounded-full border px-4 text-[13px]">Attach</button> : (
                <GlassButton size="sm" icon={<Paperclip />} aria-label={`Attach a receipt to ${r.payee}, ${r.date}`}>
                  Attach
                </GlassButton>
                )}
              </GlassTableCell>
              <GlassTableCell numeric className={`font-medium ${r.amount > 0 ? 'text-[#248a3d] dark:text-[#30d158]' : ''}`}>
                {money.format(r.amount)}
              </GlassTableCell>
            </GlassTableRow>
          ))}
        </GlassTableBody>
      </GlassTable>
    </div>
  )
}
