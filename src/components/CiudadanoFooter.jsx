import { Link } from 'react-router-dom';

export default function CiudadanoFooter() {
  return (
    <footer className="bg-[#001A33] py-12 px-4 md:px-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-headline font-bold text-white text-lg mb-3">DESIGEO</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Plataforma municipal de denuncia ciudadana geolocalizada.
          </p>
        </div>
        <div>
          <h4 className="font-headline font-bold text-white text-sm mb-3">Enlaces</h4>
          <div className="flex flex-col gap-2">
            <Link to="/terminos" className="text-slate-400 hover:text-white text-sm">
              Términos de Uso y Privacidad
            </Link>
            <Link to="/transparencia" className="text-slate-400 hover:text-white text-sm">
              Transparencia
            </Link>
            <Link to="/ayuda" className="text-slate-400 hover:text-white text-sm">
              Ayuda
            </Link>
          </div>
        </div>
        <div>
          <h4 className="font-headline font-bold text-white text-sm mb-3">Mi Cuenta</h4>
          <div className="flex flex-col gap-2">
            <Link to="/ciudadano/perfil" className="text-slate-400 hover:text-white text-sm">
              Mi Perfil
            </Link>
            <Link to="/ciudadano/reportes" className="text-slate-400 hover:text-white text-sm">
              Mis Reportes
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-center">
        <p className="text-slate-500 text-xs">
          &copy; 2026 DESIGEO — Plataforma de Denuncia Ciudadana Geolocalizada
        </p>
      </div>
    </footer>
  );
}
