/**
 * CP-RECOVERY-001  Solicitar recuperación → paso 2 visible con campo código
 * CP-RECOVERY-002  Código correcto → transición a nueva contraseña
 * CP-RECOVERY-003  Código inválido/agotado → mensaje de error correcto
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Recuperar from '../pages/public/Recuperar';

// ── Mocks top-level ────────────────────────────────────────────────
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams()],
  };
});

const mockPost = vi.fn();
vi.mock('../config/api', () => ({
  default: {
    post: (...args) => mockPost(...args),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

const renderRecuperar = () =>
  render(
    <MemoryRouter>
      <Recuperar />
    </MemoryRouter>
  );

// Helper: avanza al paso 2 (verificación de código)
const irAlPaso2 = async (email = 'user@test.com') => {
  mockPost.mockResolvedValueOnce({});
  const input = screen.getByPlaceholderText('nombre@ejemplo.cl');
  await userEvent.type(input, email);
  await userEvent.click(screen.getByRole('button', { name: /enviar código/i }));
  await waitFor(() => {
    expect(screen.getByLabelText('Dígito 1 del código')).toBeInTheDocument();
  });
};

// Helper: escribe un código de 6 dígitos en los inputs
const escribirCodigo = async (digito = '1') => {
  for (let i = 1; i <= 6; i++) {
    const input = screen.getByLabelText(`Dígito ${i} del código`);
    await userEvent.type(input, digito);
  }
};

describe('CP-RECOVERY — Recuperación de contraseña', () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-RECOVERY-001: Solicitar recuperación
  // ─────────────────────────────────────────────────────────────────
  it('CP-RECOVERY-001: enviar email válido muestra el paso 2 con inputs del código', async () => {
    renderRecuperar();
    await irAlPaso2('user@test.com');

    expect(screen.getByLabelText('Dígito 1 del código')).toBeInTheDocument();
    expect(screen.getByLabelText('Dígito 6 del código')).toBeInTheDocument();
    expect(screen.getByText(/si el correo existe en nuestro sistema/i)).toBeInTheDocument();
    expect(mockPost).toHaveBeenCalledWith('/api/auth/forgot-password', { email: 'user@test.com' });
  });

  it('CP-RECOVERY-001 (variante): avanza al paso 2 aunque el backend falle (anti-enumeración)', async () => {
    mockPost.mockRejectedValueOnce(new Error('404'));

    renderRecuperar();
    const input = screen.getByPlaceholderText('nombre@ejemplo.cl');
    await userEvent.type(input, 'noexiste@test.com');
    await userEvent.click(screen.getByRole('button', { name: /enviar código/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('Dígito 1 del código')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-RECOVERY-002: Código correcto → transición a paso de nueva contraseña
  // ─────────────────────────────────────────────────────────────────
  it('CP-RECOVERY-002: código de 6 dígitos correcto transiciona al paso de nueva contraseña', async () => {
    mockPost
      .mockResolvedValueOnce({})                          // forgot-password
      .mockResolvedValueOnce({ token: 'reset-tok-abc' }); // verify-reset-code

    renderRecuperar();
    await irAlPaso2('user@test.com');
    await escribirCodigo('3');

    await userEvent.click(screen.getByRole('button', { name: /verificar código/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/auth/verify-reset-code', {
        email: 'user@test.com',
        code: '333333',
      });
      expect(screen.getByPlaceholderText('Mínimo 8 caracteres')).toBeInTheDocument();
    });
  });

  it('CP-RECOVERY-002 (variante): código incompleto (< 6 dígitos) deshabilita botón verificar', async () => {
    mockPost.mockResolvedValueOnce({});

    renderRecuperar();
    await irAlPaso2();

    // Solo 3 dígitos
    for (let i = 1; i <= 3; i++) {
      await userEvent.type(screen.getByLabelText(`Dígito ${i} del código`), '5');
    }

    expect(screen.getByRole('button', { name: /verificar código/i })).toBeDisabled();
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-RECOVERY-003: Código inválido → error + intentos restantes
  // ─────────────────────────────────────────────────────────────────
  it('CP-RECOVERY-003: código inválido muestra mensaje de error e intentos restantes', async () => {
    mockPost
      .mockResolvedValueOnce({}) // forgot-password
      .mockRejectedValueOnce({
        response: { status: 400, data: { message: 'Código inválido. Intenta nuevamente.', attemptsLeft: 4 } },
      });

    renderRecuperar();
    await irAlPaso2();
    await escribirCodigo('9');

    await userEvent.click(screen.getByRole('button', { name: /verificar código/i }));

    await waitFor(() => {
      expect(screen.getByText('Código inválido. Intenta nuevamente.')).toBeInTheDocument();
      expect(screen.getByText(/4 intentos/i)).toBeInTheDocument();
    });
  });

  it('CP-RECOVERY-003: status 429 (rate limit) muestra mensaje de bloqueo por intentos', async () => {
    mockPost
      .mockResolvedValueOnce({}) // forgot-password
      .mockRejectedValueOnce({
        response: {
          status: 429,
          data: { attemptsLeft: 0 },
        },
      });

    renderRecuperar();
    await irAlPaso2();
    await escribirCodigo('0');

    await userEvent.click(screen.getByRole('button', { name: /verificar código/i }));

    await waitFor(() => {
      // El componente usa: "Demasiados intentos. Intenta nuevamente en unos minutos."
      expect(screen.getByText(/demasiados intentos/i)).toBeInTheDocument();
    });
  });

  it('CP-RECOVERY-003: código expirado (status 410) muestra mensaje de expiración', async () => {
    mockPost
      .mockResolvedValueOnce({}) // forgot-password
      .mockRejectedValueOnce({
        response: { status: 410, data: {} },
      });

    renderRecuperar();
    await irAlPaso2();
    await escribirCodigo('1');

    await userEvent.click(screen.getByRole('button', { name: /verificar código/i }));

    await waitFor(() => {
      // Mensaje exacto: "El código ha expirado. Solicita uno nuevo."
      expect(screen.getByText(/el código ha expirado/i)).toBeInTheDocument();
    });
  });
});
