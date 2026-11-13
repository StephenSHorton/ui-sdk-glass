import { Button } from '@/components/liquid-glass/controls/Button'

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button>Glass</Button>
      <Button variant="frosted">Frosted</Button>
      <Button size="lg" trailingIcon="arrow-right">
        Get started
      </Button>
      <Button icon="settings" iconOnly>
        Settings
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
