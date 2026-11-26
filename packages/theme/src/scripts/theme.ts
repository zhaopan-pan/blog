function setupTheme() {
  const root = document.documentElement
  const storageKey = root.dataset.themeStorageKey!
  const systemDark = matchMedia('(prefers-color-scheme: dark)')
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const buttons = document.querySelectorAll<HTMLButtonElement>('.theme-button, .cabin-switch')
  const themeColors = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
  let switching = false
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches)

  function sync() {
    const dark = isDark()
    for (const button of buttons) button.setAttribute('aria-pressed', String(dark))
    for (const meta of themeColors) meta.content = dark ? '#171b18' : '#fcfcfb'
  }

  function change(dark: boolean) {
    const theme = dark ? 'dark' : 'light'
    root.dataset.theme = theme
    try {
      localStorage.setItem(storageKey, theme)
    } catch {
      /* The in-page preference still works. */
    }
    sync()
  }

  async function toggle(event: MouseEvent, control: HTMLElement) {
    if (switching) return
    const dark = !isDark()
    if (!document.startViewTransition || reducedMotion.matches) {
      change(dark)
      return
    }

    const bounds = control.getBoundingClientRect()
    const x = event.detail ? event.clientX : bounds.x + bounds.width / 2
    const y = event.detail ? event.clientY : bounds.y + bounds.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const small = `circle(0px at ${x}px ${y}px)`
    const large = `circle(${radius}px at ${x}px ${y}px)`

    switching = true
    root.dataset.themeTransition = dark ? 'dark' : 'light'
    if (!dark) {
      // The body snapshot uses document coordinates, unlike the root snapshot.
      root.style.setProperty('--reveal-center', `${x + scrollX}px ${y + scrollY}px`)
      root.style.setProperty('--reveal-radius', `${radius}px`)
    }
    const transition = document.startViewTransition(() => change(dark))
    try {
      await transition.ready
      if (dark) {
        await root.animate(
          { clipPath: [large, small] },
          {
            duration: 480,
            fill: 'both',
            easing: 'cubic-bezier(.22,.61,.36,1)',
            pseudoElement: '::view-transition-old(root)',
          },
        ).finished
      }
    } catch {
      transition.skipTransition()
    } finally {
      await transition.finished.catch(() => {})
      root.style.removeProperty('--reveal-center')
      root.style.removeProperty('--reveal-radius')
      delete root.dataset.themeTransition
      switching = false
    }
  }

  document.addEventListener('click', (event) => {
    const control =
      event.target instanceof Element &&
      event.target.closest<HTMLButtonElement>('.theme-button, .cabin-switch')
    if (control) void toggle(event, control)
  })
  systemDark.addEventListener('change', sync)
  const restore = () => {
    try {
      const theme = localStorage.getItem(storageKey)
      if (theme === 'dark' || theme === 'light') root.dataset.theme = theme
      else delete root.dataset.theme
    } catch {
      /* Keep the current in-page preference. */
    }
    sync()
  }
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) restore()
  })
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey || event.key === null) restore()
  })
  sync()
}

setupTheme()

export {}
