"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  Settings, 
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Users,
  Plane,
  Bell,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface IoTDevice {
  deviceId: string;
  deviceType: 'water_sensor' | 'seismic_sensor' | 'crowd_sensor' | 'weather_sensor' | 'drone';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  metrics: {
    value: number;
    unit: string;
    threshold?: {
      warning: number;
      critical: number;
    };
  };
  timestamp: string;
  status: 'online' | 'offline' | 'error';
}

interface IoTAlert {
  id: string;
  deviceId: string;
  alertType: 'threshold_exceeded' | 'device_offline' | 'malfunction' | 'maintenance_required';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
}

export default function IoTManagementPage() {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [alerts, setAlerts] = useState<IoTAlert[]>([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchDevices();
    fetchAlerts();
  }, []);

  // Simulate real-time data
  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        simulateIoTData();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/iot/data');
      const data = await response.json();
      if (data.success) {
        setDevices(data.data);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/iot/alerts');
      const data = await response.json();
      if (data.success) {
        setAlerts(data.alerts);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const simulateIoTData = async () => {
    const deviceTypes = ['water_sensor', 'seismic_sensor', 'crowd_sensor', 'weather_sensor', 'drone'] as const;
    const locations = [
      { lat: 37.7749, lng: -122.4194, address: 'San Francisco Downtown' },
      { lat: 37.8715, lng: -122.2730, address: 'Berkeley Marina' },
      { lat: 37.4419, lng: -122.1430, address: 'Palo Alto' },
      { lat: 37.3382, lng: -121.8863, address: 'San Jose' }
    ];

    const randomDevice = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    let value, unit, threshold;
    
    switch (randomDevice) {
      case 'water_sensor':
        value = Math.random() * 15 + 1;
        unit = 'm';
        threshold = { warning: 8, critical: 12 };
        break;
      case 'seismic_sensor':
        value = Math.random() * 6;
        unit = 'magnitude';
        threshold = { warning: 3, critical: 5 };
        break;
      case 'crowd_sensor':
        value = Math.random() * 100;
        unit = '%';
        threshold = { warning: 70, critical: 90 };
        break;
      case 'weather_sensor':
        value = Math.random() * 40 + 10;
        unit = '°C';
        threshold = { warning: 30, critical: 35 };
        break;
      case 'drone':
        value = Math.random() * 100;
        unit = 'm';
        threshold = { warning: 80, critical: 95 };
        break;
    }

    const deviceData: IoTDevice = {
      deviceId: `device_${Date.now()}`,
      deviceType: randomDevice,
      location: randomLocation,
      metrics: { value, unit, threshold },
      timestamp: new Date().toISOString(),
      status: Math.random() > 0.1 ? 'online' : 'offline'
    };

    try {
      const response = await fetch('/api/iot/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData)
      });
      
      if (response.ok) {
        // Check if threshold exceeded and create alert
        if (threshold && value > threshold.warning) {
          const alertData = {
            deviceId: deviceData.deviceId,
            alertType: 'threshold_exceeded' as const,
            severity: value > threshold.critical ? 'critical' as const : 'high' as const,
            message: `${randomDevice.replace('_', ' ')} threshold exceeded at ${randomLocation.address}`,
            location: randomLocation
          };
          
          await fetch('/api/iot/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertData)
          });
        }
        
        fetchDevices();
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error simulating IoT data:', error);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'water_sensor': return <Droplets className="h-5 w-5" />;
      case 'seismic_sensor': return <Activity className="h-5 w-5" />;
      case 'crowd_sensor': return <Users className="h-5 w-5" />;
      case 'weather_sensor': return <Thermometer className="h-5 w-5" />;
      case 'drone': return <Plane className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'error': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="h-4 w-4" />;
      case 'offline': return <WifiOff className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredDevices = devices.filter(device => {
    const typeMatch = selectedDeviceType === 'all' || device.deviceType === selectedDeviceType;
    const statusMatch = selectedStatus === 'all' || device.status === selectedStatus;
    const locationMatch = !searchLocation || 
      device.location.address.toLowerCase().includes(searchLocation.toLowerCase());
    return typeMatch && statusMatch && locationMatch;
  });

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">IoT Device Management</h1>
                <p className="text-sm text-muted-foreground">Real-time sensor monitoring and alerts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant={isSimulating ? "default" : "outline"}
                onClick={() => setIsSimulating(!isSimulating)}
              >
                {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
              </Button>
              
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Alert Summary */}
        {criticalAlerts.length > 0 && (
          <div className="mb-6">
            <Alert className="border-l-4 border-l-red-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{criticalAlerts.length} Critical Alert(s) Require Immediate Attention</p>
                    <p className="text-sm text-muted-foreground">
                      Latest: {criticalAlerts[0]?.message}
                    </p>
                  </div>
                  <Badge className="bg-red-500">
                    CRITICAL
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{devices.length}</div>
              <p className="text-xs text-muted-foreground">
                {devices.filter(d => d.status === 'online').length} online
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
              <p className="text-xs text-muted-foreground">
                {criticalAlerts.length} critical
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Data Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{devices.length * 24}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {devices.length > 0 ? Math.round((devices.filter(d => d.status === 'online').length / devices.length) * 100) : 100}%
              </div>
              <p className="text-xs text-muted-foreground">Device uptime</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="alerts">Alerts ({activeAlerts.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="devices" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Device Type</label>
                    <Select value={selectedDeviceType} onValueChange={setSelectedDeviceType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="water_sensor">Water Sensor</SelectItem>
                        <SelectItem value="seismic_sensor">Seismic Sensor</SelectItem>
                        <SelectItem value="crowd_sensor">Crowd Sensor</SelectItem>
                        <SelectItem value="weather_sensor">Weather Sensor</SelectItem>
                        <SelectItem value="drone">Drone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input 
                      placeholder="Search location..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices.map((device) => (
                <Card key={device.deviceId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.deviceType)}
                        <div>
                          <CardTitle className="text-sm">{device.deviceType.replace('_', ' ')}</CardTitle>
                          <CardDescription className="text-xs">{device.deviceId}</CardDescription>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 ${getStatusColor(device.status)}`}>
                        {getStatusIcon(device.status)}
                        <span className="text-xs capitalize">{device.status}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Reading</span>
                        <span className="text-lg font-bold">
                          {device.metrics.value.toFixed(1)} {device.metrics.unit}
                        </span>
                      </div>
                      
                      {device.metrics.threshold && (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            Thresholds: Warning {device.metrics.threshold.warning} / Critical {device.metrics.threshold.critical}
                          </div>
                          <Progress 
                            value={(device.metrics.value / device.metrics.threshold.critical) * 100}
                            className="h-2"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{device.location.address}</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(device.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDevices.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No devices found matching your filters</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Card key={alert.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                          <CardTitle className="text-sm">{alert.alertType.replace('_', ' ')}</CardTitle>
                          <CardDescription className="text-xs">{alert.deviceId}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.acknowledged ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location.address}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      <div className="flex space-x-2 mt-3">
                        {!alert.acknowledged && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={async () => {
                              await fetch('/api/iot/alerts', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ alertId: alert.id, action: 'acknowledge' })
                              });
                              fetchAlerts();
                            }}
                          >
                            Acknowledge
                          </Button>
                        )}
                        {alert.acknowledged && !alert.resolved && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={async () => {
                              await fetch('/api/iot/alerts', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ alertId: alert.id, action: 'resolve' })
                              });
                              fetchAlerts();
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {activeAlerts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                    <p className="text-muted-foreground">No active alerts</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      All systems are operating normally
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}