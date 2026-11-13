import { ArrowRight, Plus } from 'lucide-react'

import { GlassButton } from '@/components/liquid-glass'

// Hover the buttons: the icon separates from the body as a gooey droplet.
export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <GlassButton material="liquid" className="bg-orange-500 text-white" size="lg" icon={<ArrowRight />}>
        Continue
      </GlassButton>
      <GlassButton material="tinted" className="bg-neutral-900 text-white" icon={<Plus />} iconPosition="start">
        New list
      </GlassButton>
      <GlassButton material="tinted" className="bg-sky-500 text-white" icon={<ArrowRight />} droplet="always">
        Always apart
      </GlassButton>
    </div>
  )
}
