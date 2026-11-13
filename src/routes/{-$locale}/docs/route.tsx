import { Outlet, createFileRoute } from '@tanstack/react-router'

import { DocsSidebar } from '#/site/doc-page'

export const Route = createFileRoute('/{-$locale}/docs')({
  component: DocsLayout,
})

function DocsLayout() {
  const { locale } = Route.useRouteContext()
  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 sm:px-6">
      <DocsSidebar locale={locale} />
      <main className="min-w-0 flex-1 py-10 md:py-14">
        <Outlet />
      </main>
    </div>
  )
}
