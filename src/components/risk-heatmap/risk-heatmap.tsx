"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  MapPin, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface RiskData {
  lat: number;
  lng: number;
  riskLevel: number;
  riskType: string;
}

interface RiskAnalysis {
  region: string;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: Array<{
    factor: string;
    risk: number;
    description: string;
  }>;
  predictions: Array<{
    disasterType: string;
    probability: number;
    timeframe: string;
    confidence: number;
  }>;
  heatmapData: RiskData[];
  recommendations: string[];
  timestamp: string;
}

interface RiskHeatmapProps {
  region?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function RiskHeatmap({ 
  region = "San Francisco Bay Area", 
  width = 800, 
  height = 400,
  className = "" 
}: RiskHeatmapProps) {
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const fetchRiskAnalysis = async () => {
    setIsLoading(true);
    try {
      // Simulate sensor data for demo
      const sensorData = [
        {
          deviceType: 'water_sensor',
          location: { lat: 37.7749, lng: -122.4194, address: 'San Francisco Downtown' },
          metrics: { value: 8.5, unit: 'm' }
        },
        {
          deviceType: 'seismic_sensor',
          location: { lat: 37.8715, lng: -122.2730, address: 'Berkeley Marina' },
          metrics: { value: 2.3, unit: 'magnitude' }
        },
        {
          deviceType: 'crowd_sensor',
          location: { lat: 37.4419, lng: -122.1430, address: 'Palo Alto' },
          metrics: { value: 75, unit: '%' }
        },
        {
          deviceType: 'weather_sensor',
          location: { lat: 37.3382, lng: -121.8863, address: 'San Jose' },
          metrics: { value: 32, unit: '°C' }
        }
      ];

      const response = await fetch('/api/ai/risk-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          sensorData,
          historicalData: [
            { date: '2023-01-15', disasterType: 'flood', severity: 3, affectedArea: 'Downtown' },
            { date: '2023-06-20', disasterType: 'fire', severity: 2, affectedArea: 'Hills' }
          ]
        })
      });

      const data = await response.json();
      if (data.success) {
        setRiskAnalysis(data.data);
      }
    } catch (error) {
      console.error('Error fetching risk analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskAnalysis();
  }, [region]);

  const getRiskColor = (level: number) => {
    if (level >= 80) return 'bg-red-500';
    if (level >= 60) return 'bg-orange-500';
    if (level >= 40) return 'bg-yellow-500';
    if (level >= 20) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getRiskIcon = (level: number) => {
    if (level >= 70) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (level >= 40) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  const getOverallRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const renderHeatmap = () => {
    if (!riskAnalysis || !showHeatmap) return null;

    return (
      <div className="relative bg-muted rounded-lg overflow-hidden" style={{ width, height }}>
        {/* Simplified heatmap visualization */}
        <div className="absolute inset-0 opacity-30">
          {riskAnalysis.heatmapData.map((point, index) => (
            <div
              key={index}
              className="absolute rounded-full blur-sm"
              style={{
                left: `${((point.lng + 122.5) / 0.5) * 100}%`,
                top: `${((point.lat - 37.3) / 0.6) * 100}%`,
                width: `${Math.max(point.riskLevel / 5, 10)}px`,
                height: `${Math.max(point.riskLevel / 5, 10)}px`,
                backgroundColor: getRiskColor(point.riskLevel).replace('bg-', ''),
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg width={width} height={height} className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Risk level indicators */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur p-3 rounded-lg border">
          <div className="text-sm font-medium mb-2">Risk Levels</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Low (0-20%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs">Low-Med (20-40%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">Medium (40-60%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs">High (60-80%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Critical (80-100%)</span>
            </div>
          </div>
        </div>

        {/* Location markers */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur p-3 rounded-lg border">
          <div className="text-sm font-medium mb-2">Key Locations</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3 text-red-500" />
              <span>High Risk Zones</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3 text-yellow-500" />
              <span>Monitor Areas</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3 text-green-500" />
              <span>Safe Zones</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                AI Risk Heatmap - {region}
              </CardTitle>
              <CardDescription>
                Real-time AI-powered disaster risk assessment
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={showHeatmap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRiskAnalysis}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Analyzing risk data...</p>
              </div>
            </div>
          ) : riskAnalysis ? (
            <div className="space-y-6">
              {/* Overall Risk Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Overall Risk Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Badge className={getOverallRiskColor(riskAnalysis.overallRiskLevel)}>
                        {riskAnalysis.overallRiskLevel.toUpperCase()}
                      </Badge>
                      {getRiskIcon(
                        riskAnalysis.overallRiskLevel === 'critical' ? 90 :
                        riskAnalysis.overallRiskLevel === 'high' ? 75 :
                        riskAnalysis.overallRiskLevel === 'medium' ? 50 : 25
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Active Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskAnalysis.riskFactors.length}</div>
                    <p className="text-xs text-muted-foreground">Identified factors</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{riskAnalysis.predictions.length}</div>
                    <p className="text-xs text-muted-foreground">AI predictions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Heatmap Visualization */}
              {renderHeatmap()}

              {/* Risk Factors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Risk Factors Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskAnalysis.riskFactors.map((factor, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{factor.factor}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold">{factor.risk}%</span>
                              {getRiskIcon(factor.risk)}
                            </div>
                          </div>
                          <Progress value={factor.risk} className="h-2" />
                          <p className="text-sm text-muted-foreground">{factor.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Predictions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">AI Disaster Predictions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {riskAnalysis.predictions.map((prediction, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{prediction.disasterType}</span>
                            <Badge variant={prediction.probability > 70 ? "destructive" : "secondary"}>
                              {prediction.probability}% probability
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Timeframe: {prediction.timeframe}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Confidence: {prediction.confidence}%
                          </div>
                          <Progress value={prediction.confidence} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                  AI Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {riskAnalysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                Last updated: {new Date(riskAnalysis.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No risk analysis data available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click refresh to generate AI-powered risk assessment
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}