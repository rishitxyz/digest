import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Appbar,
  List,
  Switch,
  Divider,
  useTheme,
} from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { spacing } from '../theme/theme';

interface SettingsScreenProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsScreen({
  isDarkMode,
  onToggleDarkMode,
}: SettingsScreenProps) {
  const theme = useTheme<MD3Theme>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header
        elevated
        style={{ backgroundColor: theme.colors.surface }}
      >
        <Appbar.Content
          title="Settings"
          titleStyle={{
            fontWeight: '700',
            fontSize: 24,
            color: theme.colors.onSurface,
          }}
        />
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <List.Section>
          <List.Subheader
            style={{ color: theme.colors.primary, fontWeight: '600' }}
          >
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
          <List.Subheader
            style={{ color: theme.colors.primary, fontWeight: '600' }}
          >
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
        </List.Section>

        {/* About */}
        <List.Section>
          <List.Subheader
            style={{ color: theme.colors.primary, fontWeight: '600' }}
          >
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
