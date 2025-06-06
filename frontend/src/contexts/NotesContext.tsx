import { createContext } from 'react';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/Note';

export interface NotesContextProps {
  
  notes: Note[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: Note[];
  
  getNotes: () => Promise<Note[]>;
  getNoteById: (id: number) => Promise<Note | null>;
  createNote: (noteData: CreateNoteDTO) => Promise<Note>;
  updateNote: (id: number, noteData: UpdateNoteDTO) => Promise<Note | null>;
  deleteNote: (id: number) => Promise<boolean>;
    
  searchNotes: (query: string) => Promise<Note[]>;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const defaultContextValue: NotesContextProps = {
  notes: [],
  loading: true,
  error: null,
  searchQuery: '',
  searchResults: [],

  getNotes: async () => [],
  getNoteById: async (id: number) => {
    console.error("NotesContext: getNoteById foi chamado fora de um Provider.");
    return null;
  },
  createNote: async (noteData: CreateNoteDTO) => {
    throw new Error('NotesContext: createNote foi chamado fora de um Provider.');
  },
  updateNote: async (id: number, noteData: UpdateNoteDTO) => {
    throw new Error('NotesContext: updateNote foi chamado fora de um Provider.');
  },
  deleteNote: async (id: number) => {
    throw new Error('NotesContext: deleteNote foi chamado fora de um Provider.');
  },
  searchNotes: async (query: string) => [],
  setSearchQuery: () => {
    console.error("NotesContext: setSearchQuery foi chamado fora de um Provider.");
  },
  clearSearch: () => {
    console.error("NotesContext: clearSearch foi chamado fora de um Provider.");
  },
};

export const NotesContext = createContext<NotesContextProps>(defaultContextValue); 