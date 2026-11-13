'use client'

// GlassLayer — turns any positioned element (a button, a link, a pill) into liquid glass.
// Put it as the FIRST child of the host and mark the host with `data-glass-host`:
//
//   <a data-glass-host href="/start" className="… rounded-full px-6 h-12">
//     <GlassLayer material="clear" />
//     Get started <ArrowRight />
//   </a>
//
// The host keeps its own CSS look until the first glass frame is drawn, then the layer
// sets `data-glass-ready` and the host drops its background, border and shadow (the
// glass now draws them). Without WebGL2 nothing changes: the CSS look stays.
//
// Hover swells the glass with wobbly springs, press grows it (the host scales with it),
// and an icon that is the host's first or last direct <svg> child separates as a gooey
// droplet. COPY VERBATIM. MIT — https://github.com/bilalgursen/liquid-glass

import { useEffect, useRef } from 'react'

import { drawDom } from './dom-snapshot'
import {
  DESIGN_HEIGHT,
  SPRINGS,
  clamp,
  getGlassEngine,
  lerp,
  mixRgb,
  rgbCss,
  smooth,
  stepSpring,
  surfaceColorOf,
  type GlassView,
  type Rgb,
  type Spring,
} from './engine'

export type GlassMaterial = 'clear' | 'tinted' | 'liquid'
export type GlassDroplet = 'hover' | 'always' | 'none'

export type GlassLayerProps = {
  /**
   * `clear`: transparent glass that bends the page behind it (default).
   * `tinted`: glass painted in the host's own CSS background colour, with light and shadow.
   * `liquid`: the host's flat colour, no light — only the liquid shape (swell, droplet).
   */
  material?: GlassMaterial
  /** When the icon separates as a droplet: on hover (mouse only), always, or never. */
  droplet?: GlassDroplet
  /** Clear glass: how much of the tint covers the backdrop (0 = invisible, 1 = solid). */
  tint?: number
  /** Clear glass: CSS selector of the ancestor whose content is refracted (default: the page). */
  backdrop?: string
  /** Clear glass: repaint the backdrop every frame (for animated content behind the glass). */
  live?: boolean
  /** Listen for hover/press on this ancestor instead of the host (e.g. a whole card link). */
  trigger?: string
  /** Turn the glass off and keep the host's CSS look. */
  disabled?: boolean
}

/** Size of the hover/press response. Matches the kit's Button. */
const PRESS_SCALE = 1.08
const HOVER_SCALE = 1.04
const HOVER_GROW = 0.08
const MAX_GROW_PX = 6
/** Gap between the separated droplet and the body, as a share of the height. */
const DROPLET_GAP = 0.25

/** The CSS the glass relies on. Rendered once per page by <GlassStyles /> (React 19 dedupes it). */
export const GLASS_CSS = `
/* Layered, so a utility class on the host (absolute, fixed) still wins over relative. */
@layer components{:where([data-glass-host]){position:relative;isolation:isolate}}
/* Unlayered on purpose: the droplet layout must beat the host's own padding utilities. */
[data-glass-host][data-glass-ready]{background:transparent!important;border-color:transparent!important;box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
[data-glass-droplet]{--glass-cap:2.5rem}
[data-glass-droplet=end][data-glass-droplet-mode=always]:has(> svg:last-child){padding-right:calc(var(--glass-cap)*1.625)}
[data-glass-droplet=end][data-glass-droplet-mode=always] > svg:last-child{position:absolute;top:50%;right:calc(var(--glass-cap)/2);translate:50% -50%}
[data-glass-droplet=start][data-glass-droplet-mode=always]:has(> canvas:first-child + svg){padding-left:calc(var(--glass-cap)*1.625)}
[data-glass-droplet=start][data-glass-droplet-mode=always] > canvas:first-child + svg{position:absolute;top:50%;left:calc(var(--glass-cap)/2);translate:-50% -50%}
@media (hover:hover) and (pointer:fine){
[data-glass-droplet=end][data-glass-droplet-mode=hover]:has(> svg:last-child){padding-right:calc(var(--glass-cap)*1.625)}
[data-glass-droplet=end][data-glass-droplet-mode=hover] > svg:last-child{position:absolute;top:50%;right:calc(var(--glass-cap)/2);translate:50% -50%}
[data-glass-droplet=start][data-glass-droplet-mode=hover]:has(> canvas:first-child + svg){padding-left:calc(var(--glass-cap)*1.625)}
[data-glass-droplet=start][data-glass-droplet-mode=hover] > canvas:first-child + svg{position:absolute;top:50%;left:calc(var(--glass-cap)/2);translate:-50% -50%}
}
@keyframes glass-marquee{to{transform:translateX(-50%)}}
[data-glass-marquee]{animation:glass-marquee var(--glass-marquee-duration,5s) linear infinite}
[data-glass-ready] [data-glass-fallback]{visibility:hidden}
@media (prefers-reduced-motion:reduce){[data-glass-marquee]{animation:none}}
`

