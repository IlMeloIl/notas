import { CreateNoteDTO, UpdateNoteDTO } from '@/types/Note';

/**
 * Valida os dados de uma nova nota
 * 
 * @param {CreateNoteDTO} data - Dados a serem validados
 * @returns {string | null} Mensagem de erro ou null se válido
 */
export function validateNewNote(data: CreateNoteDTO): string | null {
  if (!data.title || data.title.trim() === '') {
    return 'O título da nota é obrigatório';
  }
  
  if (data.title.length > 100) {
    return 'O título não pode ter mais de 100 caracteres';
  }
  
  return null;
}

/**
 * Valida os dados para atualização de uma nota
 * 
 * @param {UpdateNoteDTO} data - Dados a serem validados
 * @returns {string | null} Mensagem de erro ou null se válido
 */
export function validateNoteUpdate(data: UpdateNoteDTO): string | null {
  if (data.title !== undefined && data.title.trim() === '') {
    return 'O título da nota não pode ser vazio';
  }
  
  if (data.title && data.title.length > 100) {
    return 'O título não pode ter mais de 100 caracteres';
  }
    
  return null;
} 