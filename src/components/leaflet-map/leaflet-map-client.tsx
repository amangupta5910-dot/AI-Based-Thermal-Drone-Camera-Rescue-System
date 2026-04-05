"use client";

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'disaster' | 'drone' | 'iot_device' | 'shelter' | 'rescue_team';
  status: 'critical' | 'high' | 'medium' | 'low' | 'online' | 'offline' | 'warning' | 'active' | 'emergency' | 'idle' | 'maintenance';
  title: string;
  description?: string;
  icon?: string;
  severity?: string;
  popup?: React.ReactNode;
}

interface LeafletMapClientProps {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  showControls: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
}

export default function LeafletMapClient({
  center,
  zoom,
  markers,
  showControls,
  onMarkerClick
}: LeafletMapClientProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  const getMarkerColor = (type: string, status: string) => {
    switch (type) {
      case 'disaster':
        switch (status) {
          case 'critical': return '#dc2626';
          case 'high': return '#ea580c';
          case 'medium': return '#ca8a04';
          case 'low': return '#16a34a';
          default: return '#6b7280';
        }
      case 'drone':
        switch (status) {
          case 'active': return '#16a34a';
          case 'emergency': return '#dc2626';
          case 'idle': return '#ca8a04';
          case 'maintenance': return '#6b7280';
          default: return '#6b7280';
        }
      case 'iot_device':
        switch (status) {
          case 'online': return '#16a34a';
          case 'offline': return '#6b7280';
          case 'warning': return '#ca8a04';
          case 'critical': return '#dc2626';
          default: return '#6b7280';
        }
      case 'shelter':
        return '#2563eb';
      case 'rescue_team':
        return '#7c3aed';
      default:
        return '#6b7280';
    }
  };

  const getMarkerRadius = (type: string, status: string) => {
    switch (type) {
      case 'disaster':
        switch (status) {
          case 'critical': return 12;
          case 'high': return 10;
          case 'medium': return 8;
          case 'low': return 6;
          default: return 6;
        }
      case 'drone':
        return 8;
      case 'iot_device':
        return 6;
      case 'shelter':
        return 8;
      case 'rescue_team':
        return 8;
      default:
        return 6;
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {markers.filter(marker => marker.lat !== undefined && marker.lng !== undefined).map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={getMarkerRadius(marker.type, marker.status)}
          color={getMarkerColor(marker.type, marker.status)}
          fillColor={getMarkerColor(marker.type, marker.status)}
          fillOpacity={0.7}
          weight={2}
          eventHandlers={{
            click: () => onMarkerClick?.(marker)
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-sm mb-1">{marker.title}</h3>
              {marker.description && (
                <p className="text-xs text-gray-600 mb-2">{marker.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded text-white" 
                      style={{ backgroundColor: getMarkerColor(marker.type, marker.status) }}>
                  {marker.status.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {marker.type.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              {marker.popup && (
                <div className="mt-2">
                  {marker.popup}
                </div>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}