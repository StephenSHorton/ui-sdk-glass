// The single source of truth for the documentation. Plain data, no React:
// the site renders it (EN + TR), and the build turns it into llms.txt, llms-full.txt,
// per-page Markdown, the shadcn registry and the agent skill reference (scripts/ai-files.ts).
// Live examples are files in ./demos — the code shown on a page IS that file.
import type { L } from '../site/i18n'

export type PropRow = { name: string; type: string; default?: string; description: L }

export type Block =
  | { type: 'p'; text: L }
  | { type: 'h'; text: L }
  | { type: 'list'; items: L[] }
  | { type: 'note'; text: L }
  | { type: 'demo'; id: string; title?: L }
  | { type: 'code'; code: string; title?: string }
  | { type: 'install'; item: string }
  | { type: 'props'; rows: PropRow[] }

export type DocGroup = 'start' | 'liquid' | 'controls'

export type DocPage = {
  slug: string
  group: DocGroup
  title: L
  description: L
  /** Shown first on the page and used as the card preview. */
  hero?: string
  blocks: Block[]
}

export const GROUPS: { id: DocGroup; title: L }[] = [
  { id: 'start', title: { en: 'Get started', tr: 'Başlarken' } },
  { id: 'liquid', title: { en: 'Liquid glass', tr: 'Sıvı cam' } },
  { id: 'controls', title: { en: 'Canvas controls', tr: 'Tuval kontrolleri' } },
]

// ── Registry ────────────────────────────────────────────────────────────────
// Every item installs into components/liquid-glass/ (canvas controls: components/liquid-glass/controls/;
// controls). Files are copied byte-for-byte; nothing is generated or rewritten.

export type RegistryItem = {
  name: string
  title: string
  description: string
  /**
   * Entry files (repo paths). The build follows their relative imports and ships the
   * whole closure, each file to the same path under the user's `components/` folder
   * (src/components/liquid-glass/x.tsx → components/liquid-glass/x.tsx).
   */
  entries: string[]
  dependencies?: string[]
  /** Tailwind v4 CSS the CLI merges into the user's stylesheet. */
  css?: Record<string, unknown>
  cssVars?: Record<string, Record<string, string>>
}

/** Tokens the canvas controls' classes use. Written into the user's CSS by the shadcn CLI. */
/** The surface colour the canvas glass refracts where nothing is drawn beneath it. Merged into the user's CSS. */
const CANVAS_CSS = {
  ':root': { '--glass-surface': '#dedfe2' },
  "[data-theme='dark'], .dark": { '--glass-surface': '#17181c' },
}

const liquid = (file: string) => `src/components/liquid-glass/${file}`
const ui = (file: string) => `src/components/liquid-glass/controls/${file}`

export const REGISTRY: RegistryItem[] = [
  {
    name: 'liquid-glass',
    title: 'Liquid Glass (all liquid components)',
    description: 'GlassButton, GlassTabs, GlassBadge, GlassLayer and GlassLens with the zero-dependency WebGL2 engine.',
    entries: [liquid('index.ts')],
  },
  { name: 'glass-button', title: 'GlassButton', description: 'A liquid glass button or link: clear, tinted or liquid, with a gooey icon droplet.', entries: [liquid('glass-button.tsx')] },
  { name: 'glass-tabs', title: 'GlassTabs', description: 'A segmented control whose selection slides as a liquid glass lens.', entries: [liquid('glass-tabs.tsx')] },
  { name: 'glass-badge', title: 'GlassBadge', description: 'A small tinted glass badge with text flowing through it.', entries: [liquid('glass-badge.tsx')] },
  { name: 'glass-layer', title: 'GlassLayer', description: 'Turns any element (link, pill, router Link) into liquid glass.', entries: [liquid('glass-layer.tsx')] },
  { name: 'glass-lens', title: 'GlassLens', description: 'The sliding lens on its own, for your own tabs or radio group.', entries: [liquid('glass-lens.tsx')] },
  ...(
    [
      ['button', 'Button', 'A clear or frosted glass button that swells on press.', 'Button.tsx'],
      ['segmented-control', 'SegmentedControl', 'Segments with a frosted pill that becomes a magnifying lens.', 'SegmentedControl.tsx'],
      ['switch', 'Switch', 'A toggle whose knob lifts into clear glass while held.', 'Switch.tsx'],
      ['checkbox', 'Checkbox', 'A checkbox drawn by the glass shader.', 'Checkbox.tsx'],
      ['radio-group', 'RadioGroup', 'Radio options with glass dots.', 'RadioGroup.tsx'],
      ['range-slider', 'RangeSlider', 'A slider with a glass thumb over the accent fill.', 'RangeSlider.tsx'],
      ['progress', 'Progress', 'A progress bar in a clear glass tube.', 'Progress.tsx'],
      ['text-field', 'TextField', 'A text input in a glass capsule.', 'TextField.tsx'],
      ['card', 'Card', 'A plain panel for grouping controls.', 'Card.tsx'],
      ['icon', 'Icon', 'The 24×24 stroke icon set shared by DOM and canvas.', 'Icon.tsx'],
      ['liquid-glass-pane', 'LiquidGlass', 'A bare glass pane you can put behind anything.', 'LiquidGlass.tsx'],
      ['glass-card', 'GlassCard', 'A card that bends the page behind it (SVG backdrop filter, Chromium).', 'GlassCard.tsx'],
    ] as const
  ).map(([name, title, description, file]) => ({ name, title, description, entries: [ui(file)], css: CANVAS_CSS })),
]

