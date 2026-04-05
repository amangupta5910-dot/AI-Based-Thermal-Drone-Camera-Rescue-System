"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Monitor, 
  Database,
  Globe,
  Lock,
  Wifi,
  Download,
  Upload,
  Smartphone,
  Mail,
  MapPin,
  Volume2,
  VolumeX,
  AlertTriangle,
  Cloud,
  Users
} from 'lucide-react';

interface SettingsPanelProps {
  onClose?: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [userSettings, setUserSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    language: 'en',
    timezone: 'America/Los_Angeles'
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: true,
    push: true,
    emergencyAlerts: true,
    weatherAlerts: true,
    communityUpdates: false,
    sound: true,
    vibration: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareLocation: true,
    shareContactInfo: false,
    allowAnalytics: true,
    publicProfile: false,
    dataRetention: '30'
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    mapType: 'standard'
  });

  const [systemSettings, setSystemSettings] = useState({
    autoUpdate: true,
    offlineMode: false,
    dataSync: 'wifi-only',
    cacheSize: '100',
    apiEndpoint: 'https://api.starfleet-disaster.com'
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log('Settings saved:', {
      userSettings,
      notificationPreferences,
      privacySettings,
      displaySettings,
      systemSettings
    });
    if (onClose) onClose();
  };

  const handleExportSettings = () => {
    const settings = {
      userSettings,
      notificationPreferences,
      privacySettings,
      displaySettings,
      systemSettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'starfleet-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Settings</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportSettings}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="user" className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">User</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-1">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="display" className="flex items-center space-x-1">
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Display</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center space-x-1">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      value={userSettings.name}
                      onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input 
                      type="tel"
                      value={userSettings.phone}
                      onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      value={userSettings.location}
                      onChange={(e) => setUserSettings({...userSettings, location: e.target.value})}
                    />
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-medium">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Language</label>
                    <Select value={userSettings.language} onValueChange={(value) => setUserSettings({...userSettings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <Select value={userSettings.timezone} onValueChange={(value) => setUserSettings({...userSettings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {Object.entries(notificationPreferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {key === 'email' && <Mail className="h-4 w-4" />}
                        {key === 'sms' && <Smartphone className="h-4 w-4" />}
                        {key === 'push' && <Bell className="h-4 w-4" />}
                        {key === 'sound' && <Volume2 className="h-4 w-4" />}
                        {key === 'vibration' && <Smartphone className="h-4 w-4" />}
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </div>
                      <Switch 
                        checked={value}
                        onCheckedChange={(checked) => setNotificationPreferences({...notificationPreferences, [key]: checked})}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <h3 className="text-lg font-medium">Alert Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Emergency Alerts</span>
                    </div>
                    <Badge variant="destructive">High Priority</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cloud className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Weather Alerts</span>
                    </div>
                    <Badge variant="secondary">Medium Priority</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Community Updates</span>
                    </div>
                    <Badge variant="outline">Low Priority</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                
                <div className="space-y-4">
                  {Object.entries(privacySettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {key === 'shareLocation' && <MapPin className="h-4 w-4" />}
                        {key === 'shareContactInfo' && <User className="h-4 w-4" />}
                        {key === 'allowAnalytics' && <Database className="h-4 w-4" />}
                        {key === 'publicProfile' && <Globe className="h-4 w-4" />}
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </div>
                      {key === 'dataRetention' ? (
                        <Select value={String(value)} onValueChange={(value) => setPrivacySettings({...privacySettings, [key]: value})}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Switch 
                          checked={value as boolean}
                          onCheckedChange={(checked) => setPrivacySettings({...privacySettings, [key]: checked})}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                <h3 className="text-lg font-medium">Data Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">End-to-end encryption</span>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Two-factor authentication</span>
                    </div>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <Select value={displaySettings.theme} onValueChange={(value) => setDisplaySettings({...displaySettings, theme: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Font Size</span>
                    <Select value={displaySettings.fontSize} onValueChange={(value) => setDisplaySettings({...displaySettings, fontSize: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="x-large">X-Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4" />
                      <span className="text-sm font-medium">High Contrast</span>
                    </div>
                    <Switch 
                      checked={displaySettings.highContrast}
                      onCheckedChange={(checked) => setDisplaySettings({...displaySettings, highContrast: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Reduce Motion</span>
                    </div>
                    <Switch 
                      checked={displaySettings.reduceMotion}
                      onCheckedChange={(checked) => setDisplaySettings({...displaySettings, reduceMotion: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Map Type</span>
                    <Select value={displaySettings.mapType} onValueChange={(value) => setDisplaySettings({...displaySettings, mapType: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="satellite">Satellite</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Configuration</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span className="text-sm font-medium">Auto Update</span>
                    </div>
                    <Switch 
                      checked={systemSettings.autoUpdate}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoUpdate: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4" />
                      <span className="text-sm font-medium">Offline Mode</span>
                    </div>
                    <Switch 
                      checked={systemSettings.offlineMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, offlineMode: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Sync</span>
                    <Select value={systemSettings.dataSync} onValueChange={(value) => setSystemSettings({...systemSettings, dataSync: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wifi-only">WiFi Only</SelectItem>
                        <SelectItem value="wifi-cellular">WiFi & Cellular</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cache Size (MB)</span>
                    <Select value={systemSettings.cacheSize} onValueChange={(value) => setSystemSettings({...systemSettings, cacheSize: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50 MB</SelectItem>
                        <SelectItem value="100">100 MB</SelectItem>
                        <SelectItem value="200">200 MB</SelectItem>
                        <SelectItem value="500">500 MB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-medium">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">API Endpoint</label>
                    <Input 
                      value={systemSettings.apiEndpoint}
                      onChange={(e) => setSystemSettings({...systemSettings, apiEndpoint: e.target.value})}
                    />
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-medium">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Database Connection</span>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">API Status</span>
                    <Badge variant="secondary">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Real-time Services</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}