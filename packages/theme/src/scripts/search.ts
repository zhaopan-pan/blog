const trigger = document.querySelector<HTMLButtonElement>('.search-trigger')
const status = document.querySelector<HTMLElement>('.search-status')!
const modal = document.querySelector<HTMLElement & { open(): void }>('pagefind-modal')!
const bundle = '/pagefind/pagefind-component-ui'
let assets: Promise<unknown> | undefined

function loadSearch() {
  const stylesheet = document.createElement('link')
  stylesheet.rel = 'stylesheet'
  stylesheet.href = `${bundle}.css`
  const { promise: styled, resolve, reject } = Promise.withResolvers<void>()
  stylesheet.onload = () => resolve()
  stylesheet.onerror = () => reject(new Error('Pagefind stylesheet could not be loaded'))
  document.head.append(stylesheet)
  const moduleUrl = `${bundle}.js`
  return Promise.all([styled, import(/* @vite-ignore */ moduleUrl)]).catch((error) => {
    stylesheet.remove()
    assets = undefined
    throw error
  })
}

async function openSearch() {
  if (import.meta.env.DEV) {
    status.textContent = status.dataset.preview!
    return
  }
  status.textContent = status.dataset.loading!
  try {
    await (assets ??= loadSearch())
    status.textContent = ''
    modal.open()
  } catch (error) {
    status.textContent = status.dataset.error!
    console.error(error)
  }
}

if (trigger) {
  trigger.addEventListener('click', openSearch)
  document.addEventListener('keydown', (event) => {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.repeat ||
      event.altKey ||
      event.shiftKey ||
      (!event.ctrlKey && !event.metaKey) ||
      event.key.toLowerCase() !== 'k' ||
      (event.target instanceof Element &&
        event.target.closest('input, textarea, [contenteditable]:not([contenteditable="false"])'))
    )
      return
    event.preventDefault()
    void openSearch()
  })
}
