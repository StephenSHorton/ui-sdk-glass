// Generates every machine-readable file from the docs source (src/docs/content.ts)
// and the real component files, so they can never drift from the site:
//   public/llms.txt, public/llms-full.txt, public/docs/*.md, public/tr/docs/*.md,
//   public/r/registry.json, public/r/<item>.json      (gitignored, rebuilt on every build)
//   skills/liquid-glass/references/components.md      (committed; the skill ships it)
// Runs from vite.config.ts at build and dev start. Fails loudly on a broken reference.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, normalize, relative } from 'node:path'

import { GROUPS, PAGES, REGISTRY, type Block, type DocPage, type RegistryItem } from '../src/docs/content'
import { REPO_URL, SITE_ORIGIN, localizedPath, type Locale } from '../src/site/i18n'

const ROOT = join(import.meta.dirname, '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const write = (p: string, body: string) => {
  const abs = join(ROOT, p)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, body)
}

export const installCommand = (item: string) => `npx shadcn@latest add ${SITE_ORIGIN}/r/${item}.json`
const demoSource = (id: string) => read(`src/docs/demos/${id}.tsx`).trimEnd()

// ── Registry ──

const IMPORT_RE = /(?:from\s+|import\s*\(\s*)'([^']+)'/g

/** Entry files + every file they reach through relative imports. */
function closure(entries: string[]) {
  const files = new Set<string>()
  const packages = new Set<string>()
  const visit = (file: string) => {
    if (files.has(file)) return
    if (!existsSync(join(ROOT, file))) throw new Error(`[ai-files] missing file ${file}`)
    files.add(file)
    for (const [, spec] of read(file).matchAll(IMPORT_RE)) {
      if (spec.startsWith('.')) {
        const base = normalize(join(dirname(file), spec))
        const hit = ['', '.ts', '.tsx', '/index.ts'].map((ext) => base + ext).find((f) => existsSync(join(ROOT, f)) && !f.endsWith('/'))
        if (!hit) throw new Error(`[ai-files] ${file}: cannot resolve ${spec}`)
        visit(hit)
      } else if (spec.startsWith('#/') || spec.startsWith('@/')) {
        throw new Error(`[ai-files] ${file}: alias import ${spec} would break after copying; use a relative import`)
      } else if (spec !== 'react' && !spec.startsWith('react/') && spec !== 'react-dom') {
        packages.add(spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0])
      }
    }
  }
  entries.forEach(visit)
  // three/webgpu ships no types we rely on: bring the tiny module shim along.
  if (packages.has('three')) files.add('src/components/liquid-glass/controls/glass/three-webgpu.d.ts')
  return { files: [...files].sort(), packages: [...packages].sort() }
}

const VERSIONS: Record<string, string> = JSON.parse(read('package.json')).dependencies

function registryItem(item: RegistryItem) {
  const { files, packages } = closure(item.entries)
  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: item.name,
    type: 'registry:block',
    title: item.title,
    description: item.description,
    dependencies: packages.map((p) => `${p}@${VERSIONS[p] ?? 'latest'}`),
    ...(item.cssVars ? { cssVars: item.cssVars } : {}),
    ...(item.css ? { css: item.css } : {}),
    docs: `Docs: ${SITE_ORIGIN}/docs/${item.name}.md — copy verbatim; customise through props and classes only.`,
    categories: ['liquid-glass'],
    files: files.map((path) => ({
      path,
      type: 'registry:component',
      target: relative('src', path),
      content: read(path),
    })),
  }
}

// ── Markdown ──

const md = (s: string) => s // the source strings are already Markdown (`code`, **bold**)

function blockToMd(b: Block, locale: Locale): string {
  switch (b.type) {
    case 'p':
      return md(b.text[locale])
    case 'h':
      return `## ${b.text[locale]}`
    case 'list':
      return b.items.map((i) => `- ${md(i[locale])}`).join('\n')
    case 'note':
      return `> ${md(b.text[locale])}`
    case 'demo':
      return `${b.title ? `### ${b.title[locale]}\n\n` : ''}\`\`\`tsx\n${demoSource(b.id)}\n\`\`\``
    case 'code':
      return `\`\`\`${b.title === 'terminal' ? 'bash' : b.title === 'prompt' ? 'text' : 'tsx'}\n${b.code}\n\`\`\``
    case 'install':
      return `\`\`\`bash\n${installCommand(b.item)}\n\`\`\``
    case 'props': {
      const head = locale === 'tr' ? '| Prop | Tür | Varsayılan | Açıklama |' : '| Prop | Type | Default | Description |'
      const rows = b.rows.map((r) => `| \`${r.name}\` | \`${r.type.replace(/\|/g, '\\|')}\` | ${r.default ? `\`${r.default}\`` : '—'} | ${r.description[locale]} |`)
      return [head, '| --- | --- | --- | --- |', ...rows].join('\n')
    }
  }
}

export function pageToMarkdown(page: DocPage, locale: Locale): string {
  const parts = [`# ${page.title[locale]}`, `> ${page.description[locale]}`]
  if (page.hero) parts.push(`\`\`\`tsx\n${demoSource(page.hero)}\n\`\`\``)
  for (const b of page.blocks) parts.push(blockToMd(b, locale))
  parts.push(`Source: ${SITE_ORIGIN}${localizedPath(`/docs/${page.slug}`, locale)}`)
  return parts.join('\n\n') + '\n'
}

const RULES = `## Rules for AI agents

1. Install with the shadcn CLI command shown on each page, or copy the files from ${REPO_URL}/tree/main/src/components verbatim. Never re-implement, port or "simplify" the engine or shader: the look depends on its exact constants.
2. Customise only through the documented props and class names (\`className\`, \`bg-*\`, \`text-*\`, \`--glass-tint\`).
3. Liquid glass components (GlassButton, GlassTabs, GlassBadge, GlassLayer, GlassLens) have zero npm dependencies and wrap your own DOM. Prefer them. Canvas controls (Button, Switch, …) need \`three\`.
4. Requirements: React 19, Tailwind CSS v4, an \`@/\` alias to the source folder.`

function llmsIndex(): string {
  const lines = [
    '# Liquid Glass UI',
    '',
    '> Liquid glass React components drawn by one WebGL2 shader: clear lenses that bend what is behind them, swell under the pointer and separate icons as gooey droplets. Copy-paste components (shadcn registry), MIT.',
    '',
    RULES,
    '',
  ]
  for (const g of GROUPS) {
    lines.push(`## ${g.title.en}`, '')
    for (const p of PAGES.filter((x) => x.group === g.id)) lines.push(`- [${p.title.en}](${SITE_ORIGIN}/docs/${p.slug}.md): ${p.description.en}`)
    lines.push('')
  }
  lines.push('## Optional', '', `- [Full documentation in one file](${SITE_ORIGIN}/llms-full.txt)`, `- [Türkçe dokümantasyon](${SITE_ORIGIN}/tr/docs/introduction.md)`, `- [Source code](${REPO_URL})`, '')
  return lines.join('\n')
}

export function generateAiFiles() {
  for (const locale of ['en', 'tr'] as const) {
    for (const p of PAGES) write(`public${localizedPath(`/docs/${p.slug}`, locale)}.md`, pageToMarkdown(p, locale))
  }
  write('public/llms.txt', llmsIndex())
  write('public/llms-full.txt', ['# Liquid Glass UI — full documentation', '', RULES, '', ...PAGES.map((p) => pageToMarkdown(p, 'en'))].join('\n'))

  const items = REGISTRY.map(registryItem)
  for (const item of items) write(`public/r/${item.name}.json`, JSON.stringify(item, null, 2) + '\n')
  write(
    'public/r/registry.json',
    JSON.stringify(
      {
        $schema: 'https://ui.shadcn.com/schema/registry.json',
        name: 'liquid-glass',
        homepage: SITE_ORIGIN,
        items: items.map(({ content: _c, ...rest }: any) => ({ ...rest, files: rest.files.map(({ content: _x, ...f }: any) => f) })),
      },
      null,
      2,
    ) + '\n',
  )

  // The skill's reference: every page of the components, in English.
  write(
    'skills/liquid-glass/references/components.md',
    [
      '<!-- Generated from src/docs/content.ts by scripts/ai-files.ts. Do not edit by hand. -->',
      '',
      ...PAGES.filter((p) => p.group !== 'start').map((p) => pageToMarkdown(p, 'en')),
    ].join('\n'),
  )
}
