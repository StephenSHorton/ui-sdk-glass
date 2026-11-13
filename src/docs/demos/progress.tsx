import { Progress } from '@/components/liquid-glass/controls/Progress'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress label="Uploading" value={64} />
      <Progress label="Syncing" indeterminate />
    </div>
  )
}
