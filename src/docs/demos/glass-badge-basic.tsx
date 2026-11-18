import { Sparkles } from 'lucide-react'

import { GlassBadge } from '@/components/liquid-glass'

// The badge sits on the tile's corner; the tile shows through the glass, blurred.
// Hover the tile: the text flows faster.
export default function Demo() {
  return (
    <div className="relative w-full max-w-xs rounded-[28px] bg-white p-7 dark:bg-neutral-800">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
        <Sparkles className="size-5" />
      </span>
      <p className="mt-6 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">Autumn update</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">Sliders, switches and checkboxes, now in liquid glass.</p>
      <GlassBadge className="absolute -top-2.5 -right-2.5" dotColor="#f97316">
        New
      </GlassBadge>
    </div>
  )
}
