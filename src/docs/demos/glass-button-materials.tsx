import { GlassButton } from '@/components/liquid-glass'

// Tinted and liquid glass take their colour from the button's own background class.
export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <GlassButton>Clear</GlassButton>
      <GlassButton material="tinted" className="bg-sky-500 text-white">
        Tinted
      </GlassButton>
      <GlassButton material="liquid" className="bg-orange-500 text-white">
        Liquid
      </GlassButton>
      <GlassButton material="tinted" className="border border-black/15 bg-white text-neutral-900">
        Outline
      </GlassButton>
    </div>
  )
}
