export const colors = { 
  background: {
    primary: '#121212',    
    secondary: '#1E1E1E',  
    tertiary: '#2D2D2D',   
  },
  
  text: {
    primary: '#FFFFFF',    
    secondary: '#AAAAAA',  
    tertiary: '#888888',   
    disabled: '#666666',   
  },
 
  accent: {
    primary: '#4A69BD',    
    secondary: '#8C7AE6',  
  },
 
  feedback: {
    success: '#4CAF50',    
    error: '#FF5252',      
    warning: '#FFC107',    
    info: '#2196F3',       
  },
 
  border: {
    light: '#444444',      
    dark: '#333333',       
  },
  
  common: {
    black: '#000000',
    white: '#FFFFFF',
    transparent: 'transparent',
  }
};

export const typography = {
  fontSize: {
    xs: 12,               
    sm: 14,               
    base: 16,             
    md: 18,               
    lg: 20,               
    xl: 24,               
    xxl: 32,              
  },
  
  fontWeight: {
    normal: '400',        
    medium: '500',        
    semibold: '600',      
    bold: '700',          
  },
 
  fontFamily: {
    regular: 'System',    
  },
};

export const spacing = {
  xs: 4,                  
  sm: 8,                  
  md: 16,                 
  lg: 24,                 
  xl: 32,                 
  xxl: 48,                
};

export const shape = {
 
  borderRadius: {
    xs: 4,                
    sm: 8,                
    md: 12,               
    lg: 16,               
    full: 9999,           
  },
  
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

const theme = {
  colors,
  typography,
  spacing,
  shape,
};

export default theme; 