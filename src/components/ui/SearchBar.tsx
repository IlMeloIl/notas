import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  TextInputProps, 
  Animated, 
  Keyboard 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '@/constants/theme';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  containerStyle?: object;
  inputStyle?: object;
  iconColor?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Buscar...',
  containerStyle,
  inputStyle,
  iconColor = theme.colors.text.secondary,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  // Animação para o foco
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };
  
  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };
  
  const handleSearchIconPress = () => {
    inputRef.current?.focus();
  };
  
  const handleSubmitEditing = () => {
    Keyboard.dismiss();
  };
  
  // Interpolate animation values
  const iconColor_interpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [iconColor, theme.colors.accent.primary],
  });
  
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity onPress={handleSearchIconPress} style={styles.searchIcon}>
        <Animated.View>
          <Feather
            name="search"
            size={20}
            color={value || isFocused ? theme.colors.accent.primary : iconColor}
          />
        </Animated.View>
      </TouchableOpacity>
      
      <TextInput
        ref={inputRef}
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmitEditing}
        returnKeyType="search"
        autoCapitalize="none"
        clearButtonMode="never"
        {...rest}
      />
      
      {!!value && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Feather name="x" size={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.shape.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  searchIcon: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    paddingVertical: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    height: '100%',
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
}); 