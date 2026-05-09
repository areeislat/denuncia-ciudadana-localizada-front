import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Limpiar error del campo al escribir
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email no válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'Mínimo 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Debe incluir mayúscula, minúscula y número';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Debes aceptar los términos';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    try {
      setLoading(true);
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        roleId: 1, // Ciudadano
      });

      setSuccess(true);
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage:
          'radial-gradient(at 0% 0%,rgba(0,80,165,.05) 0px,transparent 50%),radial-gradient(at 100% 100%,rgba(215,20,26,.03) 0px,transparent 50%)',
      }}
    >
      <main className="w-full max-w-[420px] space-y-8">
        <header className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-16 h-16 bg-[#003a7a] rounded-full mb-4 shadow-lg shadow-blue-900/20"
          >
            <span className="material-symbols-outlined text-white text-3xl">location_on</span>
          </Link>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-[#003a7a]">DESIGEO</h1>
          <p className="text-[#424752] text-sm px-8">Crea tu cuenta para reportar incidencias en tu comunidad.</p>
        </header>

        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e4e2e2]/30">
          <div className="flex p-1 bg-[#f5f3f3] rounded-2xl mb-6">
            <Link
              to="/login"
              className="flex-1 py-3 text-sm font-semibold font-headline rounded-xl text-[#424752] text-center hover:text-[#003a7a]"
            >
              Ingresar
            </Link>
            <span className="flex-1 py-3 text-sm font-semibold font-headline rounded-xl bg-white text-[#003a7a] shadow-sm text-center">
              Registrarse
            </span>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
              <div>
                <p className="text-sm font-semibold text-green-700">¡Cuenta creada exitosamente!</p>
                <p className="text-xs text-green-600">Redirigiendo al login...</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-lg">error</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nombre completo */}
            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <input
                  className={`block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm ${validationErrors.fullName ? 'ring-2 ring-red-400' : ''}`}
                  placeholder="Ej: María González Torres"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading || success}
                  autoComplete="name"
                />
              </div>
              {validationErrors.fullName && (
                <p className="text-xs text-red-500 mt-1 ml-1">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <input
                  className={`block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm ${validationErrors.email ? 'ring-2 ring-red-400' : ''}`}
                  placeholder="nombre@ejemplo.cl"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading || success}
                  autoComplete="email"
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs text-red-500 mt-1 ml-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                Teléfono (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">phone</span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm"
                  placeholder="+56 9 1234 5678"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading || success}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <input
                  className={`block w-full pl-11 pr-10 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm ${validationErrors.password ? 'ring-2 ring-red-400' : ''}`}
                  placeholder="Mínimo 8 caracteres"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading || success}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#424752] hover:text-[#003a7a]"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-xs text-red-500 mt-1 ml-1">{validationErrors.password}</p>
              )}
              {formData.password && !validationErrors.password && (
                <p className="text-xs text-green-600 mt-1 ml-1">✓ Contraseña válida</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <input
                  className={`block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm ${validationErrors.confirmPassword ? 'ring-2 ring-red-400' : ''}`}
                  placeholder="Repite tu contraseña"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading || success}
                  autoComplete="new-password"
                />
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 ml-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Términos */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 accent-[#0050A5] w-4 h-4 rounded"
                disabled={loading || success}
              />
              <span className={`text-xs ${validationErrors.acceptTerms ? 'text-red-500' : 'text-[#424752]'}`}>
                Acepto los{' '}
                <a href="#" className="text-[#003a7a] font-bold hover:underline">
                  Términos de Uso
                </a>{' '}
                y la{' '}
                <a href="#" className="text-[#003a7a] font-bold hover:underline">
                  Política de Privacidad
                </a>
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </>
              ) : success ? (
                <>
                  <span className="material-symbols-outlined text-lg">check</span>
                  ¡Cuenta creada!
                </>
              ) : (
                <>
                  Crear Cuenta <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e4e2e2]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#737783] font-bold tracking-widest">O registrarse con</span>
            </div>
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#c2c6d4] rounded-xl hover:bg-[#f5f3f3] transition-colors"
            onClick={() => alert('Clave Única no disponible aún')}
          >
            <span className="material-symbols-outlined text-[#003a7a] fill-icon">fingerprint</span>
            <span className="text-sm font-semibold font-headline">Clave Única</span>
          </button>
        </div>

        <footer className="text-center space-y-3">
          <p className="text-sm text-[#424752]">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#003a7a] font-bold">
              Ingresar
            </Link>
          </p>
          <Link to="/" className="text-sm text-[#424752] hover:text-[#003a7a]">
            &larr; Volver al inicio
          </Link>
        </footer>
      </main>
    </div>
  );
}
