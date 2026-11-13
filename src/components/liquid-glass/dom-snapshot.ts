// dom-snapshot — paints a DOM subtree into a Canvas2D context at its on-screen position.
//
// A WebGL lens cannot read the page's pixels, so glass that bends the page needs the
// page as a texture. This paints a good-enough picture of it: backgrounds and borders
// (rounded), text, inline SVG icons, canvases, same-origin images and backdrop blur.
// It is not a browser renderer: no shadows, gradients, background images or
// ::before/::after. Used by `material="clear"` glass and by GlassBadge.
//
// COPY THIS FILE VERBATIM. MIT — https://github.com/bilalgursen/liquid-glass

const isVisibleColor = (color: string) =>
  !!color && color !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(color) && !/\/\s*0\)$/.test(color)

const svgCache = new WeakMap<Element, { key: string; image: HTMLImageElement }>()

/**
 * Draws an inline SVG as an image. Colours that come from classes are inlined first.
 * Built once per element and rebuilt when the colour, the cache key or the size
 * changes, so an animated SVG keeps its first frame instead of rebuilding every call.
 */
function drawSvg(
  ctx: CanvasRenderingContext2D,
  svg: SVGSVGElement,
  color: string,
  x: number,
  y: number,
  w: number,
  h: number,
  onStale: (() => void) | undefined,
  cacheKey: string,
) {
  const key = `${color}|${cacheKey}|${Math.round(w)}x${Math.round(h)}`
  let entry = svgCache.get(svg)
  if (!entry || entry.key !== key) {
    const clone = svg.cloneNode(true) as SVGSVGElement
    const originals = [svg, ...svg.querySelectorAll('*')]
    const clones = [clone, ...clone.querySelectorAll('*')]
    originals.forEach((original, i) => {
      const style = getComputedStyle(original)
      const target = clones[i] as SVGElement
      target.removeAttribute('class')
      target.style.fill = style.fill
      target.style.stroke = style.stroke
      target.style.animation = 'none'
    })
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('width', String(w))
    clone.setAttribute('height', String(h))
    clone.style.color = color
    const image = new Image()
    image.onload = onStale ?? null
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`
    entry = { key, image }
    svgCache.set(svg, entry)
  }
  if (entry.image.complete && entry.image.naturalWidth) ctx.drawImage(entry.image, x, y, w, h)
}

/** Draws one text node line by line, where the page laid it out and in its own font. */
function drawText(ctx: CanvasRenderingContext2D, node: Text, style: CSSStyleDeclaration, originX: number, originY: number) {
  const raw = node.textContent ?? ''
  const text = raw.replace(/\s+/g, ' ').trim()
  if (!text) return
  const range = document.createRange()
  range.selectNodeContents(node)
  const lines = [...range.getClientRects()].filter((rect) => rect.width > 0.5)
  if (!lines.length) return
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing
  ctx.fillStyle = style.color
  ctx.textBaseline = 'alphabetic'
  const metrics = ctx.measureText('Hgİş')
  const ascent = metrics.fontBoundingBoxAscent
  const descent = metrics.fontBoundingBoxDescent
  const leadingSpace = /^\s/.test(raw) ? ctx.measureText(' ').width : 0
  // Fill each line with as many words as fit (a single line takes them all).
  const words = text.split(' ')
  let next = 0
  lines.forEach((rect, i) => {
    let line = ''
    if (i === lines.length - 1) line = words.slice(next).join(' ')
    else {
      while (next < words.length) {
        const candidate = line ? `${line} ${words[next]}` : words[next]
        if (line && ctx.measureText(candidate).width > rect.width + 1) break
        line = candidate
        next++
      }
    }
    const baseline = rect.top - originY + (rect.height - (ascent + descent)) / 2 + ascent
    ctx.fillText(line, rect.left - originX + (i === 0 ? leadingSpace : 0), baseline)
  })
}

/** Blurs an area of the canvas in place (the counterpart of `backdrop-filter: blur()`). */
function blurBackdrop(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number, blurPx: number) {
  const scale = ctx.getTransform().a
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.clip()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalAlpha = 1
  ctx.filter = `blur(${blurPx * scale}px)`
  ctx.drawImage(ctx.canvas, 0, 0)
  ctx.restore()
}

/** Same origin? A cross-origin image taints the canvas and WebGL can no longer read it. */
const isSameOrigin = (src: string) => {
  try {
    const url = new URL(src, location.href)
    return url.protocol === 'data:' || url.protocol === 'blob:' || url.origin === location.origin
  } catch {
    return false
  }
}

export type DomSnapshotOptions = {
  /**
   * The viewport point that lands on the context's origin, in CSS px.
   * Pass a `getBoundingClientRect()` result; only `left` and `top` are read.
   */
  origin: { left: number; top: number }
  /** Visit only elements whose box intersects this viewport rectangle. */
  region?: { left: number; top: number; right: number; bottom: number }
  /** Return true to leave an element and everything inside it out. */
  skip?: (element: Element) => boolean
  /** Called when an SVG that was not ready has loaded: draw again. */
  onStale?: () => void
  /** Any string that changes when icon colours may have changed, such as the theme name. */
  cacheKey?: string
}

/**
 * Paints `root` and everything inside it into `ctx`. The context must already be
 * scaled so that one unit is one CSS px. Boxes that clip their overflow clip their
 * children; fixed and sticky elements are painted last, on top.
 */
export function drawDom(ctx: CanvasRenderingContext2D, root: Element, options: DomSnapshotOptions) {
  const { origin, region, skip, onStale, cacheKey = document.documentElement.className } = options
  const originX = origin.left
  const originY = origin.top
  const deferred: { element: Element; opacity: number }[] = []
  const intersects = (rect: DOMRect) =>
    !region || (rect.right > region.left && rect.left < region.right && rect.bottom > region.top && rect.top < region.bottom)

  const walk = (element: Element, parentOpacity: number, isDeferred = false) => {
    if (skip?.(element)) return
    const style = getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden') return
    const opacity = parentOpacity * Number(style.opacity)
    if (opacity < 0.01) return
    if (!isDeferred && element !== root && (style.position === 'fixed' || style.position === 'sticky')) {
      deferred.push({ element, opacity: parentOpacity })
      return
    }
    const drawChildren = () => {
      for (const child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          ctx.globalAlpha = opacity
          drawText(ctx, child as Text, style, originX, originY)
        } else if (child instanceof Element) walk(child, opacity)
      }
    }
    if (style.display === 'contents') {
      drawChildren()
      return
    }
    const rect = element.getBoundingClientRect()
    // Screen-reader-only text and empty boxes are not painted; nothing outside the region is visited.
    if (rect.width <= 1 || rect.height <= 1 || !intersects(rect)) return
    const x = rect.left - originX
    const y = rect.top - originY
    const radius = Math.min(parseFloat(style.borderTopLeftRadius) || 0, rect.width / 2, rect.height / 2)
    // Frosted veil (backdrop-filter: blur): blur what is already painted beneath it first,
    // otherwise text behind a translucent veil shows up sharp in the glass.
    const backdropBlur = /blur\(([\d.]+)px\)/.exec(style.backdropFilter)
    if (backdropBlur) blurBackdrop(ctx, x, y, rect.width, rect.height, radius, Number(backdropBlur[1]))
    ctx.globalAlpha = opacity
    if (isVisibleColor(style.backgroundColor)) {
      ctx.beginPath()
      ctx.roundRect(x, y, rect.width, rect.height, radius)
      ctx.fillStyle = style.backgroundColor
      ctx.fill()
    }
    const borderWidth = parseFloat(style.borderTopWidth) || 0
    if (borderWidth > 0 && style.borderTopStyle !== 'none' && isVisibleColor(style.borderTopColor)) {
      ctx.beginPath()
      ctx.roundRect(x + borderWidth / 2, y + borderWidth / 2, rect.width - borderWidth, rect.height - borderWidth, Math.max(0, radius - borderWidth / 2))
      ctx.lineWidth = borderWidth
      ctx.strokeStyle = style.borderTopColor
      ctx.setLineDash(style.borderTopStyle === 'dashed' ? [4, 3] : [])
      ctx.stroke()
      ctx.setLineDash([])
    }
    if (element instanceof SVGSVGElement) {
      drawSvg(ctx, element, style.color, x, y, rect.width, rect.height, onStale, cacheKey)
      return
    }
    if (element instanceof HTMLCanvasElement) {
      if (element.width && element.height) ctx.drawImage(element, x, y, rect.width, rect.height)
      return
    }
    if (element instanceof HTMLImageElement) {
      if (element.complete && element.naturalWidth && isSameOrigin(element.currentSrc || element.src)) ctx.drawImage(element, x, y, rect.width, rect.height)
      return
    }
    const clips = element !== root && style.overflow !== 'visible' && element !== document.body && element !== document.documentElement
    if (clips) {
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(x, y, rect.width, rect.height, radius)
      ctx.clip()
    }
    drawChildren()
    if (clips) ctx.restore()
  }
  walk(root, 1)
  for (let i = 0; i < deferred.length; i++) walk(deferred[i].element, deferred[i].opacity, true)
  ctx.globalAlpha = 1
}
