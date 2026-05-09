import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);

      // Redirigir según el rol del usuario
      if (data.user && (data.user.roleId >= 2 || data.user.roleName === 'ADMIN' || data.user.roleName === 'MUNICIPAL_OFFICER')) {
        navigate('/panel');
      } else {
        navigate('/ciudadano');
      }
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas. Intenta nuevamente.');
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
          <p className="text-[#424752] text-sm px-8">
            Accede a los servicios municipales y reporta incidencias en tu comunidad.
          </p>
        </header>

        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e4e2e2]/30">
          <div className="flex p-1 bg-[#f5f3f3] rounded-2xl mb-6">
            <span className="flex-1 py-3 text-sm font-semibold font-headline rounded-xl bg-white text-[#003a7a] shadow-sm text-center">
              Ingresar
            </span>
            <Link
              to="/registro"
              className="flex-1 py-3 text-sm font-semibold font-headline rounded-xl text-[#424752] text-center hover:text-[#003a7a]"
            >
              Registrarse
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-lg">error</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                Email
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
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center ml-1 mb-1.5">
                <label className="block font-headline text-xs font-bold text-[#424752] uppercase tracking-wider">
                  Contraseña
                </label>
                <Link to="/recuperar" className="text-xs font-semibold text-[#003a7a] hover:underline">
                  ¿Olvidó su clave?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <input
                  className="block w-full pl-11 pr-10 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0050A5] text-white font-headline font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ingresando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  Ingresar
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e4e2e2]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#737783] font-bold tracking-widest">O entrar con</span>
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

        <footer className="text-center">
          <Link to="/" className="text-sm text-[#424752] hover:text-[#003a7a]">
            &larr; Volver al inicio
          </Link>
        </footer>
      </main>
    </div>
  );
}
