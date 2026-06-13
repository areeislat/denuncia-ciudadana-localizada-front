/**
 * CP-LOGIN-001  Login exitoso ciudadano
 * CP-LOGIN-002  Error de credenciales
 * CP-LOGIN-003  Validar email requerido (HTML5 required)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/public/Login';

// ── Mocks globales ──────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock de apiClient — devuelve resolución o rechazo según la implementación
vi.mock('../config/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

// Mock de useAuthStore
const mockLogin = vi.fn();
vi.mock('../store/authStore', () => ({
  default: (selector) => {
    const state = { login: mockLogin };
    return selector ? selector(state) : state;
  },
}));

import apiClient from '../config/api';

// ── Helper de render ────────────────────────────────────────────────
const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe('CP-LOGIN — Componente Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-LOGIN-001: Login exitoso ciudadano
  // Email: ciudadano@test.com, Password: Secure123! → redirige + token
  // ─────────────────────────────────────────────────────────────────
  it('CP-LOGIN-001: login exitoso con credenciales válidas llama login() y redirige a /ciudadano', async () => {
    const fakeToken = 'fake-jwt-token';
    const fakeUser = { userId: '1', roleName: 'CITIZEN', fullName: 'Test User' };

    apiClient.post.mockResolvedValueOnce({ token: fakeToken, user: fakeUser });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('nombre@ejemplo.cl'), 'ciudadano@test.com');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'Secure123!');
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      // Verificar que se llamó al endpoint correcto
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'ciudadano@test.com',
        password: 'Secure123!',
      });
      // Verificar que se guardó el token en el store
      expect(mockLogin).toHaveBeenCalledWith(fakeToken, fakeUser);
      // Verificar redirección correcta para CITIZEN
      expect(mockNavigate).toHaveBeenCalledWith('/ciudadano');
    });
  });

  // CP-LOGIN-001 variante: login de rol municipal redirige al dashboard
  it('CP-LOGIN-001 (variante): login con rol MUNICIPAL_OFFICER redirige a /municipal/dashboard', async () => {
    const fakeUser = { userId: '2', roleName: 'MUNICIPAL_OFFICER' };
    apiClient.post.mockResolvedValueOnce({ token: 'token-mun', user: fakeUser });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('nombre@ejemplo.cl'), 'muni@test.com');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'Pass1234!');
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/municipal/dashboard');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-LOGIN-002: Error de credenciales
  // Email inválido + contraseña incorrecta → mensaje de error visible
  // ─────────────────────────────────────────────────────────────────
  it('CP-LOGIN-002: credenciales incorrectas muestran mensaje de error', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: 'Credenciales incorrectas. Intenta nuevamente.' } },
    });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('nombre@ejemplo.cl'), 'invalido@test.com');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), '123');
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas. Intenta nuevamente.')).toBeInTheDocument();
    });

    // Verificar que NO se redirigió
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('CP-LOGIN-002 (variante): sin mensaje del servidor muestra error genérico', async () => {
    apiClient.post.mockRejectedValueOnce(new Error('Network Error'));

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('nombre@ejemplo.cl'), 'otro@test.com');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas. Intenta nuevamente.')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-LOGIN-003: Validar email requerido
  // El input tiene `required` + `type="email"`. En jsdom la validación
  // HTML5 no bloquea el submit nativo, pero el componente tiene `required`
  // declarado y el campo vacío no pasa la validación del browser real.
  // ─────────────────────────────────────────────────────────────────
  it('CP-LOGIN-003: campo email tiene atributo required y type email', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('nombre@ejemplo.cl');
    expect(emailInput).toBeRequired();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('CP-LOGIN-003: campo contraseña tiene atributo required', () => {
    renderLogin();
    const passInput = screen.getByPlaceholderText('••••••••');
    expect(passInput).toBeRequired();
    expect(passInput).toHaveAttribute('type', 'password');
  });

  it('CP-LOGIN-003: con email vacío el formulario dispara el evento submit pero el campo reporta invalidez', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText('nombre@ejemplo.cl');
    // El campo está vacío y es required → checkValidity() = false
    expect(emailInput.checkValidity()).toBe(false);
    // El campo de contraseña también vacío → inválido
    expect(emailInput.validity.valueMissing).toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────
  // Extras: estado de carga y estructura de la UI
  // ─────────────────────────────────────────────────────────────────
  it('muestra estado "Ingresando..." mientras el request está en curso', async () => {
    let resolveLogin;
    apiClient.post.mockReturnValueOnce(new Promise((res) => (resolveLogin = res)));

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('nombre@ejemplo.cl'), 'ciudadano@test.com');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'Secure123!');
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(screen.getByText('Ingresando...')).toBeInTheDocument();

    resolveLogin({ token: 'tok', user: { roleName: 'CITIZEN' } });
  });

  it('renderiza los campos de email y contraseña correctamente', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('nombre@ejemplo.cl')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });
});
