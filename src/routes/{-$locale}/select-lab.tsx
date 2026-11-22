import { createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { GOOEY } from '@/components/liquid-glass/engine'
import { Ellipsis } from 'lucide-react'

import { GlassButtonGroup, GlassButtonGroupItem } from '@/components/liquid-glass'
import { GlassDropdownMenu, GlassDropdownMenuContent, GlassDropdownMenuItem, GlassDropdownMenuTrigger } from '@/components/liquid-glass/glass-dropdown-menu'
import { GlassSelect } from '@/components/liquid-glass/glass-select'

// The kit's own values, kept apart from what the sliders change.
const GLASS_SELECT_TUNING = GOOEY
const GLASS_SELECT_DEFAULTS = { ...GOOEY }

// Development only (a 404 in production): the GlassSelect prototype on UI SDK.
export const Route = createFileRoute('/{-$locale}/select-lab')({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  head: () => ({ meta: [{ title: 'GlassSelect lab — Liquid Glass UI' }, { name: 'robots', content: 'noindex' }] }),
  component: SelectLab,
})

// `?pump`: frames advance only when `__pump(n)` is called, so the motion can be stepped and
// inspected frame by frame (and tested in a hidden tab, where real frames never fire).
if (import.meta.env.DEV && typeof window !== 'undefined' && window.location.search.includes('pump')) {
  const w = window as unknown as { __pump: (n: number) => void; requestAnimationFrame: (cb: FrameRequestCallback) => number; cancelAnimationFrame: (id: number) => void }
  let queue: FrameRequestCallback[] = []
  let now = performance.now()
  w.requestAnimationFrame = (cb) => queue.push(cb)
  w.cancelAnimationFrame = () => {}
  // A hidden tab never reports intersections either: everything observed counts as on screen.
  window.IntersectionObserver = class {
    constructor(private cb: IntersectionObserverCallback) {}
    observe(target: Element) {
      queueMicrotask(() => this.cb([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver))
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
  w.__pump = (n) => {
    for (let i = 0; i < n; i++) {
      now += 1000 / 60
      const run = queue
      queue = []
      for (const cb of run) cb(now)
    }
  }
}

const COPY = {
  en: {
    label: 'Roast',
    placeholder: 'Pick a roast',
    selected: 'Selected',
    none: 'nothing yet',
    options: ['Light', 'Medium', 'Dark', 'Espresso', 'Decaf (sold out)'],
  },
  tr: {
    label: 'Kavrum',
    placeholder: 'Kavrum seç',
    selected: 'Seçilen',
    none: 'henüz yok',
    options: ['Açık', 'Orta', 'Koyu', 'Espresso', 'Kafeinsiz (tükendi)'],
  },
}

const VALUES = ['light', 'medium', 'dark', 'espresso', 'decaf']

type Key = keyof typeof GLASS_SELECT_TUNING

// Each knob: its range and what it does, in both languages.
const KNOBS: { key: Key; min: number; max: number; step: number; en: string; tr: string; hintEn: string; hintTr: string }[] = [
  { key: 'weight', min: 0.3, max: 6, step: 0.1, en: 'Weight', tr: 'Ağırlık', hintEn: 'Heavier: thrown less, swings slower', hintTr: 'Ağırlaştıkça daha az savrulur, daha yavaş sallanır' },
  { key: 'kick', min: 0, max: 80, step: 1, en: 'Snap jolt', tr: 'Kopuş darbesi', hintEn: 'Strength of the jolt when the neck breaks', hintTr: 'Boyun koptuğu andaki darbenin gücü' },
  { key: 'recoilDamping', min: 0.05, max: 1, step: 0.01, en: 'Settling', tr: 'Sönümleme', hintEn: 'Higher: the wobble dies out sooner', hintTr: 'Yükseldikçe sallantı daha çabuk durur' },
  { key: 'recoilSpeed', min: 4, max: 40, step: 0.5, en: 'Wobble speed', tr: 'Sallantı hızı', hintEn: 'How fast it swings back and forth', hintTr: 'Gidip gelme hızı' },
  { key: 'panelJolt', min: 0, max: 16, step: 0.5, en: 'Panel throw (px)', tr: 'Panel savrulması (px)', hintEn: 'How far the list is thrown', hintTr: 'Listenin ne kadar itildiği' },
  { key: 'triggerJolt', min: 0, max: 12, step: 0.5, en: 'Button throw (px)', tr: 'Buton savrulması (px)', hintEn: 'How far the button is thrown', hintTr: 'Butonun ne kadar itildiği' },
  { key: 'snapSpeed', min: 1, max: 12, step: 0.1, en: 'Snap speed', tr: 'Kopuş hızı', hintEn: 'Lower: the neck thins more slowly', hintTr: 'Düştükçe boyun daha yavaş incelir' },
  { key: 'detachAt', min: 0.1, max: 0.95, step: 0.01, en: 'Lets go at', tr: 'Bırakma noktası', hintEn: 'How far open before the neck starts to thin', hintTr: 'Boyun incelmeye başlamadan önce panelin açıklığı' },
  { key: 'neckSoftness', min: 14, max: 90, step: 1, en: 'Neck softness (px)', tr: 'Boyun yumuşaklığı (px)', hintEn: 'How thick and gooey the bridge is', hintTr: 'Köprünün kalınlığı ve akışkanlığı' },
  { key: 'neckPull', min: 0, max: 11, step: 0.5, en: 'Neck pull (px)', tr: 'Boyun çekişi (px)', hintEn: 'How far the list leans back to the button', hintTr: 'Listenin butona doğru ne kadar yaslandığı' },
  { key: 'triggerSag', min: 0, max: 6, step: 0.1, en: 'Button sag (px)', tr: 'Buton sarkması (px)', hintEn: 'How far the button sags while attached', hintTr: 'Bağlıyken butonun ne kadar sarktığı' },
  { key: 'openSpeed', min: 3, max: 24, step: 0.5, en: 'Open speed', tr: 'Açılış hızı', hintEn: 'How fast the list opens', hintTr: 'Listenin açılma hızı' },
  { key: 'openDamping', min: 0.3, max: 1, step: 0.01, en: 'Open settling', tr: 'Açılış sönümü', hintEn: 'Below 1 the list overshoots as it lands', hintTr: '1 altında liste yerine otururken taşar' },
  { key: 'closeSpeed', min: 4, max: 30, step: 0.5, en: 'Close speed', tr: 'Kapanış hızı', hintEn: 'The opening plays backwards; equal to Open speed = the same pace', hintTr: 'Açılış tersine oynar; Açılış hızına eşitse aynı tempoda' },
  { key: 'itemsAt', min: 0.3, max: 0.99, step: 0.01, en: 'List starts at', tr: 'Liste başlangıcı', hintEn: 'How far open the panel is when the first option appears', hintTr: 'İlk seçenek belirdiğinde panelin açıklığı' },
  { key: 'itemsGap', min: 0, max: 0.25, step: 0.005, en: 'Delay between options (s)', tr: 'Seçenekler arası gecikme (sn)', hintEn: 'Wait before each next option', hintTr: 'Her bir sonraki seçenek için bekleme' },
  { key: 'itemsFade', min: 0.02, max: 0.6, step: 0.01, en: 'Option fade (s)', tr: 'Seçenek belirme süresi (sn)', hintEn: 'How long one option takes to appear', hintTr: 'Bir seçeneğin belirme süresi' },
]

// Small controls only (an icon button): the bridge to the list there.
const SMALL_KNOBS: typeof KNOBS = [
  { key: 'smallNeckSoftness', min: 4, max: 90, step: 1, en: 'Neck softness (px)', tr: 'Boyun yumuşaklığı (px)', hintEn: 'How thick and gooey the bridge is, on small buttons', hintTr: 'Küçük butonlarda köprünün kalınlığı ve akışkanlığı' },
  { key: 'smallEdgeFade', min: 0, max: 1, step: 0.01, en: 'Far edge fade', tr: 'Uzak kenar sönümü', hintEn: '0: the far edge swells with the bridge (a ridge). 1: it keeps its own line', hintTr: '0: uzak kenar köprüyle şişer (çıkıntı). 1: kendi çizgisini korur' },
  { key: 'smallEdgeReach', min: 0.05, max: 1, step: 0.01, en: 'Fade reach', tr: 'Sönüm derinliği', hintEn: 'How far in from the far edge the softness comes back (× the height)', hintTr: 'Yumuşaklığın uzak kenardan ne kadar içeride geri geldiği (× yükseklik)' },
  { key: 'smallNeck', min: 0, max: 2, step: 0.05, en: 'Neck width, at first', tr: 'Boyun genişliği, başta', hintEn: 'The neck is no thinner than this × the height', hintTr: 'Boyun, yüksekliğin bu katından ince olmaz' },
  { key: 'smallNeckWide', min: 0, max: 3, step: 0.05, en: 'Neck width, gathered', tr: 'Boyun genişliği, toplanınca', hintEn: 'The same floor once the bridge has gathered', hintTr: 'Köprü toplandıktan sonraki aynı alt sınır' },
]

const PANEL = {
  en: { title: 'Motion', small: 'Small buttons', smallNote: 'Only for a single icon or a label of about five letters. Open the three dots to see them.', copy: 'Copy values', copied: 'Copied', reset: 'Reset', note: 'Changes apply at once. Open the select to see them.' },
  tr: { title: 'Hareket', small: 'Küçük butonlar', smallNote: 'Yalnızca tek ikonlu ya da beş harf kadar etiketli butonlar için. Görmek için üç noktayı aç.', copy: 'Değerleri kopyala', copied: 'Kopyalandı', reset: 'Sıfırla', note: 'Değişiklikler anında uygulanır. Görmek için seçiciyi aç.' },
}

// Bumped when the set of values changes, so stale saved ones do not override the kit's.
const STORE = 'glass-select-tuning-2'

function Tuner({ locale }: { locale: 'en' | 'tr' }) {
  const t = PANEL[locale]
  const [values, setValues] = useState({ ...GLASS_SELECT_DEFAULTS })
  const [copied, setCopied] = useState(false)

  // Values survive a reload, so tuning can go on across sessions.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? 'null')
      if (saved) setValues((v) => ({ ...v, ...saved }))
    } catch {
      // Nothing saved, or storage is unavailable: the defaults stand.
    }
  }, [])
  useEffect(() => {
    Object.assign(GLASS_SELECT_TUNING, values)
    try {
      localStorage.setItem(STORE, JSON.stringify(values))
    } catch {
      // Storage is unavailable: the values still apply for this visit.
    }
  }, [values])

  const text = JSON.stringify(values, null, 2)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // No clipboard access: the values are in the box below, ready to select.
    }
  }

  return (
    <aside
      data-glass-skip=""
      className="fixed top-24 right-4 bottom-4 z-10 flex w-72 flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-background p-4 text-ui text-foreground max-md:static max-md:mx-4 max-md:mt-10 max-md:w-auto"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-body-sm font-semibold">{t.small}</h2>
        <button type="button" onClick={() => setValues({ ...GLASS_SELECT_DEFAULTS })} className="press rounded-md px-2 py-1 text-caption text-muted-foreground hover:bg-accent">
          {t.reset}
        </button>
      </div>
      <p className="text-caption text-muted-foreground">{t.smallNote}</p>
      {SMALL_KNOBS.map((k) => (
        <label key={k.key} className="flex flex-col gap-1" title={locale === 'tr' ? k.hintTr : k.hintEn}>
          <span className="flex items-baseline justify-between">
            <span>{locale === 'tr' ? k.tr : k.en}</span>
            <span className="font-mono text-caption text-muted-foreground tabular-nums">{values[k.key]}</span>
          </span>
          <input
            type="range"
            min={k.min}
            max={k.max}
            step={k.step}
            value={values[k.key]}
            onChange={(e) => setValues((v) => ({ ...v, [k.key]: Number(e.target.value) }))}
            className="w-full"
          />
          <span className="text-micro text-muted-foreground">{locale === 'tr' ? k.hintTr : k.hintEn}</span>
        </label>
      ))}
      <hr className="border-border" />
      <h2 className="text-body-sm font-semibold">{t.title}</h2>
      <p className="text-caption text-muted-foreground">{t.note}</p>
      {KNOBS.map((k) => (
        <label key={k.key} className="flex flex-col gap-1" title={locale === 'tr' ? k.hintTr : k.hintEn}>
          <span className="flex items-baseline justify-between">
            <span>{locale === 'tr' ? k.tr : k.en}</span>
            <span className="font-mono text-caption text-muted-foreground tabular-nums">{values[k.key]}</span>
          </span>
          <input
            type="range"
            min={k.min}
            max={k.max}
            step={k.step}
            value={values[k.key]}
            onChange={(e) => setValues((v) => ({ ...v, [k.key]: Number(e.target.value) }))}
            className="w-full"
          />
          <span className="text-micro text-muted-foreground">{locale === 'tr' ? k.hintTr : k.hintEn}</span>
        </label>
      ))}
      <button type="button" onClick={copy} className="press mt-1 rounded-md bg-foreground px-3 py-2 text-ui font-medium text-background">
        {copied ? t.copied : t.copy}
      </button>
      <textarea readOnly value={text} rows={8} onFocus={(e) => e.currentTarget.select()} className="rounded-md border border-border bg-background p-2 font-mono text-micro" />
    </aside>
  )
}

