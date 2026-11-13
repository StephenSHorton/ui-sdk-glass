import { GlassCardExamples } from '@/components/liquid-glass/controls/GlassCard'

// Chromium bends the rims; Safari, Firefox and phones show plain frosted glass.
export default function Demo() {
  return (
    <div className="w-full">
      <GlassCardExamples />
    </div>
  )
}
