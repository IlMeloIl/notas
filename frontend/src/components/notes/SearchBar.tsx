import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard, 
  ActivityIndicator,
  Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNotes } from '@/hooks/useNotes';
import theme from '@/constants/theme';

interface SearchBarProps {
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ autoFocus = false }) => {
  const { searchQuery, setSearchQuery, loading } = useNotes();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const inputRef = useRef<TextInput>(null);
  const animatedWidth = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, animatedWidth]);

  const handleChangeText = (text: string) => {
    setLocalQuery(text);
      if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearchQuery(text);
    }, 300);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    inputRef.current?.focus();
  };
  
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (!localQuery) {
      Animated.timing(animatedWidth, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSearchIconPress = () => {
    inputRef.current?.focus();
  };

  const handleSubmitEditing = () => {
    Keyboard.dismiss();
  };

  const inputWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['85%', '100%'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.searchIcon} 
        onPress={handleSearchIconPress}
        testID="search-icon-button"
      >
        <Feather 
          name="search" 
          size={20} 
          color={isFocused || localQuery ? theme.colors.accent.primary : theme.colors.text.secondary} 
        />
      </TouchableOpacity>
      
      <Animated.View style={[styles.inputContainer, { width: inputWidth }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={localQuery}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmitEditing}
          placeholder="Buscar notas..."
          placeholderTextColor={theme.colors.text.tertiary}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
          testID="search-input"
        />
      </Animated.View>
      
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={theme.colors.accent.primary}
          style={styles.activityIndicator}
        />
      ) : localQuery ? (
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={handleClear}
          testID="clear-search-button"
        >
          <Feather name="x" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      ) : null}
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
    marginVertical: theme.spacing.sm,
  },
  searchIcon: {
    padding: theme.spacing.xs,
    zIndex: 1,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  activityIndicator: {
    padding: theme.spacing.xs,
  },
});

export default SearchBar; 