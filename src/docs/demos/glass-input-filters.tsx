import { useState } from 'react'

import { GlassInput } from '@/components/liquid-glass/glass-input'
import { GlassSelect } from '@/components/liquid-glass/glass-select'

const categories = [
  { value: 'all', label: 'All categories' },
  { value: 'travel', label: 'Travel' },
  { value: 'meals', label: 'Meals' },
  { value: 'software', label: 'Software' },
]

const tiles = ['#ff6b3d', '#ffd60a', '#30d158', '#64d2ff', '#0a84ff', '#5e5ce6', '#bf5af2', '#ff375f', '#ff9f0a', '#30d158', '#0a84ff', '#ffd60a']

// A filter row: the search field and a Select are the same height and the same glass, so they
// line up. Behind them, one band of flat colour tiles, a little taller than the fields and centred
// on them, so the labels above stay on the page's own colour.
export default function Demo() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>('all')
  return (
    <div className="flex min-h-80 w-full max-w-2xl flex-col items-center justify-center gap-8 py-10">
      <div className="relative isolate flex flex-wrap items-end justify-center gap-3">
        <div aria-hidden className="absolute -inset-x-16 -bottom-1 -z-10 flex h-14 justify-center gap-2 overflow-hidden">
          {tiles.map((colour, i) => (
            <span key={i} className="size-14 shrink-0 rounded-2xl" style={{ background: colour }} />
          ))}
        </div>
        <GlassInput label="Merchant" type="search" placeholder="Search merchants" value={query} onValueChange={setQuery} />
        <GlassSelect label="Category" options={categories} value={category} onValueChange={setCategory} className="w-48" />
      </div>
      <p className="text-[13px] font-medium text-neutral-600 tabular-nums dark:text-neutral-400">
        {query ? `Looking for “${query}”` : 'Every merchant'} · {categories.find((c) => c.value === category)?.label ?? 'All categories'}
      </p>
    </div>
  )
}
