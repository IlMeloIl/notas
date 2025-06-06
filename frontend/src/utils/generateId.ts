/**
 * Função utilitária para gerar IDs únicos para as notas
 * Combina timestamp com número aleatório para garantir unicidade
 * 
 * @returns {string} ID único gerado
 */
export function generateId(): string {
  const timestampPart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2);
  
  return timestampPart + randomPart;
} 