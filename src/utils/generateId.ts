/**
 * Função utilitária para gerar IDs únicos para as notas
 * Combina timestamp com número aleatório para garantir unicidade
 * 
 * @returns {string} ID único gerado
 */
export function generateId(): string {
  // Obtém um timestamp em base 36 (mais compacto)
  const timestampPart = Date.now().toString(36);
  
  // Gera uma parte aleatória (também em base 36) e remove o "0." do início
  const randomPart = Math.random().toString(36).substring(2);
  
  // Combina as duas partes para criar um ID único
  return timestampPart + randomPart;
} 