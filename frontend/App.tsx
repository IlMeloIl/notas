import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { NotesProvider } from './src/contexts';

export default function App() {
  return (
    <SafeAreaProvider>
      <NotesProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </NotesProvider>
    </SafeAreaProvider>
  );
}
