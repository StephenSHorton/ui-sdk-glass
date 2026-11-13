// Site chrome strings (navigation, buttons, landing copy). Docs text lives in src/docs/content.ts.
export const UI = {
  en: {
    nav: { docs: 'Docs', components: 'Components', ai: 'For AI', github: 'GitHub', skip: 'Skip to content', menu: 'Menu', close: 'Close' },
    lang: { label: 'Language', en: 'English', tr: 'Türkçe' },
    theme: { label: 'Theme', light: 'Light', dark: 'Dark' },
    code: { copy: 'Copy', copied: 'Copied', preview: 'Preview', code: 'Code' },
    docs: { onThisPage: 'On this page', install: 'Installation', markdown: 'View as Markdown', prev: 'Previous', next: 'Next', props: 'Props' },
    hero: {
      eyebrow: 'Open source · MIT',
      title: 'Liquid glass for React.',
      subtitle:
        'Buttons, tabs and badges made of one WebGL2 glass shader: they bend what is behind them, swell under the pointer and melt like liquid. Copy a file, get exactly what you see.',
      primary: 'Get started',
      secondary: 'GitHub',
    },
    liquid: {
      title: 'Liquid glass',
      description: 'Zero dependencies, a few kilobytes, your own DOM. Hover the buttons and switch the tabs.',
      more: 'All liquid components',
    },
    install: {
      title: 'One command, the exact files',
      description: 'Install with the shadcn CLI or copy the folder. The files are yours: no package, no runtime, nothing to keep in sync.',
      ai: 'Built for AI agents too: llms.txt, Markdown for every page and an installable skill.',
    },
    footer: 'MIT · open source',
    notFound: { title: 'Page not found', body: 'The page you are looking for does not exist.', home: 'Back to home' },
  },
  tr: {
    nav: { docs: 'Doküman', components: 'Bileşenler', ai: 'Yapay zekâ', github: 'GitHub', skip: 'İçeriğe geç', menu: 'Menü', close: 'Kapat' },
    lang: { label: 'Dil', en: 'English', tr: 'Türkçe' },
    theme: { label: 'Tema', light: 'Açık', dark: 'Koyu' },
    code: { copy: 'Kopyala', copied: 'Kopyalandı', preview: 'Önizleme', code: 'Kod' },
    docs: { onThisPage: 'Bu sayfada', install: 'Kurulum', markdown: 'Markdown olarak gör', prev: 'Önceki', next: 'Sonraki', props: 'Prop\'lar' },
    hero: {
      eyebrow: 'Açık kaynak · MIT',
      title: 'React için sıvı cam.',
      subtitle:
        'Tek bir WebGL2 cam gölgelendiricisinden butonlar, sekmeler ve rozetler: arkasındakini büker, imleç altında şişer, sıvı gibi erir. Dosyayı kopyala, gördüğünün aynısını al.',
      primary: 'Başla',
      secondary: 'GitHub',
    },
    liquid: {
      title: 'Sıvı cam',
      description: 'Bağımlılık yok, birkaç kilobayt, senin DOM\'un. Butonların üstüne gel, sekmeleri değiştir.',
      more: 'Tüm sıvı cam bileşenleri',
    },
    install: {
      title: 'Tek komut, birebir dosyalar',
      description: 'shadcn CLI ile kur ya da klasörü kopyala. Dosyalar senindir: paket yok, çalışma zamanı yok, eşitlenecek bir şey yok.',
      ai: 'Yapay zekâ ajanları için de hazır: llms.txt, her sayfanın Markdown hâli ve kurulabilir bir skill.',
    },
    footer: 'MIT · açık kaynak',
    notFound: { title: 'Sayfa bulunamadı', body: 'Aradığın sayfa yok.', home: 'Ana sayfaya dön' },
  },
} as const

export type UiStrings = (typeof UI)['en']
