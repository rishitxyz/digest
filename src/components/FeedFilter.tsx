import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Chip, Text, useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'

import { fontSize, shapes, spacing } from '../theme/theme'

export type FilterValue = 'all' | 'bookmarks'

interface FeedFilterProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
}

export default function FeedFilter({ value, onChange }: FeedFilterProps) {
  const theme = useTheme<MD3Theme>()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={{ gap: 10, marginBottom: spacing.md }}>
        <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: 600 }}>
          DAILY DIGEST
        </Text>
        <Text
          variant="headlineLarge"
          style={{ fontWeight: 700, color: theme.colors.onPrimaryContainer }}
        >
          Curated For You.
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', gap: 15 }}>
        {[
          {
            value: 'all',
            label: 'All',
            icon: 'format-list-bulleted',
            checkedColor: theme.colors.onPrimaryContainer,
            uncheckedColor: theme.colors.onSurfaceVariant,
          },
          {
            value: 'bookmarks',
            label: 'Bookmarks',
            icon: 'bookmark-outline',
            checkedColor: theme.colors.onPrimaryContainer,
            uncheckedColor: theme.colors.onSurfaceVariant,
          },
        ].map((button, index) => (
          <Chip
            key={index}
            mode={button.value === value ? 'flat' : 'outlined'}
            selected={button.value === value}
            compact
            style={{
              borderRadius: shapes.small,
              paddingHorizontal: spacing.md,
            }}
            onTouchEnd={() => onChange(button.value as FilterValue)}
          >
            {button.label}
          </Chip>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  buttons: {
    // RNP will handle styling internally
  },
})
