/**
 * Definições de tipos para o modelo de dados de notas
 */

/**
 * Interface principal que representa uma nota completa
 */
export interface Note {
  id: number;       
  title: string;    
  content: string;  
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para criação de uma nova nota
 * Contém apenas os campos que o usuário precisa fornecer
 */
export interface CreateNoteDTO {
  title: string;
  content: string;
}

/**
 * Interface para atualização de uma nota existente
 * Todos os campos são opcionais, permitindo atualização parcial
 */
export interface UpdateNoteDTO {
  title?: string;
  content?: string;
} 