import { ThemeColors } from '../context/ThemeContext';

export const lightColors: ThemeColors = {
  // Colores principales del branding
  primary: '#3F8A4E',           // Verde principal
  primaryLight: '#8BC34A',      // Verde claro
  primaryDark: '#204D31',       // Verde oscuro
  accent: '#F2C94C',            // Amarillo dorado

  // Gradientes para fondos
  gradientStart: '#418a2fff',   // Verde gradiente inicio
  gradientEnd: '#3F8A4E',       // Verde gradiente fin
  gradientAccent: '#8BC34A',    // Verde gradiente acento

  // Fondos y superficies
  background: '#FFFFFF',        // Blanco
  surface: '#F9F9F9',           // Gris muy claro
  surfaceSecondary: '#f8f9fa',  // Gris claro alternativo

  // Textos
  text: '#204D31',              // Verde oscuro para texto
  textSecondary: '#555555',     // Gris medio
  textMuted: '#888888',         // Gris claro
  textLight: '#fefefe',         // Blanco para texto claro

  // Estados
  success: '#28a745',           // Verde éxito
  warning: '#ffc107',           // Amarillo warning
  danger: '#dc3545',            // Rojo danger
  info: '#007BFF',              // Azul info

  // Bordes y sombras
  border: '#3F8A4E',            // Verde para bordes
  shadow: '#000000',            // Negro para sombras
};

export const darkColors: ThemeColors = {
  // Colores principales del branding
  primary: '#8BC34A',
  primaryLight: '#AED581',
  primaryDark: '#4CAF50',
  accent: '#FFD54F',
  gradientStart: '#4CAF50',
  gradientEnd: '#2E7D32',
  gradientAccent: '#8BC34A',
  background: '#121212',
  surface: '#1E1E1E',
  surfaceSecondary: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#888888',
  textLight: '#FFFFFF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  info: '#2196F3',
  border: '#8BC34A',
  shadow: '#000000',
};

// For backward compatibility
export default lightColors;
