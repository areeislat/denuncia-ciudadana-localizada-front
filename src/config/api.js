/**
 * Cliente HTTP para comunicación con el backend
 * Centraliza todas las requests y maneja errores
 */

import { getApiUrl, getDefaultHeaders } from './env';

class ApiClient {
  constructor() {
    this.baseURL = getApiUrl('');
    this.defaultHeaders = getDefaultHeaders();
  }

  /**
   * Realiza un request GET
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * Realiza un request POST
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Realiza un request PUT
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Realiza un request PATCH
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Realiza un request DELETE
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Request genérico con manejo de errores
   */
  async request(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Manejo de errores HTTP
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.status = response.status;
        error.response = response;
        
        try {
          error.data = await response.json();
        } catch {
          error.data = null;
        }

        throw error;
      }

      // Parsear respuesta
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      // Log de error en desarrollo
      if (import.meta.env.DEV) {
        console.error(`❌ API Error [${options.method || 'GET'} ${endpoint}]:`, error);
      }

      throw error;
    }
  }

  /**
   * Actualizar token de autenticación
   */
  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remover token de autenticación
   */
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }
}

// Instancia única del cliente
export const apiClient = new ApiClient();

export default apiClient;
