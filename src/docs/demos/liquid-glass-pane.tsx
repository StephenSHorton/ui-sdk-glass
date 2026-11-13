import { LiquidGlassPreview } from '@/components/liquid-glass/controls/LiquidGlass'

// One clear lens over a track and a line of type: drag the offset to see it bend.
export default function Demo() {
  return (
    <div className="w-full overflow-x-auto">
      <LiquidGlassPreview offset={0.35} />
    </div>
  )
}
