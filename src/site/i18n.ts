// Locales and URLs. English lives at the root (/docs/…), Turkish under /tr (/tr/docs/…).
// Plain TS (no React): also imported by vite.config.ts to list the pages to prerender.
export const SITE_ORIGIN = 'https://liquid-glass-interface.pages.dev'
export const REPO_URL = 'https://github.com/bilalgursen/liquid-glass'

export const LOCALES = ['en', 'tr'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
/** localStorage key of an explicit language choice. */
export const LOCALE_KEY = 'liquid-glass-locale'
/** localStorage key of an explicit theme choice. */
export const THEME_KEY = 'liquid-glass-theme'

/** A localized string. */
export type L = { en: string; tr: string }

/** `{-$locale}` param → locale; anything other than "tr" is not a locale. */
export function localeFromParam(param: string | undefined): Locale | null {
  if (param === undefined) return 'en'
  if (param === 'tr') return 'tr'
  return null
}

export function localeParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale
}

/** ('/docs/button', 'tr') → '/tr/docs/button'. */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path
  return locale === DEFAULT_LOCALE ? clean || '/' : `/${locale}${clean}`
}

/** canonical + hreflang alternates for one locale-less path. */
export function alternateLinks(path: string, locale: Locale) {
  return [
    { rel: 'canonical', href: SITE_ORIGIN + localizedPath(path, locale) },
    ...LOCALES.map((l) => ({ rel: 'alternate', hrefLang: l, href: SITE_ORIGIN + localizedPath(path, l) })),
    { rel: 'alternate', hrefLang: 'x-default', href: SITE_ORIGIN + localizedPath(path, DEFAULT_LOCALE) },
  ]
}
