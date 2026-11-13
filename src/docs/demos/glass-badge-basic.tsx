import { GlassBadge } from '@/components/liquid-glass'

// The badge sits on the card's corner; the card shows through the glass, blurred.
export default function Demo() {
  return (
    <div className="relative w-64 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
      <p className="text-sm font-semibold text-neutral-900 dark:text-white">Release notes</p>
      <p className="mt-1 text-[13px] text-neutral-500">Liquid glass tabs and badges.</p>
      <GlassBadge className="absolute -top-2.5 -right-2.5" dotColor="#f97316">
        New
      </GlassBadge>
    </div>
  )
}
