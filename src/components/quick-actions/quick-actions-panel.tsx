"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  MessageSquare, 
  Bell, 
  MapPin, 
  Home, 
  Hospital, 
  Shield, 
  Zap,
  AlertTriangle,
  Users,
  Car,
  Droplets,
  Wind,
  Thermometer,
  Truck,
  Ambulance,
  Cloud
} from 'lucide-react';

interface QuickActionsPanelProps {
  userLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  currentAlert?: {
    type: string;
    severity: string;
    location: string;
  };
}

interface Shelter {
  id: string;
  name: string;
  distance: number;
  capacity: number;
  occupied: number;
  facilities: string[];
}

export default function QuickActionsPanel({ userLocation, currentAlert }: QuickActionsPanelProps) {
  const router = useRouter();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showShelterDialog, setShowShelterDialog] = useState(false);
  const [reportData, setReportData] = useState({
    type: '',
    description: '',
    severity: 'medium',
    location: userLocation.address
  });

  // Mock shelter data
  const shelters: Shelter[] = [
    {
      id: '1',
      name: 'Central Community Center',
      distance: 0.8,
      capacity: 500,
      occupied: 320,
      facilities: ['Medical', 'Food', 'Water', 'WiFi']
    },
    {
      id: '2',
      name: 'Westside High School',
      distance: 1.2,
      capacity: 800,
      occupied: 450,
      facilities: ['Medical', 'Food', 'Water', 'Showers']
    },
    {
      id: '3',
      name: 'St. Mary\'s Church',
      distance: 2.1,
      capacity: 200,
      occupied: 120,
      facilities: ['Food', 'Water', 'Basic Medical']
    }
  ];

  const emergencyServices = [
    { name: 'Emergency 911', icon: Phone, number: '911', color: 'bg-red-500' },
    { name: 'Fire Department', icon: Truck, number: '911', color: 'bg-orange-500' },
    { name: 'Police', icon: Shield, number: '911', color: 'bg-blue-500' },
    { name: 'Medical Emergency', icon: Ambulance, number: '911', color: 'bg-green-500' },
    { name: 'Disaster Hotline', icon: Phone, number: '1-800-621-3362', color: 'bg-purple-500' },
    { name: 'Poison Control', icon: AlertTriangle, number: '1-800-222-1222', color: 'bg-yellow-500' }
  ];

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleReportSubmit = () => {
    // In a real app, this would send the report to the backend
    console.log('Report submitted:', reportData);
    setShowReportDialog(false);
    setReportData({
      type: '',
      description: '',
      severity: 'medium',
      location: userLocation.address
    });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Zap className="h-4 w-4 mr-2" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Emergency services and quick access to critical features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Emergency Call Section */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            Emergency Calls
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {emergencyServices.slice(0, 4).map((service) => (
              <Button
                key={service.name}
                variant="destructive"
                size="sm"
                className="h-auto p-2 flex flex-col items-center space-y-1"
                onClick={() => handleEmergencyCall(service.number)}
              >
                <service.icon className="h-4 w-4" />
                <span className="text-xs">{service.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* AI Assistant */}
          <Button
            variant="outline"
            size="sm"
            className="h-auto p-2 flex flex-col items-center space-y-1"
            onClick={() => {
              // Navigate to chatbot page
              router.push('/chatbot');
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">AI Assistant</span>
          </Button>

          {/* Report Event */}
          <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center space-y-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">Report Event</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Emergency Event</DialogTitle>
                <DialogDescription>
                  Provide details about the emergency situation you're reporting
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Event Type</label>
                  <Select value={reportData.type} onValueChange={(value) => setReportData({...reportData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="earthquake">Earthquake</SelectItem>
                      <SelectItem value="storm">Storm</SelectItem>
                      <SelectItem value="accident">Accident</SelectItem>
                      <SelectItem value="medical">Medical Emergency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <Select value={reportData.severity} onValueChange={(value) => setReportData({...reportData, severity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input 
                    value={reportData.location}
                    onChange={(e) => setReportData({...reportData, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    value={reportData.description}
                    onChange={(e) => setReportData({...reportData, description: e.target.value})}
                    placeholder="Describe the emergency situation..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReportSubmit}>
                    Submit Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Find Shelter */}
          <Dialog open={showShelterDialog} onOpenChange={setShowShelterDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-auto p-2 flex flex-col items-center space-y-1">
                <Home className="h-4 w-4" />
                <span className="text-xs">Find Shelter</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nearby Shelters</DialogTitle>
                <DialogDescription>
                  Available emergency shelters in your area
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {shelters.map((shelter) => (
                  <Card key={shelter.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{shelter.name}</CardTitle>
                        <Badge variant="secondary">{shelter.distance} km</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Capacity:</span>
                          <span>{shelter.occupied}/{shelter.capacity} ({Math.round((shelter.occupied / shelter.capacity) * 100)}%)</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {shelter.facilities.map((facility) => (
                            <Badge key={facility} variant="outline" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full mt-2">
                          Get Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Notifications */}
          <Button
            variant="outline"
            size="sm"
            className="h-auto p-2 flex flex-col items-center space-y-1"
            onClick={() => {
              router.push('/notifications');
            }}
          >
            <Bell className="h-4 w-4" />
            <span className="text-xs">Notifications</span>
          </Button>
        </div>

        {/* Current Alert Status */}
        {currentAlert && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Current Alert</span>
              <Badge className={getSeverityColor(currentAlert.severity)}>
                {currentAlert.severity.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {currentAlert.type} alert in {currentAlert.location}
            </p>
          </div>
        )}

        {/* Quick Status */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Your Location</div>
            <div className="text-muted-foreground">{userLocation.address.split(',')[0]}</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Status</div>
            <div className="text-green-600">Safe</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}