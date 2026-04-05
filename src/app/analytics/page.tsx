"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  MapPin,
  AlertTriangle,
  Clock,
  Target,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  DollarSign,
  Truck,
  Shield,
  CheckCircle,
  XCircle,
  Zap,
  Database,
  Globe
} from 'lucide-react';
import AnalyticsDashboard from '@/components/analytics/analytics-dashboard';

export default function AnalyticsPage() {
  const [userRole, setUserRole] = useState<'government' | 'ngo' | 'public'>('government');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('affected');

  const analyticsStats = {
    totalReports: 1247,
    avgResponseTime: 8.3,
    predictionAccuracy: 92.4,
    resourcesUtilized: 87,
    activeDisasters: 3,
    peopleAffected: 9840
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'government':
        return [
          'Full analytics access',
          'Export detailed reports',
          'Real-time data monitoring',
          'Predictive modeling',
          'Budget analysis',
          'Cross-agency metrics'
        ];
      case 'ngo':
        return [
          'Resource utilization analytics',
          'Volunteer coordination metrics',
          'Shelter occupancy data',
          'Aid distribution tracking',
          'Impact assessment reports',
          'Performance metrics'
        ];
      case 'public':
        return [
          'Basic disaster statistics',
          'Safety information access',
          'Community impact data',
          'Emergency resource locations',
          'Public alert analytics',
          'Personal safety metrics'
        ];
      default:
        return [];
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
                <h1 className="text-2xl font-bold">Starfleet Analytics Center</h1>
                <p className="text-sm text-muted-foreground">Advanced Disaster Response Analytics & Reporting</p>
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
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Analytics Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>
                  Key performance indicators and metrics for disaster response operations
                </CardDescription>
              </div>
              <Badge variant="outline" className="capitalize">
                {userRole} Access
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsStats.totalReports}
                </div>
                <div className="text-sm text-muted-foreground">Total Reports</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analyticsStats.avgResponseTime}m
                </div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analyticsStats.predictionAccuracy}%
                </div>
                <div className="text-sm text-muted-foreground">AI Accuracy</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {analyticsStats.resourcesUtilized}%
                </div>
                <div className="text-sm text-muted-foreground">Resources Used</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {analyticsStats.activeDisasters}
                </div>
                <div className="text-sm text-muted-foreground">Active Disasters</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {analyticsStats.peopleAffected.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">People Affected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Analytics Permissions</CardTitle>
            <CardDescription>
              Available analytics features based on your role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getRolePermissions(userRole).map((permission, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{permission}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Dashboard */}
        <AnalyticsDashboard userRole={userRole} />

        {/* Quick Analytics Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Analytics Actions</CardTitle>
            <CardDescription>
              Common analytics tasks and reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userRole === 'government' && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Generate Report</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Database className="h-6 w-6" />
                    <span className="text-sm">Data Export</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Target className="h-6 w-6" />
                    <span className="text-sm">Predictions</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-sm">Budget Analysis</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Globe className="h-6 w-6" />
                    <span className="text-sm">Global Metrics</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Shield className="h-6 w-6" />
                    <span className="text-sm">Security Audit</span>
                  </Button>
                </>
              )}
              
              {userRole === 'ngo' && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Volunteer Stats</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Truck className="h-6 w-6" />
                    <span className="text-sm">Resource Tracking</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <MapPin className="h-6 w-6" />
                    <span className="text-sm">Shelter Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Activity className="h-6 w-6" />
                    <span className="text-sm">Impact Metrics</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Performance</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Export Data</span>
                  </Button>
                </>
              )}
              
              {userRole === 'public' && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <AlertTriangle className="h-6 w-6" />
                    <span className="text-sm">Risk Assessment</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <MapPin className="h-6 w-6" />
                    <span className="text-sm">Safety Map</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Clock className="h-6 w-6" />
                    <span className="text-sm">Response Times</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Community Data</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Database className="h-6 w-6" />
                    <span className="text-sm">Public Records</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Zap className="h-6 w-6" />
                    <span className="text-sm">Quick Stats</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}