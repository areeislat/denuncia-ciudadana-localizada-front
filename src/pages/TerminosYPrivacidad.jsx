import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TerminosYPrivacidad() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col">
      <Header />
      <main className="flex-1 px-4 md:px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#e4e2e2]">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-[#003a7a] hover:underline mb-8 font-semibold font-headline"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Volver
          </button>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#003a7a] mb-8 font-headline">
            Términos de Uso y Política de Privacidad
          </h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1b1c1c] mb-4 font-headline">Términos de Uso</h2>
            <div className="space-y-4 text-[#424752] leading-relaxed">
              <p>
                Al utilizar DESIGEO, aceptas que la información proporcionada es veraz y asumes la responsabilidad
                del uso de la plataforma. La cuenta es personal e intransferible.
              </p>
              <p>
                El objetivo de esta plataforma es mejorar la gestión urbana permitiendo el reporte de incidencias 
                en la comunidad. El uso inapropiado, la entrega de información falsa o la afectación de 
                derechos de terceros están estrictamente prohibidos.
              </p>
              <p>
                Nos reservamos el derecho de suspender o eliminar cuentas que incumplan estas normas o
                generen reportes falsos repetitivamente.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1b1c1c] mb-4 font-headline">Política de Privacidad</h2>
            <div className="space-y-4 text-[#424752] leading-relaxed">
              <p>
                Tus datos personales son recogidos únicamente con el fin de gestionar tu cuenta y permitir
                la correcta gestión de los reportes ingresados.
              </p>
              <p>
                No compartiremos tu información con terceros con fines comerciales sin tu consentimiento explícito.
                Mantenemos protocolos de seguridad para proteger tu información.
              </p>
              <p>
                Al aceptar estos términos, permites la asociación de tu información de contacto a los 
                reportes generados para fines estadísticos y de resolución por parte de las autoridades 
                correspondientes.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
