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
  /** "Use it for / Not for": what sets this component apart from the others. */
  | { type: 'when'; use: L[]; avoid: L[] }
  /** The components as live cards. */
  | { type: 'index' }

export type DocGroup = 'start' | 'components'

export type DocPage = {
  slug: string
  group: DocGroup
  /** What the docs call it. The site is Liquid Glass, so components drop the prefix: "Button". */
  title: L
  /** Components: the export you import (`GlassButton`). Code, llms files and Markdown use it. */
  name?: string
  description: L
  /** Components: the one verb that names what it does (Press, Merge, Travel, Flow, Drag). */
  verb?: L
  /** One line: the single thing this component does that the others don't. */
  signature?: L
  /** Shown first on the page and used as the card preview. */
  hero?: string
  blocks: Block[]
}

export const GROUPS: { id: DocGroup; title: L }[] = [
  { id: 'start', title: { en: 'Get started', tr: 'Başlarken' } },
  { id: 'components', title: { en: 'Components', tr: 'Bileşenler' } },
]

// ── Registry ────────────────────────────────────────────────────────────────
// Every item installs into components/liquid-glass/. Files are copied byte-for-byte;
// nothing is generated or rewritten.

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
  /** The docs page (slug) the item points to. Defaults to its name. */
  docs?: string
  dependencies?: string[]
  /** Tailwind v4 CSS the CLI merges into the user's stylesheet. */
  css?: Record<string, unknown>
  cssVars?: Record<string, Record<string, string>>
}

const liquid = (file: string) => `src/components/liquid-glass/${file}`

export const REGISTRY: RegistryItem[] = [
  {
    name: 'liquid-glass',
    title: 'Liquid Glass (everything)',
    description: 'GlassButton, GlassActionButton, GlassTabs, GlassBadge, GlassSlideToConfirm, GlassCard and GlassButtonGroup on one WebGL2 engine. GlassButton and GlassTabs need @ui-sdk/core and @ui-sdk/react.',
    entries: [liquid('index.ts')],
    dependencies: ['@ui-sdk/core'],
    docs: 'introduction',
  },
  { name: 'button', title: 'GlassButton', description: 'Press: a clear or tinted glass button that swells under the pointer. Needs @ui-sdk/core and @ui-sdk/react.', entries: [liquid('glass-button.tsx')], dependencies: ['@ui-sdk/core'] },
  {
    name: 'action-button',
    title: 'GlassActionButton',
    description: 'Merge: an async action button whose arrow droplet melts into the body when pressed, and stays.',
    entries: [liquid('glass-action-button.tsx')],
  },
  { name: 'tabs', title: 'GlassTabs', description: 'Travel: a segmented control whose selection travels as a lens (GlassLens included). Needs @ui-sdk/core and @ui-sdk/react.', entries: [liquid('glass-tabs.tsx')], dependencies: ['@ui-sdk/core'] },
  { name: 'badge', title: 'GlassBadge', description: 'Flow: a glass badge with its text flowing through the lens.', entries: [liquid('glass-badge.tsx')] },
  {
    name: 'slide-to-confirm',
    title: 'GlassSlideToConfirm',
    description: 'Drag: a slide-to-confirm track whose glass thumb is dragged to the end to run one deliberate action.',
    entries: [liquid('glass-slide-to-confirm.tsx')],
  },
  {
    name: 'card',
    title: 'GlassCard',
    description: 'Hold: a frosted glass card that holds your content while its rim bends what slides behind.',
    entries: [liquid('glass-card.tsx')],
  },
  {
    name: 'button-group',
    title: 'GlassButtonGroup',
    description: 'Share: related actions in one body of glass, side by side or stacked, with separators and text.',
    entries: [liquid('glass-button-group.tsx')],
  },
  // The controls below are drawn by their own renderer (controls/glass), which needs `three`; their behaviour is UI SDK's.
  { name: 'slider', title: 'RangeSlider', description: 'Slide: a range slider whose glass thumb opens into a wide lens while held. Needs three, @ui-sdk/core and @ui-sdk/react.', entries: [liquid('controls/RangeSlider.tsx')], dependencies: ['@ui-sdk/core'] },
  { name: 'switch', title: 'Switch', description: 'Flip: an on/off switch whose knob swells into a clear lens as it crosses the track. Needs three, @ui-sdk/core and @ui-sdk/react.', entries: [liquid('controls/Switch.tsx')], dependencies: ['@ui-sdk/core'] },
  { name: 'checkbox', title: 'Checkbox', description: 'Tick: a checkbox under a cap of clear glass. Needs three, @ui-sdk/core and @ui-sdk/react.', entries: [liquid('controls/Checkbox.tsx')], dependencies: ['@ui-sdk/core'] },  // Behaviour (keyboard, focus, the top layer, ARIA) comes from UI SDK; the glass is the kit's own engine.
  {
    name: 'select',
    title: 'GlassSelect',
    description: 'Stretch: a select whose list swells out of its button as one body of glass, on a neck that stretches and snaps (GlassPopup included). Needs @ui-sdk/core and @ui-sdk/react.',
    entries: [liquid('glass-select.tsx')],
    dependencies: ['@ui-sdk/core'],
  },
  {
    name: 'dropdown-menu',
    title: 'GlassDropdownMenu',
    description: 'Open: a menu of actions that swells out of its trigger, or out of a whole GlassButtonGroup, as one body of glass (GlassPopup included). Needs @ui-sdk/core and @ui-sdk/react.',
    entries: [liquid('glass-dropdown-menu.tsx')],
    dependencies: ['@ui-sdk/core'],
  },
]

// ── Pages ───────────────────────────────────────────────────────────────────

const t = (en: string, tr: string): L => ({ en, tr })

const h = (en: string, tr: string): Block => ({ type: 'h', text: t(en, tr) })

