import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TouchableOpacityProps,
  ActivityIndicator
} from 'react-native';
import theme from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  style,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? theme.colors.accent.primary : theme.colors.common.white} 
          size="small" 
        />
      ) : (
        <Text style={[
          styles.text,
          variant === 'outline' && styles.outlineText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: theme.spacing.md,
    borderRadius: theme.shape.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 120,
  },
  primary: {
    backgroundColor: theme.colors.accent.primary,
  },
  secondary: {
    backgroundColor: theme.colors.accent.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.accent.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    color: theme.colors.common.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500',
  },
  outlineText: {
    color: theme.colors.accent.primary,
  }
});