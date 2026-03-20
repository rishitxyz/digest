import React, { useState, useCallback, useMemo } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { PaperProvider, BottomNavigation, useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from './src/navigation/types'
import ArticleScreen from './src/screens/Article'

import { Route, routes } from './src/routes'
import { getAppTheme } from './src/theme/theme'

import FeedScreen from './src/screens/Feeds'
import Settings from './src/screens/Settings'
import { initializeDatabase } from './src/database/schema'
import SourcesList from './src/screens/Sources'
import RedditPost from './src/screens/RedditPost'
import AllArticles from './src/screens/AllArticles'
import { fontOptionsType, useAppFonts } from './src/hooks/useAppFonts'
import { useAppTheme } from './src/hooks/useAppTheme'

initializeDatabase()

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Navigation
const Stack = createNativeStackNavigator<RootStackParamList>()

// ── Main App wrapper (inside PaperProvider) ──────────────────────────
function AppContent({
  isDarkMode,
  onToggleDarkMode,
  currentFont,
  onChangeFont,
}: {
  isDarkMode: boolean
  onToggleDarkMode: () => void
  currentFont: string
  onChangeFont: (font: fontOptionsType) => void
}) {
  const theme = useTheme<MD3Theme>()
  const [index, setIndex] = useState(0)

  const renderScene = useCallback(
    ({ route }: { route: Route }) => {
      const isFocused = routes[index].key === route.key
      switch (route.key) {
        case 'feeds':
          return <FeedScreen isFocused={isFocused} />
        case 'sources':
          return <SourcesList isFocused={isFocused} />
        case 'settings':
          return (
            <Settings
              isFocused={isFocused}
              isDarkMode={isDarkMode}
              onToggleDarkMode={onToggleDarkMode}
              currentFont={currentFont}
              onChangeFont={onChangeFont}
              onGoToFeeds={() => setIndex(0)}
            />
          )
        default:
          return null
      }
    },
    [isDarkMode, onToggleDarkMode, currentFont, onChangeFont, index],
  )

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={[]}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{
          backgroundColor: theme.colors.elevation.level2,
        }}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.onSurfaceVariant}
        activeIndicatorStyle={{
          backgroundColor: theme.colors.secondaryContainer,
          borderRadius: 9999,
        }}
        theme={theme}
      />
    </SafeAreaView>
  )
}

// ── Root App ─────────────────────────────────────────────────────────
export default function App() {
  const { isDarkMode, toggleDarkMode, systemM3Theme } = useAppTheme()
  const { selectedFont, fontsLoaded, fontError, changeFont } = useAppFonts()

  // Hide splash screen when fonts are ready
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  // Pass the system theme straight into your helper function
  const theme = useMemo(() => {
    return getAppTheme(isDarkMode, selectedFont, systemM3Theme)
  }, [isDarkMode, selectedFont, systemM3Theme])

  // Render nothing until fonts are loaded (splash screen remains)
  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    // Attach the onLayout callback to the outermost view
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs">
              {() => (
                <AppContent
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={toggleDarkMode}
                  currentFont={selectedFont}
                  onChangeFont={changeFont}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="ArticleDetail" component={ArticleScreen} />
            <Stack.Screen name="RedditPost" component={RedditPost} />
            <Stack.Screen name="AllArticles" component={AllArticles} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
