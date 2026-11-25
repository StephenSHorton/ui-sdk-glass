import { GlassInput } from '@/components/liquid-glass/glass-input'

// A month of spending as flat bars, rising, and a search field laid across them: the bars bend at
// the field's rim and the words stay sharp on the glass. The field sits 14px below the middle
// (under its label), where the bars are centred. The first three are shorter than the field, so the label stays clear of them.
const bars = [
  { height: 40, colour: '#0a84ff' },
  { height: 32, colour: '#ff6b3d' },
  { height: 40, colour: '#30d158' },
  { height: 118, colour: '#bf5af2' },
  { height: 150, colour: '#ffd60a' },
  { height: 196, colour: '#ff375f' },
  { height: 164, colour: '#64d2ff' },
  { height: 220, colour: '#ff9f0a' },
  { height: 180, colour: '#5e5ce6' },
]

export default function Demo() {
  return (
    <div className="relative isolate flex h-80 w-full max-w-xl items-center justify-center">
      <div aria-hidden className="absolute top-[calc(50%+14px)] left-1/2 -z-10 flex h-56 -translate-x-1/2 -translate-y-1/2 items-center gap-2.5">
        {bars.map((bar, i) => (
          <span key={i} className="w-7 shrink-0 rounded-full" style={{ height: bar.height, background: bar.colour }} />
        ))}
      </div>
      <GlassInput label="Merchant" type="search" placeholder="Search merchants" className="w-72" />
    </div>
  )
}
