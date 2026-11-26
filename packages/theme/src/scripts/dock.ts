function setupDock(dock: HTMLElement) {
  const controls = [...dock.querySelectorAll<HTMLAnchorElement>('a')]
  dock.addEventListener('keydown', (event) => {
    const { key } = event
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return
    const visible = controls.filter((link) => link.getClientRects().length)
    const i = visible.findIndex((link) => link === event.target)
    if (i < 0) return
    event.preventDefault()
    const offset = key === 'ArrowRight' ? 1 : -1
    const next =
      key === 'Home'
        ? 0
        : key === 'End'
          ? visible.length - 1
          : (i + offset + visible.length) % visible.length
    visible[next]?.focus()
  })
}

function setupReflection(dock: HTMLElement) {
  const finePointer = matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  )
  const solidGlass = matchMedia(
    '(prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)',
  )
  let frame: number | undefined
  let x = 0
  let y = 0

  function paint() {
    frame = undefined
    const { left, top } = dock.getBoundingClientRect()
    dock.style.setProperty('--dock-light', `${x - left}px ${y - top}px`)
    dock.setAttribute('data-reflecting', '')
  }

  function point(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || !finePointer.matches || solidGlass.matches) return
    x = event.clientX
    y = event.clientY
    frame ??= requestAnimationFrame(paint)
  }

  function reset() {
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
    dock.removeAttribute('data-reflecting')
  }

  dock.addEventListener('pointerenter', point, { passive: true })
  dock.addEventListener('pointermove', point, { passive: true })
  dock.addEventListener('pointerleave', reset)
  finePointer.addEventListener('change', reset)
  solidGlass.addEventListener('change', reset)
}

function setupRefraction(dock: HTMLElement, map: SVGFEImageElement) {
  if (!CSS.supports('backdrop-filter', 'url("#dock-refraction")')) return
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return
  const toc = dock.querySelector('details.toc')
  const channelScale = 255 / 16 // SVG displacement filter scale
  let lastRadius = 0

  new ResizeObserver(([entry]) => {
    if (toc?.open) return // The expanded panel only uses blur.
    const { inlineSize, blockSize } = entry.borderBoxSize[0]!
    const width = Math.round(inlineSize)
    const height = Math.round(blockSize)
    const radius = Math.min(
      parseFloat(getComputedStyle(dock).getPropertyValue('--dock-radius')),
      width / 2,
      height / 2,
    )
    if (!width || !height || !radius) return
    if (width === canvas.width && height === canvas.height && radius === lastRadius) return
    lastRadius = radius
    canvas.width = width
    canvas.height = height
    const image = context.createImageData(width, height)
    const { data } = image
    const cx = width / 2
    const cy = height / 2

    // Encode the inward surface normal in R/G, tapering smoothly into the center.
    for (let y = 0, i = 0; y < height; y++) {
      const dy = y + 0.5 - cy
      const qy = Math.abs(dy) - (cy - radius)
      for (let x = 0; x < width; x++, i += 4) {
        const dx = x + 0.5 - cx
        const qx = Math.abs(dx) - (cx - radius)
        const corner = qx > 0 && qy > 0
        const length = corner ? Math.hypot(qx, qy) : 0
        const distance = radius - (corner ? length : Math.max(qx, qy))
        data[i + 3] = 255
        if (distance >= 12) {
          data[i] = data[i + 1] = 128
          continue
        }
        const nx = corner ? qx / length : Number(qx > qy)
        const ny = corner ? qy / length : Number(qy >= qx)
        // The top and bottom shift text more strongly, blending into the sides at each corner.
        const bevel = Math.max(0, 1 - Math.max(0, distance) / (8 + 4 * ny))
        const strength = bevel * bevel * (3 - 2 * bevel) * channelScale
        data[i] = 128 - Math.sign(dx) * nx * 4 * strength
        data[i + 1] = 128 - Math.sign(dy) * ny * (4 + 3.5 * ny) * strength
      }
    }

    context.putImageData(image, 0, 0)
    map.setAttribute('href', canvas.toDataURL())
    dock.setAttribute('data-refracting', '')
  }).observe(dock, { box: 'border-box' })
}

const surface = document.querySelector<HTMLElement>('.site-dock')
if (surface) {
  setupReflection(surface)
  const map = document.querySelector<SVGFEImageElement>('#dock-refraction feImage')
  if (map) setupRefraction(surface, map)
}

const dock = document.querySelector<HTMLElement>('.dock-nav')
if (dock) setupDock(dock)

export {}
