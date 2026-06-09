import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createCustomIcon = (color, number) =>
  L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom(), { duration: 0.8 });
  }, [position[0], position[1]]);
  return null;
}

export default function MapComponent({
  markers = [],
  center = [-33.426, -70.61],
  zoom = 14,
  height = '400px',
  draggablePin = false,
  pinPosition = null,
  onLocationChange = null,
}) {
  const position = pinPosition ?? center;

  return (
    <MapContainer
      center={position}
      zoom={draggablePin ? 16 : zoom}
      style={{ height, width: '100%' }}
      className="rounded-2xl border border-[#e4e2e2] shadow-sm"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {draggablePin && (
        <>
          {pinPosition && <FlyToLocation position={pinPosition} />}
          <Marker
            position={position}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                if (onLocationChange) onLocationChange(lat, lng);
              },
            }}
          >
            <Popup>Arrastra para ajustar ubicación</Popup>
          </Marker>
        </>
      )}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lng]}
          icon={createCustomIcon(marker.color, marker.n)}
        >
          <Popup>
            <b>{marker.title}</b>
            <br />
            <span style={{ fontSize: '11px' }}>
              {marker.status ? `Estado: ${marker.status} · ` : ''}{marker.n} apoyos
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
