"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (window as any).L.Icon.Default.prototype._getIconUrl;
(window as any).L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface DisasterPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'flood' | 'earthquake' | 'fire' | 'storm' | 'landslide';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected: number;
  timestamp: string;
}

interface ReactLeafletMapProps {
  disasters: DisasterPoint[];
}

export default function ReactLeafletMap({ disasters }: ReactLeafletMapProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'; // red
      case 'high': return '#ea580c'; // orange
      case 'medium': return '#ca8a04'; // yellow
      case 'low': return '#16a34a'; // green
      default: return '#6b7280'; // gray
    }
  };

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'flood': return '💧';
      case 'earthquake': return '🌋';
      case 'fire': return '🔥';
      case 'storm': return '🌪️';
      case 'landslide': return '⛰️';
      default: return '⚠️';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">CRITICAL</span>;
      case 'high': return <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded">HIGH</span>;
      case 'medium': return <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded">MEDIUM</span>;
      case 'low': return <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">LOW</span>;
      default: return <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded">UNKNOWN</span>;
    }
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {disasters.map((disaster) => (
        <CircleMarker
          key={disaster.id}
          center={[disaster.lat, disaster.lng]}
          radius={8 + (disaster.severity === 'critical' ? 12 : disaster.severity === 'high' ? 8 : disaster.severity === 'medium' ? 4 : 2)}
          color={getSeverityColor(disaster.severity)}
          fillColor={getSeverityColor(disaster.severity)}
          fillOpacity={0.6}
          weight={2}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{disaster.title}</h3>
                <span className="text-lg">{getDisasterIcon(disaster.type)}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{disaster.description}</p>
              <div className="flex items-center justify-between mb-2">
                {getSeverityBadge(disaster.severity)}
                <span className="text-xs text-gray-500">
                  {new Date(disaster.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="text-xs">
                <span className="font-medium">Affected:</span> {disaster.affected.toLocaleString()} people
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}