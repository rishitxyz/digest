import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Appbar, Button, Divider, List, Menu, Switch, Text, useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'

import { fontOptions, fontOptionsType } from '../hooks/useAppFonts'
import { fontSize } from '../theme/theme'
import { clearAllDeviceData, exportDb } from '../utils/user-data'

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
          <List.Subheader>
            <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
              APPEARANCE
            </Text>
          </List.Subheader>

          <List.Item
            title={() => <Text variant="bodyLarge">Dark Mode</Text>}
            description={() => <Text variant="bodyMedium">Use dark theme throughout the app.</Text>}
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
          />

          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
        </List.Section>

        {/* Feed Settings */}
        <List.Section>
          <List.Subheader>
            <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
              FEEDS
            </Text>
          </List.Subheader>

          <List.Item
            title={() => <Text variant="bodyLarge">Change display font</Text>}
            description={() => <Text variant="bodyMedium">Font for app display</Text>}
            left={(props) => (
              <List.Icon {...props} icon="format-font" color={theme.colors.secondary} />
            )}
            right={() => (
              <Menu
                visible={openFontMenu}
                onDismiss={() => setOpenFontMenu(false)}
                anchor={
                  <Button onPress={() => setOpenFontMenu(true)}>{currentFont.toLowerCase()}</Button>
                }
              >
                {Object.values(fontOptions).map(({ displayName, value }, index) => (
                  <Menu.Item
                    key={index}
                    title={displayName}
                    onPress={() => {
                      onChangeFont(value as fontOptionsType)
                      setOpenFontMenu(false)
                    }}
                    titleStyle={{ textTransform: 'lowercase' }}
                  />
                ))}
              </Menu>
            )}
          />

          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

          <List.Item
            title={() => <Text variant="bodyLarge">Export user data</Text>}
            description={() => <Text variant="bodyMedium">Export local SQLite db file</Text>}
            left={(props) => <List.Icon {...props} icon="export" color={theme.colors.secondary} />}
            right={() => <List.Icon icon="download-outline" color={theme.colors.primary} />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            onTouchEnd={exportDb}
          />
          <List.Item
            title={() => <Text variant="bodyLarge">Delete user data</Text>}
            description={() => <Text variant="bodyMedium">Delete all articles & sources</Text>}
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
          <List.Subheader>
            <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
              ABOUT
            </Text>
          </List.Subheader>

          <List.Item
            title={() => <Text variant="bodyLarge">Version</Text>}
            description={() => <Text variant="bodyMedium">1.0.0</Text>}
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
