import { Outlet, createFileRoute, notFound } from '@tanstack/react-router'

import { SiteFooter, SiteHeader } from '#/site/chrome'
import { localeFromParam } from '#/site/i18n'

// One layout for both languages: "/…" is English, "/tr/…" is Turkish.
export const Route = createFileRoute('/{-$locale}')({
  beforeLoad: ({ params }) => {
    const locale = localeFromParam(params.locale)
    if (!locale) throw notFound()
    return { locale }
  },
  component: LocaleLayout,
})

function LocaleLayout() {
  const { locale } = Route.useRouteContext()
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader locale={locale} />
      <div id="content" className="flex-1">
        <Outlet />
      </div>
      <SiteFooter locale={locale} />
    </div>
  )
}
