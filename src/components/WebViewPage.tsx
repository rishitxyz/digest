import { StyleProp, ViewStyle } from 'react-native'

import { WebView } from 'react-native-webview'

interface WebViewPageProps {
  link: string
  style: StyleProp<ViewStyle>
}

export const WebViewPage = ({ link, style }: WebViewPageProps) => {
  return <WebView source={{ uri: link }} style={style} />
}
