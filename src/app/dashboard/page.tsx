"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, BarChart3, AlertTriangle, Users, Building, Heart, Activity, Clock, MapPin, Zap, Droplets, Wind, Thermometer, Network, Plane } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [activeDisasters, setActiveDisasters] = useState(3);
  const [resourcesDeployed, setResourcesDeployed] = useState(284);
  const [systemStatus, setSystemStatus] = useState('online');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    setIsLoading(false);
    
    const interval = setInterval(() => {
      // Update active disasters count
      setActiveDisasters(prev => {
        const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return Math.max(0, Math.min(10, prev + change));
      });
      
      // Update resources deployed
      setResourcesDeployed(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        return Math.max(100, Math.min(500, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

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
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Government</Badge>
              <Badge variant={systemStatus === 'online' ? 'default' : 'destructive'}>
                {systemStatus === 'online' ? '● Online' : '● Offline'}
              </Badge>
              <Button variant="outline" size="sm">
                Alerts ({activeDisasters})
              </Button>
              <Button variant="outline" size="sm">
                <Network className="h-4 w-4 mr-2" />
                IoT Network
              </Button>
              <Button variant="outline" size="sm">
                <Plane className="h-4 w-4 mr-2" />
                Drone Fleet
              </Button>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-8 w-8 mr-3" />
              Welcome to Disaster Response Dashboard
            </CardTitle>
            <CardDescription>
              System is operational and monitoring active emergencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-muted-foreground">System Online</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{activeDisasters}</div>
                <div className="text-sm text-muted-foreground">Active Disasters</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{resourcesDeployed}</div>
                <div className="text-sm text-muted-foreground">Resources Deployed</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-600">8.2m</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* World Map Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Global Disaster Monitor
            </CardTitle>
            <CardDescription>
              Real-time monitoring of disasters worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <div className="h-96 rounded-lg overflow-hidden border bg-gradient-to-b from-blue-100 to-green-100 relative">
                  {/* Simple World Map Representation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-64 h-32 bg-blue-200 rounded-full opacity-50 mb-4"></div>
                      <div className="w-48 h-24 bg-green-200 rounded-full opacity-40"></div>
                      <p className="text-sm text-gray-600 mt-4">Interactive World Map</p>
                      <p className="text-xs text-gray-500">Loading disaster locations...</p>
                    </div>
                  </div>

                  {/* Disaster Points */}
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>

                  {/* Map Controls */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <Button variant="secondary" size="sm">🌍 Satellite</Button>
                    <Button variant="outline" size="sm">🗺️ Terrain</Button>
                  </div>
                  
                  <div className="absolute top-4 right-4 space-y-2">
                    <Button variant="outline" size="sm">+ Zoom</Button>
                    <Button variant="outline" size="sm">- Zoom</Button>
                  </div>
                </div>
              </div>

              {/* Disaster List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Active Disasters
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🔥</span>
                        <h4 className="font-medium text-sm">Australia Bushfires</h4>
                      </div>
                      <Badge className="bg-red-500">CRITICAL</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Major bushfires in New South Wales</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>25,000 affected</span>
                      <span>Today</span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">💧</span>
                        <h4 className="font-medium text-sm">California Flooding</h4>
                      </div>
                      <Badge className="bg-orange-500">HIGH</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Severe flooding in Bay Area</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>45,000 affected</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🌋</span>
                        <h4 className="font-medium text-sm">Tokyo Earthquake</h4>
                      </div>
                      <Badge className="bg-yellow-500">MEDIUM</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Magnitude 6.2 earthquake detected</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>120,000 affected</span>
                      <span>4 hours ago</span>
                    </div>
                  </div>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-7 w-7 mr-3" />
                Active Alerts
              </CardTitle>
              <CardDescription>
                Current emergency notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border-l-4 border-l-red-500 bg-red-50 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-800">Immediate evacuation required due to flooding</p>
                    <p className="text-sm text-red-600">Downtown Area • 2:30 PM</p>
                  </div>
                  <Badge className="bg-red-500">HIGH</Badge>
                </div>
              </div>
              
              <div className="p-3 border-l-4 border-l-yellow-500 bg-yellow-50 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-yellow-800">Stay indoors, severe weather warning</p>
                    <p className="text-sm text-yellow-600">Northern District • 1:30 PM</p>
                  </div>
                  <Badge className="bg-yellow-500">MEDIUM</Badge>
                </div>
              </div>

              <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-orange-800">Road closures due to landslide</p>
                    <p className="text-sm text-orange-600">Mountain Highway • 12:45 PM</p>
                  </div>
                  <Badge className="bg-orange-500">HIGH</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shelter Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-7 w-7 mr-3" />
                Shelter Status
              </CardTitle>
              <CardDescription>
                Emergency shelter capacity and occupancy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">Central Community Center</p>
                    <p className="text-sm text-muted-foreground">Downtown</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">OPEN</Badge>
                </div>
                <Progress value={64} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Capacity: 320/500 (64%)</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">Westside High School</p>
                    <p className="text-sm text-muted-foreground">West District</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">OPEN</Badge>
                </div>
                <Progress value={56} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Capacity: 450/800 (56%)</p>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">Northside Sports Complex</p>
                    <p className="text-sm text-muted-foreground">North District</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">LIMITED</Badge>
                </div>
                <Progress value={89} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Capacity: 445/500 (89%)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Sensors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="h-5 w-5 mr-2" />
                Water Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Bay Bridge</span>
                    <span className="text-blue-600">7.2m</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>River Delta</span>
                    <span className="text-yellow-600">8.5m</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coastal Area</span>
                    <span className="text-green-600">3.1m</span>
                  </div>
                  <Progress value={31} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wind className="h-5 w-5 mr-2" />
                Wind Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>North District</span>
                    <span className="text-orange-600">45 km/h</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coastal Area</span>
                    <span className="text-red-600">78 km/h</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Downtown</span>
                    <span className="text-green-600">23 km/h</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Thermometer className="h-5 w-5 mr-2" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Urban Core</span>
                    <span className="text-orange-600">32°C</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Suburban Area</span>
                    <span className="text-yellow-600">28°C</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coastal Zone</span>
                    <span className="text-green-600">24°C</span>
                  </div>
                  <Progress value={55} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common emergency management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <AlertTriangle className="h-8 w-8" />
                <span className="text-sm">Declare Emergency</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Users className="h-8 w-8" />
                <span className="text-sm">Manage Teams</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Building className="h-8 w-8" />
                <span className="text-sm">Shelters</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Heart className="h-8 w-8" />
                <span className="text-sm">Medical Aid</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="h-8 w-8" />
                <span className="text-sm">Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Shield className="h-8 w-8" />
                <span className="text-sm">Security</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}