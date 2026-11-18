import { GlassSlideToConfirm } from '@/components/liquid-glass'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// `fillClassName` colours the fill. The second one always fails: a rejected promise
// springs the thumb back and writes `errorLabel` until the next slide.
export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <GlassSlideToConfirm size="lg" fillClassName="bg-emerald-500 text-white" successLabel="Unlocked" resetAfter={2000} onConfirm={() => {}}>
        Slide to unlock
      </GlassSlideToConfirm>
      <GlassSlideToConfirm
        size="lg"
        fillClassName="bg-rose-500 text-white"
        pendingLabel="Deleting"
        errorLabel="Offline, slide to retry"
        onConfirm={async () => {
          await wait(1200)
          throw new Error('offline')
        }}
      >
        Slide to delete
      </GlassSlideToConfirm>
    </div>
  )
}
