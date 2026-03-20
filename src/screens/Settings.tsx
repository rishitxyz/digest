import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Appbar, List, Switch, Divider, Menu, useTheme, Button } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'
import { clearAllDeviceData, exportDb } from '../utils/user-data'
import { fontOptions, fontOptionsType } from '../hooks/useAppFonts'
import { fontSize } from '../theme/theme'

interface SettingsProps {
  isFocused: boolean
  isDarkMode: boolean
  onToggleDarkMode: () => void
  currentFont: string
  onChangeFont: (font: fontOptionsType) => void
  onGoToFeeds: () => void
}

export default function Settings({
  isDarkMode,
  onToggleDarkMode,
  currentFont,
  onChangeFont,
  onGoToFeeds,
}: SettingsProps) {
  const [openFontMenu, setOpenFontMenu] = useState<boolean>(false)
  const theme = useTheme<MD3Theme>()

  const handleDeleteUserData = () => {
    clearAllDeviceData()
    onGoToFeeds()
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content
          title="Settings"
          titleStyle={{
            fontWeight: '700',
            fontSize: fontSize.headlineSmall,
            color: theme.colors.onSurface,
          }}
        />
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary, fontWeight: '600' }}>
            Appearance
          </List.Subheader>

          <List.Item
            title="Dark Mode"
            description="Use dark theme throughout the app"
            left={(props) => (
              <List.Icon {...props} icon="weather-night" color={theme.colors.primary} />
            )}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={onToggleDarkMode}
                color={theme.colors.primary}
              />
            )}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />

          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
        </List.Section>

        {/* Feed Settings */}
        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary, fontWeight: '600' }}>
            Feed Settings
          </List.Subheader>

          <List.Item
            title="Auto-refresh"
            description="Update feeds every 30 minutes"
            left={(props) => (
              <List.Icon {...props} icon="refresh-auto" color={theme.colors.secondary} />
            )}
            right={() => <Switch value={true} color={theme.colors.primary} />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />

          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

          <List.Item
            title="Show Images"
            description="Display article preview images"
            left={(props) => (
              <List.Icon {...props} icon="image-outline" color={theme.colors.secondary} />
            )}
            right={() => <Switch value={true} color={theme.colors.primary} />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

          <List.Item
            title="Change display font"
            description="Font for app display"
            left={(props) => (
              <List.Icon {...props} icon="format-font" color={theme.colors.secondary} />
            )}
            right={() => (
              <Menu
                visible={openFontMenu}
                onDismiss={() => setOpenFontMenu(false)}
                anchor={<Button onPress={() => setOpenFontMenu(true)}>{currentFont}</Button>}
              >
                {Object.values(fontOptions).map(({ displayName, value }, index) => (
                  <Menu.Item
                    key={index}
                    title={displayName}
                    onPress={() => {
                      onChangeFont(value as fontOptionsType)
                      setOpenFontMenu(false)
                    }}
                  />
                ))}
              </Menu>
            )}
          />

          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

          <List.Item
            title="Export user data"
            description="Export local SQLite db file"
            left={(props) => <List.Icon {...props} icon="export" color={theme.colors.secondary} />}
            right={() => <List.Icon icon="download-outline" color={theme.colors.primary} />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            onTouchEnd={exportDb}
          />
          <List.Item
            title="Delete user data"
            description="Delete all articles & sources"
            left={(props) => (
              <List.Icon {...props} icon="alert-circle-outline" color={theme.colors.secondary} />
            )}
            right={() => <List.Icon icon="delete-outline" color={theme.colors.primary} />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            onTouchEnd={handleDeleteUserData}
          />

          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
        </List.Section>

        {/* About */}
        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary, fontWeight: '600' }}>
            About
          </List.Subheader>

          <List.Item
            title="Version"
            description="1.0.0 — Built with Expo & M3 Expressive"
            left={(props) => (
              <List.Icon {...props} icon="information-outline" color={theme.colors.tertiary} />
            )}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </List.Section>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
