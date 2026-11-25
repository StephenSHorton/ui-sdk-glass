import { useState } from 'react'

import { GlassDatePicker } from '@/components/liquid-glass/glass-date-picker'

/** A timeline behind the glass: each bar a span of days, in its own flat colour. */
const BARS = [
  { left: '4%', width: '38%', top: 0, color: 'bg-orange-400' },
  { left: '30%', width: '44%', top: 26, color: 'bg-sky-500' },
  { left: '58%', width: '36%', top: 52, color: 'bg-lime-400' },
  { left: '12%', width: '30%', top: 78, color: 'bg-fuchsia-500' },
  { left: '48%', width: '40%', top: 104, color: 'bg-amber-300' },
]

// A From and To pair: each field holds a plain YYYY-MM-DD date, and each keeps the other
// honest (From can't pass To, To can't come before From). Type a date in the page's language
// and press Enter, or press the calendar: the month swells out of the whole field as one body
// of glass, and the arrow keys walk the days. Behind it, a timeline of flat colour to bend.
export default function Demo() {
  const [from, setFrom] = useState<string | null>('2026-11-02')
  const [to, setTo] = useState<string | null>('2026-11-27')
  return (
    <div className="relative isolate flex w-full max-w-xl flex-col items-center gap-5 py-8">
      {/* From the fields' top edge down, clear of their labels. */}
      <div aria-hidden className="absolute inset-x-0 top-[3.75rem] -z-10 h-32">
        {BARS.map((b) => (
          <span key={b.top} className={`absolute h-5 rounded-full ${b.color}`} style={{ left: b.left, width: b.width, top: b.top }} />
        ))}
      </div>
      <div className="flex flex-wrap items-end justify-center gap-3">
        <GlassDatePicker label="From" value={from} onValueChange={setFrom} max={to ?? undefined} className="w-52" />
        <GlassDatePicker label="To" value={to} onValueChange={setTo} min={from ?? undefined} className="w-52" />
      </div>
      <output className="rounded-full bg-white/70 px-3 py-1 font-mono text-xs text-neutral-900 dark:bg-neutral-900/70 dark:text-white">
        {from ?? '…'} → {to ?? '…'}
      </output>
    </div>
  )
}
