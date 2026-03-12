import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { shapes, spacing } from '../theme/theme';

interface AnimatedFABProps {
  animValue: Animated.Value; // 0 = expanded, 1 = collapsed
  onPress: () => void;
  label?: string;
  icon?: string;
}

export default function AnimatedFAB({
  animValue,
  onPress,
  label = 'Add Feed',
  icon = 'plus',
}: AnimatedFABProps) {
  const theme = useTheme<MD3Theme>();

  const scale = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale }],
          backgroundColor: theme.colors.tertiaryContainer,
          borderRadius: shapes.full,
          shadowColor: theme.colors.shadow,
        },
      ]}
    >
      <Animated.View style={styles.touchable} onTouchEnd={onPress}>
        <View style={styles.innerRow}>
          <MaterialCommunityIcons
            name={icon as any}
            size={24}
            color={theme.colors.onTertiaryContainer}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 100,
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontWeight: '600',
  },
});
