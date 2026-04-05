"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  DollarSign,
  Truck,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AnalyticsData {
  affectedAreas: Array<{
    name: string;
    affected: number;
    evacuated: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  resourceUtilization: Array<{
    name: string;
    used: number;
    total: number;
    efficiency: number;
  }>;
  predictionAccuracy: Array<{
    model: string;
    accuracy: number;
    confidence: number;
    predictions: number;
  }>;
  responseTimes: Array<{
    disaster: string;
    actual: number;
    predicted: number;
    deviation: number;
  }>;
  disasterTrends: Array<{
    date: string;
    floods: number;
    earthquakes: number;
    fires: number;
    storms: number;
  }>;
  resourceAllocation: Array<{
    category: string;
    allocated: number;
    used: number;
    remaining: number;
  }>;
}

interface AnalyticsDashboardProps {
  userRole: 'government' | 'ngo' | 'public';
}

export default function AnalyticsDashboard({ userRole }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('affected');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: AnalyticsData = {
        affectedAreas: [
          { name: 'Downtown', affected: 2500, evacuated: 1800, severity: 'high' },
          { name: 'West District', affected: 1800, evacuated: 1200, severity: 'medium' },
          { name: 'East District', affected: 900, evacuated: 600, severity: 'low' },
          { name: 'North District', affected: 3200, evacuated: 2800, severity: 'critical' },
          { name: 'South District', affected: 1500, evacuated: 900, severity: 'medium' }
        ],
        resourceUtilization: [
          { name: 'Medical Supplies', used: 850, total: 1000, efficiency: 85 },
          { name: 'Food Packages', used: 3200, total: 4000, efficiency: 80 },
          { name: 'Water Bottles', used: 5600, total: 6000, efficiency: 93 },
          { name: 'Blankets', used: 1200, total: 1500, efficiency: 80 },
          { name: 'Emergency Kits', used: 450, total: 500, efficiency: 90 }
        ],
        predictionAccuracy: [
          { model: 'Flood Prediction', accuracy: 94.2, confidence: 87.5, predictions: 156 },
          { model: 'Earthquake Detection', accuracy: 89.7, confidence: 92.1, predictions: 89 },
          { model: 'Fire Spread', accuracy: 91.3, confidence: 85.8, predictions: 234 },
          { model: 'Storm Tracking', accuracy: 96.8, confidence: 94.2, predictions: 178 },
          { model: 'Crowd Behavior', accuracy: 87.4, confidence: 82.6, predictions: 312 }
        ],
        responseTimes: [
          { disaster: 'Flood A', actual: 8.2, predicted: 7.5, deviation: 0.7 },
          { disaster: 'Earthquake B', actual: 12.1, predicted: 10.8, deviation: 1.3 },
          { disaster: 'Fire C', actual: 6.8, predicted: 6.2, deviation: 0.6 },
          { disaster: 'Storm D', actual: 9.5, predicted: 8.9, deviation: 0.6 },
          { disaster: 'Landslide E', actual: 15.3, predicted: 14.1, deviation: 1.2 }
        ],
        disasterTrends: [
          { date: '2024-01-01', floods: 2, earthquakes: 1, fires: 3, storms: 1 },
          { date: '2024-01-02', floods: 3, earthquakes: 0, fires: 2, storms: 2 },
          { date: '2024-01-03', floods: 1, earthquakes: 2, fires: 4, storms: 3 },
          { date: '2024-01-04', floods: 4, earthquakes: 1, fires: 1, storms: 2 },
          { date: '2024-01-05', floods: 2, earthquakes: 0, fires: 3, storms: 4 },
          { date: '2024-01-06', floods: 3, earthquakes: 1, fires: 2, storms: 1 },
          { date: '2024-01-07', floods: 1, earthquakes: 2, fires: 1, storms: 2 }
        ],
        resourceAllocation: [
          { category: 'Medical', allocated: 500000, used: 425000, remaining: 75000 },
          { category: 'Food', allocated: 750000, used: 680000, remaining: 70000 },
          { category: 'Water', allocated: 300000, used: 280000, remaining: 20000 },
          { category: 'Shelter', allocated: 400000, used: 350000, remaining: 50000 },
          { category: 'Transport', allocated: 600000, used: 520000, remaining: 80000 }
        ]
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    };
    
    fetchAnalyticsData();
  }, [timeRange]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p>Failed to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Comprehensive disaster response analytics and performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Affected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.affectedAreas.reduce((sum, area) => sum + area.affected, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analyticsData.responseTimes.reduce((sum, r) => sum + r.actual, 0) / analyticsData.responseTimes.length).toFixed(1)}m
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -8% improvement
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analyticsData.predictionAccuracy.reduce((sum, p) => sum + p.accuracy, 0) / analyticsData.predictionAccuracy.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.3% improvement
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources Used</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((analyticsData.resourceUtilization.reduce((sum, r) => sum + r.used, 0) / analyticsData.resourceUtilization.reduce((sum, r) => sum + r.total, 0)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-orange-500" />
              Optimal utilization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="affected-areas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="affected-areas">Affected Areas</TabsTrigger>
          <TabsTrigger value="resources">Resource Usage</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="trends">Disaster Trends</TabsTrigger>
          <TabsTrigger value="allocation">Budget Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="affected-areas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Affected Areas Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Affected Population by Area</CardTitle>
                <CardDescription>
                  Number of people affected and evacuated in each district
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.affectedAreas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="affected" fill="#ef4444" name="Affected" />
                    <Bar dataKey="evacuated" fill="#22c55e" name="Evacuated" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Severity Distribution</CardTitle>
                <CardDescription>
                  Breakdown of disaster severity levels across affected areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.affectedAreas.map(area => ({
                        name: area.name,
                        value: area.affected,
                        severity: area.severity
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.affectedAreas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Areas Table */}
          <Card>
            <CardHeader>
              <CardTitle>Affected Areas Details</CardTitle>
              <CardDescription>
                Comprehensive breakdown of affected areas and evacuation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.affectedAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{area.name}</span>
                        <Badge variant="outline" style={{ backgroundColor: getSeverityColor(area.severity), color: 'white' }}>
                          {area.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <span>Affected: {area.affected.toLocaleString()}</span>
                        <span>Evacuated: {area.evacuated.toLocaleString()}</span>
                        <span>Remaining: {(area.affected - area.evacuated).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {Math.round((area.evacuated / area.affected) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Evacuated</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resource Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization Efficiency</CardTitle>
                <CardDescription>
                  Efficiency percentage for each resource type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.resourceUtilization}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#3b82f6" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resource Usage vs Available */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage vs Available</CardTitle>
                <CardDescription>
                  Comparison of used resources against total available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.resourceUtilization}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="used" fill="#ef4444" name="Used" />
                    <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Resource Utilization Details */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization Details</CardTitle>
              <CardDescription>
                Detailed breakdown of resource usage and efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.resourceUtilization.map((resource, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{resource.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={resource.efficiency >= 90 ? 'default' : resource.efficiency >= 70 ? 'secondary' : 'destructive'}>
                          {resource.efficiency}% Efficient
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {resource.used} / {resource.total}
                        </span>
                      </div>
                    </div>
                    <Progress value={resource.efficiency} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prediction Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle>AI Model Accuracy</CardTitle>
                <CardDescription>
                  Accuracy and confidence levels for each prediction model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.predictionAccuracy}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="model" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accuracy" fill="#22c55e" name="Accuracy %" />
                    <Bar dataKey="confidence" fill="#3b82f6" name="Confidence %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Response Time Prediction */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time: Predicted vs Actual</CardTitle>
                <CardDescription>
                  Comparison of predicted and actual response times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.responseTimes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="disaster" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#ef4444" name="Actual (min)" />
                    <Line type="monotone" dataKey="predicted" stroke="#3b82f6" name="Predicted (min)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Model Performance Details */}
          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
              <CardDescription>
                Detailed performance metrics for prediction models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.predictionAccuracy.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{model.model}</span>
                        <Badge variant="outline">
                          {model.predictions} predictions
                        </Badge>
                      </div>
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <span>Accuracy: {model.accuracy}%</span>
                        <span>Confidence: {model.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {model.accuracy >= 90 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div className="text-right">
                        <div className="text-lg font-bold">{model.accuracy}%</div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disaster Trends Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Disaster Trends Over Time</CardTitle>
                <CardDescription>
                  Frequency of different disaster types over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.disasterTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="floods" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Floods" />
                    <Area type="monotone" dataKey="earthquakes" stackId="1" stroke="#ef4444" fill="#ef4444" name="Earthquakes" />
                    <Area type="monotone" dataKey="fires" stackId="1" stroke="#f97316" fill="#f97316" name="Fires" />
                    <Area type="monotone" dataKey="storms" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Storms" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Disaster Frequency */}
            <Card>
              <CardHeader>
                <CardTitle>Disaster Frequency Analysis</CardTitle>
                <CardDescription>
                  Total occurrences of each disaster type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Floods', value: analyticsData.disasterTrends.reduce((sum, d) => sum + d.floods, 0) },
                        { name: 'Earthquakes', value: analyticsData.disasterTrends.reduce((sum, d) => sum + d.earthquakes, 0) },
                        { name: 'Fires', value: analyticsData.disasterTrends.reduce((sum, d) => sum + d.fires, 0) },
                        { name: 'Storms', value: analyticsData.disasterTrends.reduce((sum, d) => sum + d.storms, 0) }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#ef4444" />
                      <Cell fill="#f97316" />
                      <Cell fill="#8b5cf6" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation by Category</CardTitle>
                <CardDescription>
                  Financial resource allocation across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.resourceAllocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" />
                    <Bar dataKey="used" fill="#22c55e" name="Used" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization Rate</CardTitle>
                <CardDescription>
                  Percentage of allocated budget used by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.resourceAllocation.map(item => ({
                        name: item.category,
                        value: Math.round((item.used / item.allocated) * 100),
                        allocated: item.allocated,
                        used: item.used
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.resourceAllocation.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [
                      `${value}% (${formatCurrency(props.payload.used)} / ${formatCurrency(props.payload.allocated)})`,
                      'Utilization Rate'
                    ]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Budget Details */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation Details</CardTitle>
              <CardDescription>
                Detailed breakdown of budget allocation and utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.resourceAllocation.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.category}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {Math.round((item.used / item.allocated) * 100)}% Used
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(item.used)} / {formatCurrency(item.allocated)}
                        </span>
                      </div>
                    </div>
                    <Progress value={(item.used / item.allocated) * 100} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Remaining: {formatCurrency(item.remaining)}</span>
                      <span>Total: {formatCurrency(item.allocated)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}