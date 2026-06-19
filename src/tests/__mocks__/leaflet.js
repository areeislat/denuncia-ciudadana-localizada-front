// Mock de Leaflet para evitar errores en jsdom (no tiene DOM canvas/SVG real)
export const map = () => ({
  setView: () => ({}),
  remove: () => {},
  addLayer: () => {},
  removeLayer: () => {},
});

export const tileLayer = () => ({ addTo: () => {} });
export const marker = () => ({ addTo: () => {}, bindPopup: () => ({}) });
export const icon = () => ({});
export const latLng = (lat, lng) => ({ lat, lng });

export default { map, tileLayer, marker, icon, latLng };
