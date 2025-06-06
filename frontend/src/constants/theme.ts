/**
 * Tema Escuro para o Aplicativo de Notas
 * 
 * Este arquivo define o sistema de design para o tema escuro do aplicativo,
 * incluindo paleta de cores, tipografia, espaçamento e formas.
 */

// Paleta de Cores
export const colors = {
  // Cores de fundo
  background: {
    primary: '#121212',     // Fundo principal do aplicativo
    secondary: '#1E1E1E',   // Fundo de cabeçalhos e barras
    tertiary: '#2D2D2D',    // Fundo de cartões e inputs
  },
  
  // Cores de texto
  text: {
    primary: '#FFFFFF',     // Texto principal
    secondary: '#AAAAAA',   // Texto secundário/descrições
    tertiary: '#888888',    // Texto de menor ênfase
    disabled: '#666666',    // Texto desabilitado
  },
  
  // Cores de ação/destaque
  accent: {
    primary: '#4A69BD',     // Cor de destaque principal (azul)
    secondary: '#8C7AE6',   // Cor de destaque secundária (roxo)
  },
  
  // Cores de feedback
  feedback: {
    success: '#4CAF50',     // Verde para sucesso
    error: '#FF5252',       // Vermelho para erro
    warning: '#FFC107',     // Amarelo para aviso
    info: '#2196F3',        // Azul para informação
  },
  
  // Cores de borda
  border: {
    light: '#444444',       // Bordas claras
    dark: '#333333',        // Bordas escuras
  },
  
  // Cores comuns
  common: {
    black: '#000000',
    white: '#FFFFFF',
    transparent: 'transparent',
  }
};

// Tipografia
export const typography = {
  // Tamanhos de fonte
  fontSize: {
    xs: 12,                // Extra pequeno
    sm: 14,                // Pequeno
    base: 16,              // Tamanho base
    md: 18,                // Médio
    lg: 20,                // Grande
    xl: 24,                // Extra grande
    xxl: 32,               // Título grande
  },
  
  // Pesos de fonte
  fontWeight: {
    normal: '400',         // Normal
    medium: '500',         // Médio
    semibold: '600',       // Semi-negrito
    bold: '700',           // Negrito
  },
  
  // Família de fonte
  fontFamily: {
    regular: 'System',     // Fonte padrão do sistema
  },
};

// Espaçamento
export const spacing = {
  xs: 4,                   // Extra pequeno
  sm: 8,                   // Pequeno
  md: 16,                  // Médio
  lg: 24,                  // Grande
  xl: 32,                  // Extra grande
  xxl: 48,                 // Extra extra grande
};

// Bordas e Sombras
export const shape = {
  // Raios de borda
  borderRadius: {
    xs: 4,                 // Extra pequeno
    sm: 8,                 // Pequeno
    md: 12,                // Médio
    lg: 16,                // Grande
    full: 9999,            // Círculo/Pílula
  },
  
  // Sombras (sutis para tema escuro)
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 8,
    },
  },
};

// Tema completo exportado como padrão
const theme = {
  colors,
  typography,
  spacing,
  shape,
};

export default theme; 