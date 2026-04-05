import { NextRequest, NextResponse } from 'next/server';

interface RealTimeDataRequest {
  region?: string;
  dataTypes?: string[];
  timeRange?: '1h' | '6h' | '24h' | '7d';
  filters?: {
    severity?: 'low' | 'medium' | 'high' | 'critical';
    source?: 'sensor' | 'user' | 'ai' | 'system';
    location?: {
      lat: number;
      lng: number;
      radius: number;
    };
  };
}

interface RealTimeDataStream {
  id: string;
  type: string;
  source: 'sensor' | 'user' | 'ai' | 'system';
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  data: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  metadata?: {
    deviceId?: string;
    userId?: string;
    accuracy?: number;
    batteryLevel?: number;
  };
}

interface RealTimeDataResponse {
  streams: RealTimeDataStream[];
  summary: {
    totalDataPoints: number;
    activeSensors: number;
    highSeverityEvents: number;
    lastUpdate: string;
  };
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }>;
}

// Mock real-time data generators
const generateMockSensorData = (region: string): RealTimeDataStream[] => {
  const baseTime = Date.now();
  const dataStreams: RealTimeDataStream[] = [];
  
  // Generate water level sensor data
  dataStreams.push({
    id: `sensor_water_${baseTime}`,
    type: 'water_level',
    source: 'sensor',
    timestamp: new Date(baseTime).toISOString(),
    location: {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
      address: `${region} River Station`
    },
    data: {
      level: Math.random() * 15 + 2, // 2-17 meters
      flow_rate: Math.random() * 1000 + 200, // 200-1200 m³/s
      temperature: Math.random() * 10 + 15 // 15-25°C
    },
    severity: Math.random() > 0.7 ? 'high' : 'medium',
    confidence: 0.85 + Math.random() * 0.1,
    metadata: {
      deviceId: 'WATER_SENSOR_001',
      accuracy: 0.95,
      batteryLevel: 78 + Math.random() * 20
    }
  });

  // Generate seismic sensor data
  dataStreams.push({
    id: `sensor_seismic_${baseTime}`,
    type: 'seismic_activity',
    source: 'sensor',
    timestamp: new Date(baseTime).toISOString(),
    location: {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
      address: `${region} Seismic Station`
    },
    data: {
      magnitude: Math.random() * 4, // 0-4 magnitude
      depth: Math.random() * 50 + 5, // 5-55 km depth
      location: {
        lat: 37.7749 + (Math.random() - 0.5) * 0.2,
        lng: -122.4194 + (Math.random() - 0.5) * 0.2
      }
    },
    severity: Math.random() > 0.9 ? 'high' : 'low',
    confidence: 0.90 + Math.random() * 0.08,
    metadata: {
      deviceId: 'SEISMIC_SENSOR_001',
      accuracy: 0.98,
      batteryLevel: 85 + Math.random() * 15
    }
  });

  // Generate weather sensor data
  dataStreams.push({
    id: `sensor_weather_${baseTime}`,
    type: 'weather_conditions',
    source: 'sensor',
    timestamp: new Date(baseTime).toISOString(),
    location: {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
      address: `${region} Weather Station`
    },
    data: {
      temperature: Math.random() * 30 + 10, // 10-40°C
      humidity: Math.random() * 40 + 40, // 40-80%
      wind_speed: Math.random() * 50 + 5, // 5-55 km/h
      precipitation: Math.random() * 50, // 0-50 mm
      pressure: Math.random() * 50 + 980 // 980-1030 hPa
    },
    severity: Math.random() > 0.8 ? 'medium' : 'low',
    confidence: 0.88 + Math.random() * 0.1,
    metadata: {
      deviceId: 'WEATHER_SENSOR_001',
      accuracy: 0.92,
      batteryLevel: 72 + Math.random() * 25
    }
  });

  // Generate crowd density data
  dataStreams.push({
    id: `sensor_crowd_${baseTime}`,
    type: 'crowd_density',
    source: 'sensor',
    timestamp: new Date(baseTime).toISOString(),
    location: {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
      address: `${region} Evacuation Center`
    },
    data: {
      density: Math.random() * 100, // 0-100%
      count: Math.floor(Math.random() * 500) + 50, // 50-550 people
      flow_rate: Math.random() * 20 - 10 // -10 to +10 people/minute
    },
    severity: Math.random() > 0.75 ? 'medium' : 'low',
    confidence: 0.82 + Math.random() * 0.15,
    metadata: {
      deviceId: 'CROWD_SENSOR_001',
      accuracy: 0.89,
      batteryLevel: 80 + Math.random() * 20
    }
  });

  return dataStreams;
};

