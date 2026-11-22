import { useState } from 'react'

import { GlassSelect } from '@/components/liquid-glass/glass-select'

const options = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'same-day', label: 'Same day' },
  { value: 'pickup', label: 'Pickup (closed today)', disabled: true },
]

// Open it: the list swells out of the whole button, a neck stretches between them and snaps,
// and the options arrive one by one. Close it and the same motion plays backwards.
// The flat shapes are only there for the glass to bend.
export default function Demo() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="relative isolate flex h-72 w-full max-w-xl items-start justify-center pt-1">
      <div aria-hidden className="absolute top-10 left-1/2 -z-10 h-56 w-40 -translate-x-[150%] rounded-[3rem] bg-[#00b386]" />
      <div aria-hidden className="absolute top-24 left-1/2 -z-10 size-52 -translate-x-[10%] rounded-full bg-[#ff4f8b]" />
      <div aria-hidden className="absolute top-44 left-1/2 -z-10 h-12 w-80 -translate-x-[70%] rounded-full bg-[#ffb000]" />
      <GlassSelect label="Delivery" placeholder="Choose a speed" options={options} value={value} onValueChange={setValue} />
    </div>
  )
}
