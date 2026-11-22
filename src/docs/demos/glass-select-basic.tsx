import { useState } from 'react'

import { GlassSelect } from '@/components/liquid-glass/glass-select'

const options = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'same-day', label: 'Same day' },
  { value: 'pickup', label: 'Pickup (closed today)', disabled: true },
]

// Blinds for the glass to bend: slats that run from violet to pink, lit from the top left and
// falling into shade below. One element, three plain CSS gradients, nothing animated.
const blinds = {
  backgroundImage: [
    'radial-gradient(circle at 28% 12%, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0) 58%)',
    'linear-gradient(180deg, rgba(12, 6, 40, 0) 30%, rgba(12, 6, 40, 0.72) 100%)',
    'repeating-linear-gradient(90deg, #5227ff 0px, #ff9ffc 48px)',
  ].join(', '),
}

// Open it: the list swells out of the whole button, a neck stretches between them and snaps,
// and the options arrive one by one. Close it and the same motion plays backwards.
export default function Demo() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="relative isolate flex h-72 w-full max-w-xl items-start justify-center pt-1">
      <div aria-hidden className="absolute inset-x-0 top-8 bottom-0 -z-10 rounded-3xl" style={blinds} />
      <GlassSelect label="Delivery" placeholder="Choose a speed" options={options} value={value} onValueChange={setValue} />
    </div>
  )
}
