/**
 * Servicio de Autenticación
 * Maneja login, registro y gestión de sesión con el backend
 */

import { API_CONFIG } from '../config/env';

const BASE_URL = API_CONFIG.baseURL;

/**
 * Login de usuario
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Error al iniciar sesión');
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
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      roleId: userData.roleId || 1, // 1 = Ciudadano por defecto
      active: true,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Error al registrar usuario');
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
