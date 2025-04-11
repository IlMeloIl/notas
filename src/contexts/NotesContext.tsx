import { createContext } from 'react';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/Note';

// Interface do contexto de notas
export interface NotesContextProps {
  // Estado
  notes: Note[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: Note[];

  // Operações CRUD
  getNotes: () => Promise<Note[]>;
  getNoteById: (id: string) => Promise<Note | null>;
  createNote: (noteData: CreateNoteDTO) => Promise<Note>;
  updateNote: (id: string, noteData: UpdateNoteDTO) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  
  // Busca
  searchNotes: (query: string) => Promise<Note[]>;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

// Valores padrão para o contexto
const defaultContextValue: NotesContextProps = {
  notes: [],
  loading: false,
  error: null,
  searchQuery: '',
  searchResults: [],

  getNotes: async () => [],
  getNoteById: async () => null,
  createNote: async () => ({
    id: '',
    title: '',
    content: '',
    createdAt: 0,
    updatedAt: 0
  }),
  updateNote: async () => null,
  deleteNote: async () => false,
  
  searchNotes: async () => [],
  setSearchQuery: () => {},
  clearSearch: () => {}
};

// Criação do contexto
export const NotesContext = createContext<NotesContextProps>(defaultContextValue); 