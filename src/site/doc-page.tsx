import { Link, useLocation } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react'

import { GROUPS, PAGES, type Block, type DocPage } from '@/docs/content'

import { CodeBlock, Inline, Preview, PropsTable } from './chrome'
import { SITE_ORIGIN, alternateLinks, localeFromParam, localeParam, localizedPath, type Locale } from './i18n'
import { UI } from './ui'

export const installCommand = (item: string) => `npx shadcn@latest add ${SITE_ORIGIN}/r/${item}.json`

export function docHead(page: DocPage, param: string | undefined, path: string) {
  const locale = localeFromParam(param) ?? 'en'
  const title = `${page.title[locale]} — Liquid Glass UI`
  return {
    meta: [
      { title },
      { name: 'description', content: page.description[locale] },
      { property: 'og:title', content: title },
      { property: 'og:description', content: page.description[locale] },
    ],
    links: [...alternateLinks(path, locale), { rel: 'alternate', type: 'text/markdown', href: `${SITE_ORIGIN}${localizedPath(`/docs/${page.slug}`, locale)}.md` }],
  }
}

/** Links to a docs page; the introduction lives at /docs itself. */
function DocLink({ page, locale, className, children }: { page: DocPage; locale: Locale; className?: string; children: React.ReactNode }) {
  const p = { locale: localeParam(locale) }
  return page.slug === 'introduction' ? (
    <Link to="/{-$locale}/docs" params={p} className={className}>
      {children}
    </Link>
  ) : (
    <Link to="/{-$locale}/docs/$slug" params={{ ...p, slug: page.slug }} className={className}>
      {children}
    </Link>
  )
}

const current = (pathname: string, slug: string) => {
  const last = pathname.replace(/\/$/, '').split('/').pop()
  return slug === 'introduction' ? last === 'docs' : last === slug
}

export function DocsSidebar({ locale }: { locale: Locale }) {
  const pathname = useLocation({ select: (l) => l.pathname })
  const nav = (
    <nav aria-label="Docs" className="flex flex-col gap-6 text-[13px]">
      {GROUPS.map((g) => (
        <div key={g.id} className="flex flex-col gap-1">
          <p className="px-2.5 pb-1 text-[11px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">{g.title[locale]}</p>
          {PAGES.filter((p) => p.group === g.id).map((p) => {
            const active = current(pathname, p.slug)
            return (
              <DocLink
                key={p.slug}
                page={p}
                locale={locale}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  active ? 'bg-black/[0.05] font-semibold text-foreground dark:bg-white/[0.08]' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span aria-current={active ? 'page' : undefined}>{p.title[locale]}</span>
              </DocLink>
            )
          })}
        </div>
      ))}
    </nav>
  )
  return (
    <>
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-52 shrink-0 overflow-y-auto py-10 md:block">{nav}</aside>
      {/* Phones: the same list in a disclosure above the article. */}
      <details className="group fixed right-4 bottom-4 z-30 md:hidden">
        <summary className="flex h-10 cursor-pointer list-none items-center rounded-full border border-border bg-background/90 px-4 text-[13px] font-semibold shadow-lg backdrop-blur-xl">
          {UI[locale].nav.menu}
        </summary>
        <div className="absolute right-0 bottom-12 max-h-[70dvh] w-64 overflow-y-auto rounded-2xl border border-border bg-background p-3 shadow-xl">{nav}</div>
      </details>
    </>
  )
}

function BlockView({ block, locale }: { block: Block; locale: Locale }) {
  switch (block.type) {
    case 'p':
      return (
        <p className="text-[15px] leading-[1.7] text-muted-foreground">
          <Inline text={block.text[locale]} />
        </p>
      )
    case 'h':
      return <h2 className="pt-6 text-[20px] font-semibold tracking-[-0.015em] text-foreground">{block.text[locale]}</h2>
    case 'list':
      return (
        <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.7] text-muted-foreground marker:text-border">
          {block.items.map((i, n) => (
            <li key={n}>
              <Inline text={i[locale]} />
            </li>
          ))}
        </ul>
      )
    case 'note':
      return (
        <p className="rounded-xl border border-border px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
          <Inline text={block.text[locale]} />
        </p>
      )
    case 'demo':
      return <Preview id={block.id} title={block.title?.[locale]} locale={locale} />
    case 'code':
      return <CodeBlock code={block.code} title={block.title} locale={locale} />
    case 'install':
      return <CodeBlock code={installCommand(block.item)} title="terminal" locale={locale} />
    case 'props':
      return <PropsTable rows={block.rows} locale={locale} />
  }
}

export function DocArticle({ page, locale }: { page: DocPage; locale: Locale }) {
  const t = UI[locale].docs
  const i = PAGES.indexOf(page)
  const prev = PAGES[i - 1]
  const next = PAGES[i + 1]
  return (
    <article className="mx-auto flex max-w-[720px] flex-col gap-5">
      <header className="flex flex-col gap-3 pb-2">
        <h1 className="text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-foreground">{page.title[locale]}</h1>
        <p className="text-[17px] leading-relaxed text-muted-foreground">{page.description[locale]}</p>
        <a
          href={`${localizedPath(`/docs/${page.slug}`, locale)}.md`}
          className="inline-flex w-fit items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
        >
          <FileText className="size-3.5" />
          {t.markdown}
        </a>
      </header>
      {page.hero && <Preview id={page.hero} locale={locale} />}
      {page.blocks.map((b, n) => (
        <BlockView key={n} block={b} locale={locale} />
      ))}
      <nav aria-label="Pagination" className="mt-10 grid grid-cols-2 gap-3 border-t border-border pt-6 text-[13px]">
        {prev ? (
          <DocLink page={prev} locale={locale} className="flex flex-col gap-1 rounded-xl p-3 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
            <span className="flex items-center gap-1 text-muted-foreground">
              <ArrowLeft className="size-3.5" />
              {t.prev}
            </span>
            <span className="font-semibold text-foreground">{prev.title[locale]}</span>
          </DocLink>
        ) : (
          <span />
        )}
        {next && (
          <DocLink page={next} locale={locale} className="flex flex-col items-end gap-1 rounded-xl p-3 text-right hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
            <span className="flex items-center gap-1 text-muted-foreground">
              {t.next}
              <ArrowRight className="size-3.5" />
            </span>
            <span className="font-semibold text-foreground">{next.title[locale]}</span>
          </DocLink>
        )}
      </nav>
    </article>
  )
}
