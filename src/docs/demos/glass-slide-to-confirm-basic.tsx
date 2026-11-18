import { GlassSlideToConfirm } from '@/components/liquid-glass'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Drag the thumb to the end: it turns to clear glass, pulls the fill behind it and bends
// the label it passes. Let go early and it springs back.
export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-neutral-900 text-[15px] font-semibold text-white dark:bg-white dark:text-neutral-900">BG</span>
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Sending to Bilal Gürşen</p>
      <p className="mt-1 text-6xl font-semibold tracking-tight text-neutral-900 tabular-nums dark:text-white">$240</p>
      <GlassSlideToConfirm className="mt-9" size="lg" pendingLabel="Sending" successLabel="Sent to Bilal" resetAfter={2600} onConfirm={() => wait(1400)}>
        Slide to send
      </GlassSlideToConfirm>
    </div>
  )
}
