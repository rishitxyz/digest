import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, BottomNavigation, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';
import ArticleScreen from './src/screens/ArticleScreen';

// ── Font Imports ─────────────────────────────────────────────────────
import { 
  useFonts, 
  FiraSans_400Regular, 
  FiraSans_500Medium, 
  FiraSans_600SemiBold, 
  FiraSans_700Bold 
} from '@expo-google-fonts/fira-sans';

import { LightTheme, DarkTheme } from './src/theme/theme';
import FeedScreen from './src/screens/FeedScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Navigation
const Stack = createNativeStackNavigator<RootStackParamList>();

// ── Route definitions for Bottom Navigation ──────────────────────────
type RouteDef = {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon: string;
};

const routes: RouteDef[] = [
  {
    key: 'feeds',
    title: 'Feeds',
    focusedIcon: 'rss',
    unfocusedIcon: 'rss',
  },
  {
    key: 'favorites',
    title: 'Favorites',
    focusedIcon: 'heart',
    unfocusedIcon: 'heart-outline',
  },
  {
    key: 'settings',
    title: 'Settings',
    focusedIcon: 'cog',
    unfocusedIcon: 'cog-outline',
  },
];

// ── Main App wrapper (inside PaperProvider) ──────────────────────────
function AppContent({
  isDarkMode,
  onToggleDarkMode,
}: {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}) {
  const theme = useTheme<MD3Theme>();
  const [index, setIndex] = useState(0);

  const renderScene = useCallback(
    ({ route }: { route: RouteDef }) => {
      switch (route.key) {
        case 'feeds':
          return <FeedScreen />;
        case 'favorites':
          return <FavoritesScreen />;
        case 'settings':
          return (
            <SettingsScreen
              isDarkMode={isDarkMode}
              onToggleDarkMode={onToggleDarkMode}
            />
          );
        default:
          return null;
      }
    },
    [isDarkMode, onToggleDarkMode],
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
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
  );
}

// ── Root App ─────────────────────────────────────────────────────────
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Load the FiraSans fonts
  const [fontsLoaded, fontError] = useFonts({
    FiraSans_400Regular,
    FiraSans_500Medium,
    FiraSans_600SemiBold,
    FiraSans_700Bold,
  });

  // 2. Hide splash screen when fonts are ready
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const theme = useMemo(() => (isDarkMode ? DarkTheme : LightTheme), [isDarkMode]);

  // 3. Render nothing until fonts are loaded (splash screen remains)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // 4. Attach the onLayout callback to the outermost view
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen
              name="MainTabs"
              children={() => (
                <AppContent isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
              )}
            />
            <Stack.Screen name="ArticleDetail" component={ArticleScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});