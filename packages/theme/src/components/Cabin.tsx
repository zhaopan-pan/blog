import { useId, useState, useSyncExternalStore } from 'react'
import { iconMarkup, type IconName } from './icons'
import type { themeCopy } from '../theme-copy.js'
import type { PostSummary } from '../types'

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className={`icon ${name}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: iconMarkup[name] }}
    />
  )
}

function subscribe(onChange: () => void) {
  window.addEventListener('site:theme', onChange)
  return () => window.removeEventListener('site:theme', onChange)
}

function isDark() {
  return (
    (document.documentElement.dataset.theme ??
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark'
  )
}

export default function Cabin({
  posts,
  copy,
}: {
  posts: readonly PostSummary[]
  copy: typeof themeCopy.cabin
}) {
  const skyId = useId()
  const pickId = useId()
  const dark = useSyncExternalStore(subscribe, isDark, () => false)
  const [index, setIndex] = useState(-1)
  const pick = posts[index]

  function draw() {
    const excludePrevious = index >= 0 && posts.length > 1
    const next = Math.floor(Math.random() * (posts.length - Number(excludePrevious)))
    setIndex(excludePrevious && next >= index ? next + 1 : next)
  }

  return (
    <section className="cabin" aria-label={copy.label}>
      <svg className="house-art" viewBox="0 0 288 174" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={skyId} x1="144" x2="144" y2="174" gradientUnits="userSpaceOnUse">
            <stop className="sky-top" />
            <stop className="sky-horizon" offset="1" />
          </linearGradient>
        </defs>
        <rect width="288" height="174" fill={`url(#${skyId})`} />
        <circle className="scene-sun" cx="216" cy="51" r="23" fill="#f0bb64" />
        <path
          className="scene-moon"
          d="M222 28a21 21 0 1 0 12 33 22 22 0 0 1-12-33Z"
          fill="#ffdf9c"
        />
        <path
          className="scene-stars"
          d="M44 33v8m-4-4h8m35 20v6m-3-3h6m165 19v8m-4-4h8m-98-49v6m-3-3h6m99 8v6m-3-3h6"
          stroke="#fde6ba"
          strokeLinecap="round"
        />
        <path className="far-hills" d="M0 119q55-53 101-13 20 20 50 17 52-27 85-18t52 25v44H0Z" />
        <path className="near-hill" d="M0 151q54-30 125-12 34 9 72 1t91 3v31H0Z" />
        <path
          className="scene-trail"
          d="M141 144c-6 12 28 13 20 20-3 3-15 7-27 10"
          strokeWidth="6"
        />
        <g className="scene-pines">
          <path d="m52 80-12 19h7l-12 14h10l-12 14h17v17h4v-17h17l-12-14h10L57 99h7Zm22 22-8 13h5l-9 12h10v13h3v-13h10l-8-12h5Zm165-12-11 16h6l-10 14h7l-12 15h17v11h4v-11h16l-11-15h7l-10-14h7Z" />
        </g>
        <g stroke="#975d47" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M161 82V67h8v24" fill="#a36e50" />
          <path d="M108 105l35-29 32 28v41h-67Z" fill="#dba873" />
          <path d="M99 107l43-39 44 39-7 3-37-32-37 32Z" fill="#a95e45" />
          <path d="M137 145v-26h14v26" fill="#875942" />
          <path d="M112 113h62m-62 24h25m14 0h23" fill="none" opacity=".35" />
          <rect className="scene-window" x="117" y="117" width="12" height="13" rx="2" />
          <rect className="scene-window" x="158" y="117" width="12" height="13" rx="2" />
          <path d="M123 117v13m41-13v13" opacity=".66" />
        </g>
        <path d="M22 151h9m33 7h9m149-5h11m-46 8h7" className="scene-marks" strokeLinecap="round" />
      </svg>
      <div className="cabin-controls">
        <button className="cabin-switch" type="button" aria-pressed={dark}>
          <Icon name="sun" />
          <Icon name="moon" />
          <span>{copy.toggleTheme}</span>
        </button>
        {posts.length > 0 && (
          <button className="cabin-draw" type="button" aria-controls={pickId} onClick={draw}>
            {copy.randomPost}
            <Icon name="arrow" />
          </button>
        )}
      </div>
      <ul className="cabin-pick" id={pickId} aria-live="polite">
        {pick && (
          <li key={pick.href}>
            <a href={pick.href}>{pick.title}</a>{' '}
            <time dateTime={pick.date}>{pick.date.slice(0, 4)}</time>
          </li>
        )}
      </ul>
    </section>
  )
}
