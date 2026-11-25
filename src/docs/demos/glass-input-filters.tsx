import { useState } from 'react'

import { GlassInput } from '@/components/liquid-glass/glass-input'
import { GlassSelect } from '@/components/liquid-glass/glass-select'

const categories = [
  { value: 'all', label: 'All categories' },
  { value: 'travel', label: 'Travel' },
  { value: 'meals', label: 'Meals' },
  { value: 'software', label: 'Software' },
]

// A filter row: the search field and a Select are the same height and the same glass, so they
// line up. Behind them, three discs of flat colour for the glass to bend.
export default function Demo() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>('all')
  return (
    <div className="relative isolate flex min-h-80 w-full max-w-2xl flex-col items-center justify-center gap-6 py-10">
      <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
        <span className="size-44 shrink-0 translate-x-10 translate-y-4 rounded-full bg-[#ff6b3d]" />
        <span className="size-56 shrink-0 rounded-full bg-[#0a84ff]" />
        <span className="size-40 shrink-0 -translate-x-8 -translate-y-6 rounded-full bg-[#ffd60a]" />
      </div>
      <div className="flex flex-wrap items-end justify-center gap-3">
        <GlassInput label="Merchant" type="search" placeholder="Search merchants" value={query} onValueChange={setQuery} />
        <GlassSelect label="Category" options={categories} value={category} onValueChange={setCategory} className="w-48" />
      </div>
      <p className="rounded-full bg-white/80 px-3 py-1 text-[13px] font-medium text-neutral-700 tabular-nums dark:bg-black/60 dark:text-neutral-200">
        {query ? `Looking for “${query}”` : 'Every merchant'} · {categories.find((c) => c.value === category)?.label ?? 'All categories'}
      </p>
    </div>
  )
}
