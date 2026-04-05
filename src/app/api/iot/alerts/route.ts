import { NextRequest, NextResponse } from 'next/server';

interface IoTAlert {
  id: string;
  deviceId: string;
  alertType: 'threshold_exceeded' | 'device_offline' | 'malfunction' | 'maintenance_required';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
}

// In-memory storage for demo purposes
const alertStore: IoTAlert[] = [];

export async function POST(request: NextRequest) {
  try {
    const alertData: Omit<IoTAlert, 'id' | 'timestamp' | 'acknowledged' | 'resolved'> = await request.json();
    
    // Validate required fields
    if (!alertData.deviceId || !alertData.alertType || !alertData.severity || !alertData.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new alert
    const newAlert: IoTAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      resolved: false,
      ...alertData
    };

    // Store the alert
    alertStore.push(newAlert);

    // Broadcast real-time alert via WebSocket if available
    if (global.io) {
      global.io.emit('iot-alert', newAlert);
    }

    // If severity is high or critical, also broadcast as emergency alert
    if (newAlert.severity === 'high' || newAlert.severity === 'critical') {
      if (global.io) {
        global.io.emit('emergency-alert', {
          type: 'iot_alert',
          severity: newAlert.severity,
          message: newAlert.message,
          location: newAlert.location,
          timestamp: newAlert.timestamp
        });
      }
    }

    return NextResponse.json({ success: true, alert: newAlert });
  } catch (error) {
    console.error('Error creating IoT alert:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const acknowledged = searchParams.get('acknowledged');
    const resolved = searchParams.get('resolved');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredAlerts = [...alertStore];

    if (severity) {
      filteredAlerts = filteredAlerts.filter(a => a.severity === severity);
    }

    if (acknowledged !== null) {
      const isAcknowledged = acknowledged === 'true';
      filteredAlerts = filteredAlerts.filter(a => a.acknowledged === isAcknowledged);
    }

    if (resolved !== null) {
      const isResolved = resolved === 'true';
      filteredAlerts = filteredAlerts.filter(a => a.resolved === isResolved);
    }

    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply limit
    filteredAlerts = filteredAlerts.slice(0, limit);

    return NextResponse.json({ 
      success: true, 
      alerts: filteredAlerts,
      count: filteredAlerts.length
    });
  } catch (error) {
    console.error('Error fetching IoT alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { alertId, action } = await request.json();
    
    if (!alertId || !action) {
      return NextResponse.json(
        { error: 'Missing alertId or action' },
        { status: 400 }
      );
    }

    const alertIndex = alertStore.findIndex(a => a.id === alertId);
    if (alertIndex === -1) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    const alert = alertStore[alertIndex];

    switch (action) {
      case 'acknowledge':
        alert.acknowledged = true;
        break;
      case 'resolve':
        alert.resolved = true;
        alert.acknowledged = true;
        break;
      case 'reopen':
        alert.resolved = false;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Broadcast update via WebSocket if available
    if (global.io) {
      global.io.emit('iot-alert-updated', alert);
    }

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error('Error updating IoT alert:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}