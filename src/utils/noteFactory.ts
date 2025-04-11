import { Note, CreateNoteDTO } from '@/types/Note';
import { generateId } from '@/utils/generateId';

/**
 * Função de fábrica para criar uma nova nota a partir de dados parciais
 * 
 * @param {CreateNoteDTO} data - Dados da nota fornecidos pelo usuário
 * @returns {Note} Uma nova nota completa
 */
export function createNote(data: CreateNoteDTO): Note {
  const now = Date.now();
  
  return {
    id: generateId(),
    title: data.title,
    content: data.content,
    createdAt: now,
    updatedAt: now
  };
} 