import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/Navigation';

// Importação das telas
import HomeScreen from '@/screens/HomeScreen';
import NoteViewScreen from '@/screens/NoteViewScreen';
import NoteEditScreen from '@/screens/NoteEditScreen';

// Importação do tema
import theme from '@/constants/theme';

// Criando um objeto de tema compatível com o NavigationContainer
const navigationTheme = {
  dark: true,
  colors: {
    primary: theme.colors.accent.primary,
    background: theme.colors.background.primary,
    card: theme.colors.background.secondary,
    text: theme.colors.text.primary,
    border: theme.colors.border.light,
    notification: theme.colors.accent.secondary,
  },
  // Propriedade necessária para o tipo Theme
  fonts: DefaultTheme.fonts
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background.primary },
          cardShadowEnabled: false,
          cardOverlayEnabled: true,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NoteView" component={NoteViewScreen} />
        <Stack.Screen name="NoteEdit" component={NoteEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;