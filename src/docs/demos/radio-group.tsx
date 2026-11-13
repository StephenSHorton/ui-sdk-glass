import { useState } from 'react'

import { RadioGroup } from '@/components/liquid-glass/controls/RadioGroup'

export default function Demo() {
  const [plan, setPlan] = useState('pro')
  return (
    <RadioGroup
      ariaLabel="Plan"
      value={plan}
      onChange={setPlan}
      options={[
        { value: 'free', label: 'Free', description: 'For personal projects' },
        { value: 'pro', label: 'Pro', description: 'For teams' },
      ]}
    />
  )
}
