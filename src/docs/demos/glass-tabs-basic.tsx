import { useState } from 'react'

import { GlassTabs } from '@/components/liquid-glass'

// Click or drag: the selection slides as a lens that bends the labels it passes.
export default function Demo() {
  const [range, setRange] = useState('week')
  return (
    <GlassTabs
      aria-label="Range"
      value={range}
      onValueChange={setRange}
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
      ]}
    />
  )
}
