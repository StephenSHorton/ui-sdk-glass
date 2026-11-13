import { useState } from 'react'

import { TextField } from '@/components/liquid-glass/controls/TextField'

export default function Demo() {
  const [email, setEmail] = useState('')
  return (
    <div className="w-full max-w-sm">
      <TextField label="Email" placeholder="you@example.com" icon="search" clearable value={email} onChange={setEmail} />
    </div>
  )
}