/** Injects GLASS_CSS once (React 19 hoists and dedupes `<style href precedence>`). */
export function GlassStyles() {
  return (
    <style href="liquid-glass" precedence="default">
      {GLASS_CSS}
    </style>
  )
}

export function GlassLayer({
  material = 'clear',
  droplet = 'hover',
  tint = 0.6,
  backdrop,
  live = false,
  trigger,
  disabled = false,
}: GlassLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    const engine = disabled ? null : getGlassEngine()
    if (!canvas || !host || !ctx || !engine) return

    const clear = material === 'clear'
    const flat = material === 'liquid'
    let w = 0
    let h = 0
    let hasDroplet = false
    let side = 1
    let surface: Rgb = [1, 1, 1]
    // Colours come from the host's own CSS (rest, hover, selected…) and cross-fade.
    let color: [Rgb, Rgb] = [
      [1, 1, 1],
      [1, 1, 1],
    ]
    let border: [Rgb, Rgb] | null = null
    let colorT = 1
    let unpaintable = false
    let sampled = false
    let pressed = false
    let hovered = false
    let ready = false
    const page = { canvas: document.createElement('canvas'), ctx: null as CanvasRenderingContext2D | null, key: '', at: 0, stale: true }
    const press: Spring = { x: 0, v: 0 }
    const growX: Spring = { x: 0, v: 0 }
    const growY: Spring = { x: 0, v: 0 }
    const scale: Spring = { x: 1, v: 0 }
    const drop: Spring = { x: 0, v: 0 }
    const maxScale = () => 1 + (2 * MAX_GROW_PX) / Math.max(w, 1)
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')

    const view: GlassView = {
      canvas,
      ctx,
      dirty: true,
      visible: false,
      step: (dt, still) => {
        if (still) {
          press.x = growX.x = growY.x = press.v = growX.v = growY.v = 0
          drop.x = droplet === 'always' && hasDroplet ? 1 : 0
          drop.v = 0
          scale.x = 1
          host.style.scale = ''
          if (colorT !== 1) view.dirty = true
          colorT = 1
          return false
        }
        const hov = hovered ? 1 : 0
        const target = pressed ? Math.min(PRESS_SCALE, maxScale()) : hovered ? Math.min(HOVER_SCALE, maxScale()) : 1
        const a = stepSpring(press, pressed ? 1 : 0, SPRINGS.press, dt)
        const b = stepSpring(growX, hov, SPRINGS.hoverX, dt)
        const c = stepSpring(growY, hov, SPRINGS.hoverY, dt)
        const d = stepSpring(scale, target, SPRINGS.press, dt)
        const apart = (droplet === 'always' ? view.visible : hovered) && !pressed
        const e = hasDroplet ? stepSpring(drop, apart ? 1 : 0, apart ? SPRINGS.dropletOut : SPRINGS.dropletIn, dt) : false
        host.style.scale = scale.x === 1 ? '' : scale.x.toFixed(4)
        const fading = 1 - colorT > 0.004
        colorT = fading ? colorT + (1 - colorT) * Math.min(1, dt * 14) : 1
        return a || b || c || d || e || fading || (clear && live && view.visible)
      },
      lens: (refresh) => {
        if (refresh) {
          w = host.offsetWidth
          h = host.offsetHeight
          // The droplet icon: the host's last (or first) direct <svg> child next to other visible content.
          const nodes = [...host.childNodes].filter((n) => {
            if (n === canvas) return false
            if (n instanceof SVGElement) return true
            if (n instanceof HTMLElement) return n.offsetWidth > 1 && n.offsetHeight > 1
            return !!n.textContent?.trim()
          })
          const first = nodes[0]
          const last = nodes[nodes.length - 1]
          const icon = droplet === 'none' || nodes.length < 2 ? null : last instanceof SVGElement ? last : first instanceof SVGElement ? first : null
          side = icon && icon === first && icon !== last ? -1 : 1
          hasDroplet = !!icon && (droplet === 'always' || fine.matches)
          const end = !icon ? '' : side < 0 ? 'start' : 'end'
          if ((host.dataset.glassDroplet ?? '') !== end) {
            if (end) host.dataset.glassDroplet = end
            else delete host.dataset.glassDroplet
            host.dataset.glassDropletMode = droplet
            view.dirty = true
            engine.wake()
          }
          if (icon) host.style.setProperty('--glass-cap', `${h}px`)
          const s = engine.resolveColor(surfaceColorOf(host.parentElement))
          surface = [s[0], s[1], s[2]]
          if (clear) {
            const custom = getComputedStyle(host).getPropertyValue('--glass-tint').trim()
            const luminance = 0.2126 * surface[0] + 0.7152 * surface[1] + 0.0722 * surface[2]
            const t = custom ? engine.resolveColor(custom) : null
            const tc: Rgb = t ? [t[0], t[1], t[2]] : luminance > 0.5 ? [1, 1, 1] : [0, 0, 0]
            color = [tc, tc]
            border = null
            colorT = 1
            sampled = true
          } else {
            // Read the host's own fill and border with the glass briefly lifted.
            const had = 'glassReady' in host.dataset
            const transition = host.style.transition
            host.style.transition = 'none'
            if (had) delete host.dataset.glassReady
            const st = getComputedStyle(host)
            const fill = engine.resolveColor(st.backgroundColor)
            const bw = st.borderTopStyle === 'solid' ? parseFloat(st.borderTopWidth) || 0 : 0
            const bc = engine.resolveColor(st.borderTopColor)
            const cannot = st.backgroundImage !== 'none' || (st.borderTopStyle !== 'solid' && st.borderTopStyle !== 'none')
            if (had) {
              host.dataset.glassReady = ''
              void getComputedStyle(host).backgroundColor
            }
            host.style.transition = transition
            const next = mixRgb(surface, [fill[0], fill[1], fill[2]], fill[3])
            const nextBorder: Rgb | null = bw > 0 && bc[3] > 0.02 ? mixRgb(next, [bc[0], bc[1], bc[2]], bc[3]) : null
            unpaintable = cannot || (fill[3] < 0.02 && !nextBorder)
            const now = sampled ? mixRgb(color[0], color[1], colorT) : next
            const nowBorder = sampled && border ? mixRgb(border[0], border[1], colorT) : (nextBorder ?? next)
            const changed = sampled && (now.some((v, i) => Math.abs(v - next[i]) > 0.004) || !!border !== !!nextBorder)
            color = [now, next]
            border = nextBorder ? [nowBorder, nextBorder] : null
            colorT = changed ? 0 : 1
            sampled = true
            if (changed) engine.wake()
          }
        }
        if (w < 2 || h < 2) return null
        if (unpaintable) {
          if (ready) {
            ready = false
            delete host.dataset.glassReady
          }
          return null
        }
        const padX = 8
        const padTop = 10
        const padBottom = Math.round(h * 0.8 + 4)
        // The host itself is scaled; the glass inside the canvas is divided by that scale.
        const p = clamp(press.x, -0.12, 1.15)
        const s = Math.max(0.5, scale.x)
        const k = lerp(1, Math.min(PRESS_SCALE, maxScale()), p) / s
        const grow = (h * HOVER_GROW) / s
        const t = hasDroplet ? clamp(drop.x, 0, 1.06) : 0
        const pull = h * (1 + DROPLET_GAP) * t
        const hy = (h / 2) * k + grow * growY.x
        const rect = host.getBoundingClientRect()
        const pc = clamp(press.x)
        return {
          // The canvas is placed against the padding box; the glass is measured on the border box.
          left: -padX - host.clientLeft,
          top: -padTop - host.clientTop,
          width: w + 2 * padX,
          height: h + padTop + padBottom,
          unit: h / DESIGN_HEIGHT,
          cx: padX + w / 2,
          cy: padTop + h / 2,
          hx: (w / 2 - pull / 2) * k + grow * growX.x,
          hy,
          radius: 999,
          bodyX: ((-side * pull) / 2) * k,
          droplet:
            t > 0.001
              ? {
                  x: side * ((w / 2 - h / 2) * k + grow * growX.x * 0.5),
                  r: hy,
                  // The gooey bridge opens as the droplet leaves and closes once it has snapped.
                  k: h * 0.34 * smooth(0, 0.15, t) * (1 - smooth(0.8, 1, t)),
                }
              : undefined,
          bevel: lerp(DESIGN_HEIGHT * 0.42, 62, pc),
          shadow: 0.12 * lerp(0.55, 1, pc),
          shadowSoftness: 34 * lerp(0.6, 1, pc),
          shadowOffset: 22 * lerp(0.5, 1, pc),
          strength: flat ? 0 : 1,
          color: mixRgb(color[0], color[1], colorT),
          border: border ? mixRgb(border[0], border[1], colorT) : undefined,
          surface,
          edgeClear: flat ? 0 : 0.2,
          cursorLight: !flat,
          refraction: clear
            ? {
                paint: (back) => {
                  back.translate(padX, padTop)
                  back.fillStyle = rgbCss(surface)
                  back.fillRect(-padX, -padTop, w + 2 * padX, h + padTop + padBottom)
                  const root = (backdrop ? host.closest(backdrop) : null) ?? document.body
                  const r = host.getBoundingClientRect()
                  const lx = r.left + (r.width - w) / 2
                  const ly = r.top + (r.height - h) / 2
                  const target = back.canvas
                  const key = `${target.width}:${target.height}:${Math.round(lx * 2)}:${Math.round(ly * 2)}:${Math.round(scrollX)}:${Math.round(scrollY)}`
                  const now = performance.now()
                  if (!page.ctx) page.ctx = page.canvas.getContext('2d')
                  // The page is re-painted when the glass moves, on scroll, and at most every 120 ms otherwise.
                  if (page.ctx && (live || page.stale || key !== page.key || now - page.at > 120)) {
                    page.stale = false
                    page.key = key
                    page.at = now
                    if (page.canvas.width !== target.width || page.canvas.height !== target.height) {
                      page.canvas.width = target.width
                      page.canvas.height = target.height
                    }
                    const pc2 = page.ctx
                    pc2.setTransform(1, 0, 0, 1, 0, 0)
                    pc2.clearRect(0, 0, target.width, target.height)
                    pc2.setTransform(back.getTransform())
                    drawDom(pc2, root, {
                      origin: { left: lx, top: ly },
                      region: { left: lx - padX, top: ly - padTop, right: lx + w + padX, bottom: ly + h + padBottom },
                      skip: (el) => el === host || el.hasAttribute('data-glass-skip'),
                      onStale: () => {
                        page.stale = true
                        view.dirty = true
                        engine.wake()
                      },
                    })
                  }
                  back.save()
                  back.setTransform(1, 0, 0, 1, 0, 0)
                  back.drawImage(page.canvas, 0, 0)
                  back.restore()
                },
                refract: lerp(44, 37, pc),
                magnify: 0,
                dispersion: 0.12,
                blurCenter: 0.35,
                blurEdge: 2.2,
                frost: clamp(tint),
              }
            : undefined,
          screenX: rect.left + rect.width / 2,
          screenY: rect.top + rect.height / 2,
        }
      },
      drawn: () => {
        if (ready) return
        ready = true
        host.dataset.glassReady = ''
      },
      lost: () => {
        delete host.dataset.glassReady
        host.style.scale = ''
      },
    }

    const isDisabled = () => host.matches(":disabled, [aria-disabled='true']")
    const dirty = () => {
      view.dirty = true
      engine.wake()
    }
    const onDown = () => {
      if (isDisabled()) return
      pressed = true
      engine.wake()
    }
    const onUp = () => {
      pressed = false
      engine.wake()
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || isDisabled()) return
      hovered = true
      dirty()
    }
    const onLeave = () => {
      pressed = false
      hovered = false
      dirty()
    }
    const target: HTMLElement = (trigger ? host.closest<HTMLElement>(trigger) : null) ?? host
    target.addEventListener('pointerdown', onDown)
    target.addEventListener('pointerup', onUp)
    target.addEventListener('pointercancel', onUp)
    target.addEventListener('pointerenter', onEnter)
    target.addEventListener('pointerleave', onLeave)
    const io = new IntersectionObserver(([entry]) => {
      view.visible = entry.isIntersecting
      dirty()
    })
    io.observe(host)
    const ro = new ResizeObserver(dirty)
    ro.observe(host)
    // Content changes (arrow ↔ spinner, selected state) re-check the droplet and colours.
    const mo = new MutationObserver(dirty)
    mo.observe(host, {
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'disabled', 'aria-pressed', 'aria-checked', 'aria-selected', 'aria-expanded', 'data-state'],
    })
    if (clear) addEventListener('scroll', dirty, { passive: true, capture: true })
    engine.add(view)

    return () => {
      engine.remove(view)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      removeEventListener('scroll', dirty, { capture: true })
      target.removeEventListener('pointerdown', onDown)
      target.removeEventListener('pointerup', onUp)
      target.removeEventListener('pointercancel', onUp)
      target.removeEventListener('pointerenter', onEnter)
      target.removeEventListener('pointerleave', onLeave)
      delete host.dataset.glassReady
      host.style.scale = ''
      host.style.removeProperty('--glass-cap')
    }
  }, [material, droplet, tint, backdrop, live, trigger, disabled])

  return (
    <>
      <GlassStyles />
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: 'absolute', zIndex: -1, maxWidth: 'none', pointerEvents: 'none', width: 0, height: 0 }}
      />
    </>
  )
}

export default GlassLayer
