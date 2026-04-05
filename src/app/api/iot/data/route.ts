import { NextRequest, NextResponse } from 'next/server';

interface IoTDeviceData {
  deviceId: string;
  deviceType: 'water_sensor' | 'seismic_sensor' | 'crowd_sensor' | 'weather_sensor' | 'drone';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  metrics: {
    value: number;
    unit: string;
    threshold?: {
      warning: number;
      critical: number;
    };
  };
  timestamp: string;
  status: 'online' | 'offline' | 'error';
}

// In-memory storage for demo purposes
const iotDataStore: IoTDeviceData[] = [];

export async function POST(request: NextRequest) {
  try {
    const data: IoTDeviceData = await request.json();
    
    // Validate required fields
    if (!data.deviceId || !data.deviceType || !data.location || !data.metrics) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    // Store the data
    const existingIndex = iotDataStore.findIndex(d => d.deviceId === data.deviceId);
    if (existingIndex >= 0) {
      iotDataStore[existingIndex] = data;
    } else {
      iotDataStore.push(data);
    }

    // Broadcast real-time update via WebSocket if available
    if (global.io) {
      global.io.emit('iot-data-update', data);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error processing IoT data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceType = searchParams.get('type');
    const location = searchParams.get('location');
    const status = searchParams.get('status');

    let filteredData = [...iotDataStore];

    if (deviceType) {
      filteredData = filteredData.filter(d => d.deviceType === deviceType);
    }

    if (location) {
      filteredData = filteredData.filter(d => 
        d.location.address.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (status) {
      filteredData = filteredData.filter(d => d.status === status);
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredData,
      count: filteredData.length
    });
  } catch (error) {
    console.error('Error fetching IoT data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}