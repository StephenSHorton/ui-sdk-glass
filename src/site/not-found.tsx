import { Link } from '@tanstack/react-router'

import { localeParam, type Locale } from './i18n'
import { UI } from './ui'

export function NotFound({ locale }: { locale: Locale }) {
  const t = UI[locale].notFound
  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-32 text-center">
      <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-foreground">{t.title}</h1>
      <p className="text-muted-foreground">{t.body}</p>
      <Link to="/{-$locale}" params={{ locale: localeParam(locale) }} className="mt-2 text-[14px] font-semibold text-[#3291FF]">
        {t.home}
      </Link>
    </main>
  )
}
