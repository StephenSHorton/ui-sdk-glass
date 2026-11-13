'use client'

// GlassLens — the sliding glass lens of a segmented control / tab bar. Bring your own
// options (Radix Tabs, a radiogroup, anything) and put the lens first in the container:
//
//   <div role="radiogroup" data-glass-host className="relative isolate …">
//     <GlassLens value={value} />
//     {options.map(o => (
//       <button role="radio" aria-checked={o === value} …>
//         {o === value && <span data-glass-highlight className="absolute inset-0 rounded-full bg-white" />}
//         <span className="relative z-20">{o}</span>
//       </button>
//     ))}
//   </div>
//
// Contract: options carry role="radio" or role="tab"; the selected option contains the
// flat highlight element marked `data-glass-highlight` (its background colour is the
// lens colour). When the selection changes the lens leaves the old highlight, swells
// into clear glass that bends and magnifies the options it passes, then settles into
// the flat highlight again. Press and hold opens the lens in place; drag it and release
// to select. While the lens is visible the container carries:
//   data-glass-moving     — hide the flat highlight:  [[data-glass-moving]_&]:opacity-0
//   data-glass-traveling  — paint the selected label as unselected, so it reads under clear glass
// Without WebGL2 or with reduced motion the highlight simply jumps. COPY VERBATIM. MIT.

import { useEffect, useRef } from 'react'

import { GlassStyles } from './glass-layer'
import { SPRINGS, clamp, getGlassEngine, lerp, stepSpring, surfaceColorOf, type GlassView, type Rgb, type Spring } from './engine'

/** One option is designed 80 units tall; the optics are scaled to the slider's 120-unit lens. */
const OPTION_UNITS = 80
const OPTICS = (OPTION_UNITS * 1.35) / 120
/** The lens swells while it travels: width +12 %, height +35 %. */
const TRAVEL_W = 0.12
const TRAVEL_H = 0.35

type Box = { x: number; y: number; w: number; h: number }
const svgCache = new WeakMap<Element, Map<string, HTMLImageElement>>()