export const PAGES: DocPage[] = [
  {
    slug: 'introduction',
    group: 'start',
    title: t('Introduction', 'Giriş'),
    description: t(
      'Glass components for React. Copy a file, get exactly what the demo shows.',
      'React için cam bileşenleri. Dosyayı kopyala, demoda gördüğünün aynısını al.',
    ),
    blocks: [
      {
        type: 'p',
        text: t(
          'Liquid Glass UI is a set of React components drawn by one WebGL2 glass shader. Each does one thing the others don\'t. There is no npm package: you copy the files into your project, and they are yours.',
          'Liquid Glass UI, tek bir WebGL2 cam gölgelendiricisiyle çizilen React bileşenleridir. Her biri, diğerlerinin yapmadığı tek bir işi yapar. npm paketi yok: dosyaları projene kopyalarsın ve artık senindir.',
        ),
      },
      { type: 'index' },
      h('How it works', 'Nasıl çalışır'),
      {
        type: 'list',
        items: [
          t('**One engine.** One WebGL2 context for the whole page, in plain TypeScript files. Where a component needs behaviour (keyboard, focus, forms, ARIA), it comes from UI SDK.', '**Tek motor.** Tüm sayfa için tek WebGL2 bağlamı, düz TypeScript dosyalarında. Bir bileşenin davranışa (klavye, odak, formlar, ARIA) ihtiyacı varsa, o UI SDK\'dan gelir.'),
          t('**Your DOM.** The glass is a canvas behind your own elements, so any router, any styling and your own markup keep working.', '**Senin DOM\'un.** Cam, senin öğelerinin arkasındaki bir tuvaldir; her router, her stil ve kendi işaretlemen çalışmaya devam eder.'),
          t('**Free at rest.** The render loop runs only while a spring moves and stops completely when nothing does.', '**Dururken bedava.** Çizim döngüsü yalnız bir yay hareket ederken çalışır, hiçbir şey kıpırdamıyorsa tamamen durur.'),
        ],
      },
      h('Browser support', 'Tarayıcı desteği'),
      {
        type: 'p',
        text: t(
          'The glass needs WebGL2, which current desktop and mobile browsers have. Without it, or before the first frame, every component keeps its plain CSS look: never a blank box. With reduced motion the springs stand still and the badge text stops.',
          'Cam WebGL2 ister; güncel masaüstü ve mobil tarayıcılarda vardır. Yoksa ya da ilk kare çizilene dek her bileşen sade CSS görünümünü korur: asla boş bir kutu değil. Hareketi azalt açıksa yaylar durur, rozetteki yazı akmaz.',
        ),
      },
      h('The one rule', 'Tek kural'),
      {
        type: 'p',
        text: t(
          'Copy the files verbatim. The look lives in the exact shader constants and spring values. Customise through props and class names, never by editing the engine.',
          'Dosyaları birebir kopyala. Görünüm gölgelendiricinin ve yayların tam değerlerinde yaşar. Özelleştirmeyi prop ve sınıf adlarıyla yap, motoru düzenleyerek değil.',
        ),
      },
    ],
  },
  {
    slug: 'installation',
    group: 'start',
    title: t('Installation', 'Kurulum'),
    description: t('Add components with the shadcn CLI, or copy the folder by hand.', 'Bileşenleri shadcn CLI ile ekle ya da klasörü elle kopyala.'),
    blocks: [
      h('Requirements', 'Gereksinimler'),
      {
        type: 'list',
        items: [
          t('React 19 (Next.js 15+, Vite, TanStack Start, React Router…)', 'React 19 (Next.js 15+, Vite, TanStack Start, React Router…)'),
          t('Tailwind CSS v4', 'Tailwind CSS v4'),
          t('An `@/` import alias pointing at your source folder (the shadcn default).', 'Kaynak klasörünü gösteren bir `@/` içe aktarma takma adı (shadcn varsayılanı).'),
        ],
      },
      h('With the CLI', 'CLI ile'),
      {
        type: 'p',
        text: t(
          'Every component page has its own command. This one installs all of them into `components/liquid-glass/`:',
          'Her bileşen sayfasının kendi komutu var. Bu komut hepsini birden `components/liquid-glass/` içine kurar:',
        ),
      },
      { type: 'install', item: 'liquid-glass' },
      h('By hand', 'Elle'),
      {
        type: 'p',
        text: t(
          'Copy `src/components/liquid-glass/` from the repository into your project as `components/liquid-glass/`. Nothing else is needed: no npm package, no CSS file (the components inject the few rules they need).',
          'Depodaki `src/components/liquid-glass/` klasörünü projene `components/liquid-glass/` olarak kopyala. Başka bir şey gerekmez: npm paketi yok, CSS dosyası yok (bileşenler ihtiyaç duydukları birkaç kuralı kendileri ekler).',
        ),
      },
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { GlassButton } from '@/components/liquid-glass'

export function Hero() {
  return <GlassButton material="tinted" className="bg-sky-500 text-white">Get started</GlassButton>
}`,
      },
      h('Dark mode', 'Karanlık mod'),
      {
        type: 'p',
        text: t(
          'The glass reads its colours from your CSS (the nearest opaque background and the element\'s own colours), so it follows whatever theme system you use. Clear glass picks its text colour from the tone it ends up, so labels stay readable on light and dark backdrops alike.',
          'Cam renklerini senin CSS\'inden okur (en yakın opak arka plan ve öğenin kendi renkleri); hangi tema sistemini kullanırsan onu izler. Berrak cam yazı rengini vardığı tondan seçer; etiketler açık ve koyu zeminlerde aynı şekilde okunur.',
        ),
      },
      h('Next.js', 'Next.js'),
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
      h('Install the skill', 'Skill\'i kur'),
      { type: 'code', title: 'terminal', code: `npx skills add bilalgursen/liquid-glass` },
      {
        type: 'p',
        text: t(
          'The skill teaches an agent which component fits which need, the install command, the props, and the rule that matters most: copy the files verbatim and customise only through props and classes.',
          'Skill, ajana hangi bileşenin hangi ihtiyaca uyduğunu, kurulum komutunu, prop\'ları ve en önemli kuralı öğretir: dosyaları birebir kopyala, yalnız prop ve sınıflarla özelleştir.',
        ),
      },
      h('A prompt that works', 'İşe yarayan bir istem'),
      {
        type: 'code',
        title: 'prompt',
        code: `Add a glass "Deploy" button that shows Deploying… then Deployed ✓.
Use Liquid Glass UI (https://liquid-glass-interface.pages.dev/llms.txt):
install it with the shadcn CLI, use its GlassActionButton as documented,
and do not modify the files in components/liquid-glass/.`,
      },
    ],
  },

  // ── Components ──
  {
    slug: 'button',
    group: 'components',
    title: t('Button', 'Button'),
    name: 'GlassButton',
    description: t(
      'A button made of glass. Clear glass bends the page behind it; tinted glass takes your background colour.',
      'Camdan bir buton. Berrak cam arkasındaki sayfayı büker; renkli cam senin arka plan rengini alır.',
    ),
    verb: t('Press', 'Bas'),
    signature: t('Swells under the pointer, bends the page behind it.', 'İmleç altında şişer, arkasındaki sayfayı büker.'),
    hero: 'glass-button-clear',
    blocks: [
      {
        type: 'when',
        use: [
          t('One action: a call to action, a toolbar button, a link that looks like a button.', 'Tek bir eylem: harekete geçirici buton, araç çubuğu butonu, buton gibi görünen bir bağlantı.'),
          t('Clear glass over imagery or colour, where the bend shows.', 'Bükülmenin göründüğü görsel ya da renk üstünde berrak cam.'),
        ],
        avoid: [
          t('An async action whose result should show on the button: use GlassActionButton.', 'Sonucu butonda görünmesi gereken asenkron bir eylem: GlassActionButton kullan.'),
          t('Choosing between options: use GlassTabs.', 'Seçenekler arasında seçim: GlassTabs kullan.'),
          t('Every button of a dense form: keep the glass for the action that matters.', 'Yoğun bir formun her butonu: camı önemli olan eyleme sakla.'),
        ],
      },
      { type: 'install', item: 'button' },
      {
        type: 'note',
        text: t(
          'The button underneath is UI SDK\'s, so Button needs `@ui-sdk/core` and `@ui-sdk/react`. Return a Promise from `onClick` and the button stays pending until it settles: it ignores further presses and says so to screen readers. The install command adds both packages at the exact version this was built on: UI SDK is in beta and its API may still change.',
          'Alttaki buton UI SDK\'nın butonudur; bu yüzden Button `@ui-sdk/core` ve `@ui-sdk/react` paketlerine ihtiyaç duyar. `onClick`\'ten bir Promise döndürürsen buton, o sonuçlanana kadar beklemede kalır: yeni basışları yok sayar ve bunu ekran okuyuculara bildirir. Kurulum komutu iki paketi, bileşenin yazıldığı tam sürümle ekler: UI SDK beta aşamasında ve API\'si hâlâ değişebilir.',
        ),
      },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { GlassButton } from '@/components/liquid-glass'

<GlassButton>Get started</GlassButton>
<GlassButton material="tinted" className="bg-sky-500 text-white">Save</GlassButton>
<GlassButton asChild>
  <Link href="/docs">Read the docs</Link>
</GlassButton>`,
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'glass-button-tinted', title: t('Tinted colours and sizes', 'Renkli cam ve boyutlar') },
      {
        type: 'p',
        text: t(
          'Colour tinted glass with a normal class such as `bg-sky-500`; the glass paints itself in that colour and adds light and shadow. A `border-*` class becomes the glass rim.',
          'Renkli camı `bg-sky-500` gibi sıradan bir sınıfla boya; cam kendini o renge boyar, ışık ve gölge ekler. Bir `border-*` sınıfı camın kenarı olur.',
        ),
      },
      { type: 'demo', id: 'glass-button-link', title: t('As a link (asChild)', 'Bağlantı olarak (asChild)') },
      {
        type: 'p',
        text: t(
          'With `asChild` the glass goes on your single child element instead of a `<button>`: an `<a>`, a Next.js `<Link>`, a TanStack Router `<Link>`. Your element keeps its own props and navigation.',
          '`asChild` ile cam, `<button>` yerine tek çocuk öğene gelir: bir `<a>`, Next.js `<Link>`, TanStack Router `<Link>`. Öğen kendi prop\'larını ve gezinmesini korur.',
        ),
      },
      { type: 'demo', id: 'glass-button-scrim', title: t('Over colour with a scrim', 'Örtülü renkler üstünde') },
      {
        type: 'p',
        text: t(
          'Clear glass repaints what lies behind it: background colours, gradients and images, `<img>` and `<video>` the way the page crops them (`object-fit`), text, inline SVG icons and backdrop blur, in their stacking order. Shadows, `::before`/`::after` and conic gradients are not painted.',
          'Berrak cam arkasında kalanı yeniden boyar: arka plan renkleri, gradyanlar ve görseller, sayfanın kırptığı haliyle `<img>` ve `<video>` (`object-fit`), yazı, satır içi SVG ikonlar ve arka plan bulanıklığı; hepsi kendi yığın sırasıyla. Gölgeler, `::before`/`::after` ve konik gradyanlar boyanmaz.',
        ),
      },
      {
        type: 'note',
        text: t(
          'An image from another origin must be served with CORS headers (image CDNs usually send them): the glass requests it again with CORS, and leaves it out if the server refuses.',
          'Başka bir kaynaktan gelen görsel CORS başlıklarıyla sunulmalıdır (görsel CDN\'leri çoğunlukla gönderir): cam görseli CORS ile yeniden ister, sunucu izin vermezse onu dışarıda bırakır.',
        ),
      },
      { type: 'demo', id: 'glass-button-corners', title: t('Square corners', 'Köşeli') },
      {
        type: 'p',
        text: t(
          'The glass takes the corners of the element it sits on. Add a `rounded-*` class and the lens, its rim and its shadow follow; the bend stays as deep as on a pill.',
          'Cam, üstünde durduğu öğenin köşelerini alır. Bir `rounded-*` sınıfı ekle; mercek, kenarı ve gölgesi onu izler, bükülme haptaki kadar derin kalır.',
        ),
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'material', type: "'clear' | 'tinted'", default: "'clear'", description: t('Clear bends the page; tinted uses the background colour.', 'Clear sayfayı büker; tinted arka plan rengini kullanır.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: t('Height 32, 40, 48 or 64 px.', 'Yükseklik 32, 40, 48 ya da 64 px.') },
          { name: 'icon', type: 'ReactNode', description: t('An icon element (e.g. a lucide-react icon).', 'Bir ikon öğesi (ör. lucide-react ikonu).') },
          { name: 'iconPosition', type: "'start' | 'end'", default: "'end'", description: t('Which side the icon sits on.', 'İkonun hangi tarafta durduğu.') },
          { name: 'tint', type: 'number', default: '0.6', description: t('Clear glass only: how much tint covers the backdrop (0–1).', 'Yalnız clear: renk tonunun arkayı ne kadar örttüğü (0–1).') },
          { name: 'asChild', type: 'boolean', default: 'false', description: t('Put the glass on the single child element instead of a `<button>`.', 'Camı `<button>` yerine tek çocuk öğeye koy.') },
          { name: '…rest', type: 'button attributes', description: t('Passed to the button: `onClick`, `disabled`, `type`, and UI SDK\'s `pendingAnnouncement` and `focusableWhenDisabled`.', 'Butona aktarılır: `onClick`, `disabled`, `type` ve UI SDK\'nın `pendingAnnouncement` ile `focusableWhenDisabled` prop\'ları.') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('A real `<button>` (or your own element with `asChild`): focus, Enter and Space work as usual.', 'Gerçek bir `<button>` (ya da `asChild` ile kendi öğen): odak, Enter ve Space her zamanki gibi çalışır.'),
          t('The glass canvas is `aria-hidden`; only your label is announced.', 'Cam tuvali `aria-hidden`; yalnız senin etiketin okunur.'),
          t('Icon-only buttons need an `aria-label`.', 'Yalnız ikonlu butonlar `aria-label` ister.'),
        ],
      },
    ],
  },
  {
    slug: 'action-button',
    group: 'components',
    title: t('Action Button', 'Action Button'),
    name: 'GlassActionButton',
    description: t(
      'A button for one async action. Its arrow floats apart as a glass droplet; press it and the droplet melts into the body, and stays.',
      'Tek bir asenkron eylem için buton. Oku ayrı bir cam damlası olarak durur; basınca damla gövdeye karışır ve öyle kalır.',
    ),
    verb: t('Merge', 'Birleş'),
    signature: t('The arrow is a droplet: press it and it melts in for good.', 'Ok bir damla: basınca gövdeye karışır ve öyle kalır.'),
    hero: 'glass-action-button-basic',
    blocks: [
      {
        type: 'when',
        use: [
          t('One async commit whose result belongs on the button: Deploy, Publish, Add to cart, Subscribe.', 'Sonucu butonun üstünde görünmesi gereken tek bir asenkron eylem: Yayınla, Gönder, Sepete ekle, Abone ol.'),
          t('Actions that stay done: the merged "Deployed ✓" is the new state of the page.', 'Bir kez yapılınca öyle kalan eylemler: birleşmiş "Deployed ✓" sayfanın yeni durumudur.'),
        ],
        avoid: [
          t('Plain links and instant actions: use GlassButton.', 'Sıradan bağlantılar ve anlık eylemler: GlassButton kullan.'),
          t('Toggling back and forth between two states: use GlassTabs.', 'İki durum arasında gidip gelmek: GlassTabs kullan.'),
          t('More than one per screen: the droplet is the kit\'s one gooey effect, keep it special.', 'Ekran başına birden fazla: damla setin tek yapışkan efekti, özel kalsın.'),
        ],
      },
      { type: 'install', item: 'action-button' },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { GlassActionButton } from '@/components/liquid-glass'

<GlassActionButton
  material="tinted"
  className="bg-neutral-900 text-white"
  pendingLabel="Deploying"
  successLabel="Deployed"
  onAction={deploy} // return the promise
>
  Deploy
</GlassActionButton>`,
      },
      h('The flow', 'Akış'),
      {
        type: 'list',
        items: [
          t('**Idle.** The arrow floats apart from the body as a separate glass droplet.', '**Boşta.** Ok, gövdeden ayrı bir cam damlası olarak durur.'),
          t('**Press.** The droplet stretches back on a gooey bridge and melts into the body.', '**Bas.** Damla yapışkan bir köprüyle geri uzanır ve gövdeye karışır.'),
          t('**Pending.** One body; the label morphs to `pendingLabel` and a spinner turns where the arrow was, until the promise from `onAction` settles.', '**Bekleme.** Tek gövde; etiket `pendingLabel`\'a dönüşür ve okun yerinde bir döner simge, `onAction`\'ın döndürdüğü söz sonuçlanana dek döner.'),
          t('**Success.** Still one body: `successLabel` and a check that draws itself in. It stays merged, unless you set `resetAfter`.', '**Başarı.** Hâlâ tek gövde: `successLabel` ve kendini çizen bir onay işareti. `resetAfter` vermezsen öyle kalır.'),
          t('**Error.** If `onAction` throws, the droplet splits off again and `onActionError` gets the error.', '**Hata.** `onAction` hata fırlatırsa damla yeniden ayrılır ve hata `onActionError`\'a gider.'),
        ],
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'glass-action-button-reset', title: t('Reset after success, and a failing action', 'Başarıdan sonra sıfırlama ve başarısız bir eylem') },
      {
        type: 'p',
        text: t(
          'With `resetAfter={2400}` the droplet splits off again 2.4 seconds after a success, ready for the next press. Any icon element can be the droplet with `icon`; the spinner and the check are built in.',
          '`resetAfter={2400}` ile damla, başarıdan 2,4 saniye sonra yeniden ayrılır ve bir sonraki basışa hazır olur. `icon` ile herhangi bir ikon damla olabilir; döner simge ve onay işareti hazır gelir.',
        ),
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'children', type: 'ReactNode', description: t('The idle label, and the button\'s accessible name.', 'Boştaki etiket; butonun erişilebilir adı da budur.') },
          { name: 'onAction', type: '() => unknown', description: t('Required. Runs on press; return a promise to stay pending until it settles.', 'Zorunlu. Basınca çalışır; sonuçlanana dek beklemede kalmak için bir söz (promise) döndür.') },
          { name: 'onActionError', type: '(error) => void', description: t('Called when `onAction` throws; the button returns to idle.', '`onAction` hata fırlatınca çağrılır; buton boşta durumuna döner.') },
          { name: 'pendingLabel', type: 'ReactNode', default: 'children', description: t('Label while `onAction` runs.', '`onAction` çalışırken etiket.') },
          { name: 'successLabel', type: 'ReactNode', default: 'children', description: t('Label after it succeeds.', 'Başarıdan sonraki etiket.') },
          { name: 'resetAfter', type: 'number', default: '0', description: t('Milliseconds before splitting off again after a success. `0` stays merged.', 'Başarıdan sonra yeniden ayrılmadan önceki milisaniye. `0` birleşik kalır.') },
          { name: 'icon', type: 'ReactNode', default: 'arrow', description: t('The droplet\'s idle icon.', 'Damlanın boştaki ikonu.') },
          { name: 'material', type: "'clear' | 'tinted'", default: "'clear'", description: t('As on GlassButton.', 'GlassButton\'daki gibi.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('Height 32, 40 or 48 px.', 'Yükseklik 32, 40 ya da 48 px.') },
          { name: '…rest', type: 'button attributes', description: t('Passed to the `<button>` (not `onClick`: use `onAction`).', '`<button>`\'a aktarılır (`onClick` değil: `onAction` kullan).') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('A real `<button>`; Enter and Space run the action.', 'Gerçek bir `<button>`; Enter ve Space eylemi çalıştırır.'),
          t('Pending sets `aria-busy`, and pending or done sets `aria-disabled` instead of `disabled`, so focus stays on the button.', 'Bekleme `aria-busy` koyar; bekleme ya da bitmiş durum `disabled` yerine `aria-disabled` koyar, böylece odak butonda kalır.'),
          t('A `role="status"` region announces the pending and success labels.', 'Bir `role="status"` bölgesi bekleme ve başarı etiketlerini duyurur.'),
          t('With reduced motion the droplet and labels switch without animation.', 'Hareketi azalt açıksa damla ve etiketler animasyonsuz değişir.'),
        ],
      },
    ],
  },
  {
    slug: 'tabs',
    group: 'components',
    title: t('Tabs', 'Tabs'),
    name: 'GlassTabs',
    description: t('A segmented control whose selection travels as a glass lens.', 'Seçimi bir cam mercek olarak yolculuk eden bölümlü seçici.'),
    verb: t('Travel', 'Kay'),
    signature: t('The selection travels as a lens that magnifies what it passes.', 'Seçim, geçtiğini büyüten bir mercek olarak yolculuk eder.'),
    hero: 'glass-tabs-basic',
    blocks: [
      {
        type: 'when',
        use: [
          t('Switching a view or a range in place: Day / Week / Month, List / Grid.', 'Yerinde görünüm ya da aralık değiştirmek: Gün / Hafta / Ay, Liste / Izgara.'),
          t('Two to five short options.', 'İki ile beş arası kısa seçenek.'),
        ],
        avoid: [
          t('Navigating between pages: use links.', 'Sayfalar arası gezinme: bağlantı kullan.'),
          t('Long lists of options: use a select.', 'Uzun seçenek listeleri: select kullan.'),
        ],
      },
      { type: 'install', item: 'tabs' },
      {
        type: 'note',
        text: t(
          'The behaviour (one tab stop, arrow keys, a hidden radio per option for forms) comes from UI SDK\'s segmented control, so Tabs needs `@ui-sdk/core` and `@ui-sdk/react`. The install command adds them at the exact version this was built on: UI SDK is in beta and its API may still change.',
          'Davranış (tek sekme durağı, ok tuşları, formlar için her seçeneğe gizli bir radio) UI SDK\'nın segmented control\'ünden gelir; bu yüzden Tabs `@ui-sdk/core` ve `@ui-sdk/react` paketlerine ihtiyaç duyar. Kurulum komutu onları, bileşenin yazıldığı tam sürümle ekler: UI SDK beta aşamasında ve API\'si hâlâ değişebilir.',
        ),
      },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { GlassTabs } from '@/components/liquid-glass'

const [view, setView] = useState('week')

<GlassTabs
  aria-label="Range"
  value={view}
  onValueChange={setView}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
  ]}
/>`,
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'glass-tabs-icons', title: t('With icons', 'İkonlarla') },
      {
        type: 'p',
        text: t(
          'When the selection changes, the highlight leaves its option, becomes clear glass that bends the labels it passes, and settles as a flat pill again. Press and hold to open the lens in place; drag and release to choose.',
          'Seçim değişince vurgu seçeneğinden ayrılır, geçtiği etiketleri büken berrak bir cama dönüşür ve yine düz bir hap olarak oturur. Basılı tutunca mercek yerinde açılır; sürükleyip bırakarak seçersin.',
        ),
      },
      h('Your own markup', 'Kendi işaretlemen'),
      {
        type: 'p',
        text: t(
          'Already have tabs (Radix Tabs, your own radio group)? Put the lens on them with `GlassLens`, which ships with GlassTabs:',
          'Zaten sekmelerin mi var (Radix Tabs, kendi radyo grubun)? Merceği GlassTabs ile birlikte gelen `GlassLens` ile onlara koy:',
        ),
      },
      {
        type: 'list',
        items: [
          t('The container is `relative isolate` and `<GlassLens value={value} />` is its first child.', 'Kap `relative isolate` olur ve `<GlassLens value={value} />` ilk çocuğudur.'),
          t('Options carry `role="radio"` or `role="tab"` (Radix Tabs works as is)', 'Seçenekler `role="radio"` ya da `role="tab"` taşır (Radix Tabs olduğu gibi çalışır)'),
          t(
            'The selected option contains the resting highlight, marked `data-glass-highlight`. Its background colour is the lens colour and its corners are the lens corners: `rounded-full` travels as a pill, `rounded-lg` as a rounded rectangle.',
            'Seçili seçenek, `data-glass-highlight` ile işaretli duran vurguyu içerir. Arka plan rengi merceğin rengi, köşeleri merceğin köşeleridir: `rounded-full` hap olarak, `rounded-lg` köşeleri yuvarlatılmış dikdörtgen olarak kayar.',
          ),
          t('Hide the highlight while the lens moves: `[[data-glass-moving]_&]:opacity-0`.', 'Mercek hareket ederken vurguyu gizle: `[[data-glass-moving]_&]:opacity-0`.'),
        ],
      },
      { type: 'demo', id: 'glass-tabs-custom', title: t('A billing switch with GlassLens', 'GlassLens ile bir ödeme seçici') },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'options', type: '{ value, label, icon?, aria-label? }[]', description: t('The segments.', 'Bölümler.') },
          { name: 'value', type: 'string | null', description: t('Selected value (controlled).', 'Seçili değer (kontrollü).') },
          { name: 'onValueChange', type: '(value) => void', description: t('Called with the new value.', 'Yeni değerle çağrılır.') },
          { name: 'aria-label', type: 'string', description: t('Required: names the group for screen readers.', 'Zorunlu: grubu ekran okuyuculara adlandırır.') },
          { name: 'name', type: 'string', description: t('Submits the selected value under this name with the form around it.', 'Seçili değeri, çevresindeki formla bu adla gönderir.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('Segment height 28, 32 or 40 px.', 'Bölüm yüksekliği 28, 32 ya da 40 px.') },
          { name: 'highlightClassName', type: 'string', default: "'bg-white dark:bg-neutral-700'", description: t('Classes of the resting pill; its background is the lens colour.', 'Duran hapın sınıfları; arka planı merceğin rengidir.') },
          { name: 'GlassLens value', type: 'string | number | null', description: t('Your own markup: the selected value; any change moves the lens.', 'Kendi işaretlemen: seçili değer; her değişiklik merceği taşır.') },
          { name: 'GlassLens disabled', type: 'boolean', default: 'false', description: t('No lens; the highlight simply jumps.', 'Mercek yok; vurgu doğrudan yer değiştirir.') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('Radiogroup pattern: one tab stop, arrow keys move the selection.', 'Radiogroup kalıbı: tek sekme durağı, ok tuşları seçimi taşır.'),
          t('Icon-only options take an `aria-label` each.', 'Yalnız ikonlu seçenekler kendi `aria-label`\'ını alır.'),
          t('With reduced motion the pill simply jumps.', 'Hareketi azalt açıksa hap doğrudan yer değiştirir.'),
        ],
      },
    ],
  },
  {
    slug: 'badge',
    group: 'components',
    title: t('Badge', 'Badge'),
    name: 'GlassBadge',
    description: t('A small glass badge with its text flowing through the lens.', 'İçinden yazısı akan küçük bir cam rozet.'),
    verb: t('Flow', 'Ak'),
    signature: t('Text flows through the glass; the rim bends each letter.', 'Yazı camın içinden akar; kenar her harfi büker.'),
    hero: 'glass-badge-basic',
    blocks: [
      {
        type: 'when',
        use: [t('One short word on a card or a tab: New, Beta, Live.', 'Bir kartta ya da sekmede tek kısa kelime: Yeni, Beta, Canlı.')],
        avoid: [
          t('Counts or status that must be read at a glance: the text is moving.', 'Bir bakışta okunması gereken sayı ya da durum: yazı hareket ediyor.'),
          t('Several on one screen: the motion competes.', 'Bir ekranda birkaç tane: hareketler yarışır.'),
        ],
      },
      { type: 'install', item: 'badge' },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { GlassBadge } from '@/components/liquid-glass'

<div className="relative">
  <Card />
  <GlassBadge className="absolute -top-2 -right-2">New</GlassBadge>
</div>`,
      },
      h('Behaviour', 'Davranış'),
      {
        type: 'p',
        text: t(
          'The text is drawn beneath the glass, so the rim bends the letters as they pass. Whatever sits behind the badge shows through, softly blurred. Hovering the badge\'s positioned parent speeds the flow up. Colour it with `bg-*` and `text-*`. With `tint` at 0.6 or below the glass counts as clear, and its rim mirrors the colours around it.',
          'Yazı camın altında çizilir; kenar, geçen harfleri büker. Rozetin arkasındaki her şey yumuşakça bulanık görünür. Rozetin konumlu atasının üstüne gelince akış hızlanır. `bg-*` ve `text-*` ile renklendir. `tint` 0.6 ya da altındayken cam şeffaf sayılır ve kenarı çevresindeki renkleri yansıtır.',
        ),
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'glass-badge-colors', title: t('Your colours', 'Kendi renklerin') },
      {
        type: 'p',
        text: t(
          'The badge takes its colour from its own classes: `bg-*` is the glass, `text-*` the text that flows through it, and `dotColor` the square between repeats. Hover speeds up only the badge whose positioned parent is under the pointer.',
          'Rozet rengini kendi sınıflarından alır: `bg-*` camın, `text-*` içinden akan yazının, `dotColor` ise tekrarlar arasındaki karenin rengidir. İmleç hangi konumlu atanın üstündeyse yalnız onun rozeti hızlanır.',
        ),
      },
      { type: 'demo', id: 'glass-badge-palette', title: t('A palette', 'Bir palet') },
      {
        type: 'p',
        text: t(
          'Any `bg-*` works as the glass. Pair it with a `text-*` that reads on it (dark text on amber, white on the rest) and a `dotColor` a shade away from the text. They sit side by side here only to compare: in a product, keep to one badge per view.',
          'Her `bg-*` cam rengi olur. Yanına üstünde okunan bir `text-*` (amberde koyu, diğerlerinde beyaz yazı) ve yazıdan bir ton farklı bir `dotColor` koy. Burada yalnız karşılaştırmak için yan yanalar: üründe ekran başına tek rozet kullan.',
        ),
      },
      { type: 'demo', id: 'glass-badge-product', title: t('On a product, for a sale', 'Bir ürünün üstünde, indirim için') },
      {
        type: 'p',
        text: t(
          'A rose badge hangs off the corner of the cover. Half of it is over the yellow and half over the page, so the glass shows both.',
          'Gül rengi bir rozet kapağın köşesinden taşar. Yarısı sarının, yarısı sayfanın üstündedir; cam ikisini de gösterir.',
        ),
      },
      { type: 'demo', id: 'glass-badge-dock', title: t('On a dock item', 'Bir dock öğesinin üstünde') },
      {
        type: 'p',
        text: t(
          'Put the badge inside the button and give the button `relative`: the orange badge then speeds up when that item is hovered, not the whole dock.',
          'Rozeti düğmenin içine koy ve düğmeye `relative` ver: turuncu rozet o zaman bütün dock\'ta değil, yalnız o öğenin üstüne gelince hızlanır.',
        ),
      },
      { type: 'demo', id: 'glass-badge-tint', title: t('Clearer glass over colour', 'Rengin üstünde daha berrak cam') },
      {
        type: 'p',
        text: t(
          '`tint` is how much of the badge colour covers what is behind it. At the default `0.82` the badge reads as a solid colour; lower it over a colourful backdrop and the backdrop shows in the glass, softly blurred. `speed` is the pace at rest, in loops per second. The badge is 64 px wide by default: widen it with a `w-*` class for a longer word.',
          '`tint`, rozet renginin arkasında kalanı ne kadar örttüğüdür. Varsayılan `0.82` değerinde rozet düz bir renk gibi okunur; renkli bir zeminde düşürürsen zemin camın içinde yumuşakça bulanık görünür. `speed`, dururkenki hızdır (saniyedeki tur sayısı). Rozet varsayılan olarak 64 px genişliğindedir: daha uzun bir kelime için `w-*` sınıfıyla genişlet.',
        ),
      },
      { type: 'demo', id: 'glass-badge-inline', title: t('Inline, next to a label', 'Satır içinde, bir etiketin yanında') },
      {
        type: 'p',
        text: t(
          'Without a position class the badge sits in the line like any inline element. Give the row `relative` so the hover that speeds the text up belongs to that row.',
          'Konum sınıfı vermezsen rozet, satır içi herhangi bir öğe gibi satırda durur. Yazıyı hızlandıran hover o satıra ait olsun diye satıra `relative` ver.',
        ),
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'children', type: 'string', description: t('The text: one short word.', 'Yazı: tek kısa kelime.') },
          { name: 'dotColor', type: 'string', default: 'currentColor', description: t('Separator colour between repeats.', 'Tekrarlar arasındaki ayracın rengi.') },
          { name: 'speed', type: 'number', default: '0.4', description: t('Loops per second at rest.', 'Dururken saniyedeki tur sayısı.') },
          { name: 'tint', type: 'number', default: '0.82', description: t('Opacity of the badge colour over the backdrop.', 'Rozet renginin arka plan üzerindeki opaklığı.') },
          { name: 'className', type: 'string', description: t('Position and colour (`bg-*`, `text-*`).', 'Konum ve renk (`bg-*`, `text-*`).') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('The text is announced once, not as a loop.', 'Yazı döngü olarak değil, bir kez okunur.'),
          t('With reduced motion the text stands still, centred.', 'Hareketi azalt açıksa yazı ortada durur.'),
        ],
      },
    ],
  },
  {
    slug: 'slide-to-confirm',
    group: 'components',
    title: t('Slide to Confirm', 'Slide to Confirm'),
    name: 'GlassSlideToConfirm',
    description: t(
      'A slide-to-confirm track. Drag its glass thumb to the end to run one deliberate action; let go early and it springs back.',
      'Kaydırarak onaylama rayı. Cam topuzu sona kadar sürükleyince tek bir bilinçli eylem çalışır; erken bırakırsan geri yaylanır.',
    ),
    verb: t('Drag', 'Sürükle'),
    signature: t('Drag the glass thumb to the end to confirm.', 'Cam topuzu sona kadar sürükle, onaylansın.'),
    hero: 'glass-slide-to-confirm-compact',
    blocks: [
      {
        type: 'when',
        use: [
          t('A routine action a stray tap must not trigger: send money, pay, unlock, start a shift.', 'Yanlışlıkla dokunuşun tetiklememesi gereken sıradan bir eylem: para gönder, öde, kilidi aç, vardiyayı başlat.'),
          t('Phone-first surfaces, where a deliberate horizontal gesture replaces a confirm dialog.', 'Bilinçli bir yatay hareketin onay penceresinin yerini aldığı, önce telefon için tasarlanan yüzeyler.'),
        ],
        avoid: [
          t('Easily undone actions: use GlassButton.', 'Kolayca geri alınan eylemler: GlassButton kullan.'),
          t('An async action a single press may start: use GlassActionButton.', 'Tek basışla başlayabilecek asenkron bir eylem: GlassActionButton kullan.'),
          t('Consequences people must read first: use a dialog.', 'Önce okunması gereken sonuçlar: bir onay penceresi kullan.'),
        ],
      },
      { type: 'install', item: 'slide-to-confirm' },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { GlassSlideToConfirm } from '@/components/liquid-glass'

<GlassSlideToConfirm
  pendingLabel="Sending"
  successLabel="Sent"
  errorLabel="Not sent, slide to retry"
  onConfirm={send} // return the promise
>
  Slide to send $240
</GlassSlideToConfirm>`,
      },
      h('The flow', 'Akış'),
      {
        type: 'list',
        items: [
          t('**Idle.** The thumb rests at the start as frosted white glass; the instruction is written in the track.', '**Boşta.** Topuz başta buzlu beyaz cam olarak durur; yönerge rayın içinde yazar.'),
          t('**Drag.** The thumb turns to clear glass and bends the fill and the label it passes; its chevron stays in place, in the fill\'s text colour. It stays round while held, and speed stretches it along its travel. The fill trails a moment behind, joined to the thumb by a bridge that thins as they pull apart, and the track and the fill swell around the thumb like a membrane. Pushed past the end the track stretches like a rubber band; pushed against the start the wall gives a little. The thumb stays round at both.', '**Sürükle.** Topuz berrak cama dönüşür, geçtiği dolguyu ve etiketi büker; oku yerinde kalır ve dolgunun yazı rengini alır. Tutulurken yuvarlak kalır, hız onu gittiği yönde uzatır. Dolgu bir an geriden gelir; topuza, aralarındaki mesafe açıldıkça incelen bir köprüyle bağlıdır. Ray ve dolgu da topuzun çevresinde bir zar gibi şişer. Sonu aşacak kadar itilince ray lastik gibi uzar; başa doğru itilince duvar biraz esner. Topuz iki uçta da yuvarlak kalır.'),
          t('**Let go early.** Below `threshold` the thumb springs back; the fill\'s tail follows and is absorbed after it.', '**Erken bırak.** `threshold` altında topuz geri yaylanır; dolgunun kuyruğu arkasından gelir ve emilir.'),
          t('**Pending.** Past the threshold the thumb lands at the end, the track draws in to a ring around it and `pendingLabel` appears beside it while a spinner takes the chevron\'s place, until the promise from `onConfirm` settles.', '**Bekleme.** Eşiği geçince topuz sona oturur, ray onun çevresinde bir halkaya çekilir ve `pendingLabel` yanında belirir, okun yerini bir döner simge alır; `onConfirm`\'in döndürdüğü söz sonuçlanana dek.'),
          t('**Success.** The white glass takes the fill\'s colour and the chevron\'s stroke bends into a check, beside `successLabel`. It stays confirmed, unless you set `resetAfter`: then the track opens first, `successLabel` leaving with its edge, and the thumb flies home after it, squashing a little as it lands against the start.', '**Başarı.** Beyaz cam dolgunun rengine bürünür, okun çizgisi `successLabel`\'ın yanında bir onay işaretine bükülür. `resetAfter` vermezsen onaylı kalır; verirsen önce ray açılır ve `successLabel` onun kenarıyla birlikte çekilir, topuz ardından hızla başa döner ve başa çarparken hafifçe ezilir.'),
          t('**Error.** If `onConfirm` throws, the track opens again, the thumb returns and `errorLabel` replaces the instruction until the next slide.', '**Hata.** `onConfirm` hata fırlatırsa ray yeniden açılır, topuz geri döner ve `errorLabel` bir sonraki sürüklemeye dek yönergenin yerini alır.'),
        ],
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'glass-slide-to-confirm-basic', title: t('A full-width payment', 'Tam genişlikte bir ödeme') },
      { type: 'demo', id: 'glass-slide-to-confirm-error', title: t('A coloured fill, and a failing action', 'Renkli dolgu ve başarısız bir eylem') },
      {
        type: 'p',
        text: t(
          'Colour the fill with `fillClassName`: its `bg-*` is the fill, its `text-*` is the label written on it, and the thumb\'s icon while the glass is clear. At rest the thumb is always frosted white glass with a dark icon (a flat white disc without WebGL2). The control fills its container, so set the width on a parent or with `className`.',
          'Dolguyu `fillClassName` ile renklendir: `bg-*` dolgunun rengi, `text-*` ise üstüne yazılan etiketin ve cam berrakken topuzdaki ikonun rengidir. Topuz dururken her zaman koyu ikonlu buzlu beyaz camdır (WebGL2 yoksa düz beyaz bir disk). Bileşen kabını doldurur; genişliği bir üst öğede ya da `className` ile ver.',
        ),
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'children', type: 'string', description: t('The instruction in the track, and the slider\'s accessible name.', 'Raydaki yönerge; kaydırıcının erişilebilir adı da budur.') },
          { name: 'onConfirm', type: '() => unknown', description: t('Required. Runs once the thumb reaches the end; return a promise to stay pending until it settles.', 'Zorunlu. Topuz sona varınca bir kez çalışır; sonuçlanana dek beklemede kalmak için bir söz (promise) döndür.') },
          { name: 'onConfirmError', type: '(error) => void', description: t('Called when `onConfirm` throws; the thumb springs back.', '`onConfirm` hata fırlatınca çağrılır; topuz geri yaylanır.') },
          { name: 'pendingLabel', type: 'string', description: t('Written beside the spinner while `onConfirm` runs.', '`onConfirm` çalışırken döner simgenin yanında yazar.') },
          { name: 'successLabel', type: 'string', description: t('Written beside the check after it succeeds.', 'Başarıdan sonra onay işaretinin yanında yazar.') },
          { name: 'errorLabel', type: 'string', description: t('Replaces the instruction after a failure, until the next slide.', 'Hatadan sonra, bir sonraki sürüklemeye dek yönergenin yerini alır.') },
          { name: 'threshold', type: 'number', default: '0.9', description: t('Share of the track the thumb must pass before letting go confirms.', 'Bırakınca onaylanması için topuzun geçmesi gereken ray payı.') },
          { name: 'resetAfter', type: 'number', default: '0', description: t('Milliseconds after a success before the track opens again. `0` stays confirmed.', 'Başarıdan sonra rayın yeniden açılmasından önceki milisaniye. `0` onaylı kalır.') },
          { name: 'hint', type: 'boolean', default: 'true', description: t('Nudges the thumb every few seconds until it has been touched. Off with reduced motion.', 'Dokunulana dek topuzu birkaç saniyede bir hafifçe iter. Hareketi azalt açıksa kapalıdır.') },
          { name: 'icon', type: 'ReactNode', default: 'chevron', description: t('The thumb\'s idle icon.', 'Topuzun boştaki ikonu.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: t('Track height 40, 48, 56 or 96 px.', 'Ray yüksekliği 40, 48, 56 ya da 96 px.') },
          { name: 'fillClassName', type: 'string', default: "'bg-[#3291FF] text-white'", description: t('Classes of the fill: its colour and the colour of the text on it.', 'Dolgunun sınıfları: rengi ve üstündeki yazının rengi.') },
          { name: 'disabled', type: 'boolean', default: 'false', description: t('Dims the control and ignores pointer and keyboard.', 'Bileşeni soluklaştırır; imleç ve klavyeyi yok sayar.') },
          { name: 'className', type: 'string', description: t('Width and position of the track.', 'Rayın genişliği ve konumu.') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('A real `role="slider"` named by its label, with `aria-valuenow` kept in step with the thumb.', 'Etiketiyle adlandırılan gerçek bir `role="slider"`; `aria-valuenow` topuzla birlikte güncellenir.'),
          t('Arrow keys move the thumb in tenths, Page Up and Page Down in quarters, Home returns it and End confirms. Holding Space or Enter glides it to the end; letting go early springs it back.', 'Ok tuşları topuzu onda bir, Page Up ve Page Down dörtte bir oynatır; Home geri döndürür, End onaylar. Space ya da Enter basılı tutulunca topuz sona süzülür; erken bırakılırsa geri yaylanır.'),
          t('A `role="status"` region announces the pending, success and error labels. While pending or confirmed the slider is `aria-disabled`.', 'Bir `role="status"` bölgesi bekleme, başarı ve hata etiketlerini duyurur. Beklemede ya da onaylıyken kaydırıcı `aria-disabled` olur.'),
          t('Success is never colour alone: the chevron becomes a check and the label is written beside it.', 'Başarı yalnız renkle anlatılmaz: ok onay işaretine dönüşür ve etiket yanına yazılır.'),
          t('Vertical page scroll still works over the control on touch. With reduced motion each state shows at once.', 'Dokunmatik ekranda bileşenin üstünde dikey kaydırma çalışmaya devam eder. Hareketi azalt açıksa her durum anında gösterilir.'),
        ],
      },
    ],
  },
  {
    slug: 'card',
    group: 'components',
    title: t('Card', 'Card'),
    name: 'GlassCard',
    description: t(
      'A card made of frosted glass. Your content sits on it; its face blurs and tints whatever lies behind so the text stays readable, and its rim pulls it towards the centre.',
      'Buzlu camdan bir kart. İçeriğin üstünde durur; yüzü arkasında kalanı bulanıklaştırıp tonlar, yazı okunur kalır; kenarı da onu merkeze doğru çeker.',
    ),
    verb: t('Hold', 'Tut'),
    signature: t('Holds your content; its rim bends what slides behind.', 'İçeriğini tutar; kenarı arkasından kayanı büker.'),
    hero: 'glass-card-basic',
    blocks: [
      {
        type: 'when',
        use: [
          t('A small surface of content over colour, imagery or motion: a widget, a now-playing card, a summary.', 'Renk, görsel ya da hareket üstünde küçük bir içerik yüzeyi: bir widget, çalan parça kartı, bir özet.'),
          t('One or two cards, where what is behind them is part of the design.', 'Arkalarında kalanın tasarımın parçası olduğu bir ya da iki kart.'),
        ],
        avoid: [
          t('Long text and forms: the backdrop shows through. Use a plain card.', 'Uzun metin ve formlar: arka plan görünür. Sade bir kart kullan.'),
          t('A card on a flat background: there is nothing to bend.', 'Düz bir zemindeki kart: bükülecek bir şey yok.'),
          t('One clickable action: use GlassButton.', 'Tıklanan tek bir eylem: GlassButton kullan.'),
        ],
      },
      { type: 'install', item: 'card' },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { GlassCard } from '@/components/liquid-glass'

<GlassCard className="w-64 p-5">
  <p className="font-semibold">Wednesday</p>
  <p className="text-sm opacity-60">Design review · 10:00</p>
</GlassCard>

// Something moves behind it: repaint what it bends every frame.
<GlassCard live className="size-44 p-4">…</GlassCard>

// Clearer glass: no frost, less tint.
<GlassCard blur={0} tint={0.3} className="w-64 p-5">…</GlassCard>`,
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'glass-card-widgets', title: t('Widgets over a wallpaper', 'Bir duvar kâğıdının üstünde widget\'lar') },
      {
        type: 'p',
        text: t(
          'Over a still backdrop, like the wallpaper here, the card needs no `live`. Like every glass in the kit it repaints only when something changes, and draws nothing at rest. Turn `live` on only when content moves behind the card, as with the rows of colour above: the card then draws every frame while it is on screen.',
          'Buradaki duvar kâğıdı gibi durağan bir zeminin üstünde kartın `live`a ihtiyacı yok. Setteki her cam gibi yalnız bir şey değişince yeniden boyanır, dururken hiçbir şey çizmez. `live`ı yalnız kartın arkasında bir şey hareket ediyorsa aç (yukarıdaki renk sıraları gibi): kart o zaman ekranda kaldığı sürece her kare çizer.',
        ),
      },
      {
        type: 'p',
        text: t(
          'The rim pulls what is behind towards the card\'s centre, by 6.5% of the viewport, fading over half the card, so type and colour stretch along the edge. The face then frosts the bent picture with a 5 px blur (`blur`) and covers it with a tint (`tint`): 70% white on a light page, 70% black on a dark one. A 1.3 px white line runs inside the rim; there is no colour split or light, only a soft drop shadow. Unlike a button, the card stays still under the pointer: it holds content, it does not swell. Size and padding come from your classes, and the glass takes the card\'s corners: `rounded-[28px]` by default, any `rounded-*` class to change them. Text on clear glass follows the tone the glass ends up (`data-glass-tone`), so it reads on light and dark backdrops. For a coloured card, use `material="tinted"` with a `bg-*` class.',
          'Kenar, arkada kalanı kartın merkezine doğru çeker (görüntü alanının %6.5\'i kadar) ve bu çekiş kartın yarısı boyunca söner; yazı ve renk kenar boyunca uzar. Ardından yüz, bükülmüş görüntüyü 5 px bulanıklıkla buzlar (`blur`) ve bir tonla örter (`tint`): açık sayfada %70 beyaz, koyu sayfada %70 siyah. Kenarın içinde 1.3 px beyaz bir çizgi uzanır; renk ayrışması ya da ışık yok, yalnız yumuşak bir gölge var. Butondan farklı olarak kart imlecin altında sabit kalır: içerik tutar, şişmez. Boyut ve iç boşluk senin sınıflarından gelir; cam kartın köşelerini alır: varsayılan `rounded-[28px]`, değiştirmek için herhangi bir `rounded-*` sınıfı. Berrak camdaki yazı, camın vardığı tonu izler (`data-glass-tone`); açık ve koyu zeminde okunur. Renkli bir kart için `material="tinted"` ile bir `bg-*` sınıfı kullan.',
        ),
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'children', type: 'ReactNode', description: t('The card\'s content.', 'Kartın içeriği.') },
          { name: 'material', type: "'clear' | 'tinted'", default: "'clear'", description: t('Clear bends what is behind; tinted uses the background colour.', 'Clear arkasında kalanı büker; tinted arka plan rengini kullanır.') },
          { name: 'tint', type: 'number', default: '0.7', description: t('Clear glass only: how much tint covers the backdrop (0–1): white on a light page, black on a dark one.', 'Yalnız clear: renk tonunun arkayı ne kadar örttüğü (0–1): açık sayfada beyaz, koyu sayfada siyah.') },
          { name: 'blur', type: 'number', default: '5', description: t('Clear glass only: how much the backdrop is frosted, in px like CSS `blur()`. `0` shows it sharp.', 'Yalnız clear: arkanın ne kadar buzlandığı, CSS `blur()` gibi px. `0` keskin gösterir.') },
          { name: 'live', type: 'boolean', default: 'false', description: t('Repaint the backdrop every frame, for content that moves behind the card.', 'Kartın arkasında hareket eden içerik için arkayı her karede yeniden boya.') },
          { name: 'className', type: 'string', description: t('Size, padding, corners (`rounded-*`) and, for tinted glass, colour (`bg-*`).', 'Boyut, iç boşluk, köşeler (`rounded-*`) ve renkli camda renk (`bg-*`).') },
          { name: '…rest', type: 'div attributes', description: t('Passed to the `<div>` (`role`, `aria-label`, `onClick`…).', '`<div>`\'e aktarılır (`role`, `aria-label`, `onClick`…).') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('A plain `<div>`: when the card stands for one thing, name it (`role="group"` with an `aria-label`).', 'Sade bir `<div>`: kart tek bir şeyi temsil ediyorsa adlandır (`role="group"` ve bir `aria-label`).'),
          t('The glass canvas is `aria-hidden`; only your content is read.', 'Cam tuvali `aria-hidden`; yalnız senin içeriğin okunur.'),
          t('Content that moves behind it should respect reduced motion: the rows above stop.', 'Arkasında hareket eden içerik hareketi azalt tercihine uymalı: yukarıdaki sıralar durur.'),
        ],
      },
    ],
  },
  {
    slug: 'slider',
    group: 'components',
    title: t('Slider', 'Slider'),
    name: 'RangeSlider',
    description: t(
      'A range slider with a glass thumb: a small pill at rest that opens into a wide lens while you hold it.',
      'Cam tutamaklı aralık kaydırıcısı: dururken küçük bir hap, basılı tutunca geniş bir merceğe açılır.',
    ),
    verb: t('Slide', 'Kaydır'),
    signature: t('The thumb opens into a wide lens that bends the track and stretches as it moves.', 'Tutamak, rayı büken ve hareket ederken esneyen geniş bir merceğe açılır.'),
    hero: 'range-slider',
    blocks: [
      {
        type: 'when',
        use: [
          t('Picking a value on a continuous range: volume, brightness, opacity.', 'Sürekli bir aralıkta değer seçmek: ses, parlaklık, opaklık.'),
        ],
        avoid: [
          t('Exact numbers the user must type: use a number input.', 'Kullanıcının yazması gereken kesin sayılar: sayı girişi kullan.'),
          t('Confirming one action: that is Slide to Confirm.', 'Tek bir eylemi onaylamak: o iş Slide to Confirm\'in.'),
        ],
      },
      { type: 'install', item: 'slider' },
      {
        type: 'note',
        text: t(
          'Slider, Switch and Checkbox are drawn by their own renderer, which needs `three`, and take their behaviour (keyboard, the label, the input a form reads) from UI SDK: `@ui-sdk/core` and `@ui-sdk/react`. The install command adds all three; UI SDK is in beta, so it is added at the exact version this was built on.',
          'Slider, Switch ve Checkbox kendi çizicileriyle çizilir ve `three` paketine ihtiyaç duyar; davranışlarını (klavye, etiket, formun okuduğu girdi) UI SDK\'dan alır: `@ui-sdk/core` ve `@ui-sdk/react`. Kurulum komutu üçünü de ekler; UI SDK beta aşamasında olduğu için bileşenin yazıldığı tam sürümle eklenir.',
        ),
      },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { RangeSlider } from '@/components/liquid-glass/controls/RangeSlider'

const [volume, setVolume] = useState(60)

<RangeSlider label="Volume" value={volume} onChange={setVolume} />`,
      },
      {
        type: 'p',
        text: t(
          'Drag the glass, or press the track to bring it there. While held, the pill swells into a clear lens that bends the track and the fill beneath it, and squashes and stretches with its speed; released, it springs back to the small pill.',
          'Camı sürükle ya da raya basıp oraya getir. Basılı tutulduğunda hap, altındaki rayı ve dolguyu büken berrak bir merceğe şişer, hızına göre basılıp esner; bırakınca yay gibi küçük hapa döner.',
        ),
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'range-slider-colors', title: t('Colours', 'Renkler') },
      {
        type: 'p',
        text: t(
          '`color` is the filled part of the track; without it the slider is the kit\'s blue. The thumb stays white at rest and clear glass while held.',
          '`color` rayın dolu kısmıdır; verilmezse kaydırıcı kitin mavisidir. Tutamak dururken beyaz, basılıyken berrak cam kalır.',
        ),
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'value', type: 'number', default: '50', description: t('Current value.', 'Geçerli değer.') },
          { name: 'onChange', type: '(value: number) => void', description: t('Called with the new value.', 'Yeni değerle çağrılır.') },
          { name: 'min / max / step', type: 'number', default: '0 / 100 / 1', description: t('The range and its step.', 'Aralık ve adımı.') },
          { name: 'label', type: 'string', default: "'Volume'", description: t('Label above the track; an empty string hides it.', 'Rayın üstündeki etiket; boş dize gizler.') },
          { name: 'name', type: 'string', description: t('Submits the value under this name with the form around it.', 'Değeri, çevresindeki formla bu adla gönderir.') },
          { name: 'showValue', type: 'boolean', default: 'true', description: t('Shows the value next to the label.', 'Değeri etiketin yanında gösterir.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: t('Track height 8, 12, 18 or 26 px; the glass scales with it.', 'Ray yüksekliği 8, 12, 18 ya da 26 px; cam onunla ölçeklenir.') },
          { name: 'startIcon / endIcon', type: "IconName | 'none'", default: "'none'", description: t('Icons at either end of the track.', 'Rayın iki ucundaki ikonlar.') },
          { name: 'color', type: 'string', default: "'#3291FF'", description: t('The filled part of the track: a hex, `rgb()` or named colour, not a CSS variable.', 'Rayın dolu kısmı: hex, `rgb()` ya da adlandırılmış bir renk; CSS değişkeni olmaz.') },
          { name: 'theme', type: "'light' | 'dark'", description: t('Overrides the page theme for this slider.', 'Bu kaydırıcı için sayfa temasını ezer.') },
          { name: 'restFrost', type: 'number', default: '1', description: t('The thumb at rest: 1 = a white pill, 0 = clear glass. Held, it is always clear glass.', 'Dururken tutamak: 1 = beyaz hap, 0 = berrak cam. Basılıyken hep berrak cam.') },
          { name: 'refraction', type: 'number', default: '37', description: t('How far the lens bends what lies beneath.', 'Merceğin altındakini ne kadar büktüğü.') },
          { name: 'dispersion / rimIntensity / magnification', type: 'number', default: '0.12 / 0.55 / 0', description: t('Colour fringing, rim light and zoom of the lens.', 'Merceğin renk saçılması, kenar ışığı ve büyütmesi.') },
          { name: 'motionStretch / motionSmoothing', type: 'number', default: '3 / 30', description: t('Squash and stretch with speed; how tightly the glass follows.', 'Hıza göre basılıp esneme; camın ne kadar sıkı izlediği.') },
          { name: 'pressSpeed / pressBounce', type: 'number', default: '16 / 0.4', description: t('The spring that opens and closes the lens.', 'Merceği açıp kapatan yay.') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('A native range input does the work: arrow keys, Home, End and Page Up / Down, and screen readers announce the value.', 'İşi yerel bir range girişi yapar: ok tuşları, Home, End ve Page Up / Down; ekran okuyucular değeri okur.'),
          t('The `label` names the input.', '`label` girişi adlandırır.'),
          t('With reduced motion the glass follows without springs.', 'Hareketi azalt açıksa cam yaysız izler.'),
        ],
      },
    ],
  },
  {
    slug: 'switch',
    group: 'components',
    title: t('Switch', 'Switch'),
    name: 'Switch',
    description: t(
      'An on/off toggle whose knob swells into a clear lens while it crosses the track.',
      'Topuzu rayı geçerken berrak bir merceğe şişen aç/kapa anahtarı.',
    ),
    verb: t('Flip', 'Çevir'),
    signature: t('The knob swells into clear glass as it crosses, then settles white.', 'Topuz geçerken berrak cama şişer, sonra beyaz olarak oturur.'),
    hero: 'switch',
    blocks: [
      {
        type: 'when',
        use: [t('A setting that takes effect at once: Wi-Fi, notifications, dark mode.', 'Hemen etkili olan bir ayar: Wi-Fi, bildirimler, koyu mod.')],
        avoid: [
          t('A choice that is saved later with a form: use Checkbox.', 'Sonradan formla kaydedilen bir seçim: Checkbox kullan.'),
          t('More than two states: use Tabs.', 'İkiden fazla durum: Tabs kullan.'),
        ],
      },
      { type: 'install', item: 'switch' },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { Switch } from '@/components/liquid-glass/controls/Switch'

const [on, setOn] = useState(false)

<Switch label="Notifications" description="Banners and sounds" checked={on} onChange={setOn} />`,
      },
      {
        type: 'p',
        text: t(
          'Tap to flip, or hold the knob and drag it across. Needs `three` and UI SDK, like Slider.',
          'Dokununca çevrilir; ya da topuzu tutup karşıya sürükle. Slider gibi `three` ve UI SDK gerektirir.',
        ),
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'switch-colors', title: t('Colours', 'Renkler') },
      {
        type: 'p',
        text: t(
          '`color` is the track while on; without it the switch is the kit\'s blue. The knob stays white. Without `onChange` a switch keeps its own state, starting from `checked`.',
          '`color` açıkken rayın rengidir; verilmezse anahtar kitin mavisidir. Topuz beyaz kalır. `onChange` vermezsen anahtar, `checked` ile başlayıp kendi durumunu tutar.',
        ),
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'checked', type: 'boolean', default: 'false', description: t('On or off.', 'Açık ya da kapalı.') },
          { name: 'onChange', type: '(checked: boolean) => void', description: t('Called with the new state.', 'Yeni durumla çağrılır.') },
          { name: 'label', type: 'string', default: "'Notifications'", description: t('Text beside the switch; an empty string leaves the switch alone.', 'Anahtarın yanındaki metin; boş dize yalnız anahtarı bırakır.') },
          { name: 'description', type: 'string', description: t('A second, quieter line under the label.', 'Etiketin altında ikinci, daha sessiz bir satır.') },
          { name: 'name', type: 'string', description: t('Submits with the form around it under this name.', 'Çevresindeki formla bu adla gönderilir.') },
          { name: 'labelSide', type: "'left' | 'right'", default: "'right'", description: t('Which side the label sits on.', 'Etiketin hangi yanda durduğu.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('Track height 22, 28 or 36 px.', 'Ray yüksekliği 22, 28 ya da 36 px.') },
          { name: 'color', type: 'string', default: "'#3291FF'", description: t('The track while on: a hex, `rgb()` or named colour, not a CSS variable.', 'Açıkken rayın rengi: hex, `rgb()` ya da adlandırılmış bir renk; CSS değişkeni olmaz.') },
          { name: 'theme', type: "'light' | 'dark'", description: t('Overrides the page theme for this switch.', 'Bu anahtar için sayfa temasını ezer.') },
          { name: 'disabled', type: 'boolean', default: 'false', description: t('Dimmed and not interactive.', 'Soluk ve etkileşimsiz.') },
          { name: 'lensScale', type: 'number', default: '1.55', description: t('Size of the travelling lens relative to the resting knob.', 'Yolculuk eden merceğin duran topuza göre boyutu.') },
          { name: 'refraction / knobBounce', type: 'number', default: '26 / 0.3', description: t('How far the lens bends the track; how much the knob overshoots.', 'Merceğin rayı ne kadar büktüğü; topuzun ne kadar taştığı.') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('A `<button role="switch">` with `aria-checked`: Space and Enter flip it.', '`aria-checked` taşıyan bir `<button role="switch">`: Space ve Enter çevirir.'),
          t('The `label` is a real `<label>` tied to the button.', '`label`, butona bağlı gerçek bir `<label>` öğesidir.'),
          t('With reduced motion the knob simply jumps.', 'Hareketi azalt açıksa topuz doğrudan yer değiştirir.'),
        ],
      },
    ],
  },
  {
    slug: 'checkbox',
    group: 'components',
    title: t('Checkbox', 'Checkbox'),
    name: 'Checkbox',
    description: t(
      'A checkbox under a cap of clear glass: the box and its mark are always seen through the lens.',
      'Berrak bir cam kapağın altındaki onay kutusu: kutu ve işareti hep merceğin içinden görünür.',
    ),
    verb: t('Tick', 'İşaretle'),
    signature: t('Always glass: the mark draws itself beneath a clear cap that swells when pressed.', 'Hep cam: işaret, basınca şişen berrak bir kapağın altında kendini çizer.'),
    hero: 'checkbox',
    blocks: [
      {
        type: 'when',
        use: [
          t('Choosing any number of items in a list or a form.', 'Bir listede ya da formda istediğin kadar öğe seçmek.'),
          t('Agreeing to something that is submitted later.', 'Sonradan gönderilecek bir şeyi onaylamak.'),
        ],
        avoid: [
          t('A setting that takes effect at once: use Switch.', 'Hemen etkili olan bir ayar: Switch kullan.'),
          t('One choice out of several: use Tabs.', 'Birkaç seçenekten biri: Tabs kullan.'),
        ],
      },
      { type: 'install', item: 'checkbox' },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { Checkbox } from '@/components/liquid-glass/controls/Checkbox'

const [remember, setRemember] = useState(true)

<Checkbox label="Remember this device" checked={remember} onChange={setRemember} />`,
      },
      {
        type: 'p',
        text: t(
          'The glass cap is there at rest, not only while pressed. Needs `three` and UI SDK, like Slider.',
          'Cam kapak yalnız basılıyken değil, dururken de oradadır. Slider gibi `three` ve UI SDK gerektirir.',
        ),
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'checkbox-colors', title: t('Colours', 'Renkler') },
      {
        type: 'p',
        text: t(
          '`color` is the box while checked; without it the checkbox is the kit\'s blue. The mark stays white.',
          '`color` işaretliyken kutunun rengidir; verilmezse onay kutusu kitin mavisidir. İşaret beyaz kalır.',
        ),
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'checked', type: 'boolean', default: 'true', description: t('Checked or not.', 'İşaretli ya da değil.') },
          { name: 'onChange', type: '(checked: boolean) => void', description: t('Called with the new state.', 'Yeni durumla çağrılır.') },
          { name: 'label', type: 'string', default: "'Remember this device'", description: t('Text beside the box; an empty string leaves the box alone.', 'Kutunun yanındaki metin; boş dize yalnız kutuyu bırakır.') },
          { name: 'description', type: 'string', description: t('A second, quieter line under the label.', 'Etiketin altında ikinci, daha sessiz bir satır.') },
          { name: 'name', type: 'string', description: t('Submits with the form around it under this name.', 'Çevresindeki formla bu adla gönderilir.') },
          { name: 'shape', type: "'rounded' | 'circle'", default: "'rounded'", description: t('A rounded square or a circle.', 'Köşeleri yuvarlak kare ya da daire.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('Box size 18, 22 or 28 px.', 'Kutu boyutu 18, 22 ya da 28 px.') },
          { name: 'color', type: 'string', default: "'#3291FF'", description: t('The box while checked: a hex, `rgb()` or named colour, not a CSS variable.', 'İşaretliyken kutunun rengi: hex, `rgb()` ya da adlandırılmış bir renk; CSS değişkeni olmaz.') },
          { name: 'theme', type: "'light' | 'dark'", description: t('Overrides the page theme for this checkbox.', 'Bu onay kutusu için sayfa temasını ezer.') },
          { name: 'disabled', type: 'boolean', default: 'false', description: t('Dimmed and not interactive.', 'Soluk ve etkileşimsiz.') },
          { name: 'swell', type: 'number', default: '1.18', description: t('How much the cap grows while pressed.', 'Kapağın basılıyken ne kadar büyüdüğü.') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('A `<button role="checkbox">` with `aria-checked`: Space toggles it.', '`aria-checked` taşıyan bir `<button role="checkbox">`: Space ile işaretlenir.'),
          t('The `label` is a real `<label>` tied to the button.', '`label`, butona bağlı gerçek bir `<label>` öğesidir.'),
          t('With reduced motion the mark and the cap change without springs.', 'Hareketi azalt açıksa işaret ve kapak yaysız değişir.'),
        ],
      },
    ],
  },
  {
    slug: 'select',
    group: 'components',
    title: t('Select', 'Select'),
    name: 'GlassSelect',
    description: t(
      'A select whose list swells out of its button as one body of glass, holds on by a neck that stretches and snaps, and closes by the same motion played backwards.',
      'Listesi butonundan tek bir cam gövde olarak şişen, esneyip kopan bir boyunla ona tutunan ve aynı hareketin tersiyle kapanan seçim kutusu.',
    ),
    verb: t('Stretch', 'Esne'),
    signature: t('The list and its button are one liquid: a neck stretches between them, thins and snaps.', 'Liste ile butonu tek bir sıvıdır: aralarında bir boyun esner, incelir ve kopar.'),
    hero: 'glass-select-basic',
    blocks: [
      {
        type: 'when',
        use: [
          t('Picking one option from a short list that should stay out of the way until asked for.', 'İstenene kadar gözden uzak durması gereken kısa bir listeden tek seçenek seçmek.'),
          t('A form field: the value is submitted under `name`.', 'Bir form alanı: değer `name` ile gönderilir.'),
        ],
        avoid: [
          t('Two to five options that fit on one line: use Tabs.', 'Tek satıra sığan iki ila beş seçenek: Tabs kullan.'),
          t('An on/off setting: use Switch.', 'Aç/kapa bir ayar: Switch kullan.'),
          t('Several of these on one screen: one stretching list is a moment, a form full of them is noise.', 'Aynı ekranda birkaç tane: esneyen tek bir liste bir andır, onlarla dolu bir form gürültüdür.'),
        ],
      },
      { type: 'install', item: 'select' },
      {
        type: 'note',
        text: t(
          'The behaviour (keyboard, typeahead, focus, positioning, ARIA) comes from UI SDK, so Select needs `@ui-sdk/core` and `@ui-sdk/react`. The install command adds them at the exact version this was built on: UI SDK is in beta and its API may still change.',
          'Davranış (klavye, harfle arama, odak, konumlandırma, ARIA) UI SDK\'dan gelir; bu yüzden Select `@ui-sdk/core` ve `@ui-sdk/react` paketlerine ihtiyaç duyar. Kurulum komutu onları, bileşenin yazıldığı tam sürümle ekler: UI SDK beta aşamasında ve API\'si hâlâ değişebilir.',
        ),
      },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import { GlassSelect } from '@/components/liquid-glass/glass-select'

const [speed, setSpeed] = useState<string | null>(null)

<GlassSelect
  label="Delivery"
  placeholder="Choose a speed"
  value={speed}
  onValueChange={setSpeed}
  options={[
    { value: 'standard', label: 'Standard' },
    { value: 'express', label: 'Express' },
    { value: 'pickup', label: 'Pickup', disabled: true },
  ]}
/>`,
      },
      {
        type: 'p',
        text: t(
          'Opening, the list swells out of the whole button, the neck between them stretches and snaps, both halves take the jolt and the options arrive one after another. Closing is the opening played backwards, frame for frame; reopen it on the way and it carries on from there. The button wears Button\'s glass, with its light and shadow. Once the neck lets go, the list settles into Card\'s frost with no light of its own: a thin line draws its edge and a soft shadow lifts it off the page. The glass is clear, so it needs something behind it to bend.',
          'Açılırken liste butonun tamamından şişer, aralarındaki boyun esneyip kopar, iki parça da sarsılır ve seçenekler birer birer gelir. Kapanış, açılışın kare kare tersidir; yoldayken yeniden açarsan kaldığı yerden devam eder. Buton, ışığı ve gölgesiyle Button\'ın camını taşır. Boyun koptuğunda liste kendi ışığı olmayan, Card\'ın buzlu camına geçer: kenarını ince bir çizgi çizer, yumuşak bir gölge onu sayfadan ayırır. Cam berraktır, bu yüzden bükecek bir arka plana ihtiyaç duyar.',
        ),
      },
      h('Your own popup', 'Kendi açılır yüzeyin'),
      {
        type: 'p',
        text: t(
          'The stretch is not tied to a select. `GlassPopup`, which ships with it, puts the same motion on any control and the surface it opens (a menu, a popover):',
          'Esneme yalnızca seçim kutusuna bağlı değil. Onunla birlikte gelen `GlassPopup`, aynı hareketi herhangi bir kontrole ve açtığı yüzeye (menü, popover) koyar:',
        ),
      },
      {
        type: 'code',
        title: 'menu.tsx',
        code: `import { GlassPopupAnchor, GlassPopupSurface, useGlassPopup } from '@/components/liquid-glass'

const popup = useGlassPopup()

<MenuTrigger data-glass-host className="rounded-full px-5 h-12 bg-white/60 dark:bg-white/10">
  <GlassPopupAnchor popup={popup} />
  Options
</MenuTrigger>
<MenuContent data-glass-popup data-glass-skip sideOffset={12} className="rounded-3xl p-1.5">
  <GlassPopupSurface popup={popup} />
  <div role="menu">
    <MenuItem style={{ '--glass-i': 0 }}>Rename</MenuItem>
    <MenuItem style={{ '--glass-i': 1 }}>Duplicate</MenuItem>
  </div>
</MenuContent>`,
      },
      {
        type: 'list',
        items: [
          t('`GlassPopupAnchor` is the first child of the control (marked `data-glass-host`); `GlassPopupSurface` is the first child of the content (marked `data-glass-popup`).', '`GlassPopupAnchor` kontrolün (`data-glass-host` ile işaretli) ilk çocuğudur; `GlassPopupSurface` içeriğin (`data-glass-popup` ile işaretli) ilk çocuğudur.'),
          t('The content carries `data-open` while open and `data-ending-style` while it closes, and stays mounted until its animations finish: UI SDK\'s popups do this.', 'İçerik açıkken `data-open`, kapanırken `data-ending-style` taşır ve animasyonları bitene kadar DOM\'da kalır: UI SDK\'nın açılır yüzeyleri böyle çalışır.'),
          t('Items are `role="option"`, `role="menuitem"` or `data-glass-item`; `--glass-i` is each one\'s place in the queue.', 'Öğeler `role="option"`, `role="menuitem"` ya da `data-glass-item` taşır; `--glass-i` her birinin sıradaki yeridir.'),
          t('The surface takes its corners from the content\'s own `rounded-*` class; leave about 12 px between it and the control for the neck.', 'Yüzey köşelerini içeriğin kendi `rounded-*` sınıfından alır; boyun için kontrolle arasında yaklaşık 12 px bırak.'),
        ],
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'label', type: 'ReactNode', description: t('The field\'s label, tied to the button.', 'Alanın butona bağlı etiketi.') },
          { name: 'options', type: '{ value: string; label: ReactNode; disabled?: boolean }[]', description: t('The choices, in order.', 'Seçenekler, sırasıyla.') },
          { name: 'value', type: 'string | null', description: t('The selected value (controlled). `null` = nothing selected.', 'Seçili değer (kontrollü). `null` = seçim yok.') },
          { name: 'defaultValue', type: 'string | null', description: t('The starting value when the select keeps its own state.', 'Seçim kutusu kendi durumunu tutarken başlangıç değeri.') },
          { name: 'onValueChange', type: '(value: string | null) => void', description: t('Called with the new value.', 'Yeni değerle çağrılır.') },
          { name: 'placeholder', type: 'string', description: t('Shown on the button while nothing is selected.', 'Hiçbir şey seçili değilken butonda görünür.') },
          { name: 'name', type: 'string', description: t('Submits the value with a form under this name.', 'Değeri formla bu adla gönderir.') },
          { name: 'disabled', type: 'boolean', default: 'false', description: t('Dimmed and not interactive.', 'Soluk ve etkileşimsiz.') },
          { name: 'className', type: 'string', description: t('Classes for the field (label and button); it is 16rem wide by default.', 'Alan (etiket ve buton) için sınıflar; varsayılan genişlik 16rem.') },
          { name: 'useGlassPopup({ matchWidth })', type: 'boolean', default: 'false', description: t('Your own popup: keep the surface exactly as wide as its control.', 'Kendi açılır yüzeyin: yüzeyi kontrolüyle tam aynı genişlikte tutar.') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('A `combobox` button that opens a `listbox` (the WAI-ARIA select pattern), labelled by `label`.', '`listbox` açan bir `combobox` butonu (WAI-ARIA seçim kalıbı); adını `label`dan alır.'),
          t('Arrow keys, Home and End move through the options, typing a letter jumps to a match, Enter selects, Escape closes and returns focus to the button. Disabled options are skipped.', 'Ok tuşları, Home ve End seçenekler arasında gezer; bir harf yazmak eşleşene atlar, Enter seçer, Escape kapatıp odağı butona döndürür. Devre dışı seçenekler atlanır.'),
          t('With reduced motion the list opens and closes at once, with no stretch or jolt.', 'Hareketi azalt açıksa liste esneme ve sarsıntı olmadan anında açılıp kapanır.'),
          t('Without WebGL2 it is a plain frosted list.', 'WebGL2 yoksa düz, buzlu bir listedir.'),
        ],
      },
    ],
  },
  {
    slug: 'button-group',
    group: 'components',
    title: t('Button Group', 'Button Group'),
    name: 'GlassButtonGroup',
    description: t(
      'Related actions in one body of glass. The buttons share a single lens: point at any of them and the whole body swells.',
      'Tek bir cam gövdede ilişkili eylemler. Butonlar tek bir merceği paylaşır: herhangi birinin üstüne gel, bütün gövde şişer.',
    ),
    verb: t('Share', 'Paylaş'),
    signature: t('Several buttons, one body of glass.', 'Birkaç buton, tek bir cam gövde.'),
    hero: 'glass-button-group-basic',
    blocks: [
      {
        type: 'when',
        use: [
          t('Two to five actions on the same thing: a message toolbar, map controls, a split button.', 'Aynı şey üzerinde iki ila beş eylem: bir ileti araç çubuğu, harita kontrolleri, bölünmüş buton.'),
          t('A main action with its options next to it, divided by a separator.', 'Yanında seçenekleriyle bir ana eylem; aralarında bir ayraç.'),
        ],
        avoid: [
          t('Choosing between options, where one stays selected: use Tabs.', 'Birinin seçili kaldığı seçenekler arasında seçim: Tabs kullan.'),
          t('A single action: use Button.', 'Tek bir eylem: Button kullan.'),
          t('Unrelated actions: one body says they belong together.', 'İlişkisiz eylemler: tek gövde, birbirlerine ait olduklarını söyler.'),
        ],
      },
      { type: 'install', item: 'button-group' },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import {
  GlassButtonGroup,
  GlassButtonGroupItem,
  GlassButtonGroupSeparator,
  GlassButtonGroupText,
} from '@/components/liquid-glass'

<GlassButtonGroup aria-label="Message">
  <GlassButtonGroupItem onClick={archive}>Archive</GlassButtonGroupItem>
  <GlassButtonGroupItem onClick={report}>Report</GlassButtonGroupItem>
  <GlassButtonGroupSeparator />
  <GlassButtonGroupItem aria-label="More"><Ellipsis /></GlassButtonGroupItem>
</GlassButtonGroup>`,
      },
      {
        type: 'p',
        text: t(
          'The group is the glass, and the glass is Button\'s, with its light and shadow. It is tinted white, on light and dark pages alike, unless you colour it. Its items are plain buttons lying in it, with no glass of their own. Do not put a Button inside: a lens within a lens bends nothing. The items get no background of their own under the pointer: the glass answers for the whole group.',
          'Cam, grubun kendisidir ve ışığı ve gölgesiyle Button\'ın camıdır. Sen boyamadıkça açık ve koyu sayfada beyaz renkli camdır. Öğeleri onun içinde duran, kendi camı olmayan sade butonlardır. İçine Button koyma: mercek içindeki mercek hiçbir şeyi bükmez. Öğeler imleç altında kendi arka planlarını almaz: grubun tamamı adına cam karşılık verir.',
        ),
      },
      h('Together and apart', 'Birlikte ve ayrı'),
      {
        type: 'p',
        text: t(
          'Nest groups to keep some actions in one body and others on their own. The outer group draws no glass: it only lays the inner ones out with space between them, and a group with a single item is a button standing apart.',
          'Bazı eylemleri tek gövdede, bazılarını ayrı tutmak için grupları iç içe koy. Dıştaki grup cam çizmez: içtekileri aralarında boşlukla dizer; tek öğeli bir grup da ayrı duran bir butondur.',
        ),
      },
      {
        type: 'code',
        title: 'toolbar.tsx',
        code: `<GlassButtonGroup aria-label="Message">
  <GlassButtonGroup>
    <GlassButtonGroupItem aria-label="Back" className="px-0"><ArrowLeft /></GlassButtonGroupItem>
  </GlassButtonGroup>
  <GlassButtonGroup>
    <GlassButtonGroupItem>Archive</GlassButtonGroupItem>
    <GlassButtonGroupItem>Report</GlassButtonGroupItem>
  </GlassButtonGroup>
</GlassButtonGroup>`,
      },
      h('With a menu', 'Menüyle'),
      {
        type: 'p',
        text: t(
          'For the actions that do not fit, wrap one group in a Dropdown Menu and put its trigger on the three dots: the list stretches out of the whole group, as Select\'s does out of its button. See Dropdown Menu.',
          'Sığmayan eylemler için bir grubu Dropdown Menu ile sar ve tetikleyicisini üç noktaya koy: liste, Select\'inkinin butonundan çıktığı gibi, bütün grubun içinden esneyerek çıkar. Dropdown Menu sayfasına bak.',
        ),
      },
      h('Examples', 'Örnekler'),
      { type: 'demo', id: 'glass-button-group-split', title: t('Tinted, split, text and sizes', 'Renkli cam, bölünmüş buton, metin ve boyutlar') },
      {
        type: 'p',
        text: t(
          'Colour the glass with a normal class on the group, such as `bg-blue-600 text-white`; `material="clear"` makes it clear glass that bends the page. A separator between a main action and a small second item makes a split button. `GlassButtonGroupText` is text that is not a button: a unit, a branch name, a count.',
          'Camı gruba verdiğin `bg-blue-600 text-white` gibi sıradan bir sınıfla boya; `material="clear"` onu sayfayı büken berrak cam yapar. Ana eylem ile küçük ikinci öğe arasındaki ayraç bölünmüş bir buton yapar. `GlassButtonGroupText` buton olmayan metindir: bir birim, bir dal adı, bir sayı.',
        ),
      },
      { type: 'demo', id: 'glass-button-group-vertical', title: t('Vertical', 'Dikey') },
      {
        type: 'p',
        text: t(
          '`orientation="vertical"` stacks the items; the separators turn with them and the body takes corners that sit concentric with its items. For icon-only items, add `px-0` to keep them square and give each an `aria-label`.',
          '`orientation="vertical"` öğeleri üst üste dizer; ayraçlar onlarla birlikte döner, gövde de öğeleriyle eş merkezli köşeler alır. Yalnız ikonlu öğelerde kare kalmaları için `px-0` ekle ve her birine `aria-label` ver.',
        ),
      },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: t('Side by side or stacked.', 'Yan yana ya da üst üste.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('Height of a horizontal group: 32, 40 or 48 px. The items follow.', 'Yatay grubun yüksekliği: 32, 40 ya da 48 px. Öğeler buna uyar.') },
          { name: 'material', type: "'tinted' | 'clear'", default: "'tinted'", description: t('Tinted is white, or the colour of your own `bg-*` class; clear bends the page.', 'Tinted beyazdır ya da kendi `bg-*` sınıfının rengini alır; clear sayfayı büker.') },
          { name: 'tint', type: 'number', default: '0.6', description: t('Clear glass only: how much tint covers the backdrop (0–1).', 'Yalnız clear: renk tonunun arkayı ne kadar örttüğü (0–1).') },
          { name: '…rest', type: 'div attributes', description: t('Passed to the group (`aria-label`, `className`…).', 'Gruba aktarılır (`aria-label`, `className`…).') },
          { name: 'GlassButtonGroupItem asChild', type: 'boolean', default: 'false', description: t('Render the item on its single child element (a router `<Link>`, a menu trigger) instead of a `<button>`. Otherwise it takes button attributes (`onClick`, `disabled`…).', 'Öğeyi `<button>` yerine tek çocuk öğesinde çizer (router `<Link>`, menü tetikleyicisi). Aksi halde buton özniteliklerini alır (`onClick`, `disabled`…).') },
          { name: 'GlassButtonGroupSeparator', type: 'className', description: t('A hairline between two items. It turns with the group.', 'İki öğe arasında ince bir çizgi. Grupla birlikte döner.') },
          { name: 'GlassButtonGroupText', type: 'span attributes', description: t('Text that is not a button.', 'Buton olmayan metin.') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('The group has `role="group"`: name it with `aria-label` or `aria-labelledby`.', 'Grup `role="group"` taşır: `aria-label` ya da `aria-labelledby` ile adlandır.'),
          t('Every item is a real `<button>`; Tab moves through them one by one, Enter and Space press.', 'Her öğe gerçek bir `<button>`; Tab aralarında tek tek gezer, Enter ve Space basar.'),
          t('Icon-only items need an `aria-label`. Separators are `role="separator"`.', 'Yalnız ikonlu öğeler `aria-label` ister. Ayraçlar `role="separator"` taşır.'),
          t('Without WebGL2 it keeps its plain CSS colour.', 'WebGL2 yoksa düz CSS rengini korur.'),
        ],
      },
    ],
  },
  {
    slug: 'dropdown-menu',
    group: 'components',
    title: t('Dropdown Menu', 'Dropdown Menu'),
    name: 'GlassDropdownMenu',
    description: t(
      'A menu of actions that swells out of the control that opens it as one body of glass: a button of its own, or a whole Button Group.',
      'Kendisini açan kontrolden tek bir cam gövde olarak şişen eylem menüsü: kendi butonundan ya da bütün bir Button Group\'tan.',
    ),
    verb: t('Open', 'Aç'),
    signature: t('Actions pour out of the control that opens them, a whole button group included.', 'Eylemler, onları açan kontrolden dökülür; bütün bir buton grubundan bile.'),
    hero: 'glass-dropdown-menu-basic',
    blocks: [
      {
        type: 'when',
        use: [
          t('A handful of actions on one thing, kept out of the way until asked for: Rename, Duplicate, Delete.', 'Tek bir şey üzerinde, istenene kadar gözden uzak duran birkaç eylem: Yeniden adlandır, Çoğalt, Sil.'),
          t('The overflow of a Button Group: the three dots at its end.', 'Bir Button Group\'un taşan eylemleri: sonundaki üç nokta.'),
        ],
        avoid: [
          t('Picking a value that stays selected: use Select.', 'Seçili kalan bir değer seçmek: Select kullan.'),
          t('Two or three actions that fit on screen: show them in a Button Group.', 'Ekrana sığan iki üç eylem: onları bir Button Group içinde göster.'),
          t('Several of these on one screen: one stretching list is a moment, many are noise.', 'Aynı ekranda birkaç tane: esneyen tek bir liste bir andır, çoğu gürültüdür.'),
        ],
      },
      { type: 'install', item: 'dropdown-menu' },
      {
        type: 'note',
        text: t(
          'The behaviour (keyboard, typeahead, focus, positioning, ARIA) comes from UI SDK, so Dropdown Menu needs `@ui-sdk/core` and `@ui-sdk/react`. The install command adds them at the exact version this was built on: UI SDK is in beta and its API may still change.',
          'Davranış (klavye, harfle arama, odak, konumlandırma, ARIA) UI SDK\'dan gelir; bu yüzden Dropdown Menu `@ui-sdk/core` ve `@ui-sdk/react` paketlerine ihtiyaç duyar. Kurulum komutu onları, bileşenin yazıldığı tam sürümle ekler: UI SDK beta aşamasında ve API\'si hâlâ değişebilir.',
        ),
      },
      h('Usage', 'Kullanım'),
      {
        type: 'code',
        title: 'app.tsx',
        code: `import {
  GlassDropdownMenu,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuSeparator,
  GlassDropdownMenuTrigger,
} from '@/components/liquid-glass/glass-dropdown-menu'

<GlassDropdownMenu>
  <GlassDropdownMenuTrigger>Options</GlassDropdownMenuTrigger>
  <GlassDropdownMenuContent>
    <GlassDropdownMenuItem onSelect={rename}>Rename</GlassDropdownMenuItem>
    <GlassDropdownMenuItem onSelect={duplicate}>Duplicate</GlassDropdownMenuItem>
    <GlassDropdownMenuSeparator />
    <GlassDropdownMenuItem destructive onSelect={remove}>Delete</GlassDropdownMenuItem>
  </GlassDropdownMenuContent>
</GlassDropdownMenu>`,
      },
      {
        type: 'p',
        text: t(
          'It is Select\'s motion on a list of actions: the list swells out of the whole trigger, the neck between them stretches and snaps, and the items arrive one after another; closing plays it backwards. The trigger wears Button\'s clear glass, so it needs something behind it to bend.',
          'Bu, Select\'in hareketinin bir eylem listesindeki halidir: liste tetikleyicinin tamamından şişer, aralarındaki boyun esneyip kopar ve öğeler birer birer gelir; kapanış bunu tersine oynatır. Tetikleyici Button\'ın berrak camını taşır, bu yüzden bükecek bir arka plana ihtiyaç duyar.',
        ),
      },
      h('Out of a Button Group', 'Bir Button Group\'tan'),
      {
        type: 'p',
        text: t(
          'Wrap one group and the content in the menu, and put the trigger on one of the group\'s items with `asChild`. The whole group is then the anchor: the list swells out of its body and takes its colour, white included. Wrap only the group that opens the menu.',
          'Tek bir grubu ve içeriği menüyle sar, tetikleyiciyi de `asChild` ile grubun öğelerinden birine koy. Böylece çapa grubun tamamı olur: liste onun gövdesinden şişer ve rengini alır, beyaz dahil. Yalnızca menüyü açan grubu sar.',
        ),
      },
      {
        type: 'code',
        title: 'toolbar.tsx',
        code: `<GlassDropdownMenu>
  <GlassButtonGroup>
    <GlassDropdownMenuTrigger asChild>
      <GlassButtonGroupItem aria-label="More" className="px-0"><Ellipsis /></GlassButtonGroupItem>
    </GlassDropdownMenuTrigger>
  </GlassButtonGroup>
  <GlassDropdownMenuContent>
    <GlassDropdownMenuItem>Mark as read</GlassDropdownMenuItem>
    <GlassDropdownMenuItem destructive>Delete</GlassDropdownMenuItem>
  </GlassDropdownMenuContent>
</GlassDropdownMenu>`,
      },
      { type: 'demo', id: 'glass-button-group-basic', title: t('The three dots of a toolbar', 'Bir araç çubuğunun üç noktası') },
      h('API reference', 'API referansı'),
      {
        type: 'props',
        rows: [
          { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open: boolean) => void', description: t('On `GlassDropdownMenu`: control the menu yourself, or let it keep its own state.', '`GlassDropdownMenu` üzerinde: menüyü kendin yönet ya da kendi durumunu tutsun.') },
          { name: 'GlassDropdownMenuTrigger asChild', type: 'boolean', default: 'false', description: t('Put the trigger on its single child (a `GlassButtonGroupItem`) instead of a glass button of its own.', 'Tetikleyiciyi kendi cam butonu yerine tek çocuğuna (bir `GlassButtonGroupItem`) koyar.') },
          { name: 'GlassDropdownMenuContent side / align', type: "'top' | 'bottom' / 'start' | 'center' | 'end'", default: "'bottom' / 'center'", description: t('Where the list opens against the trigger: below and centred by default. It flips when there is no room.', 'Listenin tetikleyiciye göre nerede açıldığı: varsayılan olarak altta ve ortalı. Yer yoksa öbür tarafa döner.') },
          { name: 'GlassDropdownMenuContent sideOffset', type: 'number', default: '12', description: t('The gap between the control and the list, where the neck stretches.', 'Kontrol ile liste arasındaki, boynun esnediği boşluk.') },
          { name: 'GlassDropdownMenuItem onSelect', type: '() => void', description: t('Runs when the item is pressed; the menu then closes (`closeOnSelect={false}` keeps it open).', 'Öğeye basılınca çalışır; ardından menü kapanır (`closeOnSelect={false}` açık tutar).') },
          { name: 'GlassDropdownMenuItem destructive', type: 'boolean', default: 'false', description: t('Paints the item red, for Delete.', 'Öğeyi kırmızıya boyar; Sil için.') },
          { name: 'GlassDropdownMenuItem disabled', type: 'boolean', default: 'false', description: t('Dimmed and skipped by the keyboard.', 'Soluk; klavye onu atlar.') },
          { name: 'GlassDropdownMenuSeparator', type: 'className', description: t('A hairline between items.', 'Öğeler arasında ince bir çizgi.') },
        ],
      },
      h('Accessibility', 'Erişilebilirlik'),
      {
        type: 'list',
        items: [
          t('A button with `aria-haspopup` that opens a `menu` of `menuitem`s (the WAI-ARIA menu button pattern).', '`menuitem` öğelerinden oluşan bir `menu` açan, `aria-haspopup` taşıyan bir buton (WAI-ARIA menü butonu kalıbı).'),
          t('Arrow keys, Home and End move through the items, typing a letter jumps to a match, Enter runs the item, Escape closes and returns focus to the trigger.', 'Ok tuşları, Home ve End öğeler arasında gezer; bir harf yazmak eşleşene atlar, Enter öğeyi çalıştırır, Escape kapatıp odağı tetikleyiciye döndürür.'),
          t('An icon-only trigger needs an `aria-label`.', 'Yalnız ikonlu tetikleyici `aria-label` ister.'),
          t('With reduced motion the list opens and closes at once. Without WebGL2 it is a plain frosted list.', 'Hareketi azalt açıksa liste anında açılıp kapanır. WebGL2 yoksa düz, buzlu bir listedir.'),
        ],
      },
    ],
  },
]

