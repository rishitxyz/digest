import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { spacing } from '../theme/theme';

export type FilterValue = 'all' | 'unread' | 'favorites';

interface FeedFilterProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function FeedFilter({ value, onChange }: FeedFilterProps) {
  const theme = useTheme<MD3Theme>();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <SegmentedButtons
        value={value}
        onValueChange={(val) => onChange(val as FilterValue)}
        buttons={[
          {
            value: 'all',
            label: 'All',
            icon: 'format-list-bulleted',
            checkedColor: theme.colors.onPrimaryContainer,
            uncheckedColor: theme.colors.onSurfaceVariant,
          },
          {
            value: 'unread',
            label: 'Unread',
            icon: 'email-outline',
            checkedColor: theme.colors.onPrimaryContainer,
            uncheckedColor: theme.colors.onSurfaceVariant,
          },
          {
            value: 'favorites',
            label: 'Favorites',
            icon: 'heart-outline',
            checkedColor: theme.colors.onPrimaryContainer,
            uncheckedColor: theme.colors.onSurfaceVariant,
          },
        ]}
        style={styles.buttons}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buttons: {
    // RNP will handle styling internally
  },
});
