import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { NotesContext } from './NotesContext';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/Note';

import * as apiService from '@/services/ApiService';

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  
  const searchResults = searchQuery
    ? notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedNotes = await apiService.getNotes();
      setNotes(loadedNotes);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar notas.');
      console.error('Erro ao carregar notas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const getNotes = async (): Promise<Note[]> => {
    await loadNotes();
    return notes; 
  };

  const getNoteById = useCallback(async (id: number): Promise<Note | null> => {
    try {
      return await apiService.getNoteById(id);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar nota.');
      console.error('Erro ao obter nota por ID:', err);
      return null;
    }
  }, []);

  const createNote = useCallback(async (noteData: CreateNoteDTO): Promise<Note> => {
    setLoading(true);
    try {
      const newNote = await apiService.createNote(noteData);
      
      await loadNotes(); 
      return newNote;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar nota.');
      console.error('Erro ao criar nota:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const updateNote = useCallback(async (id: number, noteData: UpdateNoteDTO): Promise<Note | null> => {
    setLoading(true);
    try {
      const updatedNote = await apiService.updateNote(id, noteData);
      
      await loadNotes();
      return updatedNote;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar nota.');
      console.error('Erro ao atualizar nota:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const deleteNote = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      await apiService.deleteNote(id);
      
      await loadNotes();
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir nota.');
      console.error('Erro ao excluir nota:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadNotes]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const contextValue = {
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
    searchNotes: async (query: string) => searchResults, 
    setSearchQuery,
    clearSearch,
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};