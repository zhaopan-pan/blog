declare module 'virtual:cabin/config' {
  const config: Omit<import('./types').CabinOptions, 'home'> & {
    contentRoot: string
    language: string
    search: boolean
    home: Required<
      Pick<
        NonNullable<import('./types').CabinOptions['home']>,
        'title' | 'tagline' | 'intro' | 'recentCount'
      >
    > &
      NonNullable<import('./types').CabinOptions['home']>
  }
  export default config
}
