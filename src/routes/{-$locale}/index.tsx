import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { GlassButton, GlassLayer } from '@/components/liquid-glass'
import { HowItWorks } from '#/components/site/HowItWorks'
import { Crosshair, DashedRule, DotGrid } from '#/components/site/layout-svg'
import { UiKitGallery } from '#/components/site/UiKitGallery'
import { DEMOS } from '#/docs/demos'
import { CodeBlock, GitHubMark } from '#/site/chrome'
import { installCommand } from '#/site/doc-page'
import { REPO_URL, alternateLinks, localeFromParam, localeParam, type Locale } from '#/site/i18n'
import { setTheme, useTheme } from '#/site/theme'
import { UI } from '#/site/ui'

export const Route = createFileRoute('/{-$locale}/')({
  head: ({ params }) => {
    const locale = localeFromParam(params.locale) ?? 'en'
    const t = UI[locale].hero
    return {
      meta: [
        { title: locale === 'tr' ? 'Liquid Glass UI — React için sıvı cam bileşenleri' : 'Liquid Glass UI — liquid glass components for React' },
        { name: 'description', content: t.subtitle },
        { property: 'og:title', content: 'Liquid Glass UI' },
        { property: 'og:description', content: t.subtitle },
      ],
      links: alternateLinks('/', locale),
    }
  },
  component: Home,
})

function Showcase({ id, title }: { id: string; title: string }) {
  const { Component } = DEMOS[id]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-52 items-center justify-center rounded-2xl border border-border bg-[#e6e7ea] p-6 dark:bg-[#1c1d21]">
        <Component />
      </div>
      <p className="px-1 text-[13px] font-semibold text-foreground">{title}</p>
    </div>
  )
}

function Home() {
  const { locale } = Route.useRouteContext()
  const [theme] = useTheme()
  const t = UI[locale]
  const p = { locale: localeParam(locale) }
  return (
    <main>
      <section className="w-full px-4 sm:px-6">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center py-24 text-center md:py-32">
          <DotGrid />
          <DashedRule className="bottom-0 hidden md:block" />
          <Crosshair className="absolute bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 text-foreground/50 md:block" />
          <Crosshair className="absolute right-0 bottom-0 hidden translate-x-1/2 translate-y-1/2 text-foreground/50 md:block" />
          <p className="relative mb-6 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">{t.hero.eyebrow}</p>
          <h1 className="relative max-w-3xl text-[44px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-foreground sm:text-[64px]">
            {t.hero.title}
          </h1>
          <p className="relative mt-6 max-w-2xl text-[16px] leading-relaxed text-balance text-muted-foreground sm:text-[17px]">{t.hero.subtitle}</p>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/{-$locale}/docs" params={p} data-glass-host className="inline-flex h-12 items-center gap-2 rounded-full bg-[#3291FF] px-6 text-[15px] font-semibold text-white">
              <GlassLayer material="liquid" />
              {t.hero.primary}
              <ArrowRight className="size-[18px]" />
            </Link>
            <GlassButton size="lg" href={REPO_URL} target="_blank" rel="noreferrer" icon={<GitHubMark className="size-4" />} iconPosition="start" droplet="none">
              {t.hero.secondary}
            </GlassButton>
          </div>
        </div>
      </section>

      <section id="liquid" className="w-full scroll-mt-14 px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 border-b border-border py-20 md:py-24">
          <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-2xl flex-col gap-3">
              <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.025em] text-foreground sm:text-[36px]">{t.liquid.title}</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{t.liquid.description}</p>
            </div>
            <Link to="/{-$locale}/docs/$slug" params={{ ...p, slug: 'glass-button' }} className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#3291FF]">
              {t.liquid.more}
              <ArrowRight className="size-4" />
            </Link>
          </header>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Showcase id="glass-button-droplet" title="GlassButton" />
            <Showcase id="glass-button-clear" title="GlassButton · clear" />
            <Showcase id="glass-tabs-basic" title="GlassTabs" />
            <Showcase id="glass-badge-basic" title="GlassBadge" />
          </div>
        </div>
      </section>

      <UiKitGallery locale={locale} theme={theme} onThemeChange={setTheme} />
      <HowItWorks locale={locale} />

      <section id="start" className="w-full scroll-mt-14 px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 py-20 md:py-24">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.025em] text-foreground sm:text-[36px]">{t.install.title}</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{t.install.description}</p>
          </div>
          <CodeBlock code={installCommand('liquid-glass')} title="terminal" locale={locale as Locale} className="max-w-3xl" />
          <p className="text-[14px] text-muted-foreground">
            {t.install.ai}{' '}
            <Link to="/{-$locale}/docs/$slug" params={{ ...p, slug: 'ai' }} className="font-semibold text-[#3291FF]">
              llms.txt →
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}


