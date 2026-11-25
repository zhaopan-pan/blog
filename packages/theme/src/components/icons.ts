export const iconMarkup = {
  house: '<path d="M3 10.8 12 3l9 7.8M5.5 9v11h13V9M10 20v-6h4v6"/>',
  github:
    '<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5v-3.3a3 3 0 0 0-.8-2.3c2.7-.3 5.6-1.3 5.6-6a4.7 4.7 0 0 0-1.2-3.2 4.4 4.4 0 0 0-.1-3.2S17.5 3 15 4.5a12.5 12.5 0 0 0-6 0C6.5 3 5.5 3.3 5.5 3.3a4.4 4.4 0 0 0-.1 3.2A4.7 4.7 0 0 0 4.2 9.7c0 4.7 2.9 5.7 5.6 6a3 3 0 0 0-.8 2.3v3.3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  moon: '<path d="M20.9 13.2A9 9 0 0 1 10.8 3.1 9 9 0 1 0 20.9 13.2Z"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  outline: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
} as const

export type IconName = keyof typeof iconMarkup
