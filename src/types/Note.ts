/**
 * Definições de tipos para o modelo de dados de notas
 */

/**
 * Interface principal que representa uma nota completa
 */
export interface Note {
  id: string;        // Identificador único
  title: string;     // Título da nota
  content: string;   // Conteúdo/corpo da nota
  createdAt: number; // Data de criação (timestamp)
  updatedAt: number; // Data de última atualização (timestamp)
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