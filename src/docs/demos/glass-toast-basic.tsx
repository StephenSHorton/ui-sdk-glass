import { Download, RefreshCw, Bookmark } from 'lucide-react'
import { useEffect, useId, useState, type CSSProperties } from 'react'

import { GlassButton } from '@/components/liquid-glass'
import { GlassToaster, createToaster } from '@/components/liquid-glass/glass-toast'

// A month of prices as bars of flat colour, and the three things a dashboard says afterwards:
// Refresh (a loading toast that turns into its result), Save mark (a plain toast with Undo) and
// Export (an error with Retry). Press them a few times: the toasts gather into a stack over the
// bars, fan out under the pointer, and go after four seconds.
const bars = [38, 52, 46, 61, 57, 70, 64, 78, 72, 85, 80, 92, 88, 74, 82, 96]
const colours = ['#0a84ff', '#30d158', '#ff9f0a', '#ff375f', '#bf5af2']

const wait = (ms: number) => new Promise((done) => setTimeout(done, ms))

export default function Demo() {
  // In your app: one <GlassToaster /> near the root, and `toast` from the same file. Here the
  // demo keeps a queue of its own, so its toasts never mix with another demo's.
  const [toast] = useState(() => createToaster({ duration: 4000 }))
  useEffect(() => () => void toast.dismiss(), [toast])
  // The toasts rise over this stage (CSS anchor positioning); where a browser lacks it, they
  // sit at the bottom of the window, as they would in an app.
  const anchor = `--toasts-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const [exports, setExports] = useState(0)

  const refresh = () =>
    toast.promise(() => wait(1400), { loading: 'Refreshing prices…', success: 'Prices refreshed', error: 'Could not refresh' })
  const save = () =>
    toast('Mark saved', {
      description: 'AAPL at $231.40',
      action: { label: 'Undo', onAction: () => void toast('Mark removed') },
    })
  // Every other export fails, so both outcomes show.
  const exportCsv = () => {
    const fails = exports % 2 === 0
    setExports((n) => n + 1)
    if (!fails) return void toast.success('Exported', { description: 'prices-november.csv' })
    toast.error('Could not export', {
      description: 'The file server did not answer.',
      action: { label: 'Retry', onAction: () => void toast.success('Exported', { description: 'prices-november.csv' }) },
    })
  }

  return (
    <div className="relative isolate flex h-[30rem] w-full max-w-xl flex-col items-center overflow-hidden pt-14" style={{ anchorName: anchor } as CSSProperties}>
      {/* The backdrop the glass bends: flat bars and a price, plain DOM. */}
      <div aria-hidden className="absolute inset-x-6 bottom-0 -z-10 flex h-64 items-end gap-1.5">
        {bars.map((height, i) => (
          <span key={i} className="flex-1 rounded-t-md" style={{ height: `${height}%`, background: colours[i % colours.length] }} />
        ))}
      </div>
      <p aria-hidden className="text-5xl font-semibold tracking-tight text-neutral-900 tabular-nums dark:text-white">$48,210.32</p>
      <p aria-hidden className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Portfolio · November</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <GlassButton icon={<RefreshCw />} onClick={refresh}>
          Refresh
        </GlassButton>
        <GlassButton icon={<Bookmark />} onClick={save}>
          Save mark
        </GlassButton>
        <GlassButton icon={<Download />} onClick={exportCsv}>
          Export
        </GlassButton>
      </div>
      <GlassToaster
        toaster={toast}
        align="center"
        style={{ positionAnchor: anchor, bottom: 'anchor(bottom)', left: 'anchor(center)' } as CSSProperties}
      />
    </div>
  )
}
