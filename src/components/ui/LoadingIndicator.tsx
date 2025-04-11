import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import theme from '@/constants/theme';

interface LoadingIndicatorProps {
  fullscreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  fullscreen = false,
  size = 'large',
  color = theme.colors.accent.primary,
  text,
}) => {
  if (fullscreen) {
    return (
      <View style={styles.fullscreen}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.primary,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  text: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
  },
}); 