import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import theme from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated';
  padding?: keyof typeof theme.spacing | number;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...rest
}) => {
  // Determine o padding correto (usando o valor do tema ou um valor numérico direto)
  const paddingValue = typeof padding === 'string' 
    ? theme.spacing[padding] 
    : padding;

  return (
    <View
      style={[
        styles.card,
        variant === 'elevated' && styles.elevated,
        { padding: paddingValue },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.shape.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  elevated: {
    borderWidth: 0,
    ...theme.shape.shadows.small,
  },
}); 