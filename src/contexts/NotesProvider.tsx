import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { NotesContext, NotesContextProps } from './NotesContext';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/Note';
import { storageService } from '@/services/StorageService';

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  // Estados
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);

  // Carregar notas iniciais
  useEffect(() => {
    loadNotes();
  }, []);

  // Efeito para realizar buscas quando searchQuery muda
  useEffect(() => {
    if (searchQuery) {
      handleSearchNotes(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Carregar todas as notas
  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedNotes = await storageService.getNotes();
      setNotes(loadedNotes);
    } catch (err) {
      setError('Erro ao carregar notas. Por favor, tente novamente.');
      console.error('Erro ao carregar notas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter todas as notas
  const getNotes = useCallback(async (): Promise<Note[]> => {
    try {
      await loadNotes();
      return notes;
    } catch (err) {
      console.error('Erro ao obter notas:', err);
      return [];
    }
  }, [loadNotes, notes]);

  // Obter nota por ID
  const getNoteById = useCallback(async (id: string): Promise<Note | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const note = await storageService.getNoteById(id);
      return note;
    } catch (err) {
      setError('Erro ao carregar nota. Por favor, tente novamente.');
      console.error('Erro ao obter nota por ID:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar nova nota
  const createNote = useCallback(async (noteData: CreateNoteDTO): Promise<Note> => {
    setLoading(true);
    setError(null);
    
    try {
      const newNote = await storageService.addNote(noteData);
      setNotes(prevNotes => [...prevNotes, newNote]);
      return newNote;
    } catch (err) {
      setError('Erro ao criar nota. Por favor, tente novamente.');
      console.error('Erro ao criar nota:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar nota existente
  const updateNote = useCallback(async (id: string, noteData: UpdateNoteDTO): Promise<Note | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedNote = await storageService.updateNote(id, noteData);
      
      if (updatedNote) {
        setNotes(prevNotes => 
          prevNotes.map(note => note.id === id ? updatedNote : note)
        );
      }
      
      return updatedNote;
    } catch (err) {
      setError('Erro ao atualizar nota. Por favor, tente novamente.');
      console.error('Erro ao atualizar nota:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Excluir nota
  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await storageService.deleteNote(id);
      
      if (success) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      }
      
      return success;
    } catch (err) {
      setError('Erro ao excluir nota. Por favor, tente novamente.');
      console.error('Erro ao excluir nota:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar notas
  const searchNotes = useCallback(async (query: string): Promise<Note[]> => {
    return handleSearchNotes(query);
  }, []);

  // Manipulador interno para busca
  const handleSearchNotes = async (query: string): Promise<Note[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await storageService.searchNotes(query);
      setSearchResults(results);
      return results;
    } catch (err) {
      setError('Erro ao buscar notas. Por favor, tente novamente.');
      console.error('Erro na busca de notas:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Limpar busca
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Valores do contexto
  const contextValue: NotesContextProps = {
    notes,
    loading,
    error,
    searchQuery,
    searchResults,
    
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    
    searchNotes,
    setSearchQuery,
    clearSearch
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
}; 