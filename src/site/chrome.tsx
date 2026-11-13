import { Link, useLocation } from '@tanstack/react-router'
import { Check, Copy, Moon, Sun } from 'lucide-react'
import { Fragment, useState, type ReactNode } from 'react'

import { GlassTabs } from '@/components/liquid-glass'
import { DEMOS } from '@/docs/demos'
import type { PropRow } from '@/docs/content'

import { LOCALES, LOCALE_KEY, REPO_URL, SITE_ORIGIN, localeParam, type Locale } from './i18n'
import { useTheme } from './theme'
import { UI } from './ui'

/** `code` and **bold** inside a docs string. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') ? (
          <code key={i} className="rounded-[5px] bg-black/[0.05] px-1 py-px font-mono text-[0.88em] text-foreground dark:bg-white/[0.08]">
            {p.slice(1, -1)}
          </code>
        ) : p.startsWith('**') ? (
          <strong key={i} className="font-semibold text-foreground">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

export function GitHubMark({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

function ThemeToggle({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useTheme()
  const t = UI[locale].theme
  return (
    <GlassTabs
      aria-label={t.label}
      size="sm"
      value={theme}
      onValueChange={setTheme}
      options={[
        { value: 'light', label: '', icon: <Sun />, 'aria-label': t.light },
        { value: 'dark', label: '', icon: <Moon />, 'aria-label': t.dark },
      ]}
    />
  )
}

function LangSwitch({ locale }: { locale: Locale }) {
  return (
    <nav aria-label={UI[locale].lang.label} className="flex items-center rounded-full bg-black/[0.05] p-1 text-[12px] font-semibold dark:bg-white/[0.08]">
      {LOCALES.map((l) => (
        <Link
          key={l}
          to="."
          params={(prev: Record<string, unknown>) => ({ ...prev, locale: localeParam(l) })}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          onClick={() => {
            try {
              localStorage.setItem(LOCALE_KEY, l)
            } catch {}
          }}
          className={`flex h-6 items-center rounded-full px-2.5 uppercase transition-colors ${
            l === locale ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {l}
        </Link>
      ))}
    </nav>
  )
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = UI[locale].nav
  const p = { locale: localeParam(locale) }
  const path = useLocation({ select: (l) => l.pathname })
  const inDocs = path.includes('/docs')
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-md focus:bg-background focus:px-3 focus:py-2">
        {t.skip}
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link to="/{-$locale}" params={p} aria-label="Liquid Glass UI" className="flex shrink-0 items-center gap-2 text-[14px] font-semibold tracking-[-0.01em] text-foreground">
          <span aria-hidden className="size-4 rounded-full bg-gradient-to-br from-sky-300 via-white to-sky-500 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]" />
          <span className="hidden whitespace-nowrap min-[420px]:inline">Liquid Glass UI</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-5 text-[13px] text-muted-foreground sm:flex">
          <Link to="/{-$locale}/docs" params={p} className={inDocs ? 'text-foreground' : 'hover:text-foreground'}>
            {t.docs}
          </Link>
          <Link to="/{-$locale}/docs/$slug" params={{ ...p, slug: 'ai' }} className="hover:text-foreground">
            {t.ai}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LangSwitch locale={locale} />
          <ThemeToggle locale={locale} />
          <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label={t.github} className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
            <GitHubMark />
          </a>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="w-full border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-[12px] text-muted-foreground sm:px-6">
        <span>
          <span className="font-semibold text-foreground">Liquid Glass UI</span> · {UI[locale].footer}
        </span>
        <span className="flex gap-4">
          <a href={`${SITE_ORIGIN}/llms.txt`} className="hover:text-foreground">
            llms.txt
          </a>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
        </span>
      </div>
    </footer>
  )
}

function CopyButton({ text, locale }: { text: string; locale: Locale }) {
  const [done, setDone] = useState(false)
  const t = UI[locale].code
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text)
        setDone(true)
        setTimeout(() => setDone(false), 1400)
      }}
      aria-label={done ? t.copied : t.copy}
      className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/[0.08]"
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

export function CodeBlock({ code, title, locale, className = '' }: { code: string; title?: string; locale: Locale; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-[#fafafa] dark:bg-[#18191d] ${className}`}>
      <div className="flex h-9 items-center justify-between border-b border-border pr-1.5 pl-4 font-mono text-[11px] text-muted-foreground">
        <span>{title}</span>
        <CopyButton text={code} locale={locale} />
      </div>
      <pre className="max-h-[480px] overflow-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.65] text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/** A live demo and, under it, its exact source file. */
export function Preview({ id, title, locale }: { id: string; title?: ReactNode; locale: Locale }) {
  const demo = DEMOS[id]
  if (!demo) throw new Error(`Unknown demo "${id}"`)
  const { Component, source } = demo
  return (
    <figure className="flex flex-col gap-3">
      {title && <figcaption className="text-[13px] font-semibold text-foreground">{title}</figcaption>}
      <div className="flex min-h-56 items-center justify-center rounded-xl border border-border bg-[#e6e7ea] p-8 dark:bg-[#1c1d21]">
        <Component />
      </div>
      <CodeBlock code={source} title={`${id}.tsx`} locale={locale} />
    </figure>
  )
}

export function PropsTable({ rows, locale }: { rows: PropRow[]; locale: Locale }) {
  const head = locale === 'tr' ? ['Prop', 'Tür', 'Varsayılan'] : ['Prop', 'Type', 'Default']
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-[13px]">
        <thead className="border-b border-border text-[12px] text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.name} className="align-top">
              <td className="px-4 py-3">
                <code className="font-mono text-[12.5px] font-semibold text-foreground">{r.name}</code>
                <p className="mt-1 max-w-[46ch] text-muted-foreground">
                  <Inline text={r.description[locale]} />
                </p>
              </td>
              <td className="px-4 py-3 font-mono text-[12px] text-sky-700 dark:text-sky-300">{r.type}</td>
              <td className="px-4 py-3 font-mono text-[12px] whitespace-nowrap text-muted-foreground">{r.default ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
