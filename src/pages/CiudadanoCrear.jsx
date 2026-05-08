import { Link } from 'react-router-dom';

export default function CiudadanoCrear() {
  return (
    <div className="min-h-screen bg-[#fbf9f8]">
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/ciudadano" className="text-white">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <span className="text-lg font-extrabold text-white font-headline">Nuevo Reporte</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">
            MG
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <div className="mb-6 md:mb-8">
          <h1 className="font-headline text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-[#003a7a]">
            Reportar un Problema
          </h1>
          <p className="text-[#424752] text-sm md:text-base">
            Completa los detalles para que podamos resolverlo.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 lg:p-8 shadow-sm border border-[#f5f3f3]">
          <form className="space-y-5 md:space-y-6">
            <div>
              <label className="block font-headline text-sm md:text-base font-bold text-[#1b1c1c] mb-2">
                Categoría
              </label>
              <select className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#003a7a]">
                <option>Bache / Pavimento</option>
                <option>Luminaria Dañada</option>
                <option>Basura Ilegal</option>
                <option>Microbasural</option>
                <option>Infraestructura Vial</option>
                <option>Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-headline text-sm md:text-base font-bold text-[#1b1c1c] mb-2">
                Título del Reporte
              </label>
              <input
                className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 md:py-3.5 focus:ring-2 focus:ring-[#003a7a] text-sm md:text-base"
                placeholder="Ej: Bache de gran tamaño en cruce peatonal"
              />
            </div>

            <div>
              <label className="block font-headline text-sm md:text-base font-bold text-[#1b1c1c] mb-2">
                Descripción del Problema
              </label>
              <textarea
                className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 md:py-3.5 focus:ring-2 focus:ring-[#003a7a] text-sm md:text-base resize-none"
                rows="4"
                placeholder="Describe el problema con al menos 10 caracteres..."
              ></textarea>
              <p className="text-[10px] md:text-xs text-[#737783] mt-1.5">Mínimo 10 caracteres, máximo 1000.</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-headline text-sm md:text-base font-bold">Fotos de Evidencia</span>
                <span className="text-xs md:text-sm text-[#424752]">0 / 5 fotos</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                <button
                  type="button"
                  className="aspect-square rounded-xl bg-[#e4e2e2] flex flex-col items-center justify-center border-2 border-dashed border-[#c2c6d4] text-[#737783] hover:bg-[#dbd9d9] transition-colors"
                >
                  <span className="material-symbols-outlined text-xl md:text-2xl">add_a_photo</span>
                  <span className="text-[8px] md:text-[9px] font-bold mt-1">Agregar</span>
                </button>
              </div>
              <p className="text-[10px] md:text-xs text-[#737783] mt-2">JPG, PNG o HEIC. Máximo 5 MB cada una.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6">
              <Link
                to="/ciudadano/reportes"
                className="flex-1 bg-[#0050A5] text-white font-headline font-bold py-3 md:py-4 rounded-xl shadow-lg hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Enviar Reporte <span className="material-symbols-outlined text-base md:text-lg">send</span>
              </Link>
              <Link
                to="/ciudadano"
                className="px-6 text-[#424752] font-headline font-bold py-3 md:py-4 rounded-xl hover:bg-[#f5f3f3] transition-colors flex items-center justify-center text-sm md:text-base border border-[#e4e2e2]"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
