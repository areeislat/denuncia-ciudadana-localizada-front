import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MapComponent from '../../../components/MapComponent';
import MunicipalSidebar from '../../../components/MunicipalSidebar';

export default function MunicipalCrearReporte() {
  const navigate = useNavigate();

  return (
    <div>
      <MunicipalSidebar />

      <main className="md:ml-60 p-4 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-[#424752] hover:text-[#1b1c1c]">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Crear Reporte</h2>
            <p className="text-[#424752] text-sm">Registra un nuevo problema en tu municipio.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="space-y-5">
            <div>
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Categoría</label>
              <select className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#003a7a]">
                <option>Bache / Pavimento</option>
                <option>Luminaria Dañada</option>
                <option>Basura Ilegal</option>
                <option>Microbasural</option>
                <option>Infraestructura Vial</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Título del Reporte</label>
              <input
                className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                placeholder="Ej: Bache de gran tamaño en cruce peatonal"
              />
            </div>
            <div>
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Descripción del Problema</label>
              <textarea
                className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                rows="4"
                placeholder="Describe el problema con al menos 10 caracteres..."
              ></textarea>
              <p className="text-[10px] text-[#737783] mt-1">Mínimo 10 caracteres, máximo 1000.</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-headline text-sm font-bold">Fotos de Evidencia</span>
                <span className="text-xs text-[#424752]">0 / 5 fotos</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                <button
                  type="button"
                  className="aspect-square rounded-xl bg-[#e4e2e2] flex flex-col items-center justify-center border-2 border-dashed border-[#c2c6d4] text-[#737783] hover:bg-[#dbd9d9] transition-colors"
                >
                  <span className="material-symbols-outlined">add_a_photo</span>
                  <span className="text-[8px] font-bold mt-1">Agregar</span>
                </button>
              </div>
              <p className="text-[10px] text-[#737783] mt-1">JPG, PNG o HEIC. Máximo 5 MB cada una.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => navigate('/municipal/gestion')}
                className="flex-1 bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2"
              >
                Enviar Reporte <span className="material-symbols-outlined text-sm">send</span>
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 text-[#424752] font-headline font-bold py-4 rounded-xl hover:bg-[#f5f3f3] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Mapa */}
          <div>
            <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-2">Ubicación del Reporte</label>
            <MapComponent markers={[]} height="340px" draggablePin />
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-[#efeded] mt-3">
              <div className="w-9 h-9 bg-blue-50 text-[#003a7a] rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">streetview</span>
              </div>
              <div>
                <p className="text-[9px] text-[#424752] font-bold uppercase tracking-wider">Dirección detectada por GPS</p>
                <p className="text-sm font-semibold">Arrastra el pin para ajustar la ubicación</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}