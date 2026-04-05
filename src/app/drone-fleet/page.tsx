"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Plane, Activity, MapPin, Camera, Users, AlertTriangle, Battery, Wifi, Settings, RefreshCw, Play, Pause, Navigation, Thermometer, Droplets } from 'lucide-react';
import LeafletMapComponent from '@/components/leaflet-map/leaflet-map';

interface Drone {
  id: string;
  name: string;
  type: 'surveillance' | 'rescue' | 'delivery' | 'mapping';
  status: 'active' | 'idle' | 'maintenance' | 'emergency';
  location: string;
  batteryLevel: number;
  altitude: number;
  speed: number;
  mission: string;
  cameraStatus: 'online' | 'offline' | 'recording';
  peopleDetected: number;
  lastUpdate: string;
  coordinates: { lat: number; lng: number };
}

interface Mission {
  id: string;
  name: string;
  type: 'search_rescue' | 'damage_assessment' | 'surveillance' | 'delivery';
  status: 'active' | 'completed' | 'pending' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedDrones: string[];
  area: string;
  progress: number;
  estimatedTime: string;
}

export default function DroneFleetPage() {
  const [drones, setDrones] = useState<Drone[]>([
    {
      id: '1',
      name: 'Eagle-1',
      type: 'surveillance',
      status: 'active',
      location: 'Downtown Area',
      batteryLevel: 78,
      altitude: 120,
      speed: 25,
      mission: 'Building Damage Assessment',
      cameraStatus: 'recording',
      peopleDetected: 15,
      lastUpdate: '2024-01-15T14:30:00Z',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      id: '2',
      name: 'Rescue-Alpha',
      type: 'rescue',
      status: 'active',
      location: 'Flood Zone',
      batteryLevel: 45,
      altitude: 80,
      speed: 15,
      mission: 'Search and Rescue',
      cameraStatus: 'online',
      peopleDetected: 8,
      lastUpdate: '2024-01-15T14:28:00Z',
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    {
      id: '3',
      name: 'Mapper-2',
      type: 'mapping',
      status: 'idle',
      location: 'Base Station',
      batteryLevel: 95,
      altitude: 0,
      speed: 0,
      mission: 'Standby',
      cameraStatus: 'online',
      peopleDetected: 0,
      lastUpdate: '2024-01-15T14:25:00Z',
      coordinates: { lat: 37.7649, lng: -122.4294 }
    },
    {
      id: '4',
      name: 'Delivery-Beta',
      type: 'delivery',
      status: 'emergency',
      location: 'Mountain Rescue',
      batteryLevel: 23,
      altitude: 200,
      speed: 35,
      mission: 'Medical Supply Drop',
      cameraStatus: 'recording',
      peopleDetected: 4,
      lastUpdate: '2024-01-15T14:32:00Z',
      coordinates: { lat: 37.7549, lng: -122.4394 }
    },
    {
      id: '5',
      name: 'Surveillance-3',
      type: 'surveillance',
      status: 'maintenance',
      location: 'Hangar',
      batteryLevel: 0,
      altitude: 0,
      speed: 0,
      mission: 'Maintenance',
      cameraStatus: 'offline',
      peopleDetected: 0,
      lastUpdate: '2024-01-15T12:00:00Z',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    }
  ]);

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      name: 'Downtown Building Assessment',
      type: 'damage_assessment',
      status: 'active',
      priority: 'high',
      assignedDrones: ['1'],
      area: 'Downtown Business District',
      progress: 65,
      estimatedTime: '2 hours'
    },
    {
      id: '2',
      name: 'Flood Zone Search & Rescue',
      type: 'search_rescue',
      status: 'active',
      priority: 'critical',
      assignedDrones: ['2', '4'],
      area: 'Bay Area Flood Zone',
      progress: 40,
      estimatedTime: '4 hours'
    },
    {
      id: '3',
      name: 'Mountain Area Mapping',
      type: 'surveillance',
      status: 'pending',
      priority: 'medium',
      assignedDrones: ['3'],
      area: 'Northern Mountain Range',
      progress: 0,
      estimatedTime: '6 hours'
    },
    {
      id: '4',
      name: 'Medical Supply Delivery',
      type: 'delivery',
      status: 'active',
      priority: 'critical',
      assignedDrones: ['4'],
      area: 'Mountain Rescue Site',
      progress: 85,
      estimatedTime: '1 hour'
    }
  ]);

  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update drone statuses
      setDrones(prevDrones => 
        prevDrones.map(drone => {
          let newBatteryLevel = drone.batteryLevel;
          let newAltitude = drone.altitude;
          let newSpeed = drone.speed;
          let newPeopleDetected = drone.peopleDetected;
          let newStatus = drone.status;

          // Simulate battery drain for active drones
          if (drone.status === 'active' || drone.status === 'emergency') {
            newBatteryLevel = Math.max(0, drone.batteryLevel - 0.5);
            
            // Simulate movement
            newAltitude = Math.max(0, Math.min(300, drone.altitude + (Math.random() - 0.5) * 20));
            newSpeed = Math.max(0, Math.min(50, drone.speed + (Math.random() - 0.5) * 10));
            
            // Simulate people detection changes
            newPeopleDetected = Math.max(0, drone.peopleDetected + Math.floor((Math.random() - 0.5) * 3));
          }

          // Update status based on battery
          if (newBatteryLevel < 10 && drone.status !== 'maintenance') {
            newStatus = 'emergency';
          } else if (newBatteryLevel < 20 && drone.status === 'active') {
            newStatus = 'idle';
          }

          return {
            ...drone,
            batteryLevel: newBatteryLevel,
            altitude: newAltitude,
            speed: newSpeed,
            peopleDetected: newPeopleDetected,
            status: newStatus,
            lastUpdate: new Date().toISOString()
          };
        })
      );

      // Update mission progress
      setMissions(prevMissions => 
        prevMissions.map(mission => {
          let newProgress = mission.progress;
          
          if (mission.status === 'active') {
            newProgress = Math.min(100, mission.progress + Math.random() * 2);
          }
          
          return {
            ...mission,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : mission.status
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'idle': return 'text-yellow-600';
      case 'emergency': return 'text-red-600';
      case 'maintenance': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500">ACTIVE</Badge>;
      case 'idle': return <Badge className="bg-yellow-500">IDLE</Badge>;
      case 'emergency': return <Badge className="bg-red-500">EMERGENCY</Badge>;
      case 'maintenance': return <Badge className="bg-gray-500">MAINTENANCE</Badge>;
      default: return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return <Badge className="bg-red-500">CRITICAL</Badge>;
      case 'high': return <Badge className="bg-orange-500">HIGH</Badge>;
      case 'medium': return <Badge className="bg-yellow-500">MEDIUM</Badge>;
      case 'low': return <Badge className="bg-blue-500">LOW</Badge>;
      default: return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const getDroneIcon = (type: string) => {
    switch (type) {
      case 'surveillance': return <Camera className="h-4 w-4" />;
      case 'rescue': return <Users className="h-4 w-4" />;
      case 'delivery': return <Plane className="h-4 w-4" />;
      case 'mapping': return <MapPin className="h-4 w-4" />;
      default: return <Plane className="h-4 w-4" />;
    }
  };

  const refreshFleet = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const deployDrone = (droneId: string) => {
    setDrones(prevDrones => 
      prevDrones.map(drone => 
        drone.id === droneId && drone.status === 'idle'
          ? { ...drone, status: 'active', mission: 'Deployed for Mission' }
          : drone
      )
    );
  };

  const recallDrone = (droneId: string) => {
    setDrones(prevDrones => 
      prevDrones.map(drone => 
        drone.id === droneId && (drone.status === 'active' || drone.status === 'emergency')
          ? { ...drone, status: 'idle', mission: 'Returning to Base', altitude: 0, speed: 0 }
          : drone
      )
    );
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
                <p className="text-sm text-muted-foreground">Drone Fleet Control Center</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Government</Badge>
              <Button variant="outline" size="sm" onClick={refreshFleet} disabled={isLoading}>
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
        {/* Fleet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Drones</p>
                  <p className="text-2xl font-bold">{drones.length}</p>
                </div>
                <Plane className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {drones.filter(d => d.status === 'active').length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Emergency</p>
                  <p className="text-2xl font-bold text-red-600">
                    {drones.filter(d => d.status === 'emergency').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">People Detected</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {drones.reduce((sum, drone) => sum + drone.peopleDetected, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Missions</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {missions.filter(m => m.status === 'active').length}
                  </p>
                </div>
                <Navigation className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Map */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Live Fleet Map
            </CardTitle>
            <CardDescription>
              Real-time drone positions and mission areas
            </CardDescription>
          </CardHeader>
          <CardContent>
          <div className="w-full h-96 border rounded-lg overflow-hidden bg-gray-50 relative">
            <LeafletMapComponent
              center={[37.7749, -122.4194]}
              zoom={12}
              height="384px"
              markers={drones.filter(d => d.status !== 'maintenance').map(drone => ({
                id: drone.id,
                lat: drone.coordinates.lat,
                lng: drone.coordinates.lng,
                title: drone.name,
                type: 'drone',
                status: drone.status,
                icon: drone.status === 'active' ? '🟢' : 
                      drone.status === 'emergency' ? '🔴' : 
                      drone.status === 'idle' ? '🟡' : '⚫',
                popup: (
                  <div>
                    <h3 className="font-semibold">{drone.name}</h3>
                    <p><strong>Type:</strong> {drone.type}</p>
                    <p><strong>Status:</strong> {drone.status}</p>
                    <p><strong>Altitude:</strong> {drone.altitude}m</p>
                    <p><strong>Speed:</strong> {drone.speed}km/h</p>
                    <p><strong>Battery:</strong> {drone.batteryLevel}%</p>
                    <p><strong>Mission:</strong> {drone.mission}</p>
                    <p><strong>People Detected:</strong> {drone.peopleDetected}</p>
                  </div>
                )
              }))}
            />
            
            {/* Fallback loading indicator */}
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading drone fleet map...</p>
                <p className="text-sm text-gray-500 mt-2">Center: San Francisco, CA</p>
                <p className="text-sm text-gray-500">Drones: {drones.filter(d => d.status !== 'maintenance').length}</p>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Drone List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                Drone Fleet
              </CardTitle>
              <CardDescription>
                Monitor and control all available drones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {drones.map((drone) => (
                  <div 
                    key={drone.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDrone?.id === drone.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedDrone(drone)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getDroneIcon(drone.type)}
                        <div>
                          <h3 className="font-medium">{drone.name}</h3>
                          <p className="text-sm text-muted-foreground">{drone.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">{drone.type}</Badge>
                        {getStatusBadge(drone.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Battery:</span>
                          <span>{drone.batteryLevel}%</span>
                        </div>
                        <Progress value={drone.batteryLevel} className="h-1 mt-1" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Altitude:</span>
                          <span>{drone.altitude}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Speed:</span>
                          <span>{drone.speed}km/h</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Camera:</span>
                          <span className={`capitalize ${
                            drone.cameraStatus === 'online' ? 'text-green-600' :
                            drone.cameraStatus === 'recording' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {drone.cameraStatus}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">People:</span>
                          <span>{drone.peopleDetected}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      Mission: {drone.mission}
                    </div>
                    
                    <div className="mt-2 flex space-x-2">
                      {drone.status === 'idle' && (
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          deployDrone(drone.id);
                        }}>
                          <Play className="h-3 w-3 mr-1" />
                          Deploy
                        </Button>
                      )}
                      {(drone.status === 'active' || drone.status === 'emergency') && (
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          recallDrone(drone.id);
                        }}>
                          <Pause className="h-3 w-3 mr-1" />
                          Recall
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Missions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2" />
                Active Missions
              </CardTitle>
              <CardDescription>
                Current rescue and assessment operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {missions.map((mission) => (
                  <div 
                    key={mission.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMission?.id === mission.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedMission(mission)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{mission.name}</h3>
                        <p className="text-sm text-muted-foreground">{mission.area}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(mission.priority)}
                        <Badge className={
                          mission.status === 'active' ? 'bg-green-500' :
                          mission.status === 'completed' ? 'bg-blue-500' :
                          mission.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          {mission.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{Math.round(mission.progress)}%</span>
                        </div>
                        <Progress value={mission.progress} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Drones: {mission.assignedDrones.length}</span>
                        <span>ETA: {mission.estimatedTime}</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Type: {mission.type.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drone Details Panel */}
        {selectedDrone && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                Drone Details - {selectedDrone.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Drone Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{selectedDrone.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={getStatusColor(selectedDrone.status)}>
                        {selectedDrone.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{selectedDrone.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Flight Status</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Altitude:</span>
                      <span>{selectedDrone.altitude}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Speed:</span>
                      <span>{selectedDrone.speed}km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Battery:</span>
                      <span>{selectedDrone.batteryLevel}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Mission Data</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Mission:</span>
                      <span>{selectedDrone.mission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Camera Status:</span>
                      <span className={`capitalize ${
                        selectedDrone.cameraStatus === 'online' ? 'text-green-600' :
                        selectedDrone.cameraStatus === 'recording' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {selectedDrone.cameraStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">People Detected:</span>
                      <span>{selectedDrone.peopleDetected}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Actions</h4>
                  <div className="space-y-2">
                    {selectedDrone.status === 'idle' && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Deploy Drone
                      </Button>
                    )}
                    {(selectedDrone.status === 'active' || selectedDrone.status === 'emergency') && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Pause className="h-4 w-4 mr-2" />
                        Recall Drone
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      View Camera Feed
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      Track Location
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