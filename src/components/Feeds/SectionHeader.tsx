import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, Icon, IconButton, MD3Theme, Text, useTheme } from 'react-native-paper'

import { FeedType } from '../../config/feed-source'
import { Source } from '../../database/schema/source'
import { RootStackParamList } from '../../navigation/types'
import { spacing } from '../../theme/theme'

interface SectionHeaderProps {
  title: string
  source: Source
}

export const SectionHeader = ({ title, source }: SectionHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const handleHeadingPress = useCallback(
    (source: Source) => {
      navigation.navigate('AllArticles', { source })
    },
    [navigation],
  )
  const styles = makeStyles(useTheme())

  return (
    <View style={styles.sectionHeader}>
      <Text variant="headlineSmall" style={styles.sectionTitle}>
        {source.type === FeedType.SUB_REDDIT ? source.url : title}
      </Text>
      <IconButton icon="arrow-right-circle" animated onPress={() => handleHeadingPress(source)} />
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    sectionHeader: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: { color: theme.colors.primary, fontWeight: 'bold' },
  })
