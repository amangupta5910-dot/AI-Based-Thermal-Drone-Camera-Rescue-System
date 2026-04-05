"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Users, 
  Building, 
  Heart,
  BarChart3,
  MapPin,
  AlertTriangle,
  Activity,
  Settings,
  Bell,
  Database,
  Globe,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function DashboardPage() {
  console.log('DashboardPage: Component rendering');
  const [userRole, setUserRole] = useState<'government' | 'ngo' | 'public'>('government');

  const roleStats = {
    government: {
      activeUsers: 156,
      managedResources: 2847,
      responseRate: 94,
      avgResponseTime: 8.2
    },
    ngo: {
      activeVolunteers: 1240,
      managedShelters: 45,
      distributedAid: 15600,
      satisfactionRate: 87
    },
    public: {
      activeReports: 89,
      nearbyShelters: 12,
      communityHelp: 234,
      safetyScore: 92
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'government': return <Building className="h-5 w-5" />;
      case 'ngo': return <Heart className="h-5 w-5" />;
      case 'public': return <Users className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'government':
        return 'Full access to emergency management systems, resource allocation, and cross-agency coordination';
      case 'ngo':
        return 'Manage relief operations, coordinate volunteers, and distribute aid to affected communities';
      case 'public':
        return 'Report incidents, find shelters, and access emergency information and resources';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Starfleet Command Center</h1>
                <p className="text-sm text-muted-foreground">Advanced Disaster Response Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Role:</span>
                <Select value={userRole} onValueChange={(value) => setUserRole(value as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
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
        {/* Role Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getRoleIcon(userRole)}
                <div>
                  <CardTitle className="capitalize">{userRole} Portal</CardTitle>
                  <CardDescription>{getRoleDescription(userRole)}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {userRole}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(roleStats[userRole]).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Content */}
        <div className="space-y-6">
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Disasters</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Multiple emergencies
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">People Affected</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,450</div>
                <p className="text-xs text-muted-foreground">
                  Requiring assistance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resources Deployed</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">284</div>
                <p className="text-xs text-muted-foreground">
                  Units distributed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.2m</div>
                <p className="text-xs text-muted-foreground">
                  Emergency response
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
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
                  </CardContent>
                </Card>

                {/* Shelter Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2" />
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '56%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Capacity: 450/800 (56%)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Role Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Your Permissions
                  </CardTitle>
                  <CardDescription>
                    Available actions based on your role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Full system access</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Resource allocation</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Emergency declarations</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Cross-agency coordination</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Data analytics and reporting</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Blockchain fund management</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Alerts</CardTitle>
                  <CardDescription>
                    Comprehensive view of all emergency alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-orange-500">HIGH</Badge>
                          <Badge variant="outline">EVACUATION</Badge>
                        </div>
                        <p className="font-medium">Immediate evacuation required due to flooding</p>
                        <p className="text-sm text-muted-foreground">
                          Downtown Area • 2024-01-15 2:30:00 PM
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Map
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Management</CardTitle>
                  <CardDescription>
                    Track and manage emergency resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Resource management features will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest system activities and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Activity tracking features will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks based on your role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {userRole === 'government' && (
                  <>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <AlertTriangle className="h-6 w-6" />
                      <span className="text-sm">Declare Emergency</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Database className="h-6 w-6" />
                      <span className="text-sm">Allocate Resources</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <MapPin className="h-6 w-6" />
                      <span className="text-sm">Evacuation Zones</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <TrendingUp className="h-6 w-6" />
                      <span className="text-sm">Analytics</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Phone className="h-6 w-6" />
                      <span className="text-sm">Emergency Comms</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Globe className="h-6 w-6" />
                      <span className="text-sm">Global Coordination</span>
                    </Button>
                  </>
                )}
                
                {userRole === 'ngo' && (
                  <>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Building className="h-6 w-6" />
                      <span className="text-sm">Manage Shelters</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Volunteers</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Heart className="h-6 w-6" />
                      <span className="text-sm">Distribute Aid</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <MessageSquare className="h-6 w-6" />
                      <span className="text-sm">Public Updates</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <CheckCircle className="h-6 w-6" />
                      <span className="text-sm">Verify Reports</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Activity className="h-6 w-6" />
                      <span className="text-sm">Track Progress</span>
                    </Button>
                  </>
                )}
                
                {userRole === 'public' && (
                  <>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <AlertTriangle className="h-6 w-6" />
                      <span className="text-sm">Report Incident</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Building className="h-6 w-6" />
                      <span className="text-sm">Find Shelter</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Phone className="h-6 w-6" />
                      <span className="text-sm">Emergency Call</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <MapPin className="h-6 w-6" />
                      <span className="text-sm">Safety Map</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Bell className="h-6 w-6" />
                      <span className="text-sm">Get Alerts</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Help Others</span>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}