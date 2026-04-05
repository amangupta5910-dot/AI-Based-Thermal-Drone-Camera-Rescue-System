"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Bell, 
  Send, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Settings
} from 'lucide-react';

interface NotificationRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  deviceToken?: string;
  preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  role: 'government' | 'ngo' | 'public' | 'responder';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface EmergencyNotification {
  id: string;
  type: 'emergency' | 'alert' | 'update' | 'evacuation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  affectedAreas: string[];
  recipients: string[];
  channels: ('email' | 'sms' | 'push')[];
  timestamp: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  deliveryReports: {
    email?: {
      sent: number;
      delivered: number;
      failed: number;
    };
    sms?: {
      sent: number;
      delivered: number;
      failed: number;
    };
    push?: {
      sent: number;
      delivered: number;
      failed: number;
    };
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'emergency' | 'alert' | 'update' | 'evacuation';
  subject: string;
  message: string;
  variables: string[];
  isActive: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<EmergencyNotification[]>([]);
  const [recipients, setRecipients] = useState<NotificationRecipient[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New notification form state
  const [newNotification, setNewNotification] = useState<{
    type: 'emergency' | 'alert' | 'update' | 'evacuation';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    affectedAreas: string;
    channels: ('email' | 'sms' | 'push')[];
  }>({
    type: 'alert',
    severity: 'medium',
    title: '',
    message: '',
    affectedAreas: '',
    channels: ['email']
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setRecipients(data.recipients);
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const sendNotification = async () => {
    if (!newNotification.title || !newNotification.message || !newNotification.affectedAreas) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_notification',
          type: newNotification.type,
          severity: newNotification.severity,
          title: newNotification.title,
          message: newNotification.message,
          affectedAreas: newNotification.affectedAreas.split(',').map(area => area.trim()),
          channels: newNotification.channels
        })
      });

      const data = await response.json();
      if (data.success) {
        // Reset form
        setNewNotification({
          type: 'alert',
          severity: 'medium',
          title: '',
          message: '',
          affectedAreas: '',
          channels: ['email']
        });
        fetchNotifications();
      } else {
        alert('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification');
    } finally {
      setIsLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'sent': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'push': return <Smartphone className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const calculateTotalDeliveryStats = (deliveryReports: any) => {
    const totalSent = Object.values(deliveryReports).reduce((sum: number, report: any) => sum + report.sent, 0);
    const totalDelivered = Object.values(deliveryReports).reduce((sum: number, report: any) => sum + report.delivered, 0);
    const totalFailed = Object.values(deliveryReports).reduce((sum: number, report: any) => sum + report.failed, 0);
    return { totalSent, totalDelivered, totalFailed };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Emergency Notification System</h1>
                <p className="text-sm text-muted-foreground">Real-time alerts and emergency communications</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recipients.length}</div>
              <p className="text-xs text-muted-foreground">
                {recipients.filter(r => r.role === 'public').length} public, {recipients.filter(r => r.role === 'government').length} government
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Active Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.status === 'sent' || n.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {notifications.filter(n => n.severity === 'critical').length} critical
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Delivery Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {notifications.length > 0 
                  ? Math.round(
                      notifications.reduce((sum, n) => {
                        const stats = calculateTotalDeliveryStats(n.deliveryReports);
                        return sum + (stats.totalSent > 0 ? (stats.totalDelivered / stats.totalSent) * 100 : 0);
                      }, 0) / notifications.length
                    )
                  : 100}%
              </div>
              <p className="text-xs text-muted-foreground">Average success rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="send">Send Notification</TabsTrigger>
            <TabsTrigger value="history">History ({notifications.length})</TabsTrigger>
            <TabsTrigger value="recipients">Recipients ({recipients.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Emergency Notification</CardTitle>
                <CardDescription>
                  Create and send emergency alerts to targeted recipients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notification Type</label>
                    <Select 
                      value={newNotification.type} 
                      onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="evacuation">Evacuation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Severity Level</label>
                    <Select 
                      value={newNotification.severity} 
                      onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, severity: value }))}
                    >
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
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input 
                    placeholder="Notification title..."
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Detailed message content..."
                    rows={4}
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Affected Areas (comma-separated)</label>
                  <Input 
                    placeholder="e.g., San Francisco, Oakland, Berkeley"
                    value={newNotification.affectedAreas}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, affectedAreas: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Delivery Channels</label>
                  <div className="flex space-x-4">
                    {(['email', 'sms', 'push'] as const).map(channel => (
                      <label key={channel} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newNotification.channels.includes(channel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewNotification(prev => ({ 
                                ...prev, 
                                channels: [...prev.channels, channel] 
                              }));
                            } else {
                              setNewNotification(prev => ({ 
                                ...prev, 
                                channels: prev.channels.filter(c => c !== channel) 
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <div className="flex items-center space-x-1">
                          {getChannelIcon(channel)}
                          <span className="text-sm capitalize">{channel}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={sendNotification} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? 'Sending...' : 'Send Notification'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Templates</CardTitle>
                <CardDescription>Use pre-defined notification templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map(template => (
                    <div key={template.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                      <p className="text-sm mb-3">{template.message}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setNewNotification(prev => ({
                          ...prev,
                          type: template.type,
                          title: template.subject,
                          message: template.message
                        }))}
                      >
                        Use Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              {notifications.map(notification => {
                const stats = calculateTotalDeliveryStats(notification.deliveryReports);
                return (
                  <Card key={notification.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{notification.title}</CardTitle>
                          <CardDescription>
                            {new Date(notification.timestamp).toLocaleString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(notification.severity)}>
                            {notification.severity.toUpperCase()}
                          </Badge>
                          <div className={`flex items-center space-x-1 ${getStatusColor(notification.status)}`}>
                            {getStatusIcon(notification.status)}
                            <span className="text-sm capitalize">{notification.status}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm">{notification.message}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {notification.affectedAreas.map((area, index) => (
                            <Badge key={index} variant="secondary">
                              <MapPin className="h-3 w-3 mr-1" />
                              {area}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-4">
                          {notification.channels.map(channel => (
                            <div key={channel} className="flex items-center space-x-2">
                              {getChannelIcon(channel)}
                              <span className="text-sm capitalize">{channel}</span>
                              {notification.deliveryReports[channel] && (
                                <div className="text-xs text-muted-foreground">
                                  {notification.deliveryReports[channel]!.delivered}/{notification.deliveryReports[channel]!.sent} delivered
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4">
                          <div className="text-sm text-muted-foreground mb-2">
                            Recipients: {notification.recipients.length} • 
                            Total Sent: {stats.totalSent} • 
                            Delivered: {stats.totalDelivered} • 
                            Failed: {stats.totalFailed}
                          </div>
                          {stats.totalSent > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Delivery Success Rate</span>
                                <span>{Math.round((stats.totalDelivered / stats.totalSent) * 100)}%</span>
                              </div>
                              <Progress 
                                value={(stats.totalDelivered / stats.totalSent) * 100} 
                                className="h-2" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {notifications.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No notifications sent yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Send your first emergency notification using the form above
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recipients" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipients.map(recipient => (
                <Card key={recipient.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{recipient.name}</CardTitle>
                      <Badge variant="outline">{recipient.role}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recipient.email && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{recipient.email}</span>
                        </div>
                      )}
                      
                      {recipient.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MessageSquare className="h-3 w-3" />
                          <span>{recipient.phone}</span>
                        </div>
                      )}
                      
                      {recipient.location && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span>{recipient.location.address}</span>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t">
                        <div className="text-xs font-medium mb-2">Notification Preferences</div>
                        <div className="space-y-1">
                          {Object.entries(recipient.preferences).map(([channel, enabled]) => (
                            <div key={channel} className="flex items-center justify-between text-xs">
                              <span className="capitalize">{channel}</span>
                              <Badge variant={enabled ? "default" : "secondary"}>
                                {enabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Add New Recipient</CardTitle>
                <CardDescription>Register a new recipient for emergency notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Plus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Recipient management form</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Form to add new notification recipients would be implemented here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}