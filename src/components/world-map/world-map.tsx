"use client";

import { useState, useEffect } from 'react';
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

export default function WorldMap() {
  const [disasters, setDisasters] = useState<DisasterPoint[]>([
    {
      id: '1',
      lat: 37.7749,
      lng: -122.4194,
      type: 'flood',
      severity: 'high',
      title: 'California Flooding',
      description: 'Severe flooding in San Francisco Bay Area',
      affected: 45000,
      timestamp: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      lat: 35.6762,
      lng: 139.6503,
      type: 'earthquake',
      severity: 'medium',
      title: 'Tokyo Earthquake',
      description: 'Magnitude 6.2 earthquake detected',
      affected: 120000,
      timestamp: '2024-01-15T12:15:00Z'
    },
    {
      id: '3',
      lat: -33.8688,
      lng: 151.2093,
      type: 'fire',
      severity: 'critical',
      title: 'Australia Bushfires',
      description: 'Major bushfires spreading in New South Wales',
      affected: 25000,
      timestamp: '2024-01-15T16:45:00Z'
    },
    {
      id: '4',
      lat: 51.5074,
      lng: -0.1278,
      type: 'storm',
      severity: 'medium',
      title: 'UK Storm Warning',
      description: 'Severe storm approaching London',
      affected: 8000,
      timestamp: '2024-01-15T18:20:00Z'
    },
    {
      id: '5',
      lat: 19.4326,
      lng: -99.1332,
      type: 'landslide',
      severity: 'high',
      title: 'Mexico Landslide',
      description: 'Landslide reported in Mexico City',
      affected: 15000,
      timestamp: '2024-01-15T10:30:00Z'
    }
  ]);

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Global Disaster Monitor
            </CardTitle>
            <CardDescription>
              Real-time monitoring of disasters worldwide
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{disasters.length} Active</Badge>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="h-96 rounded-lg overflow-hidden border bg-gradient-to-b from-blue-100 to-green-100 relative">
              {!mapLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading world map...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Simple World Map Representation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-64 h-32 bg-blue-200 rounded-full opacity-50 mb-4"></div>
                      <div className="w-48 h-24 bg-green-200 rounded-full opacity-40"></div>
                      <p className="text-sm text-gray-600 mt-4">Interactive World Map</p>
                      <p className="text-xs text-gray-500">Real-time disaster monitoring</p>
                    </div>
                  </div>

                  {/* Disaster Points */}
                  {disasters.map((disaster) => {
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

                  {/* Map Controls */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <Button variant="secondary" size="sm">🌍 Satellite</Button>
                    <Button variant="outline" size="sm">🗺️ Terrain</Button>
                  </div>
                  
                  <div className="absolute top-4 right-4 space-y-2">
                    <Button variant="outline" size="sm">+ Zoom</Button>
                    <Button variant="outline" size="sm">- Zoom</Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Disaster List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Active Disasters
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {disasters.map((disaster) => (
                <div key={disaster.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getDisasterIcon(disaster.type)}</span>
                      <h4 className="font-medium text-sm">{disaster.title}</h4>
                    </div>
                    {getSeverityBadge(disaster.severity)}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{disaster.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{disaster.affected.toLocaleString()} affected</span>
                    <span>{new Date(disaster.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Severity Levels</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}