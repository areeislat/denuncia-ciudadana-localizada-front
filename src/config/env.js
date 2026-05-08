/**
 * Configuración de Variables de Entorno
 * Centraliza el acceso a todas las variables de entorno
 */

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  apiKey: import.meta.env.VITE_API_KEY || '',
  authToken: import.meta.env.VITE_AUTH_TOKEN || '',
};

// Mapbox Configuration (opcional)
export const MAPBOX_CONFIG = {
  token: import.meta.env.VITE_MAPBOX_TOKEN || '',
  enabled: !!import.meta.env.VITE_MAPBOX_TOKEN,
};

// Database Configuration (si es necesario)
export const DB_CONFIG = {
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  port: import.meta.env.VITE_DB_PORT || 5432,
  name: import.meta.env.VITE_DB_NAME || 'desigeo',
};

// App Configuration
export const APP_CONFIG = {
  env: import.meta.env.VITE_APP_ENV || 'development',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

/**
 * Valida que todas las variables de entorno requeridas estén presentes
 * Lanza un error si falta alguna variable crítica
 */
export const validateEnvironment = () => {
  const required = ['VITE_API_URL'];
  const missing = [];

  required.forEach((key) => {
    if (!import.meta.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    const message = `Variables de entorno faltantes: ${missing.join(', ')}. 
    Copia .env.example a .env.local y completa los valores.`;
    
    console.warn('⚠️ ' + message);
  }
};

/**
 * Log de configuración (solo en desarrollo)
 */
export const logEnvironment = () => {
  if (import.meta.env.DEV) {
    console.group('🔧 Configuración de Entorno');
    console.log('API URL:', API_CONFIG.baseURL);
    console.log('Ambiente:', APP_CONFIG.env);
    console.log('Mapbox habilitado:', MAPBOX_CONFIG.enabled);
    console.groupEnd();
  }
};

/**
 * Obtener URL completa de API
 */
export const getApiUrl = (endpoint) => {
  const baseURL = API_CONFIG.baseURL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseURL}${path}`;
};

/**
 * Obtener headers por defecto para requests
 */
export const getDefaultHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (API_CONFIG.apiKey) {
    headers['X-API-Key'] = API_CONFIG.apiKey;
  }

  if (API_CONFIG.authToken) {
    headers['Authorization'] = `Bearer ${API_CONFIG.authToken}`;
  }

  return headers;
};

export default {
  API_CONFIG,
  MAPBOX_CONFIG,
  DB_CONFIG,
  APP_CONFIG,
  validateEnvironment,
  logEnvironment,
  getApiUrl,
  getDefaultHeaders,
};
