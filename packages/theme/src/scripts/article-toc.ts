function setupToc(toc: HTMLDetailsElement) {
  const header = toc.closest<HTMLElement>('.site-head')
  const summary = toc.querySelector('summary')
  const list = toc.querySelector('nav')
  const dock = header?.querySelector('.dock-nav')
  const opener = header?.querySelector<HTMLButtonElement>('.toc-open')
  const search = header?.querySelector('.dock-search')
  const ring = toc.querySelector<SVGCircleElement>('.toc-progress circle:last-child')
  const article =
    document.querySelector('main .article, main .page') ?? document.querySelector('main')
  if (!header || !summary || !list || !dock || !opener || !ring || !article) return
  const sections: { heading: HTMLElement; link: HTMLAnchorElement }[] = []
  for (const link of list.querySelectorAll('a')) {
    const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)))
    if (heading) sections.push({ heading, link })
  }
  const firstHeading = sections[0]?.heading
  const scrolling = document.scrollingElement ?? document.documentElement
  let current: HTMLAnchorElement | undefined
  let frame: number | undefined
  let openedFromDock = false

  const setReading = (value: boolean) => {
    if (value === header.hasAttribute('data-reading')) return
    const focused = document.activeElement
    header.toggleAttribute('data-reading', value)
    if (value && (focused === opener || dock.contains(focused) || search?.contains(focused))) {
      summary.focus({ preventScroll: true })
    }
    if (!value && toc.contains(focused)) opener.focus({ preventScroll: true })
  }

  const revealCurrent = () => {
    if (!current || !toc.open) return
    const bounds = list.getBoundingClientRect()
    const item = current.getBoundingClientRect()
    if (item.top < bounds.top) list.scrollTop += item.top - bounds.top
    else if (item.bottom > bounds.bottom) list.scrollTop += item.bottom - bounds.bottom
  }

  const update = () => {
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
    const articleBottom = article.getBoundingClientRect().bottom
    const reading = scrollY > 250 && articleBottom > innerHeight + 80
    setReading(reading || openedFromDock)
    if (!reading && !openedFromDock) toc.open = false

    const distance = Math.max(1, scrollY + articleBottom - innerHeight)
    ring.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, scrollY / distance)))
    let low = 0
    let high = sections.length
    // Match native fragment scrolling, including the heading's scroll margin and rounding.
    const padding = parseFloat(getComputedStyle(scrolling).scrollPaddingTop) || 0
    const margin = firstHeading ? parseFloat(getComputedStyle(firstHeading).scrollMarginTop) : 0
    const marker = padding + margin + 2
    while (low < high) {
      const mid = (low + high) >>> 1
      if (sections[mid]!.heading.getBoundingClientRect().top <= marker) low = mid + 1
      else high = mid
    }
    // Near the end, native fragment scrolling can stop before a heading reaches the marker.
    const fragment = location.hash
    const clamped =
      fragment && scrolling.scrollHeight - scrolling.clientHeight - scrollY <= 1
        ? sections.find(
            ({ heading, link }) =>
              link.hash === fragment && heading.getBoundingClientRect().top > marker,
          )
        : undefined
    const next = clamped?.link ?? sections[low - 1]?.link
    if (next !== current) {
      current?.removeAttribute('aria-current')
      next?.setAttribute('aria-current', 'location')
      current = next
      revealCurrent()
    }
  }

  const schedule = () => {
    if (frame === undefined) frame = requestAnimationFrame(update)
  }
  const close = (restoreFocus = false) => {
    if (restoreFocus) summary.focus({ preventScroll: true })
    toc.open = false
    openedFromDock = false
    update()
  }

  opener.addEventListener('click', () => {
    openedFromDock = true
    toc.open = true
    update()
    summary.focus({ preventScroll: true })
  })
  toc.addEventListener('toggle', () => {
    if (!toc.open && openedFromDock) close(toc.contains(document.activeElement))
    else if (toc.open) revealCurrent()
  })
  for (const { heading, link } of sections) {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      heading.tabIndex = -1
      heading.focus({ preventScroll: true })
      close()
    })
  }
  list.addEventListener('keydown', (event) => {
    const { key } = event
    if (key !== 'ArrowUp' && key !== 'ArrowDown' && key !== 'Home' && key !== 'End') return
    const i = sections.findIndex(({ link }) => event.target === link)
    if (i < 0) return
    event.preventDefault()
    const next =
      key === 'Home'
        ? 0
        : key === 'End'
          ? sections.length - 1
          : Math.max(0, Math.min(sections.length - 1, i + (key === 'ArrowDown' ? 1 : -1)))
    sections[next]?.link.focus()
  })
  document.addEventListener('click', (event) => {
    if (toc.open && event.target instanceof Node && !header.contains(event.target))
      close(toc.contains(document.activeElement))
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toc.open && !event.defaultPrevented) {
      event.preventDefault()
      close(toc.contains(document.activeElement))
    }
  })
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  window.addEventListener('hashchange', schedule)
  window.addEventListener('pageshow', schedule)
  new ResizeObserver(schedule).observe(article)
  opener.hidden = false
  update()
  header.dataset.ready = ''
}

const toc = document.querySelector<HTMLDetailsElement>('.site-head .toc')
if (toc) setupToc(toc)

export {}
