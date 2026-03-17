import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text, Appbar, useTheme, Card, IconButton } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'
import { spacing, shapes, fontSize } from '../theme/theme'

export default function BookmarksScreen() {
  const theme = useTheme<MD3Theme>()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content
          title="Bookmarks"
          titleStyle={{
            fontWeight: '700',
            fontSize: fontSize.headlineSmall,
            color: theme.colors.onSurface,
          }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Placeholder state */}
        <Card
          style={[
            styles.placeholderCard,
            {
              backgroundColor: theme.colors.tertiaryContainer,
              borderRadius: shapes.extraLarge,
            },
          ]}
        >
          <Card.Content style={styles.placeholderContent}>
            <IconButton
              icon="heart"
              iconColor={theme.colors.onTertiaryContainer}
              size={48}
              style={{ margin: 0 }}
            />
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.onTertiaryContainer, marginTop: spacing.md }}
            >
              Your Bookmarks
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onTertiaryContainer,
                textAlign: 'center',
                marginTop: spacing.sm,
                opacity: 0.8,
              }}
            >
              Articles you love will appear here. Tap the heart icon on any article to save it.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderCard: {
    width: '100%',
    paddingVertical: spacing.xxl,
  },
  placeholderContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
})
