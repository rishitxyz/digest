import { useState } from 'react'

import * as WebBrowser from 'expo-web-browser'

import { useTheme } from 'react-native-paper'

type ViewMode = 'reader' | 'link' | 'original'
interface useViewsProps {
  defaultView?: ViewMode
  onOpenReader?: () => void
  onOpenInBrowser?: () => void
  onOpenWebView?: () => void
  browserLink?: string
}

export const useViews = ({
  defaultView = 'reader',
  onOpenReader,
  onOpenInBrowser,
  onOpenWebView,
  browserLink,
}: useViewsProps) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView)
  const theme = useTheme()

  const handleOpenReader =
    onOpenReader ??
    function () {
      setViewMode('reader')
    }

  const handleOpenInBrowser =
    onOpenInBrowser ??
    async function () {
      if (browserLink) {
        try {
          await WebBrowser.openBrowserAsync(browserLink, {
            toolbarColor: theme.colors.surface,
            controlsColor: theme.colors.primary,

            // Optional iOS presentation style (MODAL makes it slide up nicely)
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
          })
        } catch (error) {
          console.error("Couldn't open browser:", error)
        }
      }
    }

  const handleOpenWebView =
    onOpenWebView ??
    function () {
      setViewMode('link')
    }

  const viewModeOptions: {
    key: ViewMode
    title: string
    onPress: () => void
    disabled: boolean
  }[] = [
    {
      key: 'reader',
      title: 'Reader',
      onPress: handleOpenReader,
      disabled: viewMode === 'reader',
    },
    {
      key: 'original',
      title: 'Open in browser',
      onPress: handleOpenInBrowser,
      disabled: viewMode === 'original',
    },
    {
      key: 'link',
      title: 'WebView',
      onPress: handleOpenWebView,
      disabled: viewMode === 'link',
    },
  ]

  return { openMenu, setOpenMenu, viewMode, setViewMode, viewModeOptions }
}