const generateAlerts = (dataStreams: RealTimeDataStream[]) => {
  const alerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: 'high' | 'critical';
    timestamp: string;
  }> = [];
  
  for (const stream of dataStreams) {
    if (stream.severity === 'high' || stream.severity === 'critical') {
      alerts.push({
        id: `alert_${stream.id}`,
        type: stream.type,
        message: `High ${stream.type.replace('_', ' ')} detected at ${stream.location.address || 'unknown location'}`,
        severity: stream.severity,
        timestamp: stream.timestamp
      });
    }
  }
  
  return alerts;
};

export async function POST(request: NextRequest) {
  try {
    const data: RealTimeDataRequest = await request.json();
    
    // Generate mock real-time data based on request parameters
    const region = data.region || 'San Francisco Bay Area';
    const dataTypes = data.dataTypes || ['water_level', 'seismic_activity', 'weather_conditions', 'crowd_density'];
    
    let streams: RealTimeDataStream[] = [];
    
    // Generate data for each requested type
    for (const dataType of dataTypes) {
      const typeStreams = generateMockSensorData(region).filter(stream => stream.type === dataType);
      streams.push(...typeStreams);
    }
    
    // Apply filters if provided
    if (data.filters) {
      if (data.filters.severity) {
        streams = streams.filter(stream => stream.severity === data.filters!.severity);
      }
      if (data.filters.source) {
        streams = streams.filter(stream => stream.source === data.filters!.source);
      }
      if (data.filters.location) {
        streams = streams.filter(stream => {
          const distance = Math.sqrt(
            Math.pow(stream.location.lat - data.filters!.location!.lat, 2) +
            Math.pow(stream.location.lng - data.filters!.location!.lng, 2)
          );
          return distance <= data.filters!.location!.radius / 111; // Rough km conversion
        });
      }
    }
    
    // Generate alerts based on the data
    const alerts = generateAlerts(streams);
    
    const response: RealTimeDataResponse = {
      streams,
      summary: {
        totalDataPoints: streams.length,
        activeSensors: streams.filter(s => s.source === 'sensor').length,
        highSeverityEvents: streams.filter(s => s.severity === 'high' || s.severity === 'critical').length,
        lastUpdate: new Date().toISOString()
      },
      alerts
    };

    // Broadcast real-time update via WebSocket if available
    if (global.io) {
      global.io.emit('realtime-data-update', response);
    }

    return NextResponse.json({
      success: true,
      data: response,
      metadata: {
        generatedAt: new Date().toISOString(),
        region,
        dataTypes,
        updateFrequency: 'real-time'
      }
    });
  } catch (error) {
    console.error('Error in real-time data processing:', error);
    return NextResponse.json(
      { error: 'Internal server error during real-time data processing' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'San Francisco Bay Area';
    const dataType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Generate recent real-time data
    const streams = generateMockSensorData(region);
    
    if (dataType) {
      streams.filter(stream => stream.type === dataType);
    }
    
    // Limit the number of streams returned
    const limitedStreams = streams.slice(0, limit);
    
    const response: RealTimeDataResponse = {
      streams: limitedStreams,
      summary: {
        totalDataPoints: limitedStreams.length,
        activeSensors: limitedStreams.filter(s => s.source === 'sensor').length,
        highSeverityEvents: limitedStreams.filter(s => s.severity === 'high' || s.severity === 'critical').length,
        lastUpdate: new Date().toISOString()
      },
      alerts: generateAlerts(limitedStreams)
    };

    return NextResponse.json({
      success: true,
      data: response,
      metadata: {
        generatedAt: new Date().toISOString(),
        region,
        dataType,
        limit,
        updateFrequency: 'real-time'
      }
    });
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Server-Sent Events endpoint for real-time streaming
export async function GET_SSE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || 'San Francisco Bay Area';
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        const event = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(event));
      };
      
      // Send initial data
      sendEvent({
        type: 'initial',
        data: generateMockSensorData(region),
        timestamp: new Date().toISOString()
      });
      
      // Send updates every 5 seconds
      const interval = setInterval(() => {
        const newData = generateMockSensorData(region);
        sendEvent({
          type: 'update',
          data: newData,
          timestamp: new Date().toISOString()
        });
      }, 5000);
      
      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}