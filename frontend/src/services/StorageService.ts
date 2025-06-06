/**
 * Serviço para gerenciar persistência de notas usando AsyncStorage
 * 
 * Este serviço encapsula todas as operações de armazenamento
 * e fornece uma API para manipulação de notas no AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/Note';
import { createNote } from '@/utils/noteFactory';

// Chave para armazenar todas as notas no AsyncStorage
const NOTES_STORAGE_KEY = '@NotesApp:notes';

/**
 * Classe que implementa o serviço de armazenamento
 */
export class StorageService {
  /**
   * Recupera todas as notas armazenadas
   * 
   * @returns {Promise<Note[]>} Lista de notas ou array vazio se ocorrer erro
   */
  async getNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Erro ao recuperar notas:', error);
      return [];
    }
  }

  /**
   * Salva a lista completa de notas
   * Método privado usado internamente por outros métodos
   * 
   * @param {Note[]} notes - Lista completa de notas para salvar
   * @returns {Promise<void>}
   * @throws {Error} Se não for possível salvar as notas
   */
  private async saveNotes(notes: Note[]): Promise<void> {
    try {
      const notesJson = JSON.stringify(notes);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, notesJson);
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
      throw new Error('Não foi possível salvar as notas.');
    }
  }

  /**
   * Recupera uma nota específica pelo ID
   * 
   * @param {string} id - ID da nota a ser recuperada
   * @returns {Promise<Note | null>} A nota encontrada ou null se não existir
   */
  async getNoteById(id: string): Promise<Note | null> {
    try {
      const notes = await this.getNotes();
      return notes.find(note => note.id === id) || null;
    } catch (error) {
      console.error('Erro ao recuperar nota específica:', error);
      return null;
    }
  }

  /**
   * Adiciona uma nova nota
   * 
   * @param {CreateNoteDTO} noteData - Dados para criar a nova nota
   * @returns {Promise<Note>} A nova nota criada
   * @throws {Error} Se não for possível adicionar a nota
   */
  async addNote(noteData: CreateNoteDTO): Promise<Note> {
    try {
      const notes = await this.getNotes();
      const newNote = createNote(noteData);
      
      await this.saveNotes([...notes, newNote]);
      return newNote;
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      throw new Error('Não foi possível adicionar a nota.');
    }
  }

  /**
   * Atualiza uma nota existente
   * 
   * @param {string} id - ID da nota a ser atualizada
   * @param {UpdateNoteDTO} noteData - Dados para atualizar a nota
   * @returns {Promise<Note | null>} A nota atualizada ou null se não existir
   * @throws {Error} Se não for possível atualizar a nota
   */
  async updateNote(id: string, noteData: UpdateNoteDTO): Promise<Note | null> {
    try {
      const notes = await this.getNotes();
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) return null;
      
      const updatedNote: Note = {
        ...notes[noteIndex],
        ...noteData,
        updatedAt: Date.now()
      };
      
      notes[noteIndex] = updatedNote;
      await this.saveNotes(notes);
      
      return updatedNote;
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      throw new Error('Não foi possível atualizar a nota.');
    }
  }

  /**
   * Remove uma nota pelo ID
   * 
   * @param {string} id - ID da nota a ser removida
   * @returns {Promise<boolean>} true se a nota foi removida, false se não existia
   * @throws {Error} Se não for possível excluir a nota
   */
  async deleteNote(id: string): Promise<boolean> {
    try {
      const notes = await this.getNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      
      // Se o comprimento não mudou, a nota não foi encontrada
      if (filteredNotes.length === notes.length) return false;
      
      await this.saveNotes(filteredNotes);
      return true;
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      throw new Error('Não foi possível excluir a nota.');
    }
  }

  /**
   * Busca notas que contenham o texto de busca no título ou conteúdo
   * 
   * @param {string} searchText - Texto a ser buscado
   * @returns {Promise<Note[]>} Notas que correspondem à busca
   */
  async searchNotes(searchText: string): Promise<Note[]> {
    try {
      if (!searchText.trim()) return this.getNotes();
      
      const notes = await this.getNotes();
      const searchLower = searchText.toLowerCase();
      
      return notes.filter(note => 
        note.title.toLowerCase().includes(searchLower) || 
        note.content.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      return [];
    }
  }

  /**
   * Limpa todas as notas (útil para testes ou recurso de "resetar")
   * 
   * @returns {Promise<void>}
   * @throws {Error} Se não for possível limpar as notas
   */
  async clearAllNotes(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTES_STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar notas:', error);
      throw new Error('Não foi possível limpar as notas.');
    }
  }
}

// Exporta uma instância única do serviço para ser usada em toda a aplicação
export const storageService = new StorageService(); 