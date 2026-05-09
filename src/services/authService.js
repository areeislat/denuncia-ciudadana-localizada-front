/**
 * Servicio de Autenticación
 * Maneja login, registro y gestión de sesión con el backend
 */

import { API_CONFIG } from '../config/env';

const BASE_URL = API_CONFIG.baseURL;

/**
 * Obtener la URL base para las requests.
 * En producción usa rutas relativas (proxy de Vercel).
 * En desarrollo usa la URL completa del backend.
 */
const getRequestUrl = (path) => {
  if (import.meta.env.PROD) {
    // En producción, usar ruta relativa para pasar por el proxy de Vercel
    return path;
  }
  // En desarrollo, usar la URL completa del backend
  return `${BASE_URL}${path}`;
};

/**
 * Login de usuario
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (email, password) => {
  let response;
  try {
    response = await fetch(getRequestUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (networkError) {
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Error del servidor (${response.status}). Intenta más tarde.`);
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Credenciales incorrectas.');
  }

  // Guardar token y datos del usuario
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
  }
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

/**
 * Registro de usuario
 * @param {object} userData - { email, password, fullName, roleId, active }
 * @returns {Promise<object>}
 */
export const register = async (userData) => {
  let response;
  try {
    response = await fetch(getRequestUrl('/api/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        rut: userData.rut,
        phone: userData.phone,
        active: true,
      }),
    });
  } catch (networkError) {
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet o intenta más tarde.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    if (response.status === 403) {
      throw new Error('El registro no está habilitado en este momento. Contacta al administrador.');
    }
    throw new Error(`Error del servidor (${response.status}). Intenta más tarde.`);
  }

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('El registro no está habilitado en este momento. Contacta al administrador.');
    }
    if (response.status === 409) {
      throw new Error('Ya existe una cuenta con ese email.');
    }
    throw new Error(data.message || data.error || 'Error al registrar usuario.');
  }

  return data;
};

/**
 * Cerrar sesión
 */
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

/**
 * Obtener token almacenado
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Obtener usuario almacenado
 * @returns {object|null}
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  // Verificar si el token no ha expirado (JWT básico)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch {
    return false;
  }
};

export default {
  login,
  register,
  logout,
  getToken,
  getUser,
  isAuthenticated,
};
