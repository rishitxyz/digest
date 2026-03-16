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
import ArticleScreen from './src/screens/ArticleScreen'

// ── Font Imports ─────────────────────────────────────────────────────
import {
  useFonts,
  FiraSans_400Regular,
  FiraSans_500Medium,
  FiraSans_600SemiBold,
  FiraSans_700Bold,
} from '@expo-google-fonts/fira-sans'

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'

// 1. Import the dynamic color hook and your new helper function
import { useMaterial3Theme } from 'react-native-material3-theme'
import { getAppTheme } from './src/theme/theme'

import FeedScreen from './src/screens/FeedScreen'
import SettingsScreen from './src/screens/SettingsScreen'
import { initializeDatabase } from './src/database/schema'
import SourcesListScreen from './src/screens/SourcesScreen'
import { fontOptions, fontOptionsType } from './src/theme/font'
import { storage, STORAGE_KEYS } from './src/database/mmkv'
import RedditPost from './src/screens/RedditPost'

initializeDatabase()

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Navigation
const Stack = createNativeStackNavigator<RootStackParamList>()

// ── Route definitions for Bottom Navigation ──────────────────────────
type RouteDef = {
  key: string
  title: string
  focusedIcon: string
  unfocusedIcon: string
}

const routes: RouteDef[] = [
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
    ({ route }: { route: RouteDef }) => {
      const isFocused = routes[index].key === route.key
      switch (route.key) {
        case 'feeds':
          return <FeedScreen isFocused={isFocused} />
        case 'sources':
          return <SourcesListScreen isFocused={isFocused} />
        case 'settings':
          return (
            <SettingsScreen
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    storage.getBoolean(STORAGE_KEYS.APP_DISPLAY_MODE) ?? false,
  )
  const [selectedFont, setSelectedFont] = useState<fontOptionsType>(
    (storage.getString(STORAGE_KEYS.APP_FONT) as fontOptionsType) ?? fontOptions.firaSans.value,
  )

  // 1. Load the FiraSans fonts
  const [fontsLoaded, fontError] = useFonts({
    // Fira Sans
    FiraSans_400Regular,
    FiraSans_500Medium,
    FiraSans_600SemiBold,
    FiraSans_700Bold,
    // Poppins
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  // 2. Fetch the dynamic device theme
  const { theme: systemM3Theme } = useMaterial3Theme()

  // 3. Hide splash screen when fonts are ready
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      storage.set(STORAGE_KEYS.APP_DISPLAY_MODE, !prev)
      return !prev
    })
  }, [])

  const changeFont = useCallback((font: fontOptionsType) => {
    setSelectedFont(font)
    storage.set(STORAGE_KEYS.APP_FONT, font)
  }, [])

  // 4. Pass the system theme straight into your helper function
  const theme = useMemo(() => {
    return getAppTheme(isDarkMode, selectedFont, systemM3Theme)
  }, [isDarkMode, selectedFont, systemM3Theme])

  // 5. Render nothing until fonts are loaded (splash screen remains)
  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    // 6. Attach the onLayout callback to the outermost view
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
