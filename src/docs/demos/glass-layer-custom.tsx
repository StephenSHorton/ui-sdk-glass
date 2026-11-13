import { ArrowUpRight } from 'lucide-react'

import { GlassLayer } from '@/components/liquid-glass'

// Any element can be glass: mark it `data-glass-host`, put <GlassLayer /> first.
// Works with router links too (Next.js <Link>, TanStack <Link>…).
export default function Demo() {
  return (
    <a
      href="https://github.com/bilalgursen/liquid-glass"
      target="_blank"
      rel="noreferrer"
      data-glass-host
      className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-white"
    >
      <GlassLayer material="tinted" />
      Star on GitHub
      <ArrowUpRight className="size-4" />
    </a>
  )
}
