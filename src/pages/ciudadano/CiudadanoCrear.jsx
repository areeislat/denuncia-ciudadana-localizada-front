import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import apiClient from '../../config/api';
import MapComponent from '../../components/MapComponent';
import CiudadanoFooter from '../../components/CiudadanoFooter';
import CiudadanoHeader from '../../components/CiudadanoHeader';

const NOMINATIM = 'https://nominatim.openstreetmap.org';

export default function CiudadanoCrear() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: 'Bache / Pavimento', description: '', address: '' });
  const [coords, setCoords] = useState({ lat: -33.4569, lng: -70.6483 });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [comunaNombre, setComunaNombre] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [procesandoFotos, setProcesandoFotos] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Dirección → pin (geocoding directo)
  const handleBuscarDireccion = async () => {
    if (!form.address.trim()) return;
    setBuscando(true);
    try {
      const res = await fetch(
        `${NOMINATIM}/search?q=${encodeURIComponent(form.address)}&format=json&limit=1&countrycodes=cl&addressdetails=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        const addr = data[0].address || {};
        setComunaNombre(addr.city || addr.municipality || addr.town || addr.county || '');
      }
    } catch {
      // silencioso — el usuario puede seguir usando el mapa manualmente
    } finally {
      setBuscando(false);
    }
  };

  const handleAgregarFotos = async (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - imagenes.length);
    if (!files.length) return;
    setProcesandoFotos(true);
    try {
      const nuevas = await Promise.all(files.map(async (file) => {
        const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true });
        const base64 = await imageCompression.getDataUrlFromFile(compressed);
        return { preview: URL.createObjectURL(compressed), base64 };
      }));
      setImagenes((prev) => [...prev, ...nuevas]);
    } catch { /* silencioso */ }
    finally { setProcesandoFotos(false); e.target.value = ''; }
  };

  const handleEliminarFoto = (index) => {
    setImagenes((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Pin → dirección (geocoding inverso)
  const handleLocationChange = async (lat, lng) => {
    setCoords({ lat, lng });
    try {
      const res = await fetch(`${NOMINATIM}/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      if (data.display_name) {
        setForm((prev) => ({ ...prev, address: data.display_name }));
        const addr = data.address || {};
        setComunaNombre(addr.city || addr.municipality || addr.town || addr.county || '');
      }
    } catch {
      // silencioso
    }
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
        comunaNombre,
        images: imagenes.map((img) => img.base64),
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
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Dirección</label>
              <div className="flex gap-2">
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleBuscarDireccion())}
                  className="flex-1 bg-[#e4e2e2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                  placeholder="Ej: Av. Principal 123, Santiago"
                />
                <button
                  type="button"
                  onClick={handleBuscarDireccion}
                  disabled={buscando}
                  className="bg-[#003a7a] text-white px-3 rounded-xl hover:bg-[#0050A5] transition-colors disabled:opacity-60"
                  title="Buscar dirección en el mapa"
                >
                  {buscando
                    ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    : <span className="material-symbols-outlined text-sm">search</span>
                  }
                </button>
              </div>
              <p className="text-[10px] text-[#737783] mt-1">Escribe y presiona buscar, o arrastra el pin en el mapa.</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-headline text-sm font-bold">Fotos de Evidencia</span>
                <span className="text-xs text-[#424752]">{imagenes.length} / 5 fotos</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {imagenes.map((img, i) => (
                  <div key={i} className="relative aspect-square">
                    <img src={img.preview} alt="" className="w-full h-full object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => handleEliminarFoto(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[10px]">close</span>
                    </button>
                  </div>
                ))}
                {imagenes.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={procesandoFotos}
                    className="aspect-square rounded-xl bg-[#e4e2e2] flex flex-col items-center justify-center border-2 border-dashed border-[#c2c6d4] text-[#737783] hover:bg-[#dbd9d9] transition-colors disabled:opacity-60"
                  >
                    {procesandoFotos
                      ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      : <><span className="material-symbols-outlined">add_a_photo</span><span className="text-[8px] font-bold mt-1">Agregar</span></>
                    }
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAgregarFotos} />
              <p className="text-[10px] text-[#737783] mt-1">JPG, PNG o HEIC. Máximo 5 MB cada una.</p>
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

          {/* Right: Map */}
          <div>
            <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-2">Ubicación del Reporte</label>
            <MapComponent
              markers={[]}
              height="340px"
              draggablePin
              pinPosition={[coords.lat, coords.lng]}
              onLocationChange={handleLocationChange}
            />
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-[#efeded] mt-3">
              <div className="w-9 h-9 bg-blue-50 text-[#003a7a] rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">location_on</span>
              </div>
              <div>
                <p className="text-[9px] text-[#424752] font-bold uppercase tracking-wider">Coordenadas seleccionadas</p>
                <p className="text-xs font-semibold text-[#1b1c1c]">
                  {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <CiudadanoFooter />
    </div>
  );
}
