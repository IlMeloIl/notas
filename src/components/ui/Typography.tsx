import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import theme from '@/constants/theme';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        align !== 'left' && { textAlign: align },
        color && { color },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  h1: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: '700',
    lineHeight: 38,
  },
  h2: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    lineHeight: 28,
  },
  h3: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '500',
    lineHeight: 24,
  },
  body: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '400',
    lineHeight: 22,
  },
  caption: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  button: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500',
    lineHeight: 20,
  },
}); 