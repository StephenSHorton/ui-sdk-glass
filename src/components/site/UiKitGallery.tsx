import { Button } from '#/components/liquid-glass/controls/Button'
import { Card } from '#/components/liquid-glass/controls/Card'
import { GlassCardExamples } from '#/components/liquid-glass/controls/GlassCard'
import { RangeSlider } from '#/components/liquid-glass/controls/RangeSlider'
import { SegmentedControl } from '#/components/liquid-glass/controls/SegmentedControl'
import { Switch } from '#/components/liquid-glass/controls/Switch'
import { useState } from 'react'

import { useSyncedState, type Theme } from '#/components/liquid-glass/controls/shared'
import { SectionHeader } from '#/components/site/SiteChrome'

const COPY = {
  en: {
    title: 'Every control, live',
    description:
      "Each control is drawn by the WebGL glass shader: clear lenses that bend what's beneath at the rim, swell when pressed and settle back into flat pills. Press, drag and toggle; all of it is live.",
    buttons: { title: 'Buttons', description: 'Clear glass; swells on press.', glass: 'Glass', new: 'New', getStarted: 'Get started', settings: 'Settings', add: 'Add', disabled: 'Disabled' },
    segmented: {
      title: 'Segmented control',
      description: 'Hold and drag the frosted pill to turn it into a magnifying lens. The theme segments switch the page: sun, system, moon.',
      list: 'List',
      grid: 'Grid',
      board: 'Board',
      themeIconsAria: 'Theme: light, system or dark',
      light: 'Light',
      system: 'System',
      dark: 'Dark',
      themeAria: 'Theme',
    },
    toggles: { title: 'Toggles', description: 'Knobs lift into clear glass while held.', notifications: 'Notifications', notificationsDesc: 'Banners and sounds', reduceMotion: 'Reduce motion' },
    sliders: { title: 'Sliders', description: 'Glass thumbs over the accent fill; press and drag to swell the lens.', brightness: 'Brightness' },
    cards: {
      title: 'Glass cards',
      description: 'A weather card and a calendar card. The rims bend the colour sliding behind them.',
      noteBefore: 'The rim refraction is an SVG filter inside ',
      noteAfter:
        ', which only Chromium composites: Safari, Firefox and every iOS browser show the frosted glass without the bend. Phones and tablets get the still, frosted version too, since redrawing the filter on every frame stutters on mobile GPUs.',
    },
  },
  tr: {
    title: 'Her kontrol, canlı',
    description:
      'Her kontrol WebGL cam gölgelendiricisiyle çizilir: kenarında altındakini büken şeffaf mercekler, basılınca şişer, sonra düz haplara geri döner. Bas, sürükle, aç kapat; hepsi canlı.',
    buttons: { title: 'Düğmeler', description: 'Şeffaf cam; basınca şişer.', glass: 'Cam', new: 'Yeni', getStarted: 'Başla', settings: 'Ayarlar', add: 'Ekle', disabled: 'Devre dışı' },
    segmented: {
      title: 'Bölmeli kontrol',
      description: 'Buzlu hapı basılı tutup sürükle, büyüteç merceğine dönüşsün. Tema bölmeleri sayfayı değiştirir: güneş, sistem, ay.',
      list: 'Liste',
      grid: 'Izgara',
      board: 'Pano',
      themeIconsAria: 'Tema: açık, sistem veya koyu',
      light: 'Açık',
      system: 'Sistem',
      dark: 'Koyu',
      themeAria: 'Tema',
    },
    toggles: { title: 'Anahtarlar', description: 'Düğmeler basılı tutulurken şeffaf cama dönüşür.', notifications: 'Bildirimler', notificationsDesc: 'Bannerlar ve sesler', reduceMotion: 'Hareketi azalt' },
    sliders: { title: 'Kaydırıcılar', description: 'Vurgu dolgusunun üzerinde cam tutamaklar; basıp sürükleyerek merceği şişir.', brightness: 'Parlaklık' },
    cards: {
      title: 'Cam kartlar',
      description: 'Bir hava durumu kartı ve bir takvim kartı. Kenarlar, arkalarından kayan rengi büker.',
      noteBefore: 'Kenar kırılması, ',
      noteAfter:
        ' içindeki bir SVG filtresidir ve yalnızca Chromium bunu birleştirir: Safari, Firefox ve tüm iOS tarayıcıları buzlu camı bükülme olmadan gösterir. Telefon ve tabletler de durağan, buzlu sürümü alır; çünkü filtreyi her karede yeniden çizmek mobil GPU\'larda takılma yaratır.',
    },
  },
} as const

