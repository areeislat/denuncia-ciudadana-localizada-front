import React from 'react';
import { Link } from 'react-router-dom';

export default function TerminosYPrivacidad() {
  return (
    <div className="min-h-screen bg-[#fbf9f8] p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-[#e4e2e2]">
        <Link to="/registro" className="inline-flex items-center text-[#003a7a] hover:underline mb-6 font-semibold">
          <span className="material-symbols-outlined mr-2">arrow_back</span>
          Volver al registro
        </Link>
        <h1 className="text-3xl font-bold text-[#003a7a] mb-6 font-headline">Términos de Uso y Política de Privacidad</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#424752] mb-4">Términos de Uso</h2>
          <p className="text-[#737783] mb-4">
            Al utilizar DESIGEO, aceptas que la información proporcionada es veraz y asumes la responsabilidad
            del uso de la plataforma. La cuenta es personal e intransferible.
          </p>
          <p className="text-[#737783] mb-4">
            Nos reservamos el derecho de suspender o eliminar cuentas que incumplan estas normas o
            generen reportes falsos repetitivamente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#424752] mb-4">Política de Privacidad</h2>
          <p className="text-[#737783] mb-4">
            Tus datos personales son recogidos únicamente con el fin de gestionar tu cuenta y permitir
            la correcta gestión de los reportes ingresados.
          </p>
          <p className="text-[#737783] mb-4">
            No compartiremos tu información con terceros con fines comerciales sin tu consentimiento explícito.
            Mantenemos protocolos de seguridad para proteger tu información.
          </p>
        </section>
      </div>
    </div>
  );
}
