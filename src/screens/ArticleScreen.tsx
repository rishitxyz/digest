// src/screens/ArticleDetailScreen.tsx
import React from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import { Text, Appbar, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { spacing, shapes } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>;

export default function ArticleDetailScreen({ route, navigation }: Props) {
  const { article } = route.params;
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* M3 App Bar with a back button */}
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={article.source || "Article"} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant='labelSmall'>{article.timestamp}</Text>
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, marginBottom: spacing.md }}>
          {article.title}
        </Text>
    
        <Image source={{uri: article.image}} style={styles.image} resizeMode='cover'/>
        
        
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.md }}>
          {article.description}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  image: {
    width: '100%',
    height: 200,
    borderRadius: shapes.large
  },
});