/**
 * Hook personalizado para acessar o serviço de armazenamento
 * Facilita o uso do StorageService em componentes
 */

import { storageService } from '@/services';

/**
 * Hook que fornece acesso ao serviço de armazenamento
 * @returns O serviço de armazenamento
 */
export function useStorage() {
  return storageService;
} 