"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, BarChart3, AlertTriangle, Users, Building, Heart } from 'lucide-react';

export default function SimpleDashboard() {
  console.log('SimpleDashboard: Component rendering');
  
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
              <Badge variant="outline">Government</Badge>
              <Button variant="outline" size="sm">
                Alerts
              </Button>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              System Status
            </CardTitle>
            <CardDescription>
              Dashboard is operational and ready for use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm text-muted-foreground">System Online</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-muted-foreground">Active Disasters</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-600">284</div>
                <div className="text-sm text-muted-foreground">Resources Deployed</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-600">8.2m</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
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
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm">Declare Emergency</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Manage Teams</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Building className="h-6 w-6" />
                <span className="text-sm">Shelters</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Heart className="h-6 w-6" />
                <span className="text-sm">Medical Aid</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6" />
                <span className="text-sm">Security</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}