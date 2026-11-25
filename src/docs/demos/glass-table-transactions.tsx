import { Check, Paperclip } from 'lucide-react'
import { useState } from 'react'

import {
  GlassButton,
  GlassTable,
  GlassTableBody,
  GlassTableCell,
  GlassTableFooter,
  GlassTableHead,
  GlassTableHeader,
  GlassTableRow,
  GlassTabs,
  sortRows,
  type GlassTableSort,
} from '@/components/liquid-glass'

// A month of transactions at dashboard size: one sheet of glass, two dozen rows, a totals
// footer. Each row holds glass of its own: tabs used as a segmented control that file the
// expense as personal or business, and a button that attaches a receipt. Sort by any head and
// the rows, controls and all, move; the business total follows the tabs. On a narrow screen the
// table scrolls sideways inside its sheet. Behind it: coins of flat colour and the month's
// balance in large type, plain DOM.
type Kind = 'personal' | 'business'
type Transaction = { id: number; date: string; payee: string; category: string; account: string; amount: number; kind: Kind; receipt: boolean }

const transactions: Transaction[] = [
  { id: 1, date: '2026-11-24', payee: 'Northwind Coffee', category: 'Eating out', account: 'Debit ··4410', amount: -6.8, kind: 'personal', receipt: false },
  { id: 2, date: '2026-11-24', payee: 'Cloudframe Hosting', category: 'Software', account: 'Credit ··9021', amount: -48, kind: 'business', receipt: true },
  { id: 3, date: '2026-11-23', payee: 'Greenleaf Market', category: 'Groceries', account: 'Debit ··4410', amount: -84.32, kind: 'personal', receipt: false },
  { id: 4, date: '2026-11-22', payee: 'Metro Transit', category: 'Transport', account: 'Debit ··4410', amount: -32.5, kind: 'personal', receipt: false },
  { id: 5, date: '2026-11-21', payee: 'Acme Design Ltd.', category: 'Income', account: 'Checking ··1187', amount: 4200, kind: 'business', receipt: true },
  { id: 6, date: '2026-11-21', payee: 'Paper & Pixel', category: 'Office', account: 'Credit ··9021', amount: -129.99, kind: 'business', receipt: false },
  { id: 7, date: '2026-11-20', payee: 'City Power', category: 'Utilities', account: 'Checking ··1187', amount: -96.4, kind: 'personal', receipt: true },
  { id: 8, date: '2026-11-19', payee: 'Harbor Books', category: 'Education', account: 'Credit ··9021', amount: -38.75, kind: 'business', receipt: false },
  { id: 9, date: '2026-11-18', payee: 'Sunrise Bakery', category: 'Eating out', account: 'Debit ··4410', amount: -12.2, kind: 'personal', receipt: false },
  { id: 10, date: '2026-11-17', payee: 'Fieldnote Studio', category: 'Income', account: 'Checking ··1187', amount: 1350, kind: 'business', receipt: true },
  { id: 11, date: '2026-11-16', payee: 'Railway Express', category: 'Travel', account: 'Credit ··9021', amount: -214.6, kind: 'business', receipt: false },
  { id: 12, date: '2026-11-15', payee: 'Greenleaf Market', category: 'Groceries', account: 'Debit ··4410', amount: -61.08, kind: 'personal', receipt: false },
  { id: 13, date: '2026-11-14', payee: 'Linework Fonts', category: 'Software', account: 'Credit ··9021', amount: -79, kind: 'business', receipt: true },
  { id: 14, date: '2026-11-13', payee: 'Corner Pharmacy', category: 'Health', account: 'Debit ··4410', amount: -23.45, kind: 'personal', receipt: false },
  { id: 15, date: '2026-11-12', payee: 'Hilltop Hotel', category: 'Travel', account: 'Credit ··9021', amount: -342, kind: 'business', receipt: false },
  { id: 16, date: '2026-11-11', payee: 'Streamline Music', category: 'Subscriptions', account: 'Credit ··9021', amount: -10.99, kind: 'personal', receipt: true },
  { id: 17, date: '2026-11-10', payee: 'Northwind Coffee', category: 'Eating out', account: 'Debit ··4410', amount: -18.6, kind: 'business', receipt: false },
  { id: 18, date: '2026-11-08', payee: 'Bright Fiber', category: 'Utilities', account: 'Checking ··1187', amount: -65, kind: 'business', receipt: true },
  { id: 19, date: '2026-11-07', payee: 'Ridgeway Gym', category: 'Health', account: 'Debit ··4410', amount: -45, kind: 'personal', receipt: false },
  { id: 20, date: '2026-11-05', payee: 'Workbench Co-op', category: 'Office', account: 'Credit ··9021', amount: -275, kind: 'business', receipt: true },
  { id: 21, date: '2026-11-04', payee: 'Metro Transit', category: 'Transport', account: 'Debit ··4410', amount: -32.5, kind: 'personal', receipt: false },
  { id: 22, date: '2026-11-03', payee: 'Oakline Rentals', category: 'Rent', account: 'Checking ··1187', amount: -1850, kind: 'personal', receipt: true },
  { id: 23, date: '2026-11-02', payee: 'Taskboard Pro', category: 'Software', account: 'Credit ··9021', amount: -24, kind: 'business', receipt: false },
  { id: 24, date: '2026-11-01', payee: 'Acme Design Ltd.', category: 'Income', account: 'Checking ··1187', amount: 2800, kind: 'business', receipt: true },
]

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', signDisplay: 'exceptZero' })
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** "2026-11-24" → "Nov 24", read from the string itself (no time zone can move the day). */
const day = (iso: string) => `${months[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}`

