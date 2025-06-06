import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Note } from './Note';

// Definição dos parâmetros para cada rota
export type RootStackParamList = {
  Home: undefined;
  NoteView: { noteId: string };
  NoteEdit: { noteId?: string }; // opcional para criação de nova nota
};

// Tipos para navegação entre telas
export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type NoteViewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NoteView'
>;

export type NoteEditScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NoteEdit'
>;

// Tipos para acesso aos parâmetros de rota
export type NoteViewScreenRouteProp = RouteProp<
  RootStackParamList,
  'NoteView'
>;

export type NoteEditScreenRouteProp = RouteProp<
  RootStackParamList,
  'NoteEdit'
>; 