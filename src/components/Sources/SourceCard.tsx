import * as React from 'react'
import { StyleSheet } from 'react-native'

import { Avatar, Card, useTheme } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

import { Source } from '../../database/schema/source'
import { fontSize, shapes, spacing } from '../../theme/theme'

interface SourceCardProps {
  source: Source
  icon: IconSource
  onPress: (source: Source) => void
}

export const SourceCard = ({ source, icon, onPress }: SourceCardProps) => {
  const theme = useTheme()

  return (
    <Card
      // 1. 'contained' removes the drop shadow and applies the flat surfaceVariant color
      mode="contained"
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceVariant, // The soft off-white background
        },
      ]}
      onPress={() => onPress(source)}
    >
      <Card.Title
        title={source.name}
        subtitle={source.url.replace('https://', '')}
        // 2. Pass an Avatar component to the 'left' prop
        left={(props) => (
          <Avatar.Icon {...props} size={48} icon={icon} style={{ borderRadius: shapes.large }} />
        )}
        titleStyle={[
          styles.title,
          {
            color: theme.colors.onSurface,
          },
        ]}
        subtitleStyle={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        leftStyle={styles.leftStyle}
        subtitleNumberOfLines={1}
      />
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    overflow: 'hidden', // Ensures the ripple effect stays inside the rounded corners
    borderRadius: shapes.extraLarge,
  },
  title: {
    fontSize: fontSize.titleLarge,
    paddingHorizontal: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  leftStyle: {
    marginRight: spacing.md, // Gives the text breathing room from the avatar
  },
})
