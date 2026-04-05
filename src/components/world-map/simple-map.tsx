"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Activity, Shield } from 'lucide-react';

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

interface SimpleMapProps {
  disasters: DisasterPoint[];
}

export default function SimpleMap({ disasters }: SimpleMapProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'; // red
      case 'high': return '#ea580c'; // orange
      case 'medium': return '#ca8a04'; // yellow
      case 'low': return '#16a34a'; // green
      default: return '#6b7280'; // gray
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge className="bg-red-500">CRITICAL</Badge>;
      case 'high': return <Badge className="bg-orange-500">HIGH</Badge>;
      case 'medium': return <Badge className="bg-yellow-500">MEDIUM</Badge>;
      case 'low': return <Badge className="bg-green-500">LOW</Badge>;
      default: return <Badge variant="outline">UNKNOWN</Badge>;
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

  return (
    <div className="h-full flex flex-col">
      {/* Simple World Map Representation */}
      <div className="flex-1 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg relative overflow-hidden">
        {/* World Map Outline */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-64 h-32 bg-blue-200 rounded-full opacity-50 mb-4"></div>
            <div className="w-48 h-24 bg-green-200 rounded-full opacity-40"></div>
            <p className="text-sm text-gray-600 mt-4">Interactive World Map</p>
            <p className="text-xs text-gray-500">Loading Leaflet components...</p>
          </div>
        </div>

        {/* Disaster Points */}
        {disasters.map((disaster, index) => {
          // Simple positioning based on lat/lng
          const x = ((disaster.lng + 180) / 360) * 100;
          const y = ((90 - disaster.lat) / 180) * 100;
          
          return (
            <div
              key={disaster.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"
                style={{ backgroundColor: getSeverityColor(disaster.severity) }}
              ></div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <span>{getDisasterIcon(disaster.type)}</span>
                    <span>{disaster.title}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}