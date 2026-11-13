import { HeadContent, ScriptOnce, Scripts, createRootRoute, useParams } from '@tanstack/react-router'

import { headScript } from '#/site/head-script'
import { localeFromParam } from '#/site/i18n'
import { NotFound } from '#/site/not-found'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Liquid Glass UI' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFound locale="en" />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { locale } = useParams({ strict: false })
  return (
    // data-theme and color-scheme are set before paint by the head script.
    <html lang={localeFromParam(locale) ?? 'en'} suppressHydrationWarning>
      <head>
        <ScriptOnce>{headScript()}</ScriptOnce>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
