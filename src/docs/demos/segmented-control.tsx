import { useState } from 'react'

import { SegmentedControl } from '@/components/liquid-glass/controls/SegmentedControl'

// Hold and drag the frosted pill: it turns into a magnifying lens.
export default function Demo() {
  const [view, setView] = useState('week')
  return (
    <SegmentedControl
      ariaLabel="Range"
      value={view}
      onChange={setView}
      options={[
        { value: 'day', label: 'Day', icon: 'sun' },
        { value: 'week', label: 'Week', icon: 'sparkle' },
        { value: 'month', label: 'Month', icon: 'moon' },
      ]}
    />
  )
}
