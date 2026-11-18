import { Link, useHydrated } from '@tanstack/react-router'
import { Fragment, type CSSProperties, type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { CATALOG, PAGES, VERSION } from '@/docs/content'

import { LOCALES, LOCALE_KEY, REPO_URL, SITE_ORIGIN, localeParam, type Locale } from './i18n'
import { DocLink, exactActive } from './links'
import { UI } from './ui'

// Site chrome is deliberately plain: the glass belongs to the components, not the frame.
// The frame is lines: rails at the column edges, full-bleed dividers, a rivet where they cross.

/** `code` and **bold** inside a docs string. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') ? (
          <code key={i} className="rounded-[5px] border border-border bg-muted px-1 py-px font-mono text-[0.86em] text-foreground">
            {p.slice(1, -1)}
          </code>
        ) : p.startsWith('**') ? (
          <strong key={i} className="font-medium text-foreground">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

/** A pill track with a lens resting on it: the kit in one mark. */
export function Logo({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="1.5" y="9" width="21" height="6" rx="3" fill="currentColor" opacity="0.18" />
      <rect x="1.5" y="9" width="12" height="6" rx="3" fill="var(--brand)" />
      <rect x="9.25" y="5.25" width="13.5" height="13.5" rx="6.75" fill="var(--background)" fillOpacity="0.55" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function GitHubMark({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

// ── Frame ──

/** The column every page shares, header to footer: 1320px, rails on both sides. The header,
 * the docs shell and every landing section use it, so the lines meet like one drawing. */
export const column = 'relative mx-auto w-[calc(100%-2rem)] max-w-[1320px] border-x border-rail sm:w-[calc(100%-3rem)]'

const rivetAt: Record<'tl' | 'tr' | 'bl' | 'br', CSSProperties> = {
  tl: { left: -0.5, top: -0.5, translate: '-50% -50%' },
  tr: { right: -0.5, top: -0.5, translate: '50% -50%' },
  bl: { left: -0.5, bottom: -0.5, translate: '-50% 50%' },
  br: { right: -0.5, bottom: -0.5, translate: '50% 50%' },
}

/** Rivets on the corners of the nearest positioned box. */
export function Rivets({ at = ['tl', 'tr'] }: { at?: (keyof typeof rivetAt)[] }) {
  return (
    <>
      {at.map((k) => (
        <i key={k} aria-hidden className="rivet" style={rivetAt[k]} />
      ))}
    </>
  )
}

/** A full-bleed divider with the column inside it and rivets where the rails meet it. */
export function FrameSection({ children, id, className = '', inner = '' }: { children: ReactNode; id?: string; className?: string; inner?: string }) {
  return (
    <section id={id} className={`border-t border-rail ${className}`}>
      <div className={`${column} ${inner}`}>
        <Rivets />
        {children}
      </div>
    </section>
  )
}

// ── Footer ──

/** English · Türkçe: the same page in the other language. It sits at the foot of every page;
 * the header stays for getting around. */
function LangSwitch({ locale }: { locale: Locale }) {
  const t = UI[locale].lang
  // Keeps the changelog's filters and the #section once hydrated (the prerendered links carry
  // neither, so the first client render must not either).
  const hydrated = useHydrated()
  return (
    <nav aria-label={t.label} className="flex items-center rounded-full border border-border p-0.5">
      {LOCALES.map((l) => (
        <Link
          key={l}
          to="."
          params={(prev: Record<string, unknown>) => ({ ...prev, locale: localeParam(l) })}
          search={hydrated ? true : undefined}
          hash={hydrated ? true : undefined}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          onClick={() => {
            try {
              localStorage.setItem(LOCALE_KEY, l)
            } catch {}
          }}
          className={`flex h-6 items-center rounded-full px-2.5 transition-colors duration-150 ${
            l === locale ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t[l]}
        </Link>
      ))}
    </nav>
  )
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const p = { locale: localeParam(locale) }
  const t = UI[locale]
  const head = 'pb-3 text-caption font-medium text-foreground'
  const link = 'text-ui text-muted-foreground transition-colors duration-150 hover:text-foreground'
  return (
    <footer className="w-full border-t border-rail">
      <div className={`${column} grid gap-10 px-6 pt-14 pb-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]`}>
        <Rivets />
        <div className="flex flex-col items-start gap-4">
          <Link to="/{-$locale}" params={p} activeOptions={exactActive} className="flex items-center gap-2 font-display text-body leading-none tracking-normal text-foreground">
            <span>
              <span className="font-sans font-light tracking-[-0.04em]">Liquid</span>Glass
            </span>
          </Link>
          <p className="max-w-[30ch] text-ui leading-relaxed text-muted-foreground">{t.hero.subtitle}</p>
          <Badge asChild size="lg" className="press h-7 gap-2 pr-3 pl-2.5 text-caption">
            <Link to="/{-$locale}/changelog" params={p} activeOptions={exactActive}>
              <span aria-hidden className="size-1.5 rounded-full bg-kind-new" />
              <span className="font-mono">v{VERSION}</span>
              <span aria-hidden className="text-faint">
                ·
              </span>
              {t.nav.whatsNew}
            </Link>
          </Badge>
        </div>
        <nav aria-label={t.nav.docs} className="flex flex-col gap-2">
          <p className={head}>{t.nav.docs}</p>
          {PAGES.filter((x) => x.group === 'start').map((x) => (
            <DocLink key={x.slug} page={x} locale={locale} className={link}>
              {x.title[locale]}
            </DocLink>
          ))}
        </nav>
        <nav aria-label={t.nav.components} className="flex flex-col gap-2">
          <p className={head}>{t.nav.components}</p>
          {CATALOG.map((x) => (
            <DocLink key={x.slug} page={x} locale={locale} className={link}>
              {x.title[locale]}
            </DocLink>
          ))}
        </nav>
        <nav aria-label={t.docs.resources} className="flex flex-col gap-2">
          <p className={head}>{t.docs.resources}</p>
          <Link to="/{-$locale}/changelog" params={p} activeOptions={exactActive} className={link}>
            {t.changelog.title}
          </Link>
          <a href={`${SITE_ORIGIN}/llms.txt`} className={link}>
            llms.txt
          </a>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className={link}>
            GitHub
          </a>
        </nav>
      </div>
      <div className="border-t border-rail">
        <div className={`${column} flex flex-wrap items-center justify-between gap-3 px-6 py-5 text-caption text-faint sm:px-10`}>
          <Rivets />
          <p>
            {t.footer}{' '}
            <a href="https://github.com/bilalgursen" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
              bilalgursen
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="font-mono">{t.stack}</p>
            <LangSwitch locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  )
}

/** The quiet surface every live preview sits on. The glass reads it as its backdrop. */
export function Stage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative flex items-center justify-center bg-stage ${className}`}>{children}</div>
}

/** Small mono label: "01", "Fig 0.2". */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-caption text-muted-foreground ${className}`}>{children}</p>
}