export const pageBySlug = (slug: string) => PAGES.find((p) => p.slug === slug)

/** The components, numbered in reading order (01, 02, …). */
export const CATALOG = PAGES.filter((p) => p.group === 'components')

// ── Releases ────────────────────────────────────────────────────────────────
// Newest first. One list feeds the sidebar card, the New pills, each component's latest
// change, /changelog and changelog.md, so they never disagree. Versions have two levels:
// x.y is a version (announced when it adds a component), x.y.z its patch releases.

export type ChangeKind = 'new' | 'improved' | 'fixed' | 'removed'

export type Change = {
  kind: ChangeKind
  /** The docs page (slug) the change is about, when it is about one. */
  page?: string
  text: L
}

export type Release = {
  version: string
  /** ISO date. */
  date: string
  title: L
  changes: Change[]
}

export const CHANGE_KINDS: ChangeKind[] = ['new', 'improved', 'fixed', 'removed']

export const RELEASES: Release[] = [
  {
    version: '1.5.8',
    date: '2026-11-23',
    title: t('A clear badge mirrors what is around it.', 'Şeffaf rozet çevresini yansıtır.'),
    changes: [
      {
        kind: 'improved',
        page: 'badge',
        text: t(
          'A clear badge (`tint` at 0.6 or below) now mirrors its surroundings on its rim, as clear buttons do; a badge in its own colour looks the same as before. The first example is now a plain outlined card with one orange badge on its corner.',
          'Şeffaf rozet (`tint` 0.6 ya da altı) artık şeffaf butonlar gibi çevresini kenarında yansıtıyor; kendi renginde bir rozet eskisi gibi görünür. İlk örnek artık köşesinde tek bir turuncu rozet olan sade çerçeveli bir kart.',
        ),
      },
    ],
  },
  {
    version: '1.5.7',
    date: '2026-11-23',
    title: t('Clear glass mirrors what is around it.', 'Şeffaf cam çevresini yansıtır.'),
    changes: [
      {
        kind: 'improved',
        text: t(
          'The rim of clear glass now mirrors its surroundings. A neighbour of another colour than the surface the glass sits on shows on the rim that faces it: an orange button above a clear control lights its top edge orange, as a soft crescent that is deepest where the neighbour is nearest and thins out round the sides. Tinted glass, and a lens frosted over at rest (the Tabs lens, the Slide to Confirm thumb), mirror nothing until they turn clear. For this the engine takes a small picture of the page around each clear glass, and only when the glass is measured again: nothing extra runs at rest, on scroll or while the cursor moves. `optics.mirror` scales the reflection; 0 turns it off.',
          'Şeffaf camın kenarı artık çevresini yansıtıyor. Camın oturduğu yüzeyden farklı renkte bir komşu, kendisine bakan kenarda görünür: şeffaf bir kontrolün üstündeki turuncu buton, kontrolün üst kenarını turuncu aydınlatır; komşunun en yakın olduğu yerde en derin, yanlara doğru incelen yumuşak bir hilal olarak. Renkli cam ve dururken buzlu olan mercekler (Tabs merceği, Slide to Confirm topuzu) şeffaflaşana dek hiçbir şey yansıtmaz. Motor bunun için her şeffaf camın çevresindeki sayfanın küçük bir resmini çeker, o da yalnız cam yeniden ölçüldüğünde: dururken, kaydırırken ya da imleç gezerken fazladan hiçbir şey çalışmaz. `optics.mirror` yansımayı ölçekler; 0 kapatır.',
        ),
      },
      {
        kind: 'improved',
        page: 'button-group',
        text: t(
          'In the first example Snooze stands apart, in clear glass: it bends the grid behind it, and its rim mirrors the white glass on either side.',
          'İlk örnekte Snooze ayrı duruyor ve şeffaf camdan: arkasındaki ızgarayı büküyor, kenarı da iki yanındaki beyaz camı yansıtıyor.',
        ),
      },
      {
        kind: 'fixed',
        text: t(
          'The blue edge every glass carried on its far side is gone. It was a fixed colour that came from nowhere on the page, and it stood out most on a dark one. That side of the rim light is now plain white; on clear glass it takes the colour of what is around the glass.',
          'Her camın uzak tarafında taşıdığı mavi kenar kalktı. Sayfadaki hiçbir şeyden gelmeyen sabit bir renkti ve en çok koyu sayfada göze batıyordu. Kenar ışığının o tarafı artık düz beyaz; şeffaf camda rengini camın çevresinden alıyor.',
        ),
      },
    ],
  },
  {
    version: '1.5.6',
    date: '2026-11-23',
    title: t('One frame loop, however often a list opens.', 'Liste kaç kez açılırsa açılsın, tek kare döngüsü.'),
    changes: [
      {
        kind: 'fixed',
        text: t(
          'Opening and closing a Select, a Dropdown Menu or the menu on a Button Group no longer slows the page down. Each time a list went back into its control, the engine started a second frame loop beside the one already running. On a page where some glass never rests (a Badge), those loops never ended, so every open and close made each frame do more work: interactions grew slower and the fans louder. The engine now keeps to one loop, whatever wakes it.',
          'Select, Dropdown Menu ya da Button Group üzerindeki menüyü açıp kapatmak artık sayfayı yavaşlatmıyor. Liste kontrolüne her geri döndüğünde motor, çalışan döngünün yanında ikinci bir kare döngüsü başlatıyordu. Camın hiç durmadığı bir sayfada (bir Badge) bu döngüler hiç bitmiyor, her açıp kapatma her karenin işini artırıyordu: etkileşimler yavaşlıyor, fanlar hızlanıyordu. Motor artık onu ne uyandırırsa uyandırsın tek döngüde kalıyor.',
        ),
      },
    ],
  },
  {
    version: '1.5.5',
    date: '2026-11-23',
    title: t('One card on a phone.', 'Telefonda tek kart.'),
    changes: [
      {
        kind: 'fixed',
        page: 'card',
        text: t(
          'The first example shows one card where two do not fit side by side, centred on the two rows of colour. On a phone the cards used to stack, and the rows ran through the gap between them.',
          'İlk örnek, iki kartın yan yana sığmadığı yerde tek kart gösteriyor; kart iki renk şeridinin ortasında duruyor. Telefonda kartlar eskiden alt alta diziliyor, şeritler aralarındaki boşluktan geçiyordu.',
        ),
      },
    ],
  },
  {
    version: '1.5.4',
    date: '2026-11-23',
    title: t('A choice lights its own spot.', 'Seçim, kendi yerini aydınlatıyor.'),
    changes: [
      {
        kind: 'improved',
        page: 'select',
        text: t(
          'Choosing an option lights the glass around that option only, and the light leaves with the list: a list on its way back into the button is no longer lit whole. Pressing the button to close the list lights the button alone. Dropdown Menu gets the same.',
          'Bir seçenek seçmek artık yalnızca o seçeneğin çevresindeki camı aydınlatıyor; ışık listeyle birlikte gidiyor: butona geri dönen liste artık baştan sona parlamıyor. Listeyi kapatmak için butona basmak yalnızca butonu aydınlatıyor. Dropdown Menu da aynısını alıyor.',
        ),
      },
    ],
  },
  {
    version: '1.5.3',
    date: '2026-11-23',
    title: t('A press lets light into the glass.', 'Basış, cama ışık salıyor.'),
    changes: [
      {
        kind: 'improved',
        page: 'select',
        text: t(
          'Pressing the button lets light into the glass where the press lands. The light paints nothing: it brightens the glass\'s own colour; it lights the glass around that spot evenly, the near end of the list included, stays inside the button but spills a little past the edge of the open list, spreads and fades. Opened from the keyboard, it starts at the button\'s centre. The press that opens the list carries its light into it: the light grows with the list until it covers it whole, then fades. Presses that land before the last light has faded add up, so it grows brighter the more you press. Choosing an option lights the list where it lands, more softly. Dropdown Menu does the same. The list is now one surface from start to finish: it leaves the button already wearing the card\'s glass and the card\'s shadow, instead of the button\'s glass turning into a card once the neck lets go.',
          'Butona basmak, basılan noktadan camın içine ışık salıyor. Işık üstüne bir şey boyamıyor: camın kendi rengini parlatıyor; ışık o noktanın çevresindeki camı, listenin yakın ucu dahil, eşit aydınlatıyor, butonun dışına taşmıyor ama açık listenin kenarından biraz dışarı yansıyor, yayılıp sönüyor. Klavyeyle açılınca butonun ortasından başlıyor. Listeyi açan basışın ışığı listeyle birlikte büyüyor: bütün listeyi kaplayıp sönüyor. Önceki ışık sönmeden gelen basışlar üst üste biniyor; bastıkça daha çok parlıyor. Bir seçenek seçmek, listeyi basılan yerde daha sönük aydınlatıyor. Dropdown Menu da aynısını yapıyor. Liste artık baştan sona tek bir yüzey: butondan, kartın camını ve kartın gölgesini taşıyarak çıkıyor; eskiden butonun camı, boyun koptuktan sonra karta dönüşüyordu.',
        ),
      },
      {
        kind: 'improved',
        page: 'select',
        text: t(
          'The list closes faster, and the bridge between the button and the list is thinner. Dropdown Menu gets the same.',
          'Liste daha hızlı kapanıyor; butonla liste arasındaki köprü daha ince. Dropdown Menu da aynısını alıyor.',
        ),
      },
    ],
  },
  {
    version: '1.5.2',
    date: '2026-11-22',
    title: t('Lighter on every frame.', 'Her karede daha hafif.'),
    changes: [
      {
        kind: 'fixed',
        page: 'select',
        text: t(
          'Opening no longer stutters. The page behind the glass is uploaded once per opening instead of on every frame, the popup measures the page once per frame instead of after each of its own style writes, and it no longer reads its colours and sizes again while the list comes in. The drawing loop also stops once the motion has died out, where it used to run for seconds after. Closing is lighter too: it uploaded the page some twenty times as the button settled, and now does so once, when the motion ends. Dropdown Menu gets the same.',
          'Açılış artık takılmıyor. Camın arkasındaki sayfa her karede değil, açılış başına bir kez yükleniyor; açılır yüzey sayfayı kendi her stil yazısından sonra değil, kare başına bir kez ölçüyor; liste gelirken renklerini ve ölçülerini baştan okumuyor. Çizim döngüsü de hareket bitince duruyor; eskiden saniyelerce sürüyordu. Kapanış da hafifledi: buton yerine otururken sayfayı yirmi kadar kez yüklüyordu, artık hareket bitince bir kez yüklüyor. Dropdown Menu da aynısını alıyor.',
        ),
      },
      {
        kind: 'improved',
        text: t(
          'Scrolling costs far less. A clear glass that scrolls with the page keeps its picture of what lies behind it instead of reading the page again on every frame; it reads it again when a sticky or fixed element reaches it. If a script moves what lies behind as the page scrolls (parallax), `live` on Card or GlassLayer keeps the glass in step.',
          'Kaydırma artık çok daha ucuz. Sayfayla birlikte kayan şeffaf cam, arkasındakinin resmini her karede baştan okumak yerine saklıyor; yapışkan ya da sabit bir öğe ona ulaşınca yeniden okuyor. Sayfa kayarken arkadakini bir betik oynatıyorsa (paralaks), Card ya da GlassLayer üzerindeki `live` camı onunla aynı adımda tutuyor.',
        ),
      },
      {
        kind: 'improved',
        text: t(
          'Less work per frame for every component, with the same picture: a frame that would come out exactly as the one on screen is not drawn, a cursor moving far from a glass no longer redraws it, pixels outside the glass leave the shader early, an empty front layer is no longer uploaded, a hover or a state change no longer uploads a picture that came out the same, and colours are resolved once.',
          'Her bileşen için kare başına daha az iş, görüntü aynı: ekrandakiyle birebir aynı çıkacak kare çizilmiyor, camdan uzakta gezen imleç onu yeniden çizdirmiyor, camın dışındaki pikseller gölgelendiriciden erken çıkıyor, boş ön katman artık yüklenmiyor, üstüne gelme ya da durum değişimi aynı çıkan resmi yeniden yüklemiyor, renkler bir kez çözülüyor.',
        ),
      },
      {
        kind: 'fixed',
        text: t(
          'Slider, Switch and Checkbox now rest. Their drawing loop used to run on every frame for as long as the page was open, and three.js\'s own frame loop with it; both now stop when nothing moves and start again on a press, a key, a theme change or a cursor that changes their light. A cursor moving far from a control no longer redraws it.',
          'Slider, Switch ve Checkbox artık dinleniyor. Çizim döngüleri sayfa açık kaldıkça her karede çalışıyordu, three.js\'in kendi kare döngüsü de onunla birlikte; ikisi de artık hiçbir şey kıpırdamadığında duruyor, bir basışta, bir tuşta, tema değişiminde ya da ışıklarını değiştiren bir imleçte yeniden başlıyor. Kontrolden uzakta gezen imleç onu yeniden çizdirmiyor.',
        ),
      },
    ],
  },
  {
    version: '1.5.1',
    date: '2026-11-22',
    title: t('Behaviour from UI SDK.', 'Davranış UI SDK\'dan.'),
    changes: [
      {
        kind: 'improved',
        text: t(
          'Button, Tabs, Slider, Switch and Checkbox now take their behaviour (keyboard, focus, forms, ARIA) from UI SDK, as Select and Dropdown Menu do. They look and move as before, but now need `@ui-sdk/core` and `@ui-sdk/react`; the install command adds them.',
          'Button, Tabs, Slider, Switch ve Checkbox artık davranışını (klavye, odak, formlar, ARIA) Select ve Dropdown Menu gibi UI SDK\'dan alıyor. Görünüm ve hareket aynı; ama artık `@ui-sdk/core` ve `@ui-sdk/react` paketlerine ihtiyaç duyuyorlar, kurulum komutu onları ekliyor.',
        ),
      },
      {
        kind: 'improved',
        page: 'button',
        text: t(
          'Return a Promise from `onClick` and the button stays pending until it settles: no second press, and screen readers are told.',
          '`onClick`\'ten bir Promise döndürürsen buton, o sonuçlanana kadar beklemede kalıyor: ikinci basış yok, ekran okuyuculara da bildiriliyor.',
        ),
      },
      {
        kind: 'improved',
        text: t(
          'Tabs, Slider, Switch and Checkbox take a `name` and submit with the form around them.',
          'Tabs, Slider, Switch ve Checkbox bir `name` alıyor ve çevrelerindeki formla birlikte gönderiliyor.',
        ),
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-11-22',
    title: t('Button Group and Dropdown Menu.', 'Button Group ve Dropdown Menu.'),
    changes: [
      {
        kind: 'improved',
        page: 'select',
        text: t(
          'The button now swells under the pointer and grows when pressed, as Button does. The neck thins more slowly before it snaps, and the snap no longer throws the button or the list out of place. The bridge no longer raises a ridge on the far edge of a small control, and small controls get a tighter bridge of their own. The label sways with the glass, and once the list is back inside, the button swells as if hovered and lets go.',
          'Buton artık Button gibi imleç altında şişiyor ve basınca büyüyor. Boyun kopmadan önce daha yavaş inceliyor; kopuş artık butonu ya da listeyi yerinden savurmuyor. Köprü artık küçük bir kontrolün uzak kenarında çıkıntı oluşturmuyor; küçük kontroller kendi dar köprüsünü alıyor. Etiket camla birlikte sallanıyor; liste içeri döndüğünde buton, üstüne gelinmiş gibi şişip bırakıyor.',
        ),
      },
      {
        kind: 'new',
        page: 'dropdown-menu',
        text: t(
          'Dropdown Menu: a list of actions that swells out of its button as one body of glass, with Select\'s stretch. Wrap a Button Group in it and the list pours out of the whole group, in its colour. Keyboard, focus and ARIA come from UI SDK.',
          'Dropdown Menu: Select\'in esnemesiyle, butonundan tek bir cam gövde olarak şişen eylem listesi. Bir Button Group\'u onunla sar; liste bütün grubun içinden, onun renginde dökülür. Klavye, odak ve ARIA UI SDK\'dan gelir.',
        ),
      },
      {
        kind: 'new',
        page: 'button-group',
        text: t(
          'Button Group: related actions share one body of glass, side by side or stacked, with separators and text; nest groups to set some apart. It wears Button\'s glass, tinted white unless you colour it, in three sizes.',
          'Button Group: ilişkili eylemler tek bir cam gövdeyi paylaşır; yan yana ya da üst üste, ayraç ve metinle; bazılarını ayırmak için grupları iç içe koy. Button\'ın camını taşır; sen boyamadıkça beyaz renkli camdır, üç boyutta.',
        ),
      },
      {
        kind: 'fixed',
        text: t(
          'Less work per frame. Moving the mouse no longer re-uploads every visible glass\'s textures on each frame: only the light is shaded again. A `live` Card reads the page behind it about 60 times a second instead of on every frame of a 120 Hz display, and skips the upload when the picture is the same. The look is unchanged.',
          'Kare başına daha az iş. Fareyi oynatmak artık görünen her camın dokularını her karede yeniden yüklemiyor: yalnızca ışık yeniden hesaplanıyor. `live` bir Card arkasındaki sayfayı 120 Hz bir ekranın her karesinde değil, saniyede yaklaşık 60 kez okuyor ve görüntü aynıysa yüklemeyi atlıyor. Görünüm değişmedi.',
        ),
      },
    ],
  },
  {
    version: '1.4.2',
    date: '2026-11-22',
    title: t('Slide to Confirm gets a short, chunky size.', 'Slide to Confirm\'e kısa ve şişko bir boyut geldi.'),
    changes: [
      {
        kind: 'improved',
        page: 'slide-to-confirm',
        text: t(
          'New `xl` size: a 96 px track with an 88 px thumb, made for narrow widths.',
          'Yeni `xl` boyutu: dar genişlikler için 96 px ray ve 88 px topuz.',
        ),
      },
    ],
  },
  {
    version: '1.4.1',
    date: '2026-11-22',
    title: t('Select wears Button and Card glass.', 'Select, Button ve Card camını giydi.'),
    changes: [
      {
        kind: 'improved',
        page: 'select',
        text: t(
          'The button now has Button\'s glass. The open list has Card\'s frost with no light of its own, a thin line at the edge and a soft shadow beneath. The stretch between them stays. GlassPopup gets the same look.',
          'Buton artık Button\'ın camını taşıyor. Açık listede Card\'ın buzlu camı var; kendi ışığı yok, kenarda ince bir çizgi, altında yumuşak bir gölge var. Aralarındaki esneme korunuyor. GlassPopup da aynı görünümü aldı.',
        ),
      },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-11-22',
    title: t('Select: a list that stretches out of its button.', 'Select: butonundan esneyerek çıkan liste.'),
    changes: [
      {
        kind: 'new',
        page: 'select',
        text: t(
          'Select: the list swells out of the whole button as one body of glass, a neck stretches between them and snaps, and closing plays the same motion backwards. Keyboard, focus and ARIA come from UI SDK.',
          'Select: liste butonun tamamından tek bir cam gövde olarak şişer, aralarında bir boyun esneyip kopar ve kapanış aynı hareketi tersine oynatır. Klavye, odak ve ARIA UI SDK\'dan gelir.',
        ),
      },
      {
        kind: 'new',
        page: 'select',
        text: t(
          'GlassPopup, the building block behind it: put the same stretch on your own menu or popover.',
          'Arkasındaki yapı taşı GlassPopup: aynı esnemeyi kendi menüne ya da popover\'ına koy.',
        ),
      },
    ],
  },
  {
    version: '1.3.12',
    date: '2026-11-22',
    title: t('Examples are coming soon.', 'Örnekler yakında.'),
    changes: [
      {
        kind: 'removed',
        text: t(
          'The Examples sections on the component pages are held back for now; a "Coming soon" stage with a fine grid stands in their place.',
          'Bileşen sayfalarındaki Örnekler bölümleri şimdilik kaldırıldı; yerlerinde ince bir ızgaranın üstünde "Yakında" yazan bir alan duruyor.',
        ),
      },
    ],
  },
  {
    version: '1.3.11',
    date: '2026-11-22',
    title: t('The wordmark reads LiquidGlass Interfaces.', 'Logo artık LiquidGlass Interfaces yazıyor.'),
    changes: [
      {
        kind: 'improved',
        text: t(
          'The header and footer wordmark gains "Interfaces", set light like "Liquid".',
          'Üst ve alt bilgideki logoya "Liquid" gibi ince yazılmış "Interfaces" eklendi.',
        ),
      },
    ],
  },
  {
    version: '1.3.10',
    date: '2026-11-19',
    title: t('Dark text on a light badge.', 'Açık renkli rozette koyu yazı.'),
    changes: [
      {
        kind: 'fixed',
        page: 'badge',
        text: t(
          'A `text-*` class on the badge now always wins over its built-in white. Dark text on a light badge stayed white before: the Live badge in the examples was white on white.',
          'Rozete verilen `text-*` sınıfı artık yerleşik beyazı her zaman ezer. Açık renkli rozette koyu yazı önceden beyaz kalıyordu: örneklerdeki Live rozeti beyaz üstüne beyazdı.',
        ),
      },
    ],
  },
  {
    version: '1.3.9',
    date: '2026-11-19',
    title: t('Shorter URLs, without the glass- prefix.', 'glass- öneki olmadan, daha kısa URL\'ler.'),
    changes: [
      {
        kind: 'improved',
        text: t(
          'Component pages and registry items lose the `glass-` prefix: `/docs/button`, `/r/button.json`. The old addresses redirect.',
          'Bileşen sayfaları ve registry öğeleri `glass-` önekini bıraktı: `/docs/button`, `/r/button.json`. Eski adresler yönlendirilir.',
        ),
      },
      {
        kind: 'improved',
        page: 'tabs',
        text: t('The icons example uses the plain lens, with no colour of its own.', 'İkonlu örnek artık kendi rengi olmayan sade merceği kullanıyor.'),
      },
    ],
  },
  {
    version: '1.3.8',
    date: '2026-11-19',
    title: t('Your colour on Slider, Switch and Checkbox.', 'Slider, Switch ve Checkbox\'ta kendi rengin.'),
    changes: [
      {
        kind: 'improved',
        page: 'slider',
        text: t('A `color` prop for the filled part of the track. The examples are now the slider in a few colours, nothing else.', 'Rayın dolu kısmı için `color` prop\'u. Örnekler artık yalnızca birkaç renkte kaydırıcı.'),
      },
      {
        kind: 'improved',
        page: 'switch',
        text: t('A `color` prop for the track while on. The examples are now the switch in a few colours, nothing else.', 'Açıkken rayın rengi için `color` prop\'u. Örnekler artık yalnızca birkaç renkte anahtar.'),
      },
      {
        kind: 'improved',
        page: 'checkbox',
        text: t('A `color` prop for the box while checked. The examples are now the checkbox in a few colours, nothing else.', 'İşaretliyken kutunun rengi için `color` prop\'u. Örnekler artık yalnızca birkaç renkte onay kutusu.'),
      },
    ],
  },
  {
    version: '1.3.7',
    date: '2026-11-19',
    title: t('Badges in more colours.', 'Daha çok renkte rozetler.'),
    changes: [
      {
        kind: 'improved',
        page: 'badge',
        text: t(
          'Three more examples: a palette of six colours, a rose sale badge on a product and an orange badge on a dock item.',
          'Üç örnek daha: altı renkli bir palet, bir ürünün üstünde gül rengi indirim rozeti ve bir dock öğesinin üstünde turuncu rozet.',
        ),
      },
    ],
  },
  {
    version: '1.3.6',
    date: '2026-11-19',
    title: t('Glass sees hairlines.', 'Cam ince çizgileri görür.'),
    changes: [
      {
        kind: 'fixed',
        text: t(
          'Clear glass now bends 1 px lines behind it (dividers, grid lines). They were left out of the picture, so the glass looked filled over a fine grid.',
          'Berrak cam artık arkasındaki 1 piksellik çizgileri (ayraçlar, ızgara çizgileri) de büker. Bunlar görüntüye girmiyordu; ince bir ızgaranın üstünde cam dolu görünüyordu.',
        ),
      },
      {
        kind: 'improved',
        page: 'button',
        text: t(
          'The Play example is fully clear (`tint={0}`): only the bent grid shows through.',
          'Play örneği tamamen şeffaf (`tint={0}`): içinden yalnızca bükülen ızgara görünür.',
        ),
      },
    ],
  },
  {
    version: '1.3.5',
    date: '2026-11-19',
    title: t('One light for every glass.', 'Bütün camlarda tek ışık.'),
    changes: [
      {
        kind: 'improved',
        text: t(
          'The rim light leans towards the cursor on Tabs, Badge, Slider, Switch and Checkbox too, as it does on Button. Card stays unlit.',
          'Kenar ışığı artık Tabs, Badge, Slider, Switch ve Checkbox\'ta da Button\'daki gibi imlece doğru yatar. Card ışıksız kalır.',
        ),
      },
    ],
  },
  {
    version: '1.3.4',
    date: '2026-11-19',
    title: t('Widgets made of Card.', 'Card\'dan yapılmış widget\'lar.'),
    changes: [
      {
        kind: 'improved',
        page: 'card',
        text: t(
          'A new example in place of the notification: an activity ring, a battery list and a now-playing card over a still wallpaper of plain CSS. It scales down to fit a phone.',
          'Bildirim örneğinin yerine yeni bir örnek: düz CSS\'ten durağan bir duvar kâğıdının üstünde bir hareket halkası, bir pil listesi ve çalan parça kartı. Telefona sığacak şekilde küçülür.',
        ),
      },
    ],
  },
  {
    version: '1.3.3',
    date: '2026-11-19',
    title: t('More examples, and news that only means new components.', 'Daha fazla örnek; yenilik artık yalnız yeni bileşen demek.'),
    changes: [
      {
        kind: 'improved',
        text: t(
          'No gradients in the examples any more. Backdrops are flat colour and plain DOM: discs under the scrim, ruled lines behind the square corners, a grid drawn cell by cell on the Button page, solid tiles and bands behind the badges, and a stepped edge blur on the Card rows.',
          'Örneklerde artık gradyan yok. Zeminler düz renk ve sade DOM: örtünün altında diskler, köşeli butonların arkasında yatay çizgiler, Button sayfasında hücre hücre çizilen ızgara, rozetlerin arkasında düz karolar ve bantlar, Card satırlarında kademeli kenar bulanıklığı.',
        ),
      },
      {
        kind: 'improved',
        page: 'badge',
        text: t(
          'Three examples: your own colours, clearer glass over a colourful backdrop (`tint`, `speed`, a wider badge), and a badge inline next to a label.',
          'Üç örnek: kendi renklerin, renkli bir zeminde daha berrak cam (`tint`, `speed`, daha geniş rozet) ve bir etiketin yanında satır içi rozet.',
        ),
      },
      {
        kind: 'improved',
        page: 'slider',
        text: t('Examples for the four sizes, a range of its own with `min`, `max` and `step`, icons, and clear glass at rest.', 'Dört boyut, `min`, `max` ve `step` ile kendi aralığı, ikonlar ve dururken berrak cam için örnekler.'),
      },
      {
        kind: 'improved',
        page: 'switch',
        text: t('Examples: a settings list with a disabled switch, the three sizes and the label on either side.', 'Örnekler: devre dışı bir anahtar içeren ayar listesi, üç boyut ve iki yandaki etiket.'),
      },
      {
        kind: 'improved',
        page: 'checkbox',
        text: t('Examples: a list of choices with descriptions, both shapes in three sizes and a disabled box.', 'Örnekler: açıklamalı bir seçim listesi, üç boyutta iki biçim ve devre dışı bir kutu.'),
      },
      {
        kind: 'improved',
        text: t(
          'Versions have two levels. A version (v1.3) is announced when it adds a component; the fixes and refinements after it are its patch releases (v1.3.1, v1.3.2…), folded under it in the changelog. The site shows the version, the New pill marks only the components of the latest one, and the Updated pill is gone.',
          'Sürümler artık iki katmanlı. Bir sürüm (v1.3) bileşen eklediğinde duyurulur; ardından gelen düzeltme ve iyileştirmeler onun alt sürümleridir (v1.3.1, v1.3.2…) ve sürüm notlarında onun altında katlanır. Site sürümü gösterir, Yeni etiketi yalnız son sürümün bileşenlerini işaretler, Güncellendi etiketi kalktı.',
        ),
      },
    ],
  },
  {
    version: '1.3.2',
    date: '2026-11-19',
    title: t('Numbers roll to their new value.', 'Rakamlar yeni değerine kayarak geçiyor.'),
    changes: [
      {
        kind: 'improved',
        page: 'tabs',
        text: t(
          'In the Tabs examples the figure above the control rolls to its new value with NumberFlow instead of swapping. The examples now import `@number-flow/react`; the component itself still needs no package.',
          'Tabs örneklerinde kontrolün üstündeki rakam, yer değiştirmek yerine NumberFlow ile yeni değerine kayıyor. Örnekler artık `@number-flow/react` içe aktarıyor; bileşenin kendisi hâlâ paket istemiyor.',
        ),
      },
      {
        kind: 'improved',
        text: t('The counts in the changelog filters animate as the filters change.', 'Değişiklik günlüğü filtrelerindeki sayılar, filtre değiştikçe animasyonla güncelleniyor.'),
      },
    ],
  },
  {
    version: '1.3.1',
    date: '2026-11-19',
    title: t('Bigger, clearer examples.', 'Daha büyük, daha anlaşılır örnekler.'),
    changes: [
      {
        kind: 'improved',
        text: t(
          'The examples for Button, Action Button, Tabs, Badge, Slide to Confirm and Card show the component at a larger size in a scene of its own, with no boxed card around it. What sits behind the clear glass is plain CSS and text: no pictures, no SVG.',
          'Button, Action Button, Tabs, Badge, Slide to Confirm ve Card örnekleri bileşeni daha büyük ve kendi sahnesinde gösteriyor; etrafında kutu yok. Berrak camın arkasında yalnız düz CSS ve yazı var: görsel yok, SVG yok.',
        ),
      },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-11-19',
    title: t('Slider, Switch and Checkbox are back.', 'Slider, Switch ve Checkbox geri döndü.'),
    changes: [
      { kind: 'new', page: 'slider', text: t('The range slider of the first previews: a glass pill that opens into a wide lens while held.', 'İlk önizlemelerdeki aralık kaydırıcısı: basılı tutunca geniş bir merceğe açılan cam hap.') },
      { kind: 'new', page: 'switch', text: t('The switch of the first previews: its knob swells into clear glass as it crosses the track.', 'İlk önizlemelerdeki anahtar: topuzu rayı geçerken berrak cama şişer.') },
      { kind: 'new', page: 'checkbox', text: t('The checkbox of the first previews: always under a cap of clear glass.', 'İlk önizlemelerdeki onay kutusu: hep berrak bir cam kapağın altında.') },
    ],
  },
  {
    version: '1.2.2',
    date: '2026-11-19',
    title: t('A softer, deeper shadow under Card.', 'Card\'ın altında daha yumuşak, daha derin bir gölge.'),
    changes: [
      {
        kind: 'fixed',
        page: 'card',
        text: t(
          'Card\'s drop shadow is two soft layers (16.5 px and 26.4 px down, 8% black each), the same at every card size.',
          'Card\'ın gölgesi iki yumuşak katman (16.5 px ve 26.4 px aşağıda, her biri %8 siyah); her kart boyutunda aynı.',
        ),
      },
      {
        kind: 'improved',
        page: 'card',
        text: t(
          'In the example, the rows of colour blur progressively as they reach either end, and the shadow is no longer cut off.',
          'Örnekte renk sıraları iki uca yaklaştıkça kademeli olarak bulanıklaşıyor ve gölge artık kesilmiyor.',
        ),
      },
      {
        kind: 'improved',
        text: t('Page titles, landing headings and the wordmark are set in Cal Sans.', 'Sayfa başlıkları, ana sayfa başlıkları ve logo yazısı Cal Sans ile yazılıyor.'),
      },
      {
        kind: 'removed',
        text: t(
          'The number and verb tags ("01 · Press") on the component tiles, the docs pages and the header menu.',
          'Bileşen kutularındaki, doküman sayfalarındaki ve üst menüdeki numara ve fiil etiketleri ("01 · Bas").',
        ),
      },
    ],
  },
  {
    version: '1.2.1',
    date: '2026-11-19',
    title: t('Flat resting pill for Tabs.', 'Tabs için düz bir duran hap.'),
    changes: [
      {
        kind: 'fixed',
        page: 'tabs',
        text: t(
          'The resting pill has no shadow, like a plain shadcn tab; the examples are back to their first versions.',
          'Duran hapın gölgesi yok, sade bir shadcn sekmesi gibi; örnekler ilk hallerine döndü.',
        ),
      },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-11-19',
    title: t('Card brings back its radial rim.', 'Card radyal kenarına geri dönüyor.'),
    changes: [
      {
        kind: 'improved',
        page: 'card',
        text: t(
          'Card\'s glass is the first card\'s again: the rim pulls what is behind towards the centre, deep and wide, and a 5 px frost blurs the bent picture, under a 70% tint (white on a light page, black on a dark one) and a 1.3 px white line. It is drawn by the WebGL glass, so it now looks the same in Safari, Firefox and on phones. Your `tint`, `blur` and `optics` still override it.',
          'Card\'ın camı yeniden ilk kartınki: kenar arkada kalanı merkeze doğru, derin ve geniş çeker; 5 px buz bükülmüş görüntüyü bulanıklaştırır; üstünde %70 ton (açık sayfada beyaz, koyu sayfada siyah) ve 1.3 px beyaz bir çizgi var. WebGL camla çizildiği için artık Safari\'de, Firefox\'ta ve telefonlarda da aynı görünür. `tint`, `blur` ve `optics` hâlâ bunun üstüne yazar.',
        ),
      },
    ],
  },
  {
    version: '1.1.4',
    date: '2026-11-19',
    title: t('A glass thumb for Slide to Confirm.', 'Slide to Confirm için cam bir tutamaç.'),
    changes: [
      {
        kind: 'improved',
        page: 'slide-to-confirm',
        text: t(
          'The thumb is drawn by the same glass as Button in every state, not only while it moves: frosted white glass with the chevron at rest and with the spinner while pending, and glass in the fill\'s colour with the check once it succeeds. Without WebGL2 or with reduced motion it stays a flat white disc.',
          'Tutamaç artık yalnızca hareket ederken değil, her hâlde Button\'la aynı camla çiziliyor: beklerken okla, yüklenirken dönen simgeyle buzlu beyaz cam; başarınca tikle, dolgunun renginde cam. WebGL2 yoksa ya da hareket azaltılmışsa düz beyaz bir disk olarak kalır.',
        ),
      },
    ],
  },
  {
    version: '1.1.3',
    date: '2026-11-18',
    title: t('A new look for Card.', 'Card için yeni bir görünüm.'),
    changes: [
      {
        kind: 'improved',
        page: 'card',
        text: t(
          'Card has a new default glass: a lighter 3.5 px frost with more vivid colour, a 68% white tint on light pages and 79% black on dark ones, a hairline of white at the rim, and a tighter bend with a slight colour split. The face carries no light or shadow. Your `tint`, `blur` and `optics` still override it.',
          'Card\'ın varsayılan camı yenilendi: daha hafif 3.5 px buz ve daha canlı renk, açık sayfada %68 beyaz, koyu sayfada %79 siyah ton, kenarda kıl inceliğinde beyaz bir çizgi ve hafif renk ayrışmalı daha sıkı bir bükülme. Yüzde ışık ya da gölge yok. `tint`, `blur` ve `optics` hâlâ bunun üstüne yazar.',
        ),
      },
      {
        kind: 'new',
        page: 'card',
        text: t(
          'GlassOptics: `dark` gives dark glass its own tint and rim line.',
          'GlassOptics: `dark`, koyu cama kendi tonunu ve kenar çizgisini verir.',
        ),
      },
    ],
  },
  {
    version: '1.1.2',
    date: '2026-11-18',
    title: t(
      'Shorter names in the docs, and a site built on shadcn/ui that works with a keyboard, a screen reader and a phone.',
      'Dokümanda kısa adlar ve klavyeyle, ekran okuyucuyla, telefonla çalışan, shadcn/ui üstüne kurulu bir site.',
    ),
    changes: [
      {
        kind: 'improved',
        text: t(
          'The docs say Button, Action Button, Tabs, Badge, Slide to Confirm and Card. The site is Liquid Glass already; the prefix stays in the code (`GlassButton`).',
          'Doküman artık Button, Action Button, Tabs, Badge, Slide to Confirm ve Card diyor. Site zaten Liquid Glass; ön ek kodda kalıyor (`GlassButton`).',
        ),
      },
      {
        kind: 'improved',
        text: t(
          'The site chrome is shadcn/ui in the site\'s own look: the header menus, the phone menu, the Preview / Code and package-manager tabs, the release filters and the props tables.',
          'Site arayüzü, sitenin kendi görünümüyle shadcn/ui: header menüleri, telefon menüsü, Önizleme / Kod ve paket yöneticisi sekmeleri, sürüm filtreleri ve prop tabloları.',
        ),
      },
      {
        kind: 'fixed',
        text: t(
          'Keyboard: Tab from an open header menu goes into it, the tabs answer the arrow keys, and the phone menu keeps focus inside and gives it back when it closes.',
          'Klavye: açık bir header menüsünden Tab içine girer, sekmeler ok tuşlarına yanıt verir; telefon menüsü odağı içinde tutar ve kapanınca geri verir.',
        ),
      },
      {
        kind: 'fixed',
        text: t(
          'Screen readers: only the page you are on is announced as current, landmarks on Turkish pages have Turkish names, and copying says "Copied".',
          'Ekran okuyucular: yalnız bulunduğun sayfa "geçerli" diye okunur, Türkçe sayfalardaki bölgelerin adı Türkçe ve kopyalayınca "Kopyalandı" denir.',
        ),
      },
      {
        kind: 'fixed',
        text: t(
          'Small grey text, release labels and code comments reach 4.5:1 contrast in both themes.',
          'Küçük gri metinler, sürüm etiketleri ve kod yorumları iki temada da 4.5:1 kontrasta ulaşıyor.',
        ),
      },
      {
        kind: 'fixed',
        text: t(
          'Phones: the install command wraps instead of hiding its end, the release filters move to a second row, and the component picker no longer zooms the page on iOS.',
          'Telefonda: kurulum komutu sonunu gizlemek yerine alt satıra iniyor, sürüm filtreleri ikinci satıra geçiyor ve bileşen seçici iOS\'ta sayfayı yakınlaştırmıyor.',
        ),
      },
      {
        kind: 'fixed',
        text: t('With reduced motion, arrows no longer slide and chevrons flip without turning.', 'Hareketi azalt açıkken oklar kaymıyor; açılır oklar dönmeden yön değiştiriyor.'),
      },
    ],
  },
  {
    version: '1.1.1',
    date: '2026-11-18',
    title: t('The tabs lens takes the corners of your options.', 'Sekme merceği seçeneklerinin köşelerini alıyor.'),
    changes: [
      {
        kind: 'fixed',
        page: 'tabs',
        text: t(
          'GlassLens takes its corners from the highlight: rectangular options (`rounded-lg`) get a rounded-rectangle lens instead of a pill, its corners grow as it swells, and between options of different sizes they travel with the size. GlassTabs keeps its pill.',
          'GlassLens köşelerini vurgudan alıyor: dikdörtgen seçeneklere (`rounded-lg`) hap yerine köşeleri yuvarlatılmış dikdörtgen bir mercek geliyor; köşeler mercek şiştikçe büyüyor, farklı boyuttaki seçenekler arasında boyutla birlikte geçiyor. GlassTabs hap olarak kalıyor.',
        ),
      },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-11-18',
    title: t('GlassCard is back, a 64 px glass button, and a quieter site.', 'GlassCard geri döndü, 64 px cam buton ve daha sade bir site.'),
    changes: [
      {
        kind: 'new',
        page: 'card',
        text: t(
          'GlassCard: a card of frosted glass that holds your content. As on the 0.x card, its face blurs (`blur`, 5 px) and tints (`tint`, 60%) what is behind, its rim bends it, and it stays still under the pointer. Rebuilt on the shared engine, so it works in every browser with WebGL2.',
          'GlassCard: içeriğini tutan buzlu cam kart. 0.x kartındaki gibi yüzü arkasında kalanı bulanıklaştırır (`blur`, 5 px) ve tonlar (`tint`, %60), kenarı onu büker; imlecin altında büyümez. Ortak motorun üstüne yeniden kuruldu; WebGL2 olan her tarayıcıda çalışır.',
        ),
      },
      {
        kind: 'improved',
        page: 'card',
        text: t(
          'GlassLayer: `blur` frosts what clear glass shows, and `swell={false}` keeps the glass still under the pointer. GlassCard uses both; every other glass looks as before.',
          'GlassLayer: `blur` berrak camın gösterdiğini buzlar, `swell={false}` camı imlecin altında sabit tutar. GlassCard ikisini de kullanır; diğer camların görünümü değişmedi.',
        ),
      },
      {
        kind: 'improved',
        page: 'button',
        text: t('`size="xl"`: a 64 px glass button for the one action a page is about.', '`size="xl"`: sayfanın asıl eylemi için 64 px cam buton.'),
      },
      {
        kind: 'improved',
        page: 'button',
        text: t(
          'The clear-glass example is a larger button on a quiet grid and nothing else: the lines bending at its rim are what you see first.',
          'Berrak cam örneği artık sade bir ızgaranın ortasında büyük bir buton, başka bir şey yok: ilk gördüğün, kenarında bükülen çizgiler.',
        ),
      },
      {
        kind: 'improved',
        page: 'button',
        text: t(
          'The square-corners example sits on fine diagonal lines instead of a blue grid, so the Press demo keeps the site’s only grid.',
          'Köşeli örnek artık mavi ızgara yerine ince çapraz çizgilerin üstünde; sitenin tek ızgarası Press demosunda kalıyor.',
        ),
      },
      {
        kind: 'improved',
        text: t(
          'The home page is quiet again: neutral stages, no light effects, and colour only inside the demos, where the glass bends it.',
          'Ana sayfa yeniden sade: nötr sahneler, ışık efekti yok; renk yalnız camın büktüğü demoların içinde.',
        ),
      },
      {
        kind: 'improved',
        text: t(
          'The language switch moved to the footer, so the header keeps only what gets you around.',
          'Dil seçimi alt bilgiye taşındı; üst bar yalnız gezinmeye yarayanları tutuyor.',
        ),
      },
      {
        kind: 'improved',
        text: t(
          'Release notes: filters show how many changes each kind has, and a pill in the sidebar now means something (New for this minor line, Updated for the latest release).',
          'Sürüm notları: filtreler her türde kaç değişiklik olduğunu gösteriyor; kenar çubuğundaki etiket artık bir şey anlatıyor (bu sürüm hattı için Yeni, son sürüm için Güncel).',
        ),
      },
      {
        kind: 'fixed',
        text: t(
          'On phones the menu opened as a thin strip under the bar; it fills the screen again. The "What\'s new" row on component pages fits phones, and at tablet widths the version badge no longer sits under the menu.',
          'Telefonda menü, barın altında ince bir şerit olarak açılıyordu; artık yine tüm ekranı kaplıyor. Bileşen sayfalarındaki yenilikler satırı telefona sığıyor; tablet genişliğinde sürüm etiketi artık menünün altında kalmıyor.',
        ),
      },
      {
        kind: 'fixed',
        text: t('Versions and dates in the release notes are easier to read.', 'Sürüm notlarındaki sürüm numaraları ve tarihler daha kolay okunuyor.'),
      },
    ],
  },
  {
    version: '1.0.1',
    date: '2026-11-18',
    title: t('A centred arrow in the action droplet.', 'Eylem damlasında ortalanmış ok.'),
    changes: [
      {
        kind: 'fixed',
        page: 'action-button',
        text: t('The arrow sits optically centred in the droplet.', 'Ok, damlanın tam ortasında (optik olarak ortalı) duruyor.'),
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-11-18',
    title: t(
      'Five components, one verb each, drawn by one zero-dependency WebGL2 engine.',
      'Her biri tek fiilli beş bileşen; hepsini bağımlılıksız tek bir WebGL2 motoru çiziyor.',
    ),
    changes: [
      { kind: 'new', page: 'button', text: t('A clear or tinted glass button that swells under the pointer.', 'İmlecin altında şişen, şeffaf ya da renkli cam buton.') },
      { kind: 'new', page: 'action-button', text: t('An async action whose arrow droplet melts into the body when pressed.', 'Basınca ok damlası gövdeye eriyen asenkron eylem butonu.') },
      { kind: 'new', page: 'tabs', text: t('The selection travels between options as a lens (GlassLens included).', 'Seçim, seçenekler arasında bir mercek olarak kayar (GlassLens dahil).') },
      { kind: 'new', page: 'badge', text: t('A badge whose text flows through the glass.', 'Yazısı camın içinden akan rozet.') },
      { kind: 'new', page: 'slide-to-confirm', text: t('Drag a glass thumb to the end to run one deliberate action.', 'Tek bir bilinçli eylem için cam tutamağı sona kadar sürükle.') },
      { kind: 'new', page: 'installation', text: t('A shadcn registry: one command copies the exact files into components/liquid-glass/.', 'shadcn kaydı: tek komut birebir dosyaları components/liquid-glass/ içine kopyalar.') },
      { kind: 'new', page: 'ai', text: t('llms.txt, Markdown for every page and an agent skill, generated from the same docs.', 'Aynı dokümandan üretilen llms.txt, her sayfanın Markdown hâli ve bir ajan skill\'i.') },
      { kind: 'new', text: t('Bilingual documentation (English and Turkish) with release notes.', 'Sürüm notlarıyla birlikte iki dilli (İngilizce ve Türkçe) doküman.') },
      { kind: 'improved', text: t('The engine is shared: one WebGL2 context draws every glass surface and sleeps when nothing moves.', 'Motor ortak: tek WebGL2 bağlamı tüm cam yüzeyleri çizer, hiçbir şey kıpırdamıyorsa uyur.') },
      { kind: 'removed', text: t('GlassCard, the slider and the form controls of the 0.x previews. The kit is now five components.', '0.x önizlemelerindeki GlassCard, kaydırıcı ve form kontrolleri. Kit artık beş bileşen.') },
    ],
  },
  {
    version: '0.3.0',
    date: '2026-11-01',
    title: t('Browser support notes and a lighter GlassCard on phones.', 'Tarayıcı desteği notları ve telefonda daha hafif bir GlassCard.'),
    changes: [
      { kind: 'improved', text: t('GlassCard renders fewer frames on mobile and documents which browsers get the glass.', 'GlassCard mobilde daha az kare çizer ve hangi tarayıcıların camı gördüğünü belgeler.') },
    ],
  },
  {
    version: '0.2.3',
    date: '2026-10-30',
    title: t('Live weather and calendar cards.', 'Canlı hava durumu ve takvim kartları.'),
    changes: [
      { kind: 'new', text: t('Weather and GitHub calendar examples behind the glass card.', 'Cam kartın arkasında hava durumu ve GitHub takvimi örnekleri.') },
      { kind: 'improved', text: t('Card shadow and a fixed tint per theme.', 'Kart gölgesi ve temaya göre sabit renk tonu.') },
    ],
  },
  {
    version: '0.2.2',
    date: '2026-10-30',
    title: t('Glass cards rest by default.', 'Cam kartlar varsayılan olarak durağan.'),
    changes: [
      { kind: 'improved', text: t('Cards are static until hovered; only the colour pills behind them loop.', 'Kartlar üzerine gelinene dek durağan; yalnız arkadaki renk hapları döner.') },
    ],
  },
  {
    version: '0.2.1',
    date: '2026-10-30',
    title: t('Rim light follows the cursor.', 'Kenar ışığı imleci izler.'),
    changes: [
      { kind: 'improved', text: t('The card rim lights up toward the pointer.', 'Kart kenarı imlecin yönüne doğru aydınlanır.') },
      { kind: 'fixed', text: t('Removed the blue bounce from the rim light.', 'Kenar ışığındaki mavi sekme kaldırıldı.') },
    ],
  },
  {
    version: '0.2.0',
    date: '2026-10-30',
    title: t('Glass that refracts the live page.', 'Canlı sayfayı kıran cam.'),
    changes: [
      { kind: 'new', text: t('GlassCard with live DOM refraction: the page behind is painted into the lens.', 'Canlı DOM kırılmalı GlassCard: arkadaki sayfa merceğe boyanır.') },
    ],
  },
  {
    version: '0.1.0',
    date: '2026-10-30',
    title: t('First preview.', 'İlk önizleme.'),
    changes: [
      { kind: 'new', text: t('A liquid glass slider and a set of glass form controls.', 'Sıvı cam kaydırıcı ve bir dizi cam form kontrolü.') },
      { kind: 'new', text: t('Hosting on Cloudflare Pages.', 'Cloudflare Pages üzerinde yayın.') },
    ],
  },
]

export const LATEST = RELEASES[0]

/** "1.3.2" → "1.3": the version people see. The third number is a patch release of it. */
export const minorOf = (version: string) => version.split('.').slice(0, 2).join('.')

/** The version the site shows (header, footer): the current line, without the patch. */
export const VERSION = minorOf(LATEST.version)

const isComponent = (slug?: string) => CATALOG.some((p) => p.slug === slug)

/**
 * The news. Only a release that adds a component is announced to visitors ("What's new",
 * the New pills); everything shipped after it is a patch release and lives in the changelog.
 */
export const FEATURED = RELEASES.find((r) => r.changes.some((c) => c.kind === 'new' && isComponent(c.page))) ?? LATEST

/** Changes about one docs page, newest first, each with its release. */
export const newsOf = (slug: string) =>
  RELEASES.flatMap((r) => r.changes.filter((c) => c.page === slug).map((c) => ({ ...c, version: r.version, date: r.date })))

/** The sidebar pill: "new" on the components the announced release added, until the next one. */
export const badgeOf = (slug: string): 'new' | null => (FEATURED.changes.some((c) => c.kind === 'new' && c.page === slug) ? 'new' : null)