export type UiKitGalleryProps = {
  locale?: 'en' | 'tr'
  theme?: Theme
  onThemeChange?: (theme: Theme) => void
  columns?: '2' | '3'
  padding?: 'compact' | 'comfortable' | 'spacious'
  showDescriptions?: boolean
}

export function UiKitGallery({
  locale = 'en',
  theme = 'light',
  onThemeChange,
  columns = '2',
  padding = 'comfortable',
  showDescriptions = true,
}: UiKitGalleryProps) {
  const c = COPY[locale]
  const [current, setCurrent] = useSyncedState(theme, onThemeChange)
  // The icon-only segment adds a "system" choice that follows prefers-color-scheme.
  const [choice, setChoice] = useState<Theme | 'system'>(theme)
  const pick = (next: Theme | 'system') => {
    setChoice(next)
    if (next !== 'system') setCurrent(next)
    else setCurrent(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }
  const card = (title: string, description: string) => ({
    title,
    description: showDescriptions ? description : undefined,
    padding,
  })

  return (
    <div
      id="kit"
      className="w-full scroll-mt-14 px-6 sm:px-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 border-b border-border py-20 md:py-24">
        <SectionHeader
          title={c.title}
          description={c.description}
        />

        <div className={`grid grid-cols-1 items-start gap-6 md:grid-cols-2 ${columns === '3' ? 'xl:grid-cols-3' : ''}`}>
          <Card {...card(c.buttons.title, c.buttons.description)}>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button>{c.buttons.glass}</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button size="sm" icon="plus">
                {c.buttons.new}
              </Button>
              <Button size="lg" trailingIcon="arrow-right">
                {c.buttons.getStarted}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button icon="settings" iconOnly>
                {c.buttons.settings}
              </Button>
              <Button icon="plus" iconOnly>
                {c.buttons.add}
              </Button>
              <Button disabled>{c.buttons.disabled}</Button>
            </div>
          </Card>

          <Card {...card(c.segmented.title, c.segmented.description)}>
            <SegmentedControl stretch />
            <div className="flex flex-wrap items-center gap-3">
              <SegmentedControl
                size="sm"
                showIcons={false}
                options={[
                  { value: 'list', label: c.segmented.list },
                  { value: 'grid', label: c.segmented.grid },
                  { value: 'board', label: c.segmented.board },
                ]}
              />
              <SegmentedControl
                showLabels={false}
                ariaLabel={c.segmented.themeIconsAria}
                value={choice}
                onChange={(v) => pick(v as Theme | 'system')}
                options={[
                  { value: 'light', label: c.segmented.light, icon: 'sun' },
                  { value: 'system', label: c.segmented.system, icon: 'sparkle' },
                  { value: 'dark', label: c.segmented.dark, icon: 'moon' },
                ]}
              />
            </div>
            {/* Both theme segments are wired up: they switch the whole page's theme. */}
            <SegmentedControl
              ariaLabel={c.segmented.themeAria}
              value={current}
              onChange={(v) => pick(v as Theme)}
              options={[
                { value: 'light', label: c.segmented.light, icon: 'sun' },
                { value: 'dark', label: c.segmented.dark, icon: 'moon' },
              ]}
            />
          </Card>

          <Card {...card(c.toggles.title, c.toggles.description)}>
            <Switch checked label={c.toggles.notifications} description={c.toggles.notificationsDesc} />
            <Switch label={c.toggles.reduceMotion} />
          </Card>

          <Card {...card(c.sliders.title, c.sliders.description)}>
            <RangeSlider label={c.sliders.brightness} value={40} size="sm" startIcon="moon" endIcon="sun" restFrost={1} />
          </Card>

          {/* Spans the whole row so the pill rows run edge to edge behind the centred cards. */}
          <div className="md:col-span-full">
            <Card {...card(c.cards.title, c.cards.description)} wide>
              <GlassCardExamples theme={current} />
              <p className="text-[12px] leading-relaxed text-neutral-500">
                {c.cards.noteBefore}<code className="font-mono">backdrop-filter</code>
                {c.cards.noteAfter}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UiKitGallery
