import { Card } from '@/components/liquid-glass/controls/Card'
import { Switch } from '@/components/liquid-glass/controls/Switch'

export default function Demo() {
  return (
    <Card title="Display" description="Adjust how surfaces look on this device.">
      <Switch label="Reduce transparency" />
    </Card>
  )
}
