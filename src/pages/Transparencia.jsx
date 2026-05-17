import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CiudadanoHeader from '../components/CiudadanoHeader';
import CiudadanoFooter from '../components/CiudadanoFooter';
import useAuthStore from '../store/authStore';

export default function Transparencia() {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const isAuthenticated = !!token;
  const isCitizen = user?.roleName === 'CITIZEN';

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col">
      {isAuthenticated && isCitizen ? <CiudadanoHeader /> : <Header />}
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
            Transparencia
          </h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1b1c1c] mb-4 font-headline">Compromiso con la Transparencia</h2>
            <div className="space-y-4 text-[#424752] leading-relaxed">
              <p>
                En DESIGEO, creemos firmemente en la importancia de la transparencia y el libre acceso a la 
                información pública como pilares fundamentales para una gestión municipal eficiente y 
                participativa.
              </p>
              <p>
                Todos los datos estadísticos generados a partir de los reportes ciudadanos, excluyendo la 
                información personal y sensible de los usuarios, están a disposición de la comunidad para 
                promover la auditoría ciudadana y el análisis urbano.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1b1c1c] mb-4 font-headline">Datos Abiertos</h2>
            <div className="space-y-4 text-[#424752] leading-relaxed">
              <p>
                Trabajamos activamente en generar reportes mensuales y anuales accesibles sobre la cantidad de 
                incidencias, tiempos de resolución y categorías más frecuentes, asegurando que cada ciudadano 
                conozca el progreso de las mejoras en la ciudad.
              </p>
              <p>
                Para solicitudes de información específica de acuerdo a la Ley de Transparencia, puedes 
                contactarte con los canales oficiales de tu municipio.
              </p>
            </div>
          </section>
        </div>
      </main>
      {isAuthenticated && isCitizen ? <CiudadanoFooter /> : <Footer />}
    </div>
  );
}
