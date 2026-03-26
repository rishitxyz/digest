import * as React from 'react'
import { StyleSheet } from 'react-native'

import { Avatar, Card, useTheme } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

import { Source } from '../../database/schema/source'
import { deleteById } from '../../services/db/source'
import { fontSize, shapes, spacing } from '../../theme/theme'

interface SourceCardProps {
  source: Source
  icon: IconSource
  editing: boolean
  onDeleteSource: () => void
}

export const SourceCard = ({ source, icon, editing = false, onDeleteSource }: SourceCardProps) => {
  const theme = useTheme()

  const handleDeleteSource = (id: string) => {
    deleteById(id)
    onDeleteSource()
  }

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
    >
      <Card.Title
        title={source.name}
        subtitle={source.url.replace('https://', '')}
        // 2. Pass an Avatar component to the 'left' prop
        left={(props) => (
          <Avatar.Icon
            {...props}
            size={48}
            icon={!editing ? icon : 'minus-thick'}
            style={{
              borderRadius: shapes.large,
              backgroundColor: !editing ? theme.colors.primary : theme.colors.error,
            }}
            onTouchEnd={() => handleDeleteSource(source.id)}
          />
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
