import { Cloud, Navigation } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'

import { GlassCard } from '@/components/liquid-glass'

// Two rows of colour slide behind two cards, and the rims bend them as they pass. The rows
// move, so the cards are `live`: they repaint what is behind them every frame.
const colours = ['#0a84ff', '#ff6b3d', '#30d158', '#ff375f', '#ffd60a', '#bf5af2']

function Row({ shift, seconds, reverse = false }: { shift: number; seconds: number; reverse?: boolean }) {
  const pills = [...colours, ...colours].map((_, i) => colours[(i + shift) % colours.length])
  return (
    // Two identical halves slide by exactly one half, on the kit's own marquee (it stops under reduced motion).
    <div
      data-glass-marquee
      className="flex w-max"
      style={{ '--glass-marquee-duration': `${seconds}s`, animationDirection: reverse ? 'reverse' : undefined } as CSSProperties}
    >
      {[0, 1].map((half) => (
        <div key={half} className="flex gap-3 pr-3">
          {pills.map((colour, i) => (
            <span key={i} className="h-12 w-24 shrink-0 rounded-full" style={{ background: colour }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// The rows fade in at both sides through a mask: an SVG ramp, clear at the edges and solid
// from 10% in, stretched over the whole width (narrow enough to stay clear of the cards).
const FADE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 1" preserveAspectRatio="none"><linearGradient id="f"><stop offset="0" stop-opacity="0"/><stop offset=".1"/><stop offset=".9"/><stop offset="1" stop-opacity="0"/></linearGradient><rect width="100" height="1" fill="url(#f)"/></svg>',
)}")`
const fade: CSSProperties = {
  maskImage: FADE,
  WebkitMaskImage: FADE,
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
}

/** Today, read after mount so a prerendered page doesn't freeze the day it was built. */
function useToday() {
  const [today, setToday] = useState<Date | null>(null)
  useEffect(() => setToday(new Date()), [])
  return today
}

export default function Demo() {
  const today = useToday()
  const events = [
    { title: 'Visit my GitHub', note: 'github.com/bilalgursen', href: 'https://github.com/bilalgursen', colour: '#0a84ff' },
    { title: 'Star liquid-glass', note: 'Leave a star on the repo', href: 'https://github.com/bilalgursen/liquid-glass', colour: '#ff6b3d' },
  ]
  return (
    // Where the two cards do not fit side by side (a phone), only the first one shows, centred on the two rows.
    // The rows run from one side of the stage to the other (`data-bleed`: the site's stages drop their side padding for it).
    <div data-bleed className="@container relative flex w-full items-center justify-center gap-5 py-14">
      <div aria-hidden className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden" style={fade}>
        <Row shift={0} seconds={40} />
        <Row shift={3} seconds={48} reverse />
      </div>

      <GlassCard live className="flex size-44 flex-col justify-between p-4">
        <div>
          <p className="flex items-center gap-1 text-[13px] font-semibold">
            Istanbul
            <Navigation className="size-2.5 fill-current" />
          </p>
          <p className="mt-0.5 text-[44px] leading-none font-light tracking-[-0.04em]">16°</p>
        </div>
        <div className="text-[12px] leading-snug font-semibold">
          <Cloud className="mb-1 size-4 fill-current" />
          <p>Cloudy</p>
          <p className="opacity-60">H:19° L:15°</p>
        </div>
      </GlassCard>

      <GlassCard live className="hidden h-44 w-64 flex-col justify-between p-5 @min-[452px]:flex">
        <div className="flex items-baseline justify-between">
          <p className="text-[14px] font-semibold">{today ? today.toLocaleDateString(undefined, { weekday: 'long' }) : 'Today'}</p>
          <p className="text-[34px] leading-none font-semibold tracking-[-0.05em] tabular-nums">{today?.getDate()}</p>
        </div>
        <ul className="flex flex-col gap-2">
          {events.map((e) => (
            <li key={e.title}>
              <a href={e.href} target="_blank" rel="noreferrer" className="flex items-stretch gap-2.5 rounded-sm">
                <span className="w-1 shrink-0 rounded-full" style={{ background: e.colour }} />
                <span>
                  <span className="block text-[13px] leading-tight font-semibold">{e.title}</span>
                  <span className="block text-[11px] font-medium opacity-60">{e.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}
