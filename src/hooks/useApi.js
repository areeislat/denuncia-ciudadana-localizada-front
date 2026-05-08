/**
 * Hook personalizado para usar el cliente API
 * Facilita el manejo de requests, loading y errores
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../config/api';

/**
 * Hook para realizar requests a la API
 * 
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones adicionales
 * @returns {object} { data, loading, error, refetch }
 */
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.get(endpoint, options);
      setData(result);
    } catch (err) {
      setError(err);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  // Fetch al montar el componente
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook para realizar mutations (POST, PUT, DELETE)
 * 
 * @param {string} method - Método HTTP (post, put, delete, patch)
 * @returns {object} { execute, loading, error, data }
 */
export const useMutation = (method = 'post') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (endpoint, payload = null) => {
      try {
        setLoading(true);
        setError(null);
        
        let result;
        if (method === 'get') {
          result = await apiClient.get(endpoint);
        } else if (method === 'post') {
          result = await apiClient.post(endpoint, payload);
        } else if (method === 'put') {
          result = await apiClient.put(endpoint, payload);
        } else if (method === 'patch') {
          result = await apiClient.patch(endpoint, payload);
        } else if (method === 'delete') {
          result = await apiClient.delete(endpoint);
        }
        
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        console.error(`Error in ${method}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [method]
  );

  return { execute, loading, error, data };
};

export default { useApi, useMutation };