const COLS = 13
const ROWS = 7

/** 1 around the middle of the grid, falling to 0 at its edge. */
const fade = (col: number, row: number) => {
  const distance = Math.hypot((col - (COLS - 1) / 2) / (COLS / 2), (row - (ROWS - 1) / 2) / (ROWS / 2))
  return Math.min(1, Math.max(0, (1 - distance) / 0.45))
}

function SelectLab() {
  const { locale } = Route.useRouteContext()
  const t = COPY[locale]
  const [value, setValue] = useState<string | null>(null)
  const options = VALUES.map((v, i) => ({ value: v, label: t.options[i], disabled: v === 'decaf' }))
  const picked = options.find((o) => o.value === value)?.label ?? t.none

  return (
    <main className="relative isolate flex min-h-dvh items-start justify-center overflow-hidden bg-stage pt-40">
      {/* The Press demo's fine grid, centred on the button (28px of label above it, 24px to its middle). */}
      <div aria-hidden className="absolute top-[212px] left-1/2 -z-10 grid -translate-x-1/2 -translate-y-1/2 grid-cols-[repeat(13,40px)]">
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <span key={i} className="relative size-10" style={{ opacity: fade(i % COLS, Math.floor(i / COLS)) }}>
            <span className="absolute inset-x-0 top-0 h-px bg-black/10 dark:bg-white/10" />
            <span className="absolute inset-y-0 left-0 w-px bg-black/10 dark:bg-white/10" />
          </span>
        ))}
      </div>
      {/* A small control: the three dots of a toolbar, white and clear. */}
      <div className="absolute top-[188px] left-1/2 flex -translate-x-[calc(50%+220px)] gap-3 max-md:static max-md:mr-6 max-md:translate-x-0 max-md:pt-7">
        {(['tinted', 'clear'] as const).map((material) => (
          <GlassDropdownMenu key={material}>
            <GlassButtonGroup material={material} size="lg">
              <GlassDropdownMenuTrigger asChild>
                <GlassButtonGroupItem aria-label={material} className="px-0">
                  <Ellipsis />
                </GlassButtonGroupItem>
              </GlassDropdownMenuTrigger>
            </GlassButtonGroup>
            <GlassDropdownMenuContent>
              {t.options.slice(0, 4).map((label) => (
                <GlassDropdownMenuItem key={label}>{label}</GlassDropdownMenuItem>
              ))}
            </GlassDropdownMenuContent>
          </GlassDropdownMenu>
        ))}
      </div>
      <div className="relative flex flex-col gap-4">
        <GlassSelect label={t.label} placeholder={t.placeholder} options={options} value={value} onValueChange={setValue} name="roast" />
        <p className="text-sm text-neutral-700 dark:text-neutral-300" data-testid="picked">
          {t.selected}: {picked}
        </p>
      </div>
      <Tuner locale={locale} />
    </main>
  )
}
