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

const dock = document.querySelector<HTMLElement>('.dock-nav')
if (dock) setupDock(dock)

export {}
