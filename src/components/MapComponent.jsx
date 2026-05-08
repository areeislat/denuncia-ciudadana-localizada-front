import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Función para crear iconos personalizados
const createCustomIcon = (color, number) => {
  return L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export default function MapComponent({ markers = [], center = [-33.426, -70.61], zoom = 14, height = '400px' }) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }} className="rounded-2xl border border-[#e4e2e2] shadow-sm">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]} icon={createCustomIcon(marker.color, marker.n)}>
          <Popup>
            <b>{marker.title}</b>
            <br />
            <span style={{ fontSize: '11px' }}>{marker.n} apoyos</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
