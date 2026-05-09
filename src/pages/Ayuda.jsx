import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Ayuda() {
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
            Centro de Ayuda
          </h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1b1c1c] mb-4 font-headline">¿Cómo crear un reporte?</h2>
            <div className="space-y-4 text-[#424752] leading-relaxed">
              <p>
                Crear un reporte es sencillo. Solo necesitas iniciar sesión en tu cuenta, dirigirte
                a la sección de creación, indicar la ubicación en el mapa, seleccionar la categoría
                del problema, agregar una descripción y, de ser posible, una fotografía del incidente.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1b1c1c] mb-4 font-headline">Estado de mis reportes</h2>
            <div className="space-y-4 text-[#424752] leading-relaxed">
              <p>
                Puedes hacer seguimiento a tus reportes en el panel principal. Los estados posibles son:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong className="text-[#1b1c1c]">Pendiente:</strong> El reporte ha sido recibido pero no ha sido revisado aún.</li>
                <li><strong className="text-[#1b1c1c]">En Proceso:</strong> Las autoridades están trabajando en la solución.</li>
                <li><strong className="text-[#1b1c1c]">Resuelto:</strong> El incidente ha sido solucionado.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1b1c1c] mb-4 font-headline">Contacto</h2>
            <div className="space-y-4 text-[#424752] leading-relaxed">
              <p>
                Si tienes problemas técnicos con la plataforma o necesitas asistencia adicional,
                por favor contáctanos al correo <strong>soporte@desigeo.cl</strong> o llámanos
                al <strong>+56 9 0000 0000</strong>.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}