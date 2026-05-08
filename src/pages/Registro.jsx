import { Link } from 'react-router-dom';

export default function Registro() {
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

          <form className="space-y-4">
            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm"
                  placeholder="Ej: María González Torres"
                  type="text"
                />
              </div>
            </div>

            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                RUT
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">badge</span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm"
                  placeholder="12.345.678-9"
                  type="text"
                />
              </div>
              <p className="text-[10px] text-[#737783] mt-1 ml-1">Formato: XX.XXX.XXX-X</p>
            </div>

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
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <input
                  className="block w-full pl-11 pr-10 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm"
                  placeholder="Mínimo 8 caracteres"
                  type="password"
                />
              </div>
            </div>

            <div>
              <label className="block font-headline text-xs font-bold text-[#424752] ml-1 uppercase tracking-wider mb-1.5">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424752]">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-[#e4e2e2] border-none rounded-xl focus:ring-2 focus:ring-[#003a7a] text-sm"
                  placeholder="Repite tu contraseña"
                  type="password"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" className="mt-1 accent-[#0050A5] w-4 h-4 rounded" />
              <span className="text-xs text-[#424752]">
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

            <Link
              to="/ciudadano"
              className="w-full bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2"
            >
              Crear Cuenta <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e4e2e2]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#737783] font-bold tracking-widest">O registrarse con</span>
            </div>
          </div>
          <Link
            to="/ciudadano"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#c2c6d4] rounded-xl hover:bg-[#f5f3f3] transition-colors"
          >
            <span className="material-symbols-outlined text-[#003a7a] fill-icon">fingerprint</span>
            <span className="text-sm font-semibold font-headline">Clave Única</span>
          </Link>
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
