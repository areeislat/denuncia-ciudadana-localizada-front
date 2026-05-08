import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Recuperar() {
  const [showSuccess, setShowSuccess] = useState(false);

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
            <span className="material-symbols-outlined text-white text-3xl">lock_reset</span>
          </Link>
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-[#003a7a]">
            Recuperar Contraseña
          </h1>
          <p className="text-[#424752] text-sm px-6">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </header>

        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e4e2e2]/30">
          <form className="space-y-5">
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
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccess(true)}
              className="w-full bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2"
            >
              Enviar enlace de recuperación <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>

          {showSuccess && (
            <div className="mt-5 bg-[#d1fae5] border border-[#a7f3d0] rounded-xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#065f46] fill-icon mt-0.5">check_circle</span>
              <div>
                <p className="text-sm font-bold text-[#065f46] font-headline">Enlace enviado</p>
                <p className="text-xs text-[#065f46] mt-1">
                  Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña. El enlace
                  expira en 30 minutos.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center space-y-3">
          <p className="text-sm text-[#424752]">
            ¿Recordaste tu contraseña?{' '}
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
