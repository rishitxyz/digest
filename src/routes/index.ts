export type Route = {
  key: string
  title: string
  focusedIcon: string
  unfocusedIcon: string
}

export const routes: Route[] = [
  {
    key: 'feeds',
    title: 'FEEDS',
    focusedIcon: 'compass',
    unfocusedIcon: 'compass-outline',
  },
  {
    key: 'library',
    title: 'LIBRARY',
    focusedIcon: 'book-open-page-variant',
    unfocusedIcon: 'book-open-page-variant-outline',
  },
  {
    key: 'settings',
    title: 'SETTINGS',
    focusedIcon: 'cog',
    unfocusedIcon: 'cog-outline',
  },
]
