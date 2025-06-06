import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Note } from './Note';

export type RootStackParamList = {
  Home: undefined;
  NoteView: { noteId: number };
  NoteEdit: { noteId?: number };
};

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

export type NoteViewScreenRouteProp = RouteProp<
  RootStackParamList,
  'NoteView'
>;

export type NoteEditScreenRouteProp = RouteProp<
  RootStackParamList,
  'NoteEdit'
>; 