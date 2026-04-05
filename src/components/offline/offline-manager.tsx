"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Download,
  Upload,
  RotateCcw,
  Shield,
  MapPin,
  Phone,
  MessageSquare
} from 'lucide-react';

interface OfflineData {
  id: string;
  type: 'report' | 'location' | 'message' | 'alert';
  data: any;
  timestamp: string;
  synced: boolean;
}

interface CacheInfo {
  name: string;
  size: number;
  entries: number;
}

export default function OfflineManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    setIsOnline(navigator.onLine);
    
    // Register service worker
    registerServiceWorker();
    
    // Load offline data
    loadOfflineData();
    
    // Load cache info
    loadCacheInfo();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
        setServiceWorkerRegistered(true);
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker available');
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const loadOfflineData = async () => {
    // Simulate loading offline data from IndexedDB
    const mockData: OfflineData[] = [
      {
        id: '1',
        type: 'report',
        data: {
          type: 'flood',
          location: 'Downtown Area',
          severity: 'high',
          description: 'Severe flooding reported'
        },
        timestamp: '2024-01-15T10:30:00Z',
        synced: false
      },
      {
        id: '2',
        type: 'location',
        data: {
          lat: 37.7749,
          lng: -122.4194,
          accuracy: 10
        },
        timestamp: '2024-01-15T09:15:00Z',
        synced: true
      }
    ];
    
    setOfflineData(mockData);
  };

  const loadCacheInfo = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const cacheInfos: CacheInfo[] = [];
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          let totalSize = 0;
          
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }
          
          cacheInfos.push({
            name: cacheName,
            size: totalSize,
            entries: keys.length
          });
        }
        
        setCacheInfo(cacheInfos);
      } catch (error) {
        console.error('Failed to load cache info:', error);
      }
    }
  };

  const syncOfflineData = async () => {
    if (!isOnline) {
      alert('Please connect to the internet to sync data');
      return;
    }
    
    setIsSyncing(true);
    setSyncProgress(0);
    
    // Simulate sync process
    const unsyncedData = offlineData.filter(item => !item.synced);
    
    for (let i = 0; i < unsyncedData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      setSyncProgress(((i + 1) / unsyncedData.length) * 100);
      
      // Update item as synced
      setOfflineData(prev => 
        prev.map(item => 
          item.id === unsyncedData[i].id 
            ? { ...item, synced: true }
            : item
        )
      );
    }
    
    setIsSyncing(false);
    
    // Trigger background sync
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register('background-sync');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  };

  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        await loadCacheInfo();
        alert('Cache cleared successfully');
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    }
  };

  const downloadOfflineData = () => {
    // Create a downloadable package of offline data
    const data = {
      offlineData,
      cacheInfo,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'starfleet-offline-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getOfflineFeatures = () => [
    { icon: MapPin, title: 'Offline Maps', description: 'Cached maps and shelter locations' },
    { icon: Phone, title: 'Emergency Calls', description: 'One-tap emergency contact access' },
    { icon: MessageSquare, title: 'Offline Messaging', description: 'Queue messages to send when online' },
    { icon: Shield, title: 'Cached Alerts', description: 'Access critical alerts offline' }
  ];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {isOnline ? <Wifi className="h-5 w-5 mr-2 text-green-500" /> : <WifiOff className="h-5 w-5 mr-2 text-red-500" />}
            Connection Status
          </CardTitle>
          <CardDescription>
            {isOnline ? 'You are online and connected to the disaster response network' : 'You are currently offline - cached data is available'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Network Status</span>
                <Badge variant={isOnline ? "default" : "destructive"}>
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Service Worker</span>
                <Badge variant={serviceWorkerRegistered ? "default" : "secondary"}>
                  {serviceWorkerRegistered ? 'Registered' : 'Not Registered'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Offline Data</span>
                <Badge variant="outline">
                  {offlineData.length} items
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cache Size</span>
                <span className="text-sm font-medium">
                  {formatFileSize(cacheInfo.reduce((total, cache) => total + cache.size, 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cached Entries</span>
                <span className="text-sm font-medium">
                  {cacheInfo.reduce((total, cache) => total + cache.entries, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Sync</span>
                <span className="text-sm font-medium">
                  {offlineData.length > 0 ? new Date(offlineData[0].timestamp).toLocaleString() : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Features */}
      {!isOnline && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are currently offline. The following features are still available:
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Offline Features</CardTitle>
          <CardDescription>Features that work even without internet connection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getOfflineFeatures().map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-4 border rounded-lg text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sync Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Data Synchronization
          </CardTitle>
          <CardDescription>
            Manage offline data and sync when back online
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSyncing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Syncing offline data...</span>
                <span>{Math.round(syncProgress)}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={syncOfflineData} 
              disabled={!isOnline || isSyncing || offlineData.filter(item => !item.synced).length === 0}
            >
              <Upload className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
            
            <Button variant="outline" onClick={downloadOfflineData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            
            <Button variant="outline" onClick={clearCache}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Offline Data
          </CardTitle>
          <CardDescription>
            Data stored locally for offline access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {offlineData.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No offline data stored</p>
            </div>
          ) : (
            <div className="space-y-3">
              {offlineData.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${item.synced ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div>
                      <div className="text-sm font-medium capitalize">{item.type}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.synced ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <Badge variant={item.synced ? "secondary" : "outline"}>
                      {item.synced ? 'Synced' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cache Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Cache Information
          </CardTitle>
          <CardDescription>
            Browser cache usage for offline functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cacheInfo.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No cache information available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cacheInfo.map((cache, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{cache.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {cache.entries} entries
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatFileSize(cache.size)}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((cache.size / (1024 * 1024)) * 100) / 100} MB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}