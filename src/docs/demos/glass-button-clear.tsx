import { ArrowRight } from 'lucide-react'

import { GlassButton } from '@/components/liquid-glass'

// Clear glass bends whatever is behind it: here, a few coloured stripes.
export default function Demo() {
  return (
    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl">
      <div aria-hidden className="absolute inset-0 flex flex-col">
        {['bg-rose-400', 'bg-amber-300', 'bg-emerald-400', 'bg-sky-400', 'bg-violet-400'].map((c) => (
          <div key={c} className={`flex-1 ${c}`} />
        ))}
      </div>
      <GlassButton size="lg" icon={<ArrowRight />}>
        Get started
      </GlassButton>
    </div>
  )
}
