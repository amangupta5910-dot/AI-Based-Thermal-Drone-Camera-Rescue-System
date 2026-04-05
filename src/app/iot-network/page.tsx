"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Network, Activity, Wifi, Satellite, Radio, MapPin, AlertTriangle, Battery, Signal, Settings, RefreshCw } from 'lucide-react';
import LeafletMapComponent from '@/components/leaflet-map/leaflet-map';

interface NetworkDevice {
  id: string;
  name: string;
  type: 'sensor' | 'gateway' | 'drone_controller' | 'emergency_beacon';
  status: 'online' | 'offline' | 'warning' | 'critical';
  location: string;
  signalStrength: number;
  batteryLevel?: number;
  lastSeen: string;
  ipAddress: string;
}

interface NetworkStats {
  totalDevices: number;
  onlineDevices: number;
  networkUptime: number;
  dataThroughput: number;
  activeConnections: number;
}

export default function IoTNetworkPage() {
  const [devices, setDevices] = useState<NetworkDevice[]>([
    {
      id: '1',
      name: 'Main Gateway Alpha',
      type: 'gateway',
      status: 'online',
      location: 'Command Center',
      signalStrength: 95,
      lastSeen: '2024-01-15T14:30:00Z',
      ipAddress: '192.168.1.1'
    },
    {
      id: '2',
      name: 'Flood Sensor Delta',
      type: 'sensor',
      status: 'online',
      location: 'Bay Bridge',
      signalStrength: 78,
      batteryLevel: 85,
      lastSeen: '2024-01-15T14:28:00Z',
      ipAddress: '192.168.1.102'
    },
    {
      id: '3',
      name: 'Drone Controller Bravo',
      type: 'drone_controller',
      status: 'online',
      location: 'North District',
      signalStrength: 88,
      lastSeen: '2024-01-15T14:29:00Z',
      ipAddress: '192.168.1.45'
    },
    {
      id: '4',
      name: 'Emergency Beacon Gamma',
      type: 'emergency_beacon',
      status: 'warning',
      location: 'Coastal Area',
      signalStrength: 45,
      batteryLevel: 15,
      lastSeen: '2024-01-15T14:15:00Z',
      ipAddress: '192.168.1.78'
    },
    {
      id: '5',
      name: 'Seismic Sensor Echo',
      type: 'sensor',
      status: 'critical',
      location: 'Downtown',
      signalStrength: 12,
      batteryLevel: 5,
      lastSeen: '2024-01-15T13:45:00Z',
      ipAddress: '192.168.1.156'
    },
    {
      id: '6',
      name: 'Weather Station Foxtrot',
      type: 'sensor',
      status: 'offline',
      location: 'Mountain Zone',
      signalStrength: 0,
      batteryLevel: 0,
      lastSeen: '2024-01-15T12:00:00Z',
      ipAddress: '192.168.1.203'
    }
  ]);

  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalDevices: 24,
    onlineDevices: 18,
    networkUptime: 99.7,
    dataThroughput: 2.4,
    activeConnections: 156
  });

  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  // Sample map markers for IoT devices
  const networkMarkers = [
    {
      id: 'gateway-1',
      lat: 37.7749,
      lng: -122.4194,
      type: 'iot_device' as const,
      status: 'online' as const,
      title: 'Main Gateway Alpha',
      description: 'Central network gateway at Command Center'
    },
    {
      id: 'sensor-1',
      lat: 37.7849,
      lng: -122.4094,
      type: 'iot_device' as const,
      status: 'online' as const,
      title: 'Flood Sensor Delta',
      description: 'Water level monitoring at Bay Bridge'
    },
    {
      id: 'drone-controller-1',
      lat: 37.7649,
      lng: -122.4294,
      type: 'iot_device' as const,
      status: 'online' as const,
      title: 'Drone Controller Bravo',
      description: 'Drone fleet controller in North District'
    },
    {
      id: 'beacon-1',
      lat: 37.7549,
      lng: -122.4394,
      type: 'iot_device' as const,
      status: 'warning' as const,
      title: 'Emergency Beacon Gamma',
      description: 'Emergency beacon in Coastal Area'
    },
    {
      id: 'sensor-2',
      lat: 37.7449,
      lng: -122.4494,
      type: 'iot_device' as const,
      status: 'critical' as const,
      title: 'Seismic Sensor Echo',
      description: 'Earthquake monitoring in Downtown'
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update device statuses
      setDevices(prevDevices => 
        prevDevices.map(device => {
          const randomChange = Math.random();
          let newSignalStrength = device.signalStrength;
          let newStatus = device.status;
          let newBatteryLevel = device.batteryLevel;

          // Simulate signal fluctuations
          if (device.status !== 'offline') {
            newSignalStrength = Math.max(0, Math.min(100, 
              device.signalStrength + (Math.random() - 0.5) * 10
            ));

            // Simulate battery drain for sensors
            if (device.type === 'sensor' && device.batteryLevel) {
              newBatteryLevel = Math.max(0, device.batteryLevel - 0.1);
            }

            // Update status based on signal and battery
            if (newSignalStrength < 20 || (device.batteryLevel && device.batteryLevel < 10)) {
              newStatus = 'critical';
            } else if (newSignalStrength < 50 || (device.batteryLevel && device.batteryLevel < 20)) {
              newStatus = 'warning';
            } else if (newSignalStrength > 70) {
              newStatus = 'online';
            }
          }

          return {
            ...device,
            signalStrength: newSignalStrength,
            status: newStatus,
            batteryLevel: newBatteryLevel,
            lastSeen: new Date().toISOString()
          };
        })
      );

      // Update network stats
      setNetworkStats(prev => ({
        ...prev,
        onlineDevices: devices.filter(d => d.status === 'online').length,
        dataThroughput: Math.max(0.5, Math.min(5.0, prev.dataThroughput + (Math.random() - 0.5) * 0.2)),
        activeConnections: Math.max(100, Math.min(300, prev.activeConnections + Math.floor((Math.random() - 0.5) * 10)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [devices.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'offline': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge className="bg-green-500">ONLINE</Badge>;
      case 'warning': return <Badge className="bg-yellow-500">WARNING</Badge>;
      case 'critical': return <Badge className="bg-red-500">CRITICAL</Badge>;
      case 'offline': return <Badge className="bg-gray-500">OFFLINE</Badge>;
      default: return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'sensor': return <Radio className="h-4 w-4" />;
      case 'gateway': return <Wifi className="h-4 w-4" />;
      case 'drone_controller': return <Satellite className="h-4 w-4" />;
      case 'emergency_beacon': return <AlertTriangle className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const refreshNetwork = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
                <h1 className="text-2xl font-bold">Starfleet Disaster Response - AI-Powered Emergency Management System</h1>
                <p className="text-sm text-muted-foreground">IoT Network Control Center</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Government</Badge>
              <Button variant="outline" size="sm" onClick={refreshNetwork} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Network Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Devices</p>
                  <p className="text-2xl font-bold">{networkStats.totalDevices}</p>
                </div>
                <Network className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Online</p>
                  <p className="text-2xl font-bold text-green-600">{networkStats.onlineDevices}</p>
                </div>
                <Wifi className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Network Uptime</p>
                  <p className="text-2xl font-bold">{networkStats.networkUptime}%</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Throughput</p>
                  <p className="text-2xl font-bold">{networkStats.dataThroughput}MB/s</p>
                </div>
                <Signal className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Connections</p>
                  <p className="text-2xl font-bold">{networkStats.activeConnections}</p>
                </div>
                <Radio className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Topology Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="h-5 w-5 mr-2" />
              Network Topology
            </CardTitle>
            <CardDescription>
              Real-time network status and device connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeafletMapComponent
              center={[37.7749, -122.4194]}
              zoom={11}
              markers={networkMarkers}
              height="256px"
              onMarkerClick={(marker) => setSelectedMarker(marker)}
            />
          </CardContent>
        </Card>

        {/* Device List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Radio className="h-5 w-5 mr-2" />
              Network Devices
            </CardTitle>
            <CardDescription>
              Monitor and manage all connected IoT devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {devices.map((device) => (
                <div 
                  key={device.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDevice?.id === device.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.type)}
                        <div>
                          <h3 className="font-medium">{device.name}</h3>
                          <p className="text-sm text-muted-foreground">{device.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">{device.type.replace('_', ' ')}</Badge>
                        {getStatusBadge(device.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">Signal</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={device.signalStrength} className="w-16 h-2" />
                          <span className="text-xs text-muted-foreground">{device.signalStrength}%</span>
                        </div>
                      </div>
                      
                      {device.batteryLevel !== undefined && (
                        <div className="text-right">
                          <p className="text-sm font-medium">Battery</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={device.batteryLevel} className="w-16 h-2" />
                            <span className="text-xs text-muted-foreground">{device.batteryLevel}%</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">IP Address</p>
                        <p className="text-xs text-muted-foreground">{device.ipAddress}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">Last Seen</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(device.lastSeen).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Details Panel */}
        {selectedDevice && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Device Details - {selectedDevice.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Device Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{selectedDevice.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={getStatusColor(selectedDevice.status)}>
                        {selectedDevice.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{selectedDevice.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Network Status</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signal Strength:</span>
                      <span>{selectedDevice.signalStrength}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP Address:</span>
                      <span>{selectedDevice.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span>{new Date(selectedDevice.lastSeen).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {selectedDevice.batteryLevel !== undefined && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Power Status</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Battery Level:</span>
                        <span>{selectedDevice.batteryLevel}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Power Source:</span>
                        <span>Battery</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Runtime:</span>
                        <span>{Math.floor(selectedDevice.batteryLevel * 2.4)}h</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-medium">Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restart Device
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      View Location
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}