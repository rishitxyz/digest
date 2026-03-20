export type Route = {
  key: string
  title: string
  focusedIcon: string
  unfocusedIcon: string
}

export const routes: Route[] = [
  {
    key: 'feeds',
    title: 'Feeds',
    focusedIcon: 'rss',
    unfocusedIcon: 'rss',
  },
  {
    key: 'sources',
    title: 'Sources',
    focusedIcon: 'list-box',
    unfocusedIcon: 'list-box-outline',
  },
  {
    key: 'settings',
    title: 'Settings',
    focusedIcon: 'cog',
    unfocusedIcon: 'cog-outline',
  },
]
