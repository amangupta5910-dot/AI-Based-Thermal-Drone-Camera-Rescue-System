"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  Shield, 
  Activity, 
  Zap,
  Phone,
  MessageSquare,
  Bell,
  Settings,
  Home,
  Hospital,
  Droplets,
  Wind,
  Thermometer,
  Wifi,
  Camera,
  BarChart3,
  Network,
  Plane
} from 'lucide-react';
import RiskHeatmap from '@/components/risk-heatmap/risk-heatmap';
import QuickActionsPanel from '@/components/quick-actions/quick-actions-panel';
import SettingsPanel from '@/components/settings/settings-panel';
import LeafletMapComponent from '@/components/leaflet-map/leaflet-map';

interface SensorData {
  id: string;
  type: string;
  location: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
}

interface AlertData {
  id: string;
  type: 'flood' | 'earthquake' | 'fire' | 'storm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  message: string;
  timestamp: string;
}

export default function StarfleetDisasterResponse() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'government' | 'ngo' | 'public'>('government');
  const [activeAlerts, setActiveAlerts] = useState<AlertData[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('San Francisco Bay Area');
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  // Sample map markers for disasters, shelters, and rescue teams
  const mapMarkers = [
    {
      id: 'disaster-1',
      lat: 37.7749,
      lng: -122.4194,
      type: 'disaster' as const,
      status: 'critical' as const,
      title: 'California Flooding',
      description: 'Severe flooding in San Francisco Bay Area'
    },
    {
      id: 'disaster-2',
      lat: 35.6762,
      lng: 139.6503,
      type: 'disaster' as const,
      status: 'high' as const,
      title: 'Tokyo Earthquake',
      description: 'Magnitude 6.2 earthquake detected'
    },
    {
      id: 'shelter-1',
      lat: 37.7849,
      lng: -122.4094,
      type: 'shelter' as const,
      status: 'online' as const,
      title: 'Central Community Center',
      description: 'Emergency shelter with 320 capacity'
    },
    {
      id: 'shelter-2',
      lat: 37.7649,
      lng: -122.4294,
      type: 'shelter' as const,
      status: 'online' as const,
      title: 'Westside High School',
      description: 'Emergency shelter with 800 capacity'
    },
    {
      id: 'rescue-1',
      lat: 37.7549,
      lng: -122.4394,
      type: 'rescue_team' as const,
      status: 'online' as const,
      title: 'Rescue Team Alpha',
      description: 'Search and rescue team deployed'
    }
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update sensor data
      const newSensorData: SensorData[] = [
        {
          id: '1',
          type: 'Water Level',
          location: 'Bay Bridge',
          value: Math.random() * 10 + 2,
          unit: 'm',
          status: Math.random() > 0.7 ? 'warning' : 'normal',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'Seismic Activity',
          location: 'Downtown',
          value: Math.random() * 5,
          unit: 'magnitude',
          status: Math.random() > 0.8 ? 'critical' : 'normal',
          timestamp: new Date().toISOString()
        },
        {
          id: '3',
          type: 'Crowd Density',
          location: 'Evacuation Center A',
          value: Math.random() * 100,
          unit: '%',
          status: Math.random() > 0.6 ? 'warning' : 'normal',
          timestamp: new Date().toISOString()
        }
      ];
      setSensorData(newSensorData);

      // Generate random alerts
      if (Math.random() > 0.9) {
        const alertTypes = ['flood', 'earthquake', 'fire', 'storm'] as const;
        const severities = ['low', 'medium', 'high', 'critical'] as const;
        const newAlert: AlertData = {
          id: Date.now().toString(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          location: ['Downtown', 'Bay Area', 'Coastal Region', 'Mountain Zone'][Math.floor(Math.random() * 4)],
          message: 'Potential disaster detected in the area',
          timestamp: new Date().toISOString()
        };
        setActiveAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'normal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Starfleet Disaster Response</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Emergency Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Role:</span>
                <select 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="government">Government</option>
                  <option value="ngo">NGO</option>
                  <option value="public">Public</option>
                </select>
              </div>
              
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({activeAlerts.length})
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  router.push('/offline');
                }}
              >
                <Wifi className="h-4 w-4 mr-2" />
                Offline
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  router.push('/crowdsource');
                }}
              >
                <Camera className="h-4 w-4 mr-2" />
                Crowdsource
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  router.push('/blockchain');
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Blockchain
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  router.push('/analytics');
                }}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  router.push('/iot-network');
                }}
              >
                <Network className="h-4 w-4 mr-2" />
                IoT Network
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  router.push('/drone-fleet');
                }}
              >
                <Plane className="h-4 w-4 mr-2" />
                Drone Fleet
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  router.push('/dashboard');
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Active Alerts
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeAlerts.map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.location} • {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Map Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Live Disaster Map - {selectedRegion}
                    </CardTitle>
                    <CardDescription>
                      Real-time monitoring of disaster zones, shelters, and rescue operations
                    </CardDescription>
                  </div>
                  <Button 
                    variant={showRiskHeatmap ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setShowRiskHeatmap(!showRiskHeatmap)}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    AI Risk Heatmap
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showRiskHeatmap ? (
                  <RiskHeatmap region={selectedRegion} height={384} />
                ) : (
                  <LeafletMapComponent
                    center={[37.7749, -122.4194]}
                    zoom={10}
                    markers={mapMarkers}
                    height="384px"
                    onMarkerClick={(marker) => setSelectedMarker(marker)}
                  />
                )}
                
                {!showRiskHeatmap && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-sm text-muted-foreground">Active Shelters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-sm text-muted-foreground">Rescue Teams</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-sm text-muted-foreground">Evacuation Routes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">2</div>
                      <div className="text-sm text-muted-foreground">Critical Zones</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActionsPanel 
              userLocation={{
                lat: 37.7749,
                lng: -122.4194,
                address: 'San Francisco, CA'
              }}
              currentAlert={
                activeAlerts.length > 0 ? {
                  type: activeAlerts[0].type,
                  severity: activeAlerts[0].severity,
                  location: activeAlerts[0].location
                } : undefined
              }
            />

            {/* Real-time Sensors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Live Sensors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sensorData.map((sensor) => (
                  <div key={sensor.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{sensor.type}</span>
                      <span className={`text-sm ${getStatusColor(sensor.status)}`}>
                        {sensor.value.toFixed(1)} {sensor.unit}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {sensor.location}
                    </div>
                    <Progress 
                      value={(sensor.value / 10) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Resource Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resource Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medical Supplies</span>
                  <Badge variant="secondary">85%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Food & Water</span>
                  <Badge variant="secondary">72%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Vehicles</span>
                  <Badge variant="outline">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Communication</span>
                  <Badge variant="outline">Operational</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Tabs */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reporting</CardTitle>
              <CardDescription>
                Disaster trends, resource utilization, and prediction accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="historical">Historical</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Affected Population</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2,847</div>
                        <p className="text-xs text-muted-foreground">+12% from last hour</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Response Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8.3 min</div>
                        <p className="text-xs text-muted-foreground">Average response time</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Prediction Accuracy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">94.2%</div>
                        <p className="text-xs text-muted-foreground">AI model accuracy</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="predictions">
                  <div className="text-center py-8">
                    <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">AI Prediction Models</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Flood forecasting, seismic activity prediction, and resource optimization
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources">
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Resource Allocation Dashboard</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Real-time tracking of relief supplies, personnel, and equipment
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="historical">
                  <div className="text-center py-8">
                    <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Historical Disaster Data</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Trends and patterns from past disaster events
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}