function drawSvg(ctx: CanvasRenderingContext2D, el: SVGSVGElement, color: string, x: number, y: number, w: number, h: number, redraw: () => void) {
  let byColor = svgCache.get(el)
  if (!byColor) svgCache.set(el, (byColor = new Map()))
  let img = byColor.get(color)
  if (!img) {
    const clone = el.cloneNode(true) as SVGSVGElement
    clone.removeAttribute('class')
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('width', String(w))
    clone.setAttribute('height', String(h))
    clone.style.color = color
    img = new Image()
    img.onload = redraw
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`
    byColor.set(color, img)
  }
  if (img.complete && img.naturalWidth) ctx.drawImage(img, x, y, w, h)
}

const visible = (c: string) => !!c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c) && !/\/\s*0\)$/.test(c)

/** Paints the container into `back` (everything beneath the lens) and the labels into `front` in the selected colour. */
function paintOptions(back: CanvasRenderingContext2D, front: CanvasRenderingContext2D, root: HTMLElement, selectedColor: string, redraw: () => void) {
  const o = root.getBoundingClientRect()
  const walk = (el: Element) => {
    if (el instanceof HTMLCanvasElement || el.hasAttribute('data-glass-highlight')) return
    const st = getComputedStyle(el)
    if (st.display === 'none' || st.visibility === 'hidden') return
    const r = el.getBoundingClientRect()
    const x = r.left - o.left
    const y = r.top - o.top
    if (el instanceof SVGSVGElement) {
      if (r.width < 1 || r.height < 1) return
      drawSvg(back, el, st.color, x, y, r.width, r.height, redraw)
      drawSvg(front, el, selectedColor, x, y, r.width, r.height, redraw)
      return
    }
    if (st.display !== 'contents' && r.width > 1 && r.height > 1) {
      const radius = Math.min(parseFloat(st.borderTopLeftRadius) || 0, r.width / 2, r.height / 2)
      if (visible(st.backgroundColor)) {
        back.beginPath()
        back.roundRect(x, y, r.width, r.height, radius)
        back.fillStyle = st.backgroundColor
        back.fill()
      }
      const bw = parseFloat(st.borderTopWidth) || 0
      if (bw > 0 && st.borderTopStyle !== 'none' && visible(st.borderTopColor)) {
        back.beginPath()
        back.roundRect(x + bw / 2, y + bw / 2, r.width - bw, r.height - bw, Math.max(0, radius - bw / 2))
        back.lineWidth = bw
        back.strokeStyle = st.borderTopColor
        back.stroke()
      }
    }
    for (const n of el.childNodes) {
      if (n instanceof Element) walk(n)
      else if (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) {
        const range = document.createRange()
        range.selectNodeContents(n)
        const m = range.getBoundingClientRect()
        if (m.width < 1) continue
        const text = n.textContent.trim()
        for (const [ctx, color] of [
          [back, st.color],
          [front, selectedColor],
        ] as const) {
          ctx.font = `${st.fontStyle} ${st.fontWeight} ${st.fontSize} ${st.fontFamily}`
          ctx.letterSpacing = st.letterSpacing === 'normal' ? '0px' : st.letterSpacing
          ctx.textAlign = 'left'
          ctx.textBaseline = 'alphabetic'
          const mt = ctx.measureText(text)
          ctx.fillStyle = color
          ctx.fillText(text, m.left - o.left, m.top - o.top + (m.height - mt.fontBoundingBoxAscent - mt.fontBoundingBoxDescent) / 2 + mt.fontBoundingBoxAscent)
        }
      }
    }
  }
  walk(root)
}

export type GlassLensProps = {
  /** The selected value (any change slides the lens). `null` = nothing selected. */
  value: string | number | null
  disabled?: boolean
}

export function GlassLens({ value, disabled = false }: GlassLensProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const syncRef = useRef<((slide: boolean) => void) | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    const engine = disabled ? null : getGlassEngine()
    if (!canvas || !root || !ctx || !engine) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    let target: Box | null = null
    let active = false
    let pressed = false
    let dragX: number | null = null
    let color: Rgb = [0, 0, 0]
    let surface: Rgb = [1, 1, 1]
    let selectedColor = 'white'
    const mx: Spring = { x: 0, v: 0 }
    const my: Spring = { x: 0, v: 0 }
    const mw: Spring = { x: 0, v: 0 }
    const mh: Spring = { x: 0, v: 0 }
    const press: Spring = { x: 0, v: 0 }
    const place = (b: Box) => {
      mx.x = b.x
      my.x = b.y
      mw.x = b.w
      mh.x = b.h
      mx.v = my.v = mw.v = mh.v = 0
    }
    const options = () =>
      [...root.querySelectorAll<HTMLElement>('[role="radio"], [role="tab"]')].map((el) => {
        const a = root.getBoundingClientRect()
        const b = el.getBoundingClientRect()
        return { el, x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2, w: b.width, h: b.height }
      })
    const nearest = (x: number, y: number) => {
      let best: ReturnType<typeof options>[number] | null = null
      let d = Infinity
      for (const o of options()) {
        const dd = Math.abs(o.x - x) + Math.abs(o.y - y) * 4
        if (dd < d) {
          d = dd
          best = o
        }
      }
      return best
    }
    const stop = () => {
      active = false
      press.x = press.v = 0
      if (target) place(target)
      delete root.dataset.glassMoving
      delete root.dataset.glassTraveling
      view.dirty = true
      setTimeout(() => {
        const el = root.querySelector('[data-glass-highlight]')?.parentElement
        if (!active && el) selectedColor = getComputedStyle(el).color
      }, 400)
    }
    const start = () => {
      if (active || !target) return
      place(target)
      active = true
    }

    const view: GlassView = {
      canvas,
      ctx,
      dirty: false,
      visible: false,
      step: (dt, still) => {
        if (!active || !target) return false
        if (still) {
          stop()
          return false
        }
        let goal: Box = target
        if (dragX !== null) {
          const all = options()
          const near = nearest(dragX, my.x)
          if (near && all.length) {
            const xs = all.map((o) => o.x)
            goal = { x: clamp(dragX, Math.min(...xs), Math.max(...xs)), y: near.y, w: near.w, h: near.h }
          }
        }
        const spring = dragX !== null ? SPRINGS.drag : SPRINGS.slide
        const a = stepSpring(mx, goal.x, spring, dt)
        const b = stepSpring(my, goal.y, spring, dt)
        const c = stepSpring(mw, goal.w, spring, dt)
        const d = stepSpring(mh, goal.h, spring, dt)
        // The lens stays clear until it is within 6 % of an option's width from its target.
        const traveling = dragX === null && Math.hypot(mx.x - goal.x, my.x - goal.y) > target.w * 0.06
        const open = pressed || traveling
        if (!open) delete root.dataset.glassTraveling
        else if ('glassMoving' in root.dataset) root.dataset.glassTraveling = ''
        const e = stepSpring(press, open ? 1 : 0, SPRINGS.press, dt)
        const moving = a || b || c || d || e
        if (!moving && !pressed) stop()
        return moving
      },
      lens: () => {
        if (!active || !target) return null
        const p = clamp(press.x, -0.12, 1.15)
        const pc = clamp(press.x)
        const frost = 1 - pc
        const padX = 16
        const padTop = Math.round(target.h * 0.3 + 6)
        const padBottom = Math.round(target.h * 1.1 + 8)
        const box = root.getBoundingClientRect()
        return {
          left: -padX,
          top: -padTop,
          width: root.offsetWidth + 2 * padX,
          height: root.offsetHeight + padTop + padBottom,
          unit: target.h / OPTION_UNITS,
          cx: padX + mx.x,
          cy: padTop + my.x,
          hx: (mw.x / 2) * (1 + TRAVEL_W * p),
          hy: (mh.x / 2) * (1 + TRAVEL_H * p),
          radius: 999,
          bodyX: 0,
          bevel: lerp(OPTION_UNITS * 0.42, 62 * OPTICS, pc),
          shadow: 0.12 * lerp(0.55, 1, pc),
          shadowSoftness: 34 * OPTICS * lerp(0.6, 1, pc),
          shadowOffset: 22 * OPTICS * lerp(0.5, 1, pc),
          strength: pc,
          color,
          surface,
          edgeClear: 0,
          refraction: {
            paint: (back, front) => {
              back.translate(padX, padTop)
              front.translate(padX, padTop)
              paintOptions(back, front, root, selectedColor, () => {
                view.dirty = true
                engine.wake()
              })
            },
            refract: lerp(6, 37, pc) * OPTICS * lerp(0.06, 1, pc),
            magnify: 0.12 * pc,
            dispersion: 0.12 * pc,
            blurCenter: lerp(0.35, 4, frost),
            blurEdge: lerp(2.2, 4, frost),
            frost,
          },
          cursorLight: false,
          screenX: box.left + mx.x,
          screenY: box.top + my.x,
        }
      },
      // The flat highlight hides only once the lens has drawn its first frame.
      drawn: () => {
        if (!active || 'glassMoving' in root.dataset) return
        root.dataset.glassMoving = ''
        root.dataset.glassTraveling = ''
      },
      lost: () => {
        pressed = false
        dragX = null
        stop()
      },
    }

    const measure = (): Box | null => {
      const hl = root.querySelector<HTMLElement>('[data-glass-highlight]')
      const el = hl?.parentElement
      if (!hl || !el) return null
      const a = root.getBoundingClientRect()
      const b = el.getBoundingClientRect()
      if (b.width < 2 || b.height < 2) return null
      const c = engine.resolveColor(getComputedStyle(hl).backgroundColor)
      color = [c[0], c[1], c[2]]
      const s = engine.resolveColor(surfaceColorOf(root.parentElement))
      surface = [s[0], s[1], s[2]]
      if (!active) selectedColor = getComputedStyle(el).color
      return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2, w: b.width, h: b.height }
    }
    const sync = (slide: boolean) => {
      const keepColor = selectedColor
      const old = target
      const next = measure()
      const same = !!next && !!old && Math.abs(next.x - old.x) < 0.5 && Math.abs(next.y - old.y) < 0.5 && Math.abs(next.w - old.w) < 0.5
      if (same) return
      if (!slide || !next || !old || !view.visible || reduced.matches) {
        target = next
        if (active && !pressed) stop()
        return
      }
      selectedColor = keepColor
      start()
      target = next
      engine.wake()
    }
    syncRef.current = sync
    sync(false)

    // Press, drag, release. The pointer is not captured: a tap still clicks the option.
    let downX = 0
    let moved = false
    const localX = (e: PointerEvent) => e.clientX - root.getBoundingClientRect().left
    const onMove = (e: PointerEvent) => {
      const x = localX(e)
      if (!moved && Math.abs(x - downX) < 4) return
      moved = true
      dragX = x
      engine.wake()
    }
    const onUp = (e: PointerEvent) => {
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerup', onUp)
      removeEventListener('pointercancel', onUp)
      pressed = false
      if (moved && dragX !== null && e.type === 'pointerup') {
        const near = nearest(dragX, my.x)
        if (near && !near.el.querySelector('[data-glass-highlight]')) {
          near.el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }))
          near.el.click()
        }
      }
      dragX = null
      engine.wake()
    }
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || reduced.matches || !target || !view.visible) return
      if (!(e.target instanceof Element) || !e.target.closest('[role="radio"], [role="tab"]')) return
      pressed = true
      moved = false
      downX = localX(e)
      start()
      addEventListener('pointermove', onMove)
      addEventListener('pointerup', onUp)
      addEventListener('pointercancel', onUp)
      engine.wake()
    }
    root.addEventListener('pointerdown', onDown)
    const touchAction = root.style.touchAction
    root.style.touchAction = 'pan-y'
    const io = new IntersectionObserver(([entry]) => {
      view.visible = entry.isIntersecting
    })
    io.observe(root)
    const ro = new ResizeObserver(() => {
      if (!active) sync(false)
    })
    ro.observe(root)
    engine.add(view)

    return () => {
      engine.remove(view)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      io.disconnect()
      ro.disconnect()
      root.removeEventListener('pointerdown', onDown)
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerup', onUp)
      removeEventListener('pointercancel', onUp)
      root.style.touchAction = touchAction
      syncRef.current = null
      delete root.dataset.glassMoving
      delete root.dataset.glassTraveling
    }
  }, [disabled])

  useEffect(() => {
    syncRef.current?.(true)
  }, [value])

  return (
    <>
      <GlassStyles />
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: 'absolute', zIndex: 30, maxWidth: 'none', pointerEvents: 'none', width: 0, height: 0 }}
      />
    </>
  )
}

export default GlassLens
