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
    focusedIcon: 'rss',
    unfocusedIcon: 'rss',
  },
  {
    key: 'sources',
    title: 'SOURCES',
    focusedIcon: 'list-box',
    unfocusedIcon: 'list-box-outline',
  },
  {
    key: 'settings',
    title: 'SETTINGS',
    focusedIcon: 'cog',
    unfocusedIcon: 'cog-outline',
  },
]
