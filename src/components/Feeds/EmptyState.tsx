import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Button, MD3Theme, Text, useTheme } from 'react-native-paper'
import Svg, { Circle, Path, Rect } from 'react-native-svg'

import { spacing } from '../../theme/theme'

// ── Custom M3 Illustrations ──────────────────────────────────────────

const BookmarkIllustration = ({ theme }: { theme: MD3Theme }) => {
  const styles = makeStyles(theme)
  return (
    <Svg width="160" height="160" viewBox="0 0 160 160" fill="none" style={styles.illustration}>
      {/* Soft background blob */}
      <Circle cx="80" cy="80" r="64" fill={theme.colors.surfaceVariant} />
      {/* Accent element */}
      <Circle cx="120" cy="40" r="12" fill={theme.colors.secondaryContainer} />
      {/* Main Bookmark Shape */}
      <Path
        d="M56 40C56 35.5817 59.5817 32 64 32H96C100.418 32 104 35.5817 104 40V124.382C104 128.875 98.5447 131.088 95.4055 127.859L82.8711 114.97C81.2926 113.346 78.7074 113.346 77.1289 114.97L64.5945 127.859C61.4553 131.088 56 128.875 56 124.382V40Z"
        fill={theme.colors.primary}
      />
      {/* Inner detail line */}
      <Path d="M72 56H88" stroke={theme.colors.onPrimary} strokeWidth="6" strokeLinecap="round" />
    </Svg>
  )
}

const AddSourceIllustration = ({ theme }: { theme: MD3Theme }) => {
  const styles = makeStyles(theme)
  return (
    <Svg width="160" height="160" viewBox="0 0 160 160" fill="none" style={styles.illustration}>
      {/* Soft background blob */}
      <Circle cx="80" cy="80" r="64" fill={theme.colors.primaryContainer} />
      {/* Dashed outer accent ring */}
      <Circle
        cx="80"
        cy="80"
        r="74"
        stroke={theme.colors.outlineVariant}
        strokeWidth="2"
        strokeDasharray="8 8"
      />
      {/* Document/Card Outline */}
      <Rect
        x="50"
        y="36"
        width="60"
        height="88"
        rx="12"
        stroke={theme.colors.primary}
        strokeWidth="8"
        fill={theme.colors.surface}
      />
      {/* Plus Icon inside the document */}
      <Path
        d="M80 60V100M60 80H100"
        stroke={theme.colors.primary}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </Svg>
  )
}

// ── Main Component ───────────────────────────────────────────────────

export const EmptyState = ({
  filter,
  openLibrary,
}: {
  filter: string
  openLibrary: () => void
}) => {
  const theme = useTheme<MD3Theme>()
  const styles = makeStyles(theme)

  return (
    <View style={styles.container}>
      {/* 1. Conditionally render the correct illustration */}
      {filter === 'bookmarks' ? (
        <BookmarkIllustration theme={theme} />
      ) : (
        <AddSourceIllustration theme={theme} />
      )}

      {/* 2. Text and Actions */}
      {filter === 'bookmarks' ? (
        <Text variant="headlineSmall" style={styles.title}>
          No articles found
        </Text>
      ) : (
        <Button
          mode="contained"
          icon="book-open-page-variant"
          style={{ padding: spacing.xs, borderRadius: spacing.lg }}
          onTouchEnd={openLibrary}
          // Ensure your onPress is hooked up here to actually trigger the modal!
        >
          Go to library
        </Button>
      )}

      <Text variant="bodyMedium" style={styles.bookmarksTitle}>
        {filter === 'bookmarks'
          ? 'No bookmark articles yet.'
          : 'Your feed is looking a little empty. Add a source to get started!'}
      </Text>
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
      paddingHorizontal: spacing.xl,
    },
    illustration: {
      marginBottom: spacing.xl, // Gives the SVG breathing room above the text/button
    },
    title: {
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    bookmarksTitle: {
      color: theme.colors.outline, // Using outline color makes the subtitle slightly softer than the title
      textAlign: 'center',
      marginTop: spacing.md,
      lineHeight: 22,
    },
  })