const coins = [
  { left: '2%', top: '6%', size: 220, colour: '#ffd60a' },
  { left: '30%', top: '58%', size: 300, colour: '#0a84ff' },
  { left: '62%', top: '-4%', size: 260, colour: '#ff375f' },
  { left: '84%', top: '48%', size: 240, colour: '#30d158' },
  { left: '12%', top: '78%', size: 160, colour: '#bf5af2' },
]

export default function Demo() {
  const [sort, setSort] = useState<GlassTableSort>({ key: 'date', direction: 'descending' })
  const [rows, setRows] = useState(transactions)
  const update = (id: number, change: Partial<Transaction>) => setRows((all) => all.map((r) => (r.id === id ? { ...r, ...change } : r)))
  const total = rows.reduce((sum, r) => sum + r.amount, 0)
  const business = rows.filter((r) => r.kind === 'business' && r.amount < 0).reduce((sum, r) => sum + r.amount, 0)
  return (
    <div className="relative isolate w-full overflow-hidden rounded-3xl px-3 py-10 sm:px-8 sm:py-14">
      {/* The backdrop: coins of flat colour and the balance, in type large enough to bend. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {coins.map((c, i) => (
          <span key={i} className="absolute rounded-full" style={{ left: c.left, top: c.top, width: c.size, height: c.size, background: c.colour }} />
        ))}
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] leading-none font-bold tracking-[-0.06em] whitespace-nowrap text-black/55 tabular-nums dark:text-white/55">
          +$4,860
        </p>
      </div>

      <GlassTable aria-label="Transactions in November" sort={sort} onSortChange={setSort} className="mx-auto w-full max-w-[1000px]">
        <GlassTableHeader>
          <GlassTableRow>
            <GlassTableHead sortKey="date">Date</GlassTableHead>
            <GlassTableHead sortKey="payee">Payee</GlassTableHead>
            <GlassTableHead sortKey="category">Category</GlassTableHead>
            <GlassTableHead>Account</GlassTableHead>
            <GlassTableHead sortKey="kind">Expense</GlassTableHead>
            <GlassTableHead>Receipt</GlassTableHead>
            <GlassTableHead sortKey="amount" numeric>
              Amount
            </GlassTableHead>
          </GlassTableRow>
        </GlassTableHeader>
        <GlassTableBody>
          {sortRows(rows, sort).map((r) => (
            <GlassTableRow key={r.id}>
              <GlassTableCell className="tabular-nums opacity-60">{day(r.date)}</GlassTableCell>
              <GlassTableCell className="font-medium">{r.payee}</GlassTableCell>
              <GlassTableCell>{r.category}</GlassTableCell>
              <GlassTableCell className="tabular-nums opacity-60">{r.account}</GlassTableCell>
              <GlassTableCell>
                <GlassTabs
                  aria-label={`${r.payee}, ${day(r.date)}: expense type`}
                  size="sm"
                  value={r.kind}
                  onValueChange={(kind) => update(r.id, { kind })}
                  options={[
                    { value: 'personal', label: 'Personal' },
                    { value: 'business', label: 'Business' },
                  ]}
                />
              </GlassTableCell>
              <GlassTableCell>
                {r.receipt ? (
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-medium opacity-60">
                    <Check className="size-3.5" aria-hidden />
                    Attached
                  </span>
                ) : (
                  <GlassButton size="sm" icon={<Paperclip />} aria-label={`Attach a receipt to ${r.payee}, ${day(r.date)}`} onClick={() => update(r.id, { receipt: true })}>
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
        <GlassTableFooter>
          <GlassTableRow>
            <GlassTableCell colSpan={6}>Business expenses</GlassTableCell>
            <GlassTableCell numeric>{money.format(business)}</GlassTableCell>
          </GlassTableRow>
          <GlassTableRow>
            <GlassTableCell colSpan={6}>Total · {rows.length} transactions</GlassTableCell>
            <GlassTableCell numeric>{money.format(total)}</GlassTableCell>
          </GlassTableRow>
        </GlassTableFooter>
      </GlassTable>
    </div>
  )
}