// ── Pages ───────────────────────────────────────────────────────────────────

const t = (en: string, tr: string): L => ({ en, tr })

const COMMON_LIQUID_NOTE: Block = {
  type: 'note',
  text: t(
    'Without WebGL2 (or before the first frame) the component keeps its plain CSS look. With reduced motion the glass stays still.',
    'WebGL2 yoksa (ya da ilk kare çizilene dek) bileşen sade CSS görünümünde kalır. Hareketi azalt açıksa cam durağandır.',
  ),
}

export const PAGES: DocPage[] = [
  {
    slug: 'introduction',
    group: 'start',
    title: t('Introduction', 'Giriş'),
    description: t(
      'Liquid glass components for React. Copy a file, get exactly what the demo shows.',
      'React için sıvı cam bileşenleri. Dosyayı kopyala, demoda gördüğünün aynısını al.',
    ),
    blocks: [
      {
        type: 'p',
        text: t(
          'Liquid Glass UI is a set of React components drawn by a WebGL2 glass shader: clear lenses that bend what is behind them, swell under the pointer and melt like liquid. It is not a package you import from npm. You copy the files into your project, and they are yours.',
          'Liquid Glass UI, WebGL2 cam gölgelendiricisiyle çizilen React bileşenleridir: arkasındakini büken, imleç altında şişen ve sıvı gibi eriyen şeffaf mercekler. npm\'den içe aktarılan bir paket değildir. Dosyaları projene kopyalarsın ve artık senindir.',
        ),
      },
      { type: 'h', text: t('Two families', 'İki aile') },
      {
        type: 'list',
        items: [
          t(
            '**Liquid glass** — GlassButton, GlassTabs, GlassBadge, GlassLayer, GlassLens. Zero dependencies, a few kilobytes. They wrap your own DOM, so they work with any router, any styling and your existing buttons. Start here.',
            '**Sıvı cam** — GlassButton, GlassTabs, GlassBadge, GlassLayer, GlassLens. Bağımlılık yok, birkaç kilobayt. Senin DOM\'unu sarar; her router, her stil ve mevcut butonlarınla çalışır. Buradan başla.',
          ),
          t(
            '**Canvas controls** — Button, Switch, Slider, SegmentedControl and more, drawn entirely on canvas by a three.js renderer (loaded lazily). Use them when you want the full glass control set.',
            '**Tuval kontrolleri** — Button, Switch, Slider, SegmentedControl ve diğerleri; tamamı three.js çizicisiyle (geç yüklenir) tuvale çizilir. Tam cam kontrol setini istediğinde kullan.',
          ),
        ],
      },
      { type: 'h', text: t('The one rule', 'Tek kural') },
      {
        type: 'p',
        text: t(
          'Copy the files verbatim. The look lives in the exact shader constants and spring values; rewriting, "simplifying" or porting the engine changes it. Customise through props and class names, never by editing the engine.',
          'Dosyaları birebir kopyala. Görünüm gölgelendiricinin ve yayların tam değerlerinde yaşar; motoru yeniden yazmak, "sadeleştirmek" ya da başka yapıya çevirmek görünümü değiştirir. Özelleştirmeyi prop ve sınıf adlarıyla yap, motoru düzenleyerek değil.',
        ),
      },
      { type: 'demo', id: 'glass-button-droplet' },
    ],
  },
  {
    slug: 'installation',
    group: 'start',
    title: t('Installation', 'Kurulum'),
    description: t('Add components with the shadcn CLI, or copy the folder by hand.', 'Bileşenleri shadcn CLI ile ekle ya da klasörü elle kopyala.'),
    blocks: [
      { type: 'h', text: t('Requirements', 'Gereksinimler') },
      {
        type: 'list',
        items: [
          t('React 19 (Next.js 15+, Vite, TanStack Start, Remix…)', 'React 19 (Next.js 15+, Vite, TanStack Start, Remix…)'),
          t('Tailwind CSS v4', 'Tailwind CSS v4'),
          t('An `@/` import alias pointing at your source folder (the shadcn default).', 'Kaynak klasörünü gösteren bir `@/` içe aktarma takma adı (shadcn varsayılanı).'),
        ],
      },
      { type: 'h', text: t('With the CLI', 'CLI ile') },
      {
        type: 'p',
        text: t(
          'Every component page has its own command. This one installs all liquid glass components into `components/liquid-glass/`:',
          'Her bileşen sayfasında kendi komutu var. Bu komut tüm sıvı cam bileşenlerini `components/liquid-glass/` içine kurar:',
        ),
      },
      { type: 'install', item: 'liquid-glass' },
      { type: 'h', text: t('By hand', 'Elle') },
      {
        type: 'p',
        text: t(
          'Copy `src/components/liquid-glass/` from the repository into your project as `components/liquid-glass/`. Nothing else is needed: no npm package, no CSS file (the components inject the few rules they need).',
          'Depodaki `src/components/liquid-glass/` klasörünü projene `components/liquid-glass/` olarak kopyala. Başka hiçbir şey gerekmez: npm paketi yok, CSS dosyası yok (bileşenler ihtiyaç duydukları birkaç kuralı kendileri ekler).',
        ),
      },
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { GlassButton } from '@/components/liquid-glass'

export function Hero() {
  return <GlassButton material="liquid" className="bg-orange-500 text-white">Get started</GlassButton>
}`,
      },
      { type: 'h', text: t('Dark mode', 'Karanlık mod') },
      {
        type: 'p',
        text: t(
          'Liquid glass reads its colours from your CSS, so it follows whatever theme system you use. Canvas controls follow the nearest `data-theme="dark"` or a `dark` class on `<html>`.',
          'Sıvı cam renklerini senin CSS\'inden okur; hangi tema sistemini kullanırsan onu izler. Tuval kontrolleri en yakın `data-theme="dark"` özniteliğini ya da `<html>` üzerindeki `dark` sınıfını izler.',
        ),
      },
      { type: 'h', text: t('Next.js', 'Next.js') },
      {
        type: 'p',
        text: t(
          'The files already start with `"use client"`. Import them from server components as usual.',
          'Dosyalar zaten `"use client"` ile başlıyor. Sunucu bileşenlerinden her zamanki gibi içe aktar.',
        ),
      },
    ],
  },
  {
    slug: 'ai',
    group: 'start',
    title: t('For AI agents', 'Yapay zekâ ajanları için'),
    description: t(
      'Machine-readable docs and a skill, so assistants install the real components instead of re-inventing them.',
      'Makinece okunur dokümanlar ve bir skill: asistanlar bileşenleri yeniden icat etmek yerine gerçeğini kursun.',
    ),
    blocks: [
      {
        type: 'p',
        text: t(
          'Every page of these docs exists as Markdown, and the whole set is published as `llms.txt` and `llms-full.txt`. Point your assistant at them, or install the skill.',
          'Bu dokümanın her sayfası Markdown olarak da var; tamamı `llms.txt` ve `llms-full.txt` olarak yayımlanır. Asistanını bunlara yönlendir ya da skill\'i kur.',
        ),
      },
      {
        type: 'list',
        items: [
          t('`/llms.txt` — index of every page with one line each.', '`/llms.txt` — her sayfanın tek satırlık dizini.'),
          t('`/llms-full.txt` — every page, every example, every prop in one file.', '`/llms-full.txt` — tüm sayfalar, örnekler ve prop\'lar tek dosyada.'),
          t('`/docs/<page>.md` — one page as Markdown (also under `/tr/docs/`).', '`/docs/<sayfa>.md` — tek sayfa Markdown olarak (`/tr/docs/` altında da).'),
          t('`/r/<item>.json` — shadcn registry items.', '`/r/<öğe>.json` — shadcn registry öğeleri.'),
        ],
      },
      { type: 'h', text: t('Install the skill', 'Skill\'i kur') },
      {
        type: 'code',
        title: 'terminal',
        code: `npx skills add bilalgursen/liquid-glass`,
      },
      {
        type: 'p',
        text: t(
          'The skill teaches an agent which component fits which need, the install command, the props, and the rule that matters most: copy the files verbatim and customise only through props and classes.',
          'Skill, ajana hangi ihtiyaca hangi bileşenin uyduğunu, kurulum komutunu, prop\'ları ve en önemli kuralı öğretir: dosyaları birebir kopyala, yalnız prop ve sınıflarla özelleştir.',
        ),
      },
      { type: 'h', text: t('A prompt that works', 'İşe yarayan bir istem') },
      {
        type: 'code',
        title: 'prompt',
        code: `Add a liquid glass "Get started" button with a gooey arrow to the hero.
Use Liquid Glass UI (https://liquid-glass-interface.pages.dev/llms.txt):
install it with the shadcn CLI, use its GlassButton as documented,
and do not modify the files in components/liquid-glass/.`,
      },
    ],
  },
  {
    slug: 'glass-button',
    group: 'liquid',
    title: t('GlassButton', 'GlassButton'),
    description: t(
      'A button or link made of liquid glass, with a gooey icon droplet.',
      'Sıvı camdan bir buton ya da bağlantı; ikonu yapışkan bir damla olarak ayrılır.',
    ),
    hero: 'glass-button-clear',
    blocks: [
      { type: 'install', item: 'glass-button' },
      { type: 'h', text: t('Materials', 'Malzemeler') },
      {
        type: 'p',
        text: t(
          '`clear` bends the page behind it. `tinted` is glass painted in the button\'s own background colour. `liquid` is that colour with no light at all: only the liquid shape. Colour tinted and liquid buttons with a normal class such as `bg-orange-500`.',
          '`clear` arkasındaki sayfayı büker. `tinted`, butonun kendi arka plan rengine boyanmış camdır. `liquid` aynı renktir ama ışık yoktur: yalnız sıvı biçim. tinted ve liquid butonları `bg-orange-500` gibi sıradan bir sınıfla renklendir.',
        ),
      },
      { type: 'demo', id: 'glass-button-materials' },
      { type: 'h', text: t('Gooey droplet', 'Yapışkan damla') },
      {
        type: 'p',
        text: t(
          'Give the button an `icon`. On hover the icon separates from the body as a droplet and melts back when the pointer leaves or presses. Touch screens keep the icon inside unless `droplet="always"`.',
          'Butona bir `icon` ver. Üstüne gelince ikon gövdeden damla olarak ayrılır; imleç çıkınca ya da basınca geri karışır. Dokunmatik ekranda ikon içeride kalır; `droplet="always"` verirsen hep ayrıdır.',
        ),
      },
      { type: 'demo', id: 'glass-button-droplet' },
      COMMON_LIQUID_NOTE,
      { type: 'h', text: t('Props', 'Prop\'lar') },
      {
        type: 'props',
        rows: [
          { name: 'material', type: "'clear' | 'tinted' | 'liquid'", default: "'clear'", description: t('Glass look.', 'Cam görünümü.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('Height 32, 40 or 48 px.', 'Yükseklik 32, 40 ya da 48 px.') },
          { name: 'icon', type: 'ReactNode', description: t('An element that renders an `<svg>` (e.g. a lucide-react icon).', '`<svg>` çizen bir öğe (ör. lucide-react ikonu).') },
          { name: 'iconPosition', type: "'start' | 'end'", default: "'end'", description: t('Which side the icon sits on.', 'İkonun hangi tarafta durduğu.') },
          { name: 'droplet', type: "'hover' | 'always' | 'none'", default: "'hover'", description: t('When the icon separates as a droplet.', 'İkonun ne zaman damla olarak ayrıldığı.') },
          { name: 'tint', type: 'number', default: '0.6', description: t('Clear glass only: how much tint covers the backdrop (0–1).', 'Yalnız clear: renk tonunun arkayı ne kadar örttüğü (0–1).') },
          { name: 'href', type: 'string', description: t('Renders an `<a>` instead of a `<button>`.', '`<button>` yerine `<a>` çizer.') },
          { name: '…rest', type: 'button / anchor attributes', description: t('Passed to the element (`onClick`, `disabled`, `type`…).', 'Öğeye aktarılır (`onClick`, `disabled`, `type`…).') },
        ],
      },
    ],
  },
  {
    slug: 'glass-tabs',
    group: 'liquid',
    title: t('GlassTabs', 'GlassTabs'),
    description: t('A segmented control whose selection slides as a liquid glass lens.', 'Seçimi sıvı cam mercek olarak kayan bir bölümlü seçici.'),
    hero: 'glass-tabs-basic',
    blocks: [
      { type: 'install', item: 'glass-tabs' },
      {
        type: 'p',
        text: t(
          'When the selection changes the highlight leaves its option, swells into clear glass that bends and magnifies the labels it passes, and settles as a flat pill again. Press and hold to open the lens in place; drag and release to choose. Arrow keys move the selection.',
          'Seçim değişince vurgu seçeneğinden ayrılır, geçtiği etiketleri büken ve büyüten şeffaf bir cama dönüşür, sonra yine düz bir hap olarak oturur. Basılı tutunca mercek yerinde açılır; sürükleyip bırakarak seçersin. Ok tuşları seçimi taşır.',
        ),
      },
      { type: 'demo', id: 'glass-tabs-icons', title: t('Icons and a coloured lens', 'İkonlar ve renkli mercek') },
      COMMON_LIQUID_NOTE,
      { type: 'h', text: t('Props', 'Prop\'lar') },
      {
        type: 'props',
        rows: [
          { name: 'options', type: '{ value, label, icon?, aria-label? }[]', description: t('The segments.', 'Bölümler.') },
          { name: 'value', type: 'string | null', description: t('Selected value (controlled).', 'Seçili değer (kontrollü).') },
          { name: 'onValueChange', type: '(value) => void', description: t('Called with the new value.', 'Yeni değerle çağrılır.') },
          { name: 'aria-label', type: 'string', description: t('Required: names the group for screen readers.', 'Zorunlu: grubu ekran okuyuculara adlandırır.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('Segment height 28, 32 or 40 px.', 'Bölüm yüksekliği 28, 32 ya da 40 px.') },
          { name: 'highlightClassName', type: 'string', default: "'bg-white shadow-sm dark:bg-neutral-700'", description: t('Classes of the resting pill; its background is the lens colour.', 'Duran hapın sınıfları; arka planı merceğin rengidir.') },
        ],
      },
    ],
  },
  {
    slug: 'glass-badge',
    group: 'liquid',
    title: t('GlassBadge', 'GlassBadge'),
    description: t('A tinted glass drop with text flowing through it.', 'İçinden yazı akan, renkli bir cam damla.'),
    hero: 'glass-badge-basic',
    blocks: [
      { type: 'install', item: 'glass-badge' },
      {
        type: 'p',
        text: t(
          'The text is drawn beneath the glass, so the rim bends the letters as they pass. Whatever sits behind the badge shows through, softly blurred. Hovering the badge\'s positioned parent speeds the flow up. With reduced motion the text stands still, centred.',
          'Yazı camın altında çizilir; kenar, geçen harfleri büker. Rozetin arkasındaki her şey yumuşakça bulanık görünür. Rozetin konumlu atasının üstüne gelince akış hızlanır. Hareketi azalt açıksa yazı ortada durur.',
        ),
      },
      COMMON_LIQUID_NOTE,
      { type: 'h', text: t('Props', 'Prop\'lar') },
      {
        type: 'props',
        rows: [
          { name: 'children', type: 'string', description: t('The text.', 'Yazı.') },
          { name: 'dotColor', type: 'string', default: 'currentColor', description: t('Separator colour between repeats.', 'Tekrarlar arasındaki ayracın rengi.') },
          { name: 'speed', type: 'number', default: '0.4', description: t('Loops per second at rest.', 'Dururken saniyedeki tur sayısı.') },
          { name: 'tint', type: 'number', default: '0.82', description: t('Opacity of the badge colour over the backdrop.', 'Rozet renginin arka plan üzerindeki opaklığı.') },
          { name: 'className', type: 'string', description: t('Position and colour (`bg-*`, `text-*`).', 'Konum ve renk (`bg-*`, `text-*`).') },
        ],
      },
    ],
  },
  {
    slug: 'glass-layer',
    group: 'liquid',
    title: t('GlassLayer', 'GlassLayer'),
    description: t('Turn any element — a router link, a pill, your own button — into liquid glass.', 'Herhangi bir öğeyi — router bağlantısı, hap, kendi butonun — sıvı cama çevir.'),
    hero: 'glass-layer-custom',
    blocks: [
      { type: 'install', item: 'glass-layer' },
      {
        type: 'p',
        text: t(
          'GlassButton is GlassLayer plus sizes. When you already have the element — a Next.js `<Link>`, a shadcn `<Button>` — add the layer yourself:',
          'GlassButton, GlassLayer\'a boyutlar eklenmiş hâlidir. Öğe zaten elindeyse — Next.js `<Link>`, shadcn `<Button>` — katmanı kendin ekle:',
        ),
      },
      {
        type: 'list',
        items: [
          t('Mark the host with `data-glass-host` (it becomes `relative isolate`).', 'Ana öğeyi `data-glass-host` ile işaretle (`relative isolate` olur).'),
          t('Put `<GlassLayer />` as its first child.', '`<GlassLayer />` bileşenini ilk çocuğu yap.'),
          t('For a droplet, make the icon a direct `<svg>` child, first or last.', 'Damla için ikon, doğrudan çocuk olan bir `<svg>` olsun; ilk ya da son.'),
        ],
      },
      {
        type: 'p',
        text: t(
          'The host keeps its CSS look until the glass draws its first frame; then it gets `data-glass-ready` and drops its background, border and shadow.',
          'Cam ilk karesini çizene dek ana öğe CSS görünümünü korur; sonra `data-glass-ready` alır ve arka planını, kenarlığını ve gölgesini bırakır.',
        ),
      },
      { type: 'h', text: t('Props', 'Prop\'lar') },
      {
        type: 'props',
        rows: [
          { name: 'material', type: "'clear' | 'tinted' | 'liquid'", default: "'clear'", description: t('See GlassButton.', 'GlassButton\'a bak.') },
          { name: 'droplet', type: "'hover' | 'always' | 'none'", default: "'hover'", description: t('When the icon separates.', 'İkonun ne zaman ayrıldığı.') },
          { name: 'tint', type: 'number', default: '0.6', description: t('Clear glass tint (0–1). Set `--glass-tint` on the host to change its colour.', 'Clear cam tonu (0–1). Rengi için ana öğeye `--glass-tint` ver.') },
          { name: 'backdrop', type: 'string', description: t('CSS selector of the ancestor to refract (default: the page).', 'Kırılacak atanın CSS seçicisi (varsayılan: sayfa).') },
          { name: 'live', type: 'boolean', default: 'false', description: t('Repaint the backdrop every frame (animated content behind).', 'Arkayı her karede yeniden çiz (arkada hareketli içerik).') },
          { name: 'trigger', type: 'string', description: t('Listen for hover/press on this ancestor (e.g. a whole card).', 'Üstüne gelme/basmayı bu atada dinle (ör. kartın tamamı).') },
          { name: 'disabled', type: 'boolean', default: 'false', description: t('Keep the CSS look.', 'CSS görünümünde kal.') },
        ],
      },
    ],
  },
  {
    slug: 'glass-lens',
    group: 'liquid',
    title: t('GlassLens', 'GlassLens'),
    description: t('The sliding lens of GlassTabs, for your own tabs or radio group.', 'GlassTabs\'in kayan merceği; kendi sekmen ya da radyo grubun için.'),
    hero: 'glass-lens-custom',
    blocks: [
      { type: 'install', item: 'glass-lens' },
      {
        type: 'list',
        items: [
          t('The container is `relative isolate` and `<GlassLens value={value} />` is its first child.', 'Kap `relative isolate` olur ve `<GlassLens value={value} />` ilk çocuğudur.'),
          t('Options carry `role="radio"` or `role="tab"` (Radix Tabs works as is).', 'Seçenekler `role="radio"` ya da `role="tab"` taşır (Radix Tabs olduğu gibi çalışır).'),
          t('The selected option contains the resting pill, marked `data-glass-highlight`. Its background colour is the lens colour.', 'Seçili seçenek, `data-glass-highlight` ile işaretli duran hapı içerir. Arka plan rengi merceğin rengidir.'),
          t('Hide the pill while the lens moves: `[[data-glass-moving]_&]:opacity-0`.', 'Mercek hareket ederken hapı gizle: `[[data-glass-moving]_&]:opacity-0`.'),
          t('Optionally style the selected label as unselected during travel: `[[data-glass-traveling]_&]:…`.', 'İstersen seçili etiketi yolculuk sırasında seçilmemiş gibi boya: `[[data-glass-traveling]_&]:…`.'),
        ],
      },
      { type: 'h', text: t('Props', 'Prop\'lar') },
      {
        type: 'props',
        rows: [
          { name: 'value', type: 'string | number | null', description: t('The selected value; any change slides the lens.', 'Seçili değer; her değişiklik merceği kaydırır.') },
          { name: 'disabled', type: 'boolean', default: 'false', description: t('No lens; the pill simply jumps.', 'Mercek yok; hap doğrudan yer değiştirir.') },
        ],
      },
    ],
  },
  ...canvasPages(),
]

function canvasPages(): DocPage[] {
  const note: Block = {
    type: 'note',
    text: t(
      'Canvas controls need `three` and draw through one shared renderer that loads after hydration. Theme: the nearest `data-theme`, or `class="dark"` on `<html>`; every control also takes a `theme` prop.',
      'Tuval kontrolleri `three` ister ve hidrasyondan sonra yüklenen tek ortak çiziciyle çizilir. Tema: en yakın `data-theme` ya da `<html>` üzerindeki `class="dark"`; her kontrol ayrıca `theme` prop\'u alır.',
    ),
  }
  const page = (slug: string, title: string, description: L, rows: PropRow[], demo = slug): DocPage => ({
    slug,
    group: 'controls',
    title: t(title, title),
    description,
    hero: demo,
    blocks: [{ type: 'install', item: slug }, note, { type: 'h', text: t('Props', 'Prop\'lar') }, { type: 'props', rows }],
  })
  const theme: PropRow = { name: 'theme', type: "'light' | 'dark'", description: t('Override the page theme for this control.', 'Bu kontrol için sayfa temasını geçersiz kıl.') }
  const size = (sizes: string, d = "'md'"): PropRow => ({ name: 'size', type: sizes, default: d, description: t('Control size.', 'Kontrol boyutu.') })
  const disabled: PropRow = { name: 'disabled', type: 'boolean', default: 'false', description: t('Disable interaction.', 'Etkileşimi kapat.') }
  return [
    page('button', 'Button', t('A clear or frosted glass button that swells on press.', 'Basınca şişen, şeffaf ya da buzlu cam buton.'), [
      { name: 'variant', type: "'glass' | 'frosted' | 'ghost'", default: "'glass'", description: t('Glass look.', 'Cam görünümü.') },
      size("'sm' | 'md' | 'lg'"),
      { name: 'icon / trailingIcon', type: 'IconName', description: t('Leading / trailing icon from the kit set.', 'Kit setinden baştaki / sondaki ikon.') },
      { name: 'iconOnly', type: 'boolean', default: 'false', description: t('Round icon button; `children` becomes the aria-label.', 'Yuvarlak ikon butonu; `children` aria-label olur.') },
      { name: 'swell', type: 'number', default: '1.08', description: t('Lens growth while pressed.', 'Basılıyken merceğin büyümesi.') },
      { name: 'onClick', type: '() => void', description: t('Click handler.', 'Tıklama işleyicisi.') },
      disabled,
      theme,
    ]),
    page('segmented-control', 'SegmentedControl', t('Segments with a frosted pill that turns into a magnifying lens.', 'Büyüten bir merceğe dönüşen buzlu haplı bölümler.'), [
      { name: 'options', type: '{ value, label, icon? }[]', description: t('The segments.', 'Bölümler.') },
      { name: 'value / onChange', type: 'string / (v) => void', description: t('Selected value.', 'Seçili değer.') },
      size("'sm' | 'md' | 'lg'"),
      { name: 'stretch', type: 'boolean', default: 'false', description: t('Fill the container width.', 'Kabın enini doldur.') },
      { name: 'showIcons / showLabels', type: 'boolean', default: 'true', description: t('What each segment shows.', 'Her bölümün ne gösterdiği.') },
      { name: 'ariaLabel', type: 'string', description: t('Group name for screen readers.', 'Ekran okuyucu için grup adı.') },
      { name: 'magnify', type: 'number', default: '0.12', description: t('Zoom of the labels through the pressed lens.', 'Basılı mercekten görünen etiketlerin büyütmesi.') },
      theme,
    ]),
    page('switch', 'Switch', t('A toggle whose knob lifts into clear glass while held.', 'Topuzu basılı tutunca şeffaf cama dönen bir anahtar.'), [
      { name: 'checked / onChange', type: 'boolean / (v) => void', description: t('On or off.', 'Açık ya da kapalı.') },
      { name: 'label / description', type: 'string', description: t('Text beside the switch.', 'Anahtarın yanındaki yazı.') },
      size("'sm' | 'md' | 'lg'"),
      { name: 'labelSide', type: "'left' | 'right'", default: "'right'", description: t('Label position.', 'Etiketin yeri.') },
      disabled,
      theme,
    ]),
    page('checkbox', 'Checkbox', t('A checkbox drawn by the glass shader.', 'Cam gölgelendiricisiyle çizilen onay kutusu.'), [
      { name: 'checked / onChange', type: 'boolean / (v) => void', description: t('Checked state.', 'İşaret durumu.') },
      { name: 'label / description', type: 'string', description: t('Text beside the box.', 'Kutunun yanındaki yazı.') },
      { name: 'shape', type: "'rounded' | 'circle'", default: "'rounded'", description: t('Box shape.', 'Kutu biçimi.') },
      size("'sm' | 'md' | 'lg'"),
      disabled,
      theme,
    ]),
    page('radio-group', 'RadioGroup', t('Radio options with glass dots.', 'Cam noktalı radyo seçenekleri.'), [
      { name: 'options', type: '{ value, label, description? }[]', description: t('The options.', 'Seçenekler.') },
      { name: 'value / onChange', type: 'string / (v) => void', description: t('Selected value.', 'Seçili değer.') },
      { name: 'layout', type: "'list' | 'cards'", default: "'list'", description: t('Plain list or bordered cards.', 'Düz liste ya da kenarlıklı kartlar.') },
      { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", description: t('Flow direction.', 'Akış yönü.') },
      { name: 'ariaLabel', type: 'string', description: t('Group name.', 'Grup adı.') },
      theme,
    ]),
    page('range-slider', 'RangeSlider', t('A slider with a glass thumb over the accent fill.', 'Vurgu dolgusunun üstünde cam topuzlu kaydırıcı.'), [
      { name: 'value / onChange', type: 'number / (v) => void', default: '50', description: t('Current value.', 'Geçerli değer.') },
      { name: 'min / max / step', type: 'number', default: '0 / 100 / 1', description: t('Range.', 'Aralık.') },
      { name: 'label', type: 'string', description: t('Label above the track.', 'Rayın üstündeki etiket.') },
      { name: 'startIcon / endIcon', type: 'IconName', description: t('Icons at the ends.', 'Uçlardaki ikonlar.') },
      size("'sm' | 'md' | 'lg' | 'xl'"),
      { name: 'restFrost', type: 'number', default: '0', description: t('0 = clear resting thumb, 1 = frosted.', '0 = şeffaf duran topuz, 1 = buzlu.') },
      theme,
    ]),
    page('progress', 'Progress', t('A progress bar in a clear glass tube.', 'Şeffaf cam tüp içinde ilerleme çubuğu.'), [
      { name: 'value', type: 'number', default: '64', description: t('0–100.', '0–100.') },
      { name: 'label', type: 'string', description: t('Label above the bar.', 'Çubuğun üstündeki etiket.') },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: t('Unknown duration.', 'Süresi belirsiz.') },
      { name: 'tube', type: 'boolean', default: 'true', description: t('Encase the track in glass.', 'Rayı camla kapla.') },
      size("'sm' | 'md' | 'lg'"),
      theme,
    ]),
    page('text-field', 'TextField', t('A text input in a glass capsule.', 'Cam kapsül içinde metin alanı.'), [
      { name: 'value / onChange', type: 'string / (v) => void', description: t('Field value.', 'Alan değeri.') },
      { name: 'label / placeholder / hint / error', type: 'string', description: t('Texts around the field.', 'Alanın çevresindeki yazılar.') },
      { name: 'type', type: "'text' | 'email' | 'password' | 'search'", default: "'text'", description: t('Input type.', 'Girdi türü.') },
      { name: 'icon', type: 'IconName', description: t('Leading icon.', 'Baştaki ikon.') },
      { name: 'clearable', type: 'boolean', default: 'false', description: t('Show a clear button.', 'Temizleme butonu göster.') },
      size("'md' | 'lg'"),
      disabled,
      theme,
    ]),
    page('card', 'Card', t('A plain panel for grouping controls.', 'Kontrolleri gruplamak için sade bir panel.'), [
      { name: 'title / description', type: 'string', description: t('Header texts.', 'Başlık yazıları.') },
      { name: 'children / footer', type: 'ReactNode', description: t('Body and footer.', 'Gövde ve alt kısım.') },
      { name: 'padding', type: "'compact' | 'comfortable' | 'spacious'", default: "'comfortable'", description: t('Inner spacing.', 'İç boşluk.') },
      theme,
    ]),
    page('icon', 'Icon', t('The 24×24 stroke icon set shared by DOM and canvas.', 'DOM ve tuvalin ortak kullandığı 24×24 çizgi ikon seti.'), [
      { name: 'name', type: 'IconName', default: "'sparkle'", description: t('One of `iconNames`.', '`iconNames` içinden biri.') },
      { name: 'size', type: 'number', default: '15', description: t('Pixel size.', 'Piksel boyutu.') },
      { name: 'strokeWidth', type: 'number', default: '2', description: t('Line width.', 'Çizgi kalınlığı.') },
    ]),
    page('liquid-glass-pane', 'LiquidGlass', t('A bare glass pane you can put behind anything.', 'Herhangi bir şeyin arkasına koyabileceğin çıplak cam.'), [
      { name: 'width / height', type: 'number', description: t('Glass size in px.', 'Cam boyutu (px).') },
      { name: 'x / y', type: 'number', default: '0', description: t('Offset inside the positioned parent.', 'Konumlu ata içindeki kayma.') },
      { name: 'frost', type: 'number', default: '0', description: t('0 clear … 1 frosted.', '0 şeffaf … 1 buzlu.') },
      { name: 'pressed / hovered', type: 'boolean', description: t('Drive the press and hover springs.', 'Basma ve üstüne gelme yaylarını sür.') },
      { name: 'drawBackdrop', type: '(ctx, tokens, glass) => void', description: t('Paint what lies beneath the glass.', 'Camın altında kalanı çiz.') },
    ]),
    page('glass-card', 'GlassCard', t('A card that bends the page behind it (Chromium; frosted elsewhere).', 'Arkasındaki sayfayı büken kart (Chromium; diğerlerinde buzlu).'), [
      { name: 'mode', type: "'light' | 'dark' | 'custom'", default: "'light'", description: t('Colour preset.', 'Renk hazır ayarı.') },
      { name: 'width / height / radius', type: 'number', default: '500 / 120 / 40', description: t('Size and corners.', 'Boyut ve köşeler.') },
      { name: 'shape', type: "'rounded' | 'rectangle' | 'circle' | 'ellipse'", default: "'rounded'", description: t('Outline.', 'Dış biçim.') },
      { name: 'refractStrength', type: 'number', default: '0.065', description: t('Rim refraction.', 'Kenar kırılması.') },
      { name: 'frostedRadius', type: 'number', default: '10', description: t('Blur radius in px.', 'Bulanıklık yarıçapı (px).') },
      { name: 'children', type: 'ReactNode', description: t('Card content.', 'Kart içeriği.') },
    ]),
  ]
}

export const pageBySlug = (slug: string) => PAGES.find((p) => p.slug === slug)
