import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  TouchableOpacityProps, 
  ViewStyle 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '@/constants/theme';

export type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps extends TouchableOpacityProps {
  name: string;
  size?: IconButtonSize;
  color?: string;
  variant?: 'ghost' | 'solid';
  containerStyle?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 'medium',
  color = theme.colors.text.primary,
  variant = 'ghost',
  containerStyle,
  disabled,
  ...rest
}) => {
  
  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };
  
  const containerSizes = {
    small: 32,
    medium: 40,
    large: 48,
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          width: containerSizes[size], 
          height: containerSizes[size],
        },
        variant === 'solid' && styles.solid,
        disabled && styles.disabled,
        containerStyle,
      ]}
      disabled={disabled}
      {...rest}
    >
      <Feather 
        name={name as any} 
        size={iconSizes[size]} 
        color={disabled ? theme.colors.text.disabled : color} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius.full,
  },
  solid: {
    backgroundColor: theme.colors.background.tertiary,
  },
  disabled: {
    opacity: 0.5,
  },
}); 