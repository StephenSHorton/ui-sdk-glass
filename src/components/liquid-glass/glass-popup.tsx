'use client'

// GlassPopup — the gooey popup, as a building block. A surface (a select's list, a menu, a
// popover) and the control that opens it are one body of liquid glass: the surface swells out of
// the whole anchor, a neck gathers between them, thins and snaps, both halves take the jolt, and
// the options come in one after another. Closing is the same motion played backwards.
//
//   const popup = useGlassPopup()
//   <button data-glass-host className="rounded-full …">     // the anchor: any positioned control
//     <GlassPopupAnchor popup={popup} />                     //   first child
//     Open
//   </button>
//   <Content data-glass-popup data-glass-skip className="rounded-3xl …">   // the popup's content
//     <GlassPopupSurface popup={popup} />                                   //   first child
//     <div role="menu">
//       <div role="menuitem" style={{ '--glass-i': 0 }}>…</div>          // --glass-i: its place in the queue
//     </div>
//   </Content>
//
// Contract (what UI SDK's popups do; any headless library that does the same works): the content
// carries `data-open` while open and `data-ending-style` while it closes, and stays mounted
// until every animation inside it has finished. An empty element (`data-glass-hold`) runs a
// long transition while closing and is finished the moment the glass is back inside the anchor:
// the WebGL exit decides when the popup leaves. Items are `role="option"`, `role="menuitem"` or
// `data-glass-item`, inside `role="listbox"`, `role="menu"` or `data-glass-list`.
// One shape, two canvases: the part inside the anchor's box is drawn beneath its label, the rest
// in the popup's layer (the top layer included). Both draw the same field, so the seam cannot show.
// Without WebGL2 the surface is a plain frosted panel and the anchor keeps its CSS look.
// COPY VERBATIM. MIT — https://github.com/bilalgursen/liquid-glass

import { createContext, useEffect, useRef, useState } from 'react'

import { drawDom } from './dom-snapshot'
import { GOOEY, SPRINGS, clamp, getGlassEngine, lerp, rgbCss, smooth, stepSpring, surfaceColorOf, type GlassEngine, type GlassLens, type GlassView, type Rgb, type Spring } from './engine'
import { GlassStyles } from './glass-layer'

const DESIGN_HEIGHT = 120
/** The control is GlassButton's glass: its tint, no frost, its light and shadow. */
const TINT = 0.6
/** Once the neck has let go the surface is GlassCard's glass: frosted, with its tighter bend. */
const CARD = { tint: 0.7, blur: 5, bendCurve: 9.75, bendDepth: 1.35 }
/** Under a control painted in its own colour, the surface's tint covers this much. */
const FILLED = 0.92
/** The surface has no light of its own: this thin white line draws its edge, a soft CSS shadow lifts it. */
const LINE = { alpha: 0.6, darkAlpha: 0.25, width: 1.3 }
/** Room around the trigger's own canvas, and around the popup's. */
const TRIGGER_PAD = 16
const PAD = 28
const PAD_BOTTOM = 56
const TUNE = GOOEY
const ITEMS = ':is([role=option],[role=menuitem],[data-glass-item])'
/** The bridge forms fast; once the thread has broken, what is left of the tension lets go at once. */
const ATTACH = { omega: 28, zeta: 1 }
const LET_GO = { omega: 16, zeta: 1 }
/** How far through the opening the near edge has crossed the gap, and the list shows. */
const NEAR_EDGE = 0.3
/** Closed, the control answers the pointer as GlassButton does (GlassLayer's own values). */
const PRESS_SCALE = 1.08
const HOVER_SCALE = 1.04
const HOVER_GROW = 0.08
const MAX_GROW_PX = 6

const CSS = `
[data-glass-popup]{isolation:isolate;overflow:visible!important;background:transparent}
[data-glass-popup][data-glass-off]{background:rgb(255 255 255 / .86);border:1px solid rgb(0 0 0 / .1);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}
:is(.dark,[data-theme=dark]) [data-glass-popup][data-glass-off]{background:rgb(23 23 23 / .86);border-color:rgb(255 255 255 / .14)}
[data-glass-popup] :is([role=option],[role=menuitem],[data-glass-item]){transition:background-color .12s ease}
[data-glass-popup]:not([data-glass-off]) :is([role=listbox],[role=menu],[data-glass-list]){opacity:var(--glass-out,0)}
[data-glass-popup]:not([data-glass-off]) :is([role=option],[role=menuitem],[data-glass-item]){--glass-in:clamp(0,calc((var(--glass-items,0) - var(--glass-i,0) * var(--glass-gap)) / var(--glass-fade)),1);opacity:calc(var(--glass-base,1) * var(--glass-in));translate:0 calc((1 - var(--glass-in)) * 6px)}
[data-glass-popup] :is([role=option],[role=menuitem],[data-glass-item])[data-disabled]{--glass-base:.4}
[data-glass-popup][data-glass-arriving] :is([role=listbox],[role=menu],[data-glass-list]){overflow:hidden}
[data-glass-popup][data-glass-off] :is([role=listbox],[role=menu],[data-glass-list]){transition:opacity .16s ease}
[data-glass-popup][data-glass-off]:is([data-starting-style],[data-ending-style]) :is([role=listbox],[role=menu],[data-glass-list]){opacity:0}
[data-glass-hold]{position:absolute;width:0;height:0;opacity:1;pointer-events:none}
[data-glass-card-shadow]{position:absolute;inset:0;z-index:-2;border-radius:inherit;pointer-events:none;opacity:0;box-shadow:0 20px 48px oklch(0 0 0 / .105),0 3px 10px oklch(0 0 0 / .045)}
[data-glass-popup][data-glass-tone=dark]>[data-glass-card-shadow]{box-shadow:0 22px 55px oklch(0 0 0 / .34)}
[data-glass-popup][data-glass-off]>[data-glass-card-shadow]{opacity:1!important}
@keyframes glass-hold{to{opacity:0}}
[data-glass-popup]:not([data-glass-off])[data-ending-style]>[data-glass-hold]{animation:glass-hold 60s linear forwards}
@media (prefers-reduced-motion:reduce){
[data-glass-popup]:not([data-glass-off])[data-ending-style]>[data-glass-hold]{animation:none}
}
`

type Box = { L: number; T: number; W: number; H: number }
type Page = { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D | null; key: string; at: number; stale: boolean }

const newPage = (): Page => ({ canvas: document.createElement('canvas'), ctx: null, key: '', at: 0, stale: true })

/** The shared physics and shape of one popup: the anchor's canvas and the surface's both draw it. */
function createMorph(matchWidth: boolean) {
  let engine: GlassEngine | null = null
  let host: HTMLElement | null = null
  let content: HTMLElement | null = null
  let holdEl: HTMLElement | null = null
  let triggerView: GlassView | null = null
  let panelView: GlassView | null = null

  const open: Spring = { x: 0, v: 0 }
  const bridge: Spring = { x: 0, v: 0 }
  const recoil: Spring = { x: 0, v: 0 }
  // The control's own swell under the pointer, while the popup is shut.
  const swPress: Spring = { x: 0, v: 0 }
  const swX: Spring = { x: 0, v: 0 }
  const swY: Spring = { x: 0, v: 0 }
  const swScale: Spring = { x: 1, v: 0 }
  let hovered = false
  let pressed = false
  let moving = false
  let joined = false
  let wasJoined = false
  let pushed = false
  let snapped = false
  /** The opening as it played, frame by frame; and where a rewind of it has got to (seconds, or null). */
  let rec: { t: number; open: number; bridge: number; rc: number; reveal: number; snapped: boolean }[] = []
  let recT = 0
  let rewind: number | null = null
  let panelDrawn = false
  let ready = false
  let dir = 1
  let surface: Rgb = [1, 1, 1]
  let tint: Rgb = [1, 1, 1]
  /** How much of the tint covers the control: Button's, or all of it on a control painted in its own colour. */
  let cover = TINT
  /** And how much covers the surface: the card's, or nearly all of it under a painted control, so the list keeps its colour. */
  let cardCover = CARD.tint
  let panelRadius = 24

  const isOpen = () => !!content && content.hasAttribute('data-open') && !content.hasAttribute('data-ending-style')
  // The closing popup leaves the moment the glass is back inside the trigger.
  const release = () => holdEl?.getAnimations().forEach((a) => a.finish())
  // The list comes in once the panel is open, one option after another (`reveal` = seconds since
  // the first one started); closing fades them out together.
  let reveal = 0
  let out = 0
  const stepItems = (goal: number, dt: number, still: boolean, fixed?: number) => {
    if (!content) return false
    if (fixed !== undefined) {
      // Rewinding: the list is wherever it was at that moment of the opening.
      reveal = fixed
      out = 1
    } else if (still) {
      reveal = goal ? 99 : 0
      out = goal
    } else if (goal) {
      out = 1
      if (open.x > TUNE.itemsAt) reveal = Math.min(reveal + dt, 99)
    } else {
      out = Math.max(0, out - dt / 0.12)
      if (!out) reveal = 0
    }
    const st = content.style
    st.setProperty('--glass-items', reveal.toFixed(3))
    st.setProperty('--glass-out', out.toFixed(3))
    st.setProperty('--glass-gap', String(TUNE.itemsGap))
    st.setProperty('--glass-fade', String(Math.max(TUNE.itemsFade, 0.01)))
    const count = content.querySelectorAll(ITEMS).length
    const arriving = (!!goal || fixed !== undefined) && reveal < count * TUNE.itemsGap + TUNE.itemsFade
    // Options rise into place: until they have, their offset must not count as scrollable overflow.
    if (arriving !== 'glassArriving' in content.dataset) {
      if (arriving) content.dataset.glassArriving = ''
      else delete content.dataset.glassArriving
    }
    return goal ? arriving : out > 0
  }
  const panelRect = () => {
    const c = content?.getBoundingClientRect()
    return c && c.width > 2 && c.height > 2 ? c : null
  }
  const dirty = () => {
    if (triggerView) triggerView.dirty = true
    if (panelView) panelView.dirty = true
    engine?.wake()
  }

  const maxScale = () => 1 + (2 * MAX_GROW_PX) / Math.max(host?.offsetWidth ?? 1, 1)
  /** Hover swells the control and press grows it, as GlassLayer does; an open popup holds it still. */
  const stepSwell = (dt: number, still: boolean) => {
    if (!host) return false
    const shut = !isOpen() && open.x < 0.004
    if (still) {
      swPress.x = swX.x = swY.x = swPress.v = swX.v = swY.v = swScale.v = 0
      swScale.x = 1
      host.style.scale = ''
      return false
    }
    const hov = hovered && shut ? 1 : 0
    const down = pressed && shut
    const target = down ? Math.min(PRESS_SCALE, maxScale()) : hov ? Math.min(HOVER_SCALE, maxScale()) : 1
    const a = stepSpring(swPress, down ? 1 : 0, SPRINGS.press, dt)
    const b = stepSpring(swX, hov, SPRINGS.hoverX, dt)
    const c = stepSpring(swY, hov, SPRINGS.hoverY, dt)
    const d = stepSpring(swScale, target, SPRINGS.press, dt)
    host.style.scale = swScale.x === 1 ? '' : swScale.x.toFixed(4)
    return a || b || c || d
  }

  /** Everything both canvases need, in viewport px. */
  const shape = () => {
    if (!host) return null
    // The control itself is scaled while it swells: measure it unscaled, as its canvas is.
    const r = host.getBoundingClientRect()
    const sc = Math.max(0.5, swScale.x)
    const a = sc === 1 ? r : new DOMRect(r.left + (r.width - host.offsetWidth) / 2, r.top + (r.height - host.offsetHeight) / 2, host.offsetWidth, host.offsetHeight)
    if (a.width < 2 || a.height < 2) return null
    const sk = lerp(1, Math.min(PRESS_SCALE, maxScale()), clamp(swPress.x, -0.12, 1.15)) / sc
    const grow = (a.height * HOVER_GROW) / sc
    const c = panelRect()
    const b = clamp(bridge.x, 0, 1.1)
    const rc = recoil.x
    if (c) dir = c.top < a.top ? -1 : 1
    // The trigger: it sags towards the panel while they hold on, and jolts away when they part.
    // The pull on it grows as the panel comes out and eases off as it goes back in, so the
    // trigger is already at rest when the popup leaves.
    const hold = c ? b * smooth(0, 0.6, clamp(open.x)) : 0
    const body = {
      cx: a.left + a.width / 2,
      cy: a.top + a.height / 2 + dir * (TUNE.triggerSag * hold - TUNE.triggerJolt * rc),
      hx: (a.width / 2) * sk + grow * swX.x - 1.5 * hold + 3.2 * rc,
      hy: (a.height / 2) * sk + grow * swY.x + hold - 2 * rc,
    }
    let blob: GlassLens['blob']
    joined = false
    if (c) {
      const y = clamp(open.x, -0.04, 1.08)
      const t = clamp(y)
      const edge = dir < 0 ? a.top : a.bottom
      const panelNear = dir < 0 ? c.bottom : c.top
      const panelFar = dir < 0 ? c.top : c.bottom
      // The panel starts inside the trigger. Its near edge crosses the gap first and leans back
      // towards the trigger while the bridge holds; a jolt throws it the other way.
      // (A panel still inside the trigger has nowhere to be thrown.)
      const jolt = dir * TUNE.panelJolt * rc * smooth(0, 0.35, t)
      const near = lerp(edge - dir * 6, panelNear - dir * TUNE.neckPull * b, smooth(0, NEAR_EDGE, t)) + jolt
      const far = lerp(edge - dir, panelFar, y) + jolt * 0.5
      const hx = lerp(a.width * 0.3, c.width / 2, y) * (1 - 0.012 * rc)
      const hy = Math.max(Math.abs(far - near) / 2, 0.5)
      // The softness follows how far the panel sticks out: at full strength a panel still inside
      // the trigger would swell it, and with none the two bodies would meet in a visible crease.
      const k = Math.max(TUNE.neckSoftness * b * smooth(0, 90, dir * (far - edge)), 0.05)
      // Two facing edges stay bridged while the softness is over twice the gap between them.
      joined = k > 2 * Math.max(dir * (near - (body.cy + dir * body.hy)), 0)
      blob = {
        x: lerp(body.cx, c.left + c.width / 2, t) - body.cx,
        y: (near + far) / 2 - body.cy,
        hx,
        hy,
        // Still attached, the panel is rounder: surface tension lets go as the neck does.
        r: Math.min(lerp(panelRadius, panelRadius * 1.8, b), hx, hy),
        k,
        // The bridge spans the whole trigger at first and gathers into a neck at its middle.
        neck: { x: 0, w: a.width * lerp(0.2, 0.6, clamp(b)) },
      }
    }
    const t = clamp(open.x)
    // The surface turns into the card as the neck lets go, and back before it forms again.
    const card = c ? (1 - smooth(0, 0.35, clamp(b))) * smooth(0.35, 0.8, t) : 0
    // Parted: the control draws itself alone, with its own shadow, whatever the card does.
    return { a, c, body, blob, t, card, parted: card > 0 && !joined }
  }

  /** `card`: 0 draws the control's glass, 1 the surface's. While the neck holds they are one glass. */
  const lensFor = (box: Box, s: NonNullable<ReturnType<typeof shape>>, page: Page, repaint: () => void, card = 0): Omit<GlassLens, 'left' | 'top'> => {
    const unit = s.a.height / DESIGN_HEIGHT
    return {
      width: box.W,
      height: box.H,
      unit,
      cx: s.body.cx - box.L,
      cy: s.body.cy - box.T,
      hx: s.body.hx,
      hy: s.body.hy,
      radius: 999,
      bodyX: 0,
      blob: s.blob,
      bevel: DESIGN_HEIGHT * 0.42,
      // The engine scales the shadow with `strength`, so both leave together as the card arrives.
      shadow: 0.12 * lerp(0.55, 1, s.t),
      shadowSoftness: 34 * lerp(0.6, 1, s.t),
      shadowOffset: 22 * lerp(0.5, 1, s.t),
      strength: 1 - card,
      tune: { bendCurve: lerp(1.6, CARD.bendCurve, card), bendDepth: lerp(1, CARD.bendDepth, card), fresnel: 1 - card },
      color: tint,
      border: card > 0 ? [1, 1, 1] : undefined,
      borderAlpha: card > 0 ? card * (tint[0] > 0.5 ? LINE.alpha : LINE.darkAlpha) : undefined,
      borderWidth: card > 0 ? LINE.width : undefined,
      surface,
      edgeClear: 0.2,
      cursorLight: card < 0.5,
      refraction: {
        paint: (back) => {
          back.fillStyle = rgbCss(surface)
          back.fillRect(0, 0, box.W, box.H)
          const target = back.canvas
          const key = `${target.width}:${target.height}:${box.L}:${box.T}:${Math.round(scrollX)}:${Math.round(scrollY)}`
          const now = performance.now()
          if (!page.ctx) page.ctx = page.canvas.getContext('2d')
          // Never re-read the page mid-flight: that would drop frames.
          if (page.ctx && (page.stale || key !== page.key || (!moving && now - page.at > 120))) {
            page.stale = false
            page.key = key
            page.at = now
            if (page.canvas.width !== target.width || page.canvas.height !== target.height) {
              page.canvas.width = target.width
              page.canvas.height = target.height
            }
            page.ctx.setTransform(1, 0, 0, 1, 0, 0)
            page.ctx.clearRect(0, 0, target.width, target.height)
            page.ctx.setTransform(back.getTransform())
            drawDom(page.ctx, document.body, {
              origin: { left: box.L, top: box.T },
              region: { left: box.L, top: box.T, right: box.L + box.W, bottom: box.T + box.H },
              skip: (el) => el === host || el === content || el.hasAttribute('data-glass-skip'),
              onStale: () => {
                page.stale = true
                repaint()
              },
            })
          }
          back.save()
          back.setTransform(1, 0, 0, 1, 0, 0)
          back.drawImage(page.canvas, 0, 0)
          back.restore()
        },
        refract: 44,
        magnify: 0,
        dispersion: lerp(0.12, 0, card),
        blurCenter: 0.35,
        blurEdge: 2.2,
        frost: lerp(cover, cardCover, card),
        blur: CARD.blur * card,
      },
      screenX: s.body.cx,
      screenY: s.body.cy,
    }
  }

  const readColours = () => {
    if (!host || !engine) return
    const s = engine.resolveColor(surfaceColorOf(host.parentElement))
    surface = [s[0], s[1], s[2]]
    let light = 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2] > 0.5
    tint = light ? [1, 1, 1] : [0, 0, 0]
    cover = TINT
    cardCover = CARD.tint
    if ('glassFill' in host.dataset) {
      // A control painted in its own CSS background (`data-glass-fill`, as a tinted
      // GlassButtonGroup is): the glass takes that colour whole, and the surface follows it.
      // Read with the glass briefly lifted, as GlassLayer does.
      const had = 'glassReady' in host.dataset
      if (had) delete host.dataset.glassReady
      const fill = engine.resolveColor(getComputedStyle(host).backgroundColor)
      if (had) host.dataset.glassReady = ''
      if (fill[3] > 0.02) {
        tint = [fill[0], fill[1], fill[2]]
        cover = 1
        cardCover = FILLED
        light = 0.2126 * tint[0] + 0.7152 * tint[1] + 0.0722 * tint[2] > 0.5
      }
    }
    const tone = light ? 'light' : 'dark'
    if (host.dataset.glassTone !== tone) host.dataset.glassTone = tone
    if (content) {
      if (content.dataset.glassTone !== tone) content.dataset.glassTone = tone
      panelRadius = parseFloat(getComputedStyle(content).borderTopLeftRadius) || 24
      // The layout width, not --anchor-width: the surface is exactly as wide as its anchor.
      const width = `${host.offsetWidth}px`
      if (matchWidth && content.style.width !== width) content.style.width = width
    }
  }

  const setTrigger = (canvas: HTMLCanvasElement | null) => {
    const el = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    engine = getGlassEngine()
    if (!canvas || !el || !ctx || !engine) return () => {}
    const e = engine
    host = el
    const page = newPage()
    const pages = [page]
    const advance = (dt: number, still: boolean): boolean => {
      const goal = isOpen() ? 1 : 0
      const live = !!panelRect()
      if (still) {
        open.x = goal
        open.v = bridge.x = bridge.v = recoil.x = recoil.v = 0
        stepItems(goal, dt, true)
        rec = []
        rewind = null
        if (!goal) release()
        return (moving = false)
      }
      if (goal && open.x === 0) {
        for (const p of [...pages, panelPage]) if (p) p.stale = true
        rec = []
        recT = 0
      }
      // Closing is the opening played backwards: the same frames, in reverse.
      if (!goal && rewind === null && rec.length > 1 && open.x > 0.004) {
        // Skip the settled tail, where nothing visible is left to undo.
        const shown = (content?.querySelectorAll(ITEMS).length ?? 0) * TUNE.itemsGap + TUNE.itemsFade
        let i = rec.length - 1
        while (i > 0 && rec[i].open >= 0.995 && rec[i].bridge <= 0.02 && rec[i].reveal >= shown) i--
        rewind = rec[Math.min(i + 1, rec.length - 1)].t
      }
      if (goal && rewind !== null) {
        // Reopened on the way back: the opening carries on from this very frame.
        const at = rewind
        rec = rec.filter((f) => f.t <= at)
        recT = at
        rewind = null
        open.v = bridge.v = recoil.v = 0
        pushed = open.x > 0.02
      }
      if (rewind !== null) {
        rewind -= (dt * TUNE.closeSpeed) / Math.max(TUNE.openSpeed, 0.1)
        if (rewind <= 0) {
          rewind = null
          rec = []
          open.x = open.v = bridge.x = bridge.v = recoil.x = recoil.v = 0
          pushed = snapped = wasJoined = false
          stepItems(0, dt, true)
          release()
          dirty()
          return (moving = false)
        }
        let j = rec.length - 2
        while (j > 0 && rec[j].t > rewind) j--
        const f0 = rec[j]
        const f1 = rec[j + 1]
        const u = clamp((rewind - f0.t) / Math.max(f1.t - f0.t, 1e-4))
        open.x = lerp(f0.open, f1.open, u)
        bridge.x = lerp(f0.bridge, f1.bridge, u)
        recoil.x = lerp(f0.rc, f1.rc, u)
        open.v = bridge.v = recoil.v = 0
        snapped = f0.snapped
        wasJoined = joined
        stepItems(0, dt, false, lerp(f0.reveal, f1.reveal, u))
        return (moving = true)
      }
      const weight = Math.max(TUNE.weight, 0.1)
      const kick = TUNE.kick / weight
      const m1 = stepSpring(open, goal, goal ? { omega: TUNE.openSpeed, zeta: TUNE.openDamping } : { omega: TUNE.closeSpeed, zeta: 0.7 }, dt)
      const attached = live && (goal ? open.x < TUNE.detachAt : true)
      const m2 = stepSpring(bridge, attached ? 1 : 0, attached || !goal ? ATTACH : snapped ? LET_GO : { omega: TUNE.snapSpeed, zeta: 1 }, dt)
      // Jolts: the panel pushing out, the neck snapping, the panel bumping back in.
      if (goal && !pushed && open.x > 0.02) {
        pushed = true
        recoil.v += kick * 0.5
      }
      if (!goal) pushed = snapped = false
      if (wasJoined && !joined && goal && !snapped) {
        snapped = true
        recoil.v += kick
      }
      if (!wasJoined && joined && !goal) recoil.v += kick * 0.5
      wasJoined = joined
      const m3 = stepSpring(recoil, 0, { omega: TUNE.recoilSpeed / Math.sqrt(weight), zeta: Math.min(TUNE.recoilDamping, 0.999) }, dt)
      const m4 = stepItems(goal, dt, false)
      // Only once nothing of the panel shows outside the trigger.
      if (!goal && open.x < 0.004) release()
      moving = m1 || m2 || m3 || m4
      if (goal && moving && rec.length < 1500) {
        recT += dt
        rec.push({ t: recT, open: open.x, bridge: bridge.x, rc: recoil.x, reveal, snapped })
      }
      return moving
    }
    const view: GlassView = {
      canvas,
      ctx,
      dirty: true,
      visible: false,
      // The one place the springs advance; the popup's view reports the same answer.
      step: (dt, still) => {
        const swelling = stepSwell(dt, still)
        return advance(dt, still) || swelling
      },
      lens: (refresh) => {
        if (refresh) readColours()
        const s = shape()
        if (!s) return null
        const { a } = s
        const box = {
          L: Math.floor(a.left - TRIGGER_PAD),
          T: Math.floor(a.top - TRIGGER_PAD),
          W: Math.ceil(a.width + 2 * TRIGGER_PAD) + 1,
          H: Math.ceil(a.height * 1.8 + 2 * TRIGGER_PAD) + 1,
        }
        // While the popup's canvas draws the rest, this one keeps to the trigger's own box.
        canvas.style.clipPath =
          s.c && panelDrawn && !s.parted
            ? `inset(${a.top - 1 - box.T}px ${box.L + box.W - a.right - 1}px ${box.T + box.H - a.bottom - 1}px ${a.left - 1 - box.L}px)`
            : ''
        return {
          ...lensFor(box, s, page, dirty),
          blob: s.parted ? undefined : s.blob,
          left: box.L - a.left - el.clientLeft,
          top: box.T - a.top - el.clientTop,
        }
      },
      drawn: () => {
        if (ready) return
        ready = true
        el.dataset.glassReady = ''
      },
      lost: () => {
        ready = false
        delete el.dataset.glassReady
        el.style.scale = ''
        if (content) content.dataset.glassOff = ''
        release()
      },
    }
    triggerView = view
    const off = () => el.matches(":disabled, [aria-disabled='true']")
    const onDown = () => {
      if (off()) return
      pressed = true
      dirty()
    }
    const onUp = () => {
      pressed = false
      dirty()
    }
    const onEnter = (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse' || off()) return
      hovered = true
      dirty()
    }
    const onLeave = () => {
      pressed = hovered = false
      dirty()
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    const io = new IntersectionObserver(([entry]) => {
      view.visible = entry.isIntersecting
      dirty()
    })
    io.observe(el)
    const ro = new ResizeObserver(dirty)
    ro.observe(el)
    addEventListener('scroll', dirty, { passive: true, capture: true })
    e.add(view)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.style.scale = ''
      pressed = hovered = false
      e.remove(view)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      io.disconnect()
      ro.disconnect()
      removeEventListener('scroll', dirty, { capture: true })
      delete el.dataset.glassReady
      delete el.dataset.glassTone
      triggerView = null
      host = null
    }
  }

  let panelPage: Page | null = null
  const setPanel = (canvas: HTMLCanvasElement | null, hold: HTMLElement | null, cardShadow: HTMLElement | null) => {
    const el = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !el || !ctx) return () => {}
    const e = getGlassEngine()
    if (!e) {
      el.dataset.glassOff = ''
      return () => {}
    }
    engine = e
    content = el
    holdEl = hold
    const page = (panelPage = newPage())
    const view: GlassView = {
      canvas,
      ctx,
      dirty: true,
      visible: false,
      step: () => moving,
      lens: (refresh) => {
        if (refresh) readColours()
        const s = shape()
        if (!s?.c || (s.t < 0.004 && !isOpen())) {
          panelDrawn = false
          return null
        }
        const { a, c } = s
        const L = Math.floor(Math.min(a.left, c.left) - PAD)
        const T = Math.floor(Math.min(a.top, c.top) - PAD)
        const box = { L, T, W: Math.ceil(Math.max(a.right, c.right) + PAD - L), H: Math.ceil(Math.max(a.bottom, c.bottom) + PAD_BOTTOM - T) }
        // Everything but the trigger's box, which its own canvas draws beneath the label.
        const x0 = a.left - L
        const y0 = a.top - T
        canvas.style.clipPath = s.parted ? '' : `path(evenodd,"M0 0H${box.W}V${box.H}H0Z M${x0} ${y0}H${x0 + a.width}V${y0 + a.height}H${x0}Z")`
        // The card's own drop shadow is CSS: it arrives with the card, once the body has its final shape.
        if (cardShadow) cardShadow.style.opacity = s.card.toFixed(3)
        // Parted, this canvas (above the control) draws the card alone: a control thrown past its
        // own box by the jolt must not show up here, on top of its glass.
        const alone =
          s.parted && s.blob
            ? { cx: s.body.cx + s.blob.x - box.L, cy: s.body.cy + s.blob.y - box.T, hx: s.blob.hx, hy: s.blob.hy, radius: s.blob.r, blob: undefined }
            : {}
        return { ...lensFor(box, s, page, dirty, s.card), ...alone, left: L - c.left - el.clientLeft, top: T - c.top - el.clientTop }
      },
      drawn: () => {
        if (panelDrawn) return
        panelDrawn = true
        if (triggerView) triggerView.dirty = true
      },
      lost: () => {
        el.dataset.glassOff = ''
      },
    }
    panelView = view
    const mo = new MutationObserver(dirty)
    mo.observe(el, { attributes: true, attributeFilter: ['data-open', 'data-closed', 'data-ending-style', 'data-side', 'style'] })
    const ro = new ResizeObserver(dirty)
    ro.observe(el)
    const io = new IntersectionObserver(([entry]) => {
      view.visible = entry.isIntersecting
      dirty()
    })
    io.observe(el)
    e.add(view)
    dirty()
    return () => {
      e.remove(view)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      mo.disconnect()
      ro.disconnect()
      io.disconnect()
      delete el.dataset.glassTone
      panelView = null
      panelPage = null
      panelDrawn = false
      content = null
      holdEl = null
      dirty()
    }
  }

  return { setTrigger, setPanel }
}

export type GlassPopup = ReturnType<typeof createMorph>

/**
 * The popup a control inside may anchor: GlassDropdownMenu provides it, and a GlassButtonGroup
 * under it becomes the anchor, so the menu swells out of the whole group.
 */
export const GlassPopupContext = createContext<GlassPopup | null>(null)

const canvasStyle = { position: 'absolute', zIndex: -1, maxWidth: 'none', pointerEvents: 'none', width: 0, height: 0 } as const

/** The surface's share of the glass: the first child of the popup's content. */
export function GlassPopupSurface({ popup: morph }: { popup: GlassPopup }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const holdRef = useRef<HTMLSpanElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)
  useEffect(() => morph.setPanel(canvasRef.current, holdRef.current, shadowRef.current), [morph])
  return (
    <>
      <canvas ref={canvasRef} aria-hidden style={canvasStyle} />
      <span ref={holdRef} aria-hidden data-glass-hold="" />
      <span ref={shadowRef} aria-hidden data-glass-card-shadow="" />
    </>
  )
}

/** The anchor's share of the glass: the first child of the control that opens the popup. */
export function GlassPopupAnchor({ popup }: { popup: GlassPopup }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => popup.setTrigger(canvasRef.current), [popup])
  return (
    <>
      <GlassStyles />
      <style href="liquid-glass-popup" precedence="default">
        {CSS}
      </style>
      <canvas ref={canvasRef} aria-hidden style={canvasStyle} />
    </>
  )
}

/** One gooey popup: hand the result to its GlassPopupAnchor and GlassPopupSurface. `matchWidth` keeps the surface as wide as the anchor. */
export function useGlassPopup({ matchWidth = false }: { matchWidth?: boolean } = {}): GlassPopup {
  const [popup] = useState(() => createMorph(matchWidth))
  return popup
}
