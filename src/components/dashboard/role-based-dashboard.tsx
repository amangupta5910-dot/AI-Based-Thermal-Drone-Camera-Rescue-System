"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  Upload,
  DollarSign,
  Truck,
  Heart,
  Building,
  Phone,
  MessageSquare,
  Settings,
  BarChart3,
  Database,
  Zap,
  Globe
} from 'lucide-react';

interface RoleBasedDashboardProps {
  userRole: 'government' | 'ngo' | 'public';
}

export default function RoleBasedDashboard({ userRole }: RoleBasedDashboardProps) {
  console.log('RoleBasedDashboard: Component mounted with userRole:', userRole);
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'government': return <Building className="h-5 w-5" />;
      case 'ngo': return <Heart className="h-5 w-5" />;
      case 'public': return <Users className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getRoleIcon(userRole)}
          <div>
            <h1 className="text-2xl font-bold capitalize">{userRole} Dashboard</h1>
            <p className="text-muted-foreground">
              {userRole === 'government' && 'Emergency Management & Coordination'}
              {userRole === 'ngo' && 'Relief Operations & Volunteer Management'}
              {userRole === 'public' && 'Personal Safety & Community Updates'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="capitalize">
            {userRole}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

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
            <Truck className="h-4 w-4 text-muted-foreground" />
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
                <Alert className="border-l-4 border-l-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Immediate evacuation required due to flooding</p>
                        <p className="text-sm text-muted-foreground">
                          Downtown Area • 2:30 PM
                        </p>
                      </div>
                      <Badge className="bg-orange-500">
                        HIGH
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-l-4 border-l-yellow-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Stay indoors, severe weather warning</p>
                        <p className="text-sm text-muted-foreground">
                          Northern District • 1:30 PM
                        </p>
                      </div>
                      <Badge className="bg-yellow-500">
                        MEDIUM
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Central Community Center</p>
                      <p className="text-sm text-muted-foreground">Downtown</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      OPEN
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Capacity: 320/500</span>
                      <span>64%</span>
                    </div>
                    <Progress value={64} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Westside High School</p>
                      <p className="text-sm text-muted-foreground">West District</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      OPEN
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Capacity: 450/800</span>
                      <span>56%</span>
                    </div>
                    <Progress value={56} className="h-2" />
                  </div>
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
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Map
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-500">MEDIUM</Badge>
                      <Badge variant="outline">SHELTER_IN_PLACE</Badge>
                    </div>
                    <p className="font-medium">Stay indoors, severe weather warning</p>
                    <p className="text-sm text-muted-foreground">
                      Northern District • 2024-01-15 1:30:00 PM
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">MEDICAL</Badge>
                      <Badge variant="outline" className="text-green-600">AVAILABLE</Badge>
                    </div>
                    <p className="font-medium">Medical Supplies</p>
                    <p className="text-sm text-muted-foreground">
                      Central Warehouse • Quantity: 500
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Locate
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">FOOD</Badge>
                      <Badge variant="outline" className="text-yellow-600">LOW_STOCK</Badge>
                    </div>
                    <p className="font-medium">Food Packages</p>
                    <p className="text-sm text-muted-foreground">
                      Distribution Center A • Quantity: 1200
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Locate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions and updates in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">New damage assessment report submitted</p>
                    <p className="text-sm text-muted-foreground">
                      John Doe • 2024-01-15 2:15:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Truck className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Medical supplies deployed to Central Shelter</p>
                    <p className="text-sm text-muted-foreground">
                      Emergency Team • 2024-01-15 1:45:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Building className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">New shelter opened at Westside High School</p>
                    <p className="text-sm text-muted-foreground">
                      Government Agency • 2024-01-15 1:15:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}