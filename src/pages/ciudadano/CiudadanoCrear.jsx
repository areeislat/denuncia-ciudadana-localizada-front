import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import apiClient from '../../config/api';
import MapComponent from '../../components/MapComponent';
import CiudadanoFooter from '../../components/CiudadanoFooter';
import CiudadanoHeader from '../../components/CiudadanoHeader';

export default function CiudadanoCrear() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: 'Bache / Pavimento', description: '', address: '' });
  const [coords, setCoords] = useState({ lat: -33.4569, lng: -70.6483 });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await apiClient.post('/api/reports', {
        category: form.category,
        description: form.description,
        latitude: coords.lat,
        longitude: coords.lng,
        address: form.address,
      });
      navigate('/ciudadano/reportes');
    } catch (err) {
      const msg = err.response?.data?.description?.[0] || err.response?.data?.message || 'Error al enviar el reporte.';
      setError(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <CiudadanoHeader activePage="crear" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h1 className="font-headline text-2xl font-bold mb-1 text-[#003a7a]">Reportar un Problema</h1>
        <p className="text-[#424752] text-sm mb-6">Completa los detalles para que podamos resolverlo.</p>

        {/* Progress */}
        <div className="flex items-center justify-between relative mb-8 max-w-md">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#e4e2e2] -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-[#0050A5] -translate-y-1/2 z-0" style={{ width: '50%' }}></div>
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#0050A5] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-sm fill-icon">check</span>
            </div>
            <span className="text-[9px] font-bold text-[#003a7a] uppercase">Categoría</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#0050A5] text-white flex items-center justify-center ring-4 ring-[#d7e2ff] shadow-md">
              <span className="text-xs font-bold">2</span>
            </div>
            <span className="text-[9px] font-bold text-[#003a7a] uppercase">Detalles</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#e4e2e2] text-[#424752] flex items-center justify-center">
              <span className="text-xs font-bold">3</span>
            </div>
            <span className="text-[9px] font-bold text-[#424752] uppercase">Confirmar</span>
          </div>
        </div>

        {/* Two-column layout on desktop */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-5">
            <div>
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Categoría</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#003a7a]"
              >
                <option>Bache / Pavimento</option>
                <option>Luminaria Dañada</option>
                <option>Basura Ilegal</option>
                <option>Microbasural</option>
                <option>Infraestructura Vial</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Descripción del Problema</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={1000}
                className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                rows="5"
                placeholder="Describe el problema con al menos 10 caracteres..."
              />
              <p className="text-[10px] text-[#737783] mt-1">Mínimo 10 caracteres, máximo 1000.</p>
            </div>
            <div>
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Dirección (opcional)</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                placeholder="Ej: Av. Principal 123, Santiago"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {enviando ? (
                  <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Enviando...</>
                ) : (
                  <>Enviar Reporte <span className="material-symbols-outlined text-sm">send</span></>
                )}
              </button>
              <Link
                to="/ciudadano"
                className="px-6 text-[#424752] font-headline font-bold py-4 rounded-xl hover:bg-[#f5f3f3] transition-colors flex items-center justify-center"
              >
                Cancelar
              </Link>
            </div>
          </div>

          {/* Right: Map for location */}
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
            <p className="text-[10px] text-[#737783] mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span>
              Puedes crear reportes en cualquier comuna. La ubicación del problema se registra automáticamente.
            </p>
          </div>
        </form>
      </main>

      <CiudadanoFooter />
    </div>
  );
}
