"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OfflineManager from '@/components/offline/offline-manager';
import { 
  Wifi, 
  WifiOff, 
  Shield, 
  MapPin, 
  Phone, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Database,
  Users,
  Activity,
  Zap,
  Heart,
  Truck,
  Building
} from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    // Check online status
    const handleOnline = () => {
      setIsOnline(true);
      setLastSync(new Date().toISOString());
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    setIsOnline(navigator.onLine);
    
    // Load last sync time
    const savedLastSync = localStorage.getItem('lastSync');
    if (savedLastSync) {
      setLastSync(savedLastSync);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', icon: Phone, color: 'bg-red-500' },
    { name: 'Fire Department', number: '911', icon: AlertTriangle, color: 'bg-orange-500' },
    { name: 'Police', number: '911', icon: Shield, color: 'bg-blue-500' },
    { name: 'Medical Emergency', number: '911', icon: Heart, color: 'bg-green-500' },
    { name: 'Disaster Hotline', number: '1-800-621-3362', icon: Phone, color: 'bg-purple-500' },
    { name: 'Poison Control', number: '1-800-222-1222', icon: AlertTriangle, color: 'bg-yellow-500' }
  ];

  const offlineFeatures = [
    {
      icon: MapPin,
      title: 'Offline Maps',
      description: 'Access cached maps and shelter locations',
      action: 'View Maps'
    },
    {
      icon: Phone,
      title: 'Emergency Contacts',
      description: 'One-tap access to emergency services',
      action: 'View Contacts'
    },
    {
      icon: MessageSquare,
      title: 'Offline Reports',
      description: 'File reports that sync when online',
      action: 'Create Report'
    },
    {
      icon: Shield,
      title: 'Safety Guidelines',
      description: 'Access critical safety information',
      action: 'View Guidelines'
    }
  ];

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isOnline ? <Wifi className="h-8 w-8 text-green-500" /> : <WifiOff className="h-8 w-8 text-red-500" />}
                <div>
                  <h1 className="text-2xl font-bold">Offline Mode</h1>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? 'Connected - All features available' : 'Offline - Limited functionality available'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
              
              {lastSync && (
                <div className="text-sm text-muted-foreground">
                  Last sync: {new Date(lastSync).toLocaleString()}
                </div>
              )}
              
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Status Alert */}
        {!isOnline && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                You Are Offline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700">
                You are currently offline. Starfleet Disaster Response continues to work with cached data. 
                Emergency features remain available, and some data will sync automatically when you reconnect.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contacts - Always Available */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>
              Always available - one-tap emergency calling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {emergencyContacts.map((contact, index) => (
                <Button
                  key={index}
                  variant="destructive"
                  size="sm"
                  className="h-auto p-3 flex flex-col items-center space-y-1"
                  onClick={() => handleEmergencyCall(contact.number)}
                >
                  <contact.icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center">{contact.name}</span>
                  <span className="text-xs">{contact.number}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offline Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Available Offline
              </CardTitle>
              <CardDescription>
                Features that work without internet connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {offlineFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="p-4 border rounded-lg text-center hover:bg-muted/50 transition-colors">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{feature.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        {feature.action}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Status
              </CardTitle>
              <CardDescription>
                Current system status and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {isOnline ? '100%' : '85%'}
                    </div>
                    <div className="text-xs text-muted-foreground">Features Available</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {isOnline ? 'Real-time' : 'Cached'}
                    </div>
                    <div className="text-xs text-muted-foreground">Data Status</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Emergency Services</span>
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Location Services</span>
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Data Synchronization</span>
                    <Badge variant={isOnline ? "outline" : "secondary"}>
                      {isOnline ? 'Active' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>AI Assistant</span>
                    <Badge variant={isOnline ? "outline" : "secondary"}>
                      {isOnline ? 'Online' : 'Limited'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offline Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Offline Data Management
            </CardTitle>
            <CardDescription>
              Manage cached data and synchronization settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OfflineManager />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common actions available offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <MapPin className="h-6 w-6" />
                <span className="text-sm">Find Shelter</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm">Report Incident</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Heart className="h-6 w-6" />
                <span className="text-sm">First Aid</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Download className="h-6 w-6" />
                <span className="text-sm">Download Guide</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Safety Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Safety Information
            </CardTitle>
            <CardDescription>
              Critical safety guidelines available offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium">Emergency Procedures</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Stay calm and assess your situation</li>
                  <li>• Check for injuries and provide first aid</li>
                  <li>• Listen to emergency broadcasts</li>
                  <li>• Follow evacuation orders if given</li>
                  <li>• Help others if you can safely do so</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Offline Resources</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Cached maps and shelter locations</li>
                  <li>• Emergency contact information</li>
                  <li>• First aid instructions</li>
                  <li>• Safety guidelines by disaster type</li>
                  <li>• Communication procedures</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}