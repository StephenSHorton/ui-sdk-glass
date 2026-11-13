'use client'

// GlassButton — a button (or link, with `href`) made of liquid glass.
//
//   <GlassButton icon={<ArrowRight />}>Get started</GlassButton>                    // clear glass
//   <GlassButton material="tinted" className="bg-blue-500 text-white">Save</GlassButton>
//   <GlassButton material="liquid" className="bg-orange-500 text-white" icon={<ArrowRight />}>Continue</GlassButton>
//
// Tinted and liquid glass take their colour from the button's own CSS background,
// so you colour it with a normal class. The icon must render an <svg>; on hover it
// separates from the body as a gooey droplet. COPY VERBATIM. MIT.

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import { GlassLayer, type GlassDroplet, type GlassMaterial } from './glass-layer'

export type GlassButtonSize = 'sm' | 'md' | 'lg'

type Common = {
  children?: ReactNode
  /** Glass look. Default `clear`. See GlassLayer. */
  material?: GlassMaterial
  size?: GlassButtonSize
  /** An <svg> icon (e.g. a lucide-react icon). */
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  /** Icon separates as a gooey droplet: on hover (default), always, or never. */
  droplet?: GlassDroplet
  /** Clear glass tint (0–1). */
  tint?: number
  className?: string
}

export type GlassButtonProps = Common &
  (
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common>)
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common>)
  )

const sizes: Record<GlassButtonSize, { box: string; cap: string }> = {
  sm: { box: 'h-8 gap-1.5 px-4 text-[13px] [&_svg]:size-3.5', cap: '2rem' },
  md: { box: 'h-10 gap-2 px-5 text-sm [&_svg]:size-4', cap: '2.5rem' },
  lg: { box: 'h-12 gap-2 px-6 text-[15px] [&_svg]:size-[18px]', cap: '3rem' },
}

// The look before the glass draws (first paint, and the permanent look without WebGL2).
const fallback: Record<GlassMaterial, string> = {
  clear:
    'border border-black/10 bg-white/60 text-neutral-900 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:text-white',
  tinted: '',
  liquid: '',
}

export function GlassButton({
  children,
  material = 'clear',
  size = 'md',
  icon,
  iconPosition = 'end',
  droplet = 'hover',
  tint,
  className = '',
  ...rest
}: GlassButtonProps) {
  const s = sizes[size]
  const props = {
    'data-glass-host': '',
    'data-glass-droplet': icon && droplet !== 'none' ? iconPosition : undefined,
    'data-glass-droplet-mode': droplet,
    style: { '--glass-cap': s.cap } as React.CSSProperties,
    className: `inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-semibold whitespace-nowrap select-none outline-none focus-visible:ring-2 focus-visible:ring-[#3291FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:shrink-0 ${s.box} ${fallback[material]} ${className}`,
  }
  const content = (
    <>
      <GlassLayer material={material} droplet={droplet} tint={tint} />
      {icon && iconPosition === 'start' && icon}
      {children}
      {icon && iconPosition === 'end' && icon}
    </>
  )
  if (rest.href !== undefined) {
    return (
      <a {...props} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }
  const { type = 'button', ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button {...props} type={type} {...button}>
      {content}
    </button>
  )
}

export default GlassButton
