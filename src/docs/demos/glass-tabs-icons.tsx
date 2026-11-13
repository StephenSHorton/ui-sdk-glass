import { LayoutGrid, List, Rows3 } from 'lucide-react'
import { useState } from 'react'

import { GlassTabs } from '@/components/liquid-glass'

// Icons, a larger size and a coloured lens (the highlight's background is the lens colour).
export default function Demo() {
  const [layout, setLayout] = useState('grid')
  return (
    <GlassTabs
      aria-label="Layout"
      size="lg"
      value={layout}
      onValueChange={setLayout}
      highlightClassName="bg-sky-500"
      className="[&_[aria-checked=true]]:text-white"
      options={[
        { value: 'list', label: 'List', icon: <List /> },
        { value: 'grid', label: 'Grid', icon: <LayoutGrid /> },
        { value: 'rows', label: 'Rows', icon: <Rows3 /> },
      ]}
    />
  )
}
