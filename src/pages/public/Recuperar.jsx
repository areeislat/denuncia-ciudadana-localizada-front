import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import apiClient from '../../config/api';

const STEPS = {
  EMAIL: 'email',
  VERIFY: 'verify',
  RESET: 'reset',
  SUCCESS: 'success',
};

export default function Recuperar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Si llega con ?token=... saltar directo al paso de nueva contraseña
  const tokenFromUrl = searchParams.get('token');

  const [step, setStep] = useState(tokenFromUrl ? STEPS.RESET : STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState(tokenFromUrl || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  // Refs para inputs de código
  const codeInputsRef = useRef([]);

  // ─── Paso 1: Enviar email ───
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      setStep(STEPS.VERIFY);
    } catch (err) {
      // Mensaje genérico para evitar enumeración de emails
      // Avanzamos igual al paso 2
      setStep(STEPS.VERIFY);
    } finally {
      setLoading(false);
    }
  };

  // ─── Paso 2: Verificar código ───
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.post('/api/auth/verify-reset-code', {
        email,
        code,
      });
      // El backend devuelve un map con el token para el siguiente paso
      setToken(data.token);
      setStep(STEPS.RESET);
    } catch (err) {
      const remaining = err.response?.data?.attemptsLeft;
      if (remaining !== undefined) {
        setAttemptsLeft(remaining);
      }

      if (err.response?.status === 429) {
        setError('Demasiados intentos. Intenta nuevamente en unos minutos.');
      } else if (err.response?.status === 410) {
        setError('El código ha expirado. Solicita uno nuevo.');
      } else {
        setError(err.response?.data?.message || 'Código inválido. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Paso 3: Cambiar contraseña ───
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/api/auth/reset-password', {
        token,
        newPassword: password,
      });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      if (err.response?.status === 410) {
        setError('El enlace ha expirado. Solicita una nueva recuperación.');
      } else {
        setError(err.response?.data?.message || 'Error al cambiar la contraseña. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Manejo de inputs de código (6 dígitos separados) ───
  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = code.split('');
    newCode[index] = value.slice(-1);
    const joined = newCode.join('').slice(0, 6);
    setCode(joined);

    // Auto-focus siguiente input
    if (value && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setCode(pasted);
    const lastIndex = Math.min(pasted.length, 5);
    codeInputsRef.current[lastIndex]?.focus();
  };

  // ─── Render ───
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage:
          'radial-gradient(at 0% 0%,rgba(0,80,165,.05) 0px,transparent 50%),radial-gradient(at 100% 100%,rgba(215,20,26,.03) 0px,transparent 50%)',
      }}
    >
      <main className="w-full max-w-[420px] space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-16 h-16 bg-[#003a7a] rounded-full mb-4 shadow-lg shadow-blue-900/20"
          >
            <span className="material-symbols-outlined text-white text-3xl">lock_reset</span>
          </Link>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-[#003a7a]">
            Recuperar Contraseña
          </h1>
          <p className="text-[#424752] text-sm px-6">
            {step === STEPS.EMAIL && 'Ingresa tu email y te enviaremos un código para restablecer tu contraseña.'}
            {step === STEPS.VERIFY && 'Revisa tu correo e ingresa el código de 6 dígitos que te enviamos.'}
            {step === STEPS.RESET && 'Ingresa tu nueva contraseña.'}
            {step === STEPS.SUCCESS && '¡Tu contraseña ha sido actualizada exitosamente!'}
          </p>
        </header>

        {/* Indicador de pasos */}
        {step !== STEPS.SUCCESS && (
          <div className="flex items-center justify-center gap-2">
            {[STEPS.EMAIL, STEPS.VERIFY, STEPS.RESET].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s
                      ? 'bg-[#0050A5] text-white'
                      : [STEPS.EMAIL, STEPS.VERIFY, STEPS.RESET].indexOf(step) > i
                      ? 'bg-[#d1fae5] text-[#065f46]'
                      : 'bg-[#e4e2e2] text-[#424752]'
                  }`}
                >
                  {[STEPS.EMAIL, STEPS.VERIFY, STEPS.RESET].indexOf(step) > i ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-8 h-0.5 ${
                      [STEPS.EMAIL, STEPS.VERIFY, STEPS.RESET].indexOf(step) > i
                        ? 'bg-[#0050A5]'
                        : 'bg-[#e4e2e2]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Card principal */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e4e2e2]/30">
          {/* ─── PASO 1: Email ─── */}
          {step === STEPS.EMAIL && (
            <form className="space-y-5" onSubmit={handleSendEmail}>
              <div>
                <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                  Email registrado
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm"
                    placeholder="nombre@ejemplo.cl"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {error && <ErrorMessage message={error} />}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar código de recuperación{' '}
                    <span className="material-symbols-outlined text-lg">send</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ─── PASO 2: Verificar código ─── */}
          {step === STEPS.VERIFY && (
            <form className="space-y-5" onSubmit={handleVerifyCode}>
              {/* Mensaje informativo */}
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#1d4ed8] mt-0.5">info</span>
                <div>
                  <p className="text-sm text-[#1e40af] font-medium">
                    Si el correo existe en nuestro sistema, recibirás instrucciones para recuperar tu cuenta.
                  </p>
                  <p className="text-xs text-[#3b82f6] mt-1">El código expira en 15 minutos.</p>
                </div>
              </div>

              {/* Inputs de código */}
              <div>
                <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-3">
                  Código de verificación
                </label>
                <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => (codeInputsRef.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={code[i] || ''}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] transition-all"
                      aria-label={`Dígito ${i + 1} del código`}
                    />
                  ))}
                </div>
                {attemptsLeft < 5 && (
                  <p className="text-xs text-[#737783] text-center mt-2">
                    {attemptsLeft} intento{attemptsLeft !== 1 ? 's' : ''} restante{attemptsLeft !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {error && <ErrorMessage message={error} />}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Verificando...
                  </>
                ) : (
                  <>
                    Verificar código{' '}
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </>
                )}
              </button>

              {/* Reenviar código */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setCode('');
                    handleSendEmail({ preventDefault: () => {} });
                  }}
                  className="text-xs text-[#003a7a] font-semibold hover:underline"
                >
                  ¿No recibiste el código? Reenviar
                </button>
              </div>
            </form>
          )}

          {/* ─── PASO 3: Nueva contraseña ─── */}
          {step === STEPS.RESET && (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              <div>
                <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm"
                    placeholder="Mínimo 8 caracteres"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                    <span className="material-symbols-outlined text-xl">lock_reset</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm"
                    placeholder="Repite tu nueva contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Indicador de fortaleza */}
              <PasswordStrength password={password} />

              {error && <ErrorMessage message={error} />}

              <button
                type="submit"
                disabled={loading || password.length < 8}
                className="w-full bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Cambiando contraseña...
                  </>
                ) : (
                  <>
                    Cambiar contraseña{' '}
                    <span className="material-symbols-outlined text-lg">shield</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ─── PASO 4: Éxito ─── */}
          {step === STEPS.SUCCESS && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-[#d1fae5] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#065f46] text-4xl">check_circle</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-[#065f46] font-headline">
                  Contraseña actualizada
                </p>
                <p className="text-xs text-[#424752] mt-2">
                  Tu contraseña ha sido cambiada exitosamente. Todas las sesiones activas han sido cerradas por
                  seguridad. Inicia sesión con tu nueva contraseña.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors"
              >
                Ir a iniciar sesión{' '}
                <span className="material-symbols-outlined text-lg">login</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center space-y-3">
          {step !== STEPS.SUCCESS && (
            <p className="text-sm text-[#424752]">
              ¿Recordaste tu contraseña?{' '}
              <Link to="/login" className="text-[#003a7a] font-bold">
                Ingresar
              </Link>
            </p>
          )}
          <Link to="/" className="text-sm text-[#424752] hover:text-[#003a7a]">
            &larr; Volver al inicio
          </Link>
        </footer>
      </main>
    </div>
  );
}

// ─── Componentes auxiliares ───

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
      <span className="material-symbols-outlined text-red-600 text-lg mt-0.5">error</span>
      <p className="text-xs text-red-700">{message}</p>
    </div>
  );
}

function PasswordStrength({ password }) {
  const getStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: 'Débil', color: 'bg-red-400' };
    if (score <= 3) return { level: 2, label: 'Media', color: 'bg-yellow-400' };
    if (score <= 4) return { level: 3, label: 'Fuerte', color: 'bg-green-400' };
    return { level: 4, label: 'Muy fuerte', color: 'bg-green-600' };
  };

  const { level, label, color } = getStrength();

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= level ? color : 'bg-[#e4e2e2]'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-[#737783] ml-1">Fortaleza: {label}</p>
    </div>
  );
}
