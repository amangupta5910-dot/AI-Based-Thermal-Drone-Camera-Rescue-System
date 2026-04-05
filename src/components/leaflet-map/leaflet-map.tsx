"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const LeafletMap = dynamic(
  () => import('./leaflet-map-client'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }
);

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

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  className?: string;
  showControls?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
}

export default function LeafletMapComponent({
  center = [20, 0],
  zoom = 2,
  markers = [],
  height = "400px",
  className = "",
  showControls = true,
  onMarkerClick
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`w-full bg-muted rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <LeafletMap
        center={center}
        zoom={zoom}
        markers={markers}
        showControls={showControls}
        onMarkerClick={onMarkerClick}
      />
    </div>
  );
}