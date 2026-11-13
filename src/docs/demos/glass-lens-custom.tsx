import { useState } from 'react'

import { GlassLens } from '@/components/liquid-glass'

const plans = ['Monthly', 'Yearly']

// Your own segmented control: role="radio" options and a `data-glass-highlight` pill.
export default function Demo() {
  const [plan, setPlan] = useState('Yearly')
  return (
    <div role="radiogroup" aria-label="Billing" className="relative isolate inline-flex gap-1 rounded-xl bg-neutral-900 p-1">
      <GlassLens value={plan} />
      {plans.map((p) => (
        <button
          key={p}
          type="button"
          role="radio"
          aria-checked={p === plan}
          onClick={() => setPlan(p)}
          className={`relative h-9 rounded-lg px-4 text-sm font-semibold ${
            p === plan ? 'text-neutral-900 [[data-glass-traveling]_&]:text-white/60' : 'text-white/60'
          }`}
        >
          {p === plan && <span data-glass-highlight className="absolute inset-0 rounded-lg bg-white [[data-glass-moving]_&]:opacity-0" />}
          <span className="relative z-20">{p}</span>
        </button>
      ))}
    </div>
  )
}
