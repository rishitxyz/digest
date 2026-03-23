import { StyleSheet, View } from 'react-native'

import { MD3Theme, Text, useTheme } from 'react-native-paper'

import { spacing } from '../../theme/theme'

export const EmptyState = ({ filter }: { filter: string }) => {
  const styles = makeStyles(useTheme())
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        No articles found
      </Text>
      <Text variant="bodyMedium" style={styles.bookmarksTitle}>
        {filter === 'bookmarks'
          ? 'No bookmark articles yet.'
          : 'Add new feeds by clicking on the plus button'}
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
      paddingTop: 120,
      paddingHorizontal: spacing.xl,
    },
    title: { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
    bookmarksTitle: {
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  })
