import { useContext } from 'react';
import { NotesContext, NotesContextProps } from '@/contexts';

/**
 * Hook personalizado para acessar o contexto de notas
 * @returns {NotesContextProps} Propriedades e métodos do contexto de notas
 */
export const useNotes = (): NotesContextProps => {
  const context = useContext(NotesContext);
  
  if (!context) {
    throw new Error('useNotes deve ser usado dentro de um NotesProvider');
  }
  
  return context;
}; 