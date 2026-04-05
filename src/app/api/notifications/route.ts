import { NextRequest, NextResponse } from 'next/server';

interface NotificationRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  deviceToken?: string; // For push notifications
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
  recipients: string[]; // Recipient IDs
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

// In-memory storage for demo purposes
const recipientsStore: NotificationRecipient[] = [
  {
    id: '1',
    name: 'Emergency Response Team',
    email: 'emergency@gov.org',
    phone: '+1234567890',
    preferences: { email: true, sms: true, push: true },
    role: 'government',
    location: { lat: 37.7749, lng: -122.4194, address: 'San Francisco' }
  },
  {
    id: '2',
    name: 'NGO Coordinator',
    email: 'ngo@relief.org',
    phone: '+1234567891',
    preferences: { email: true, sms: false, push: true },
    role: 'ngo'
  },
  {
    id: '3',
    name: 'John Citizen',
    email: 'john@email.com',
    phone: '+1234567892',
    deviceToken: 'device_token_123',
    preferences: { email: true, sms: true, push: true },
    role: 'public',
    location: { lat: 37.7749, lng: -122.4194, address: 'San Francisco' }
  }
];

const notificationsStore: EmergencyNotification[] = [];
const templatesStore: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Emergency Evacuation',
    type: 'evacuation',
    subject: 'EMERGENCY EVACUATION ORDER - {{area}}',
    message: 'IMMEDIATE EVACUATION required for {{area}}. Proceed to nearest shelter: {{shelter}}. This is not a drill.',
    variables: ['area', 'shelter'],
    isActive: true
  },
  {
    id: '2',
    name: 'Severe Weather Alert',
    type: 'alert',
    subject: 'SEVERE WEATHER ALERT - {{area}}',
    message: 'Severe weather warning for {{area}}. {{conditions}} expected. Take immediate precautions.',
    variables: ['area', 'conditions'],
    isActive: true
  }
];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action, ...payload } = data;

    switch (action) {
      case 'send_notification':
        return await sendNotification(payload);
      case 'add_recipient':
        return await addRecipient(payload);
      case 'create_template':
        return await createTemplate(payload);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in notification request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const recipientId = searchParams.get('recipientId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredNotifications = [...notificationsStore];

    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }

    if (status) {
      filteredNotifications = filteredNotifications.filter(n => n.status === status);
    }

    if (recipientId) {
      filteredNotifications = filteredNotifications.filter(n => n.recipients.includes(recipientId));
    }

    // Sort by timestamp (newest first)
    filteredNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply limit
    filteredNotifications = filteredNotifications.slice(0, limit);

    return NextResponse.json({ 
      success: true, 
      notifications: filteredNotifications,
      recipients: recipientsStore,
      templates: templatesStore.filter(t => t.isActive)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendNotification(payload: any) {
  const { type, severity, title, message, affectedAreas, channels = ['email', 'sms', 'push'] } = payload;

  if (!type || !severity || !title || !message || !affectedAreas) {
    return NextResponse.json(
      { error: 'Missing required fields for notification' },
      { status: 400 }
    );
  }

  // Find recipients in affected areas or all recipients if no specific area targeting
  const recipients = recipientsStore.filter(recipient => {
    if (recipient.role === 'government' || recipient.role === 'ngo') {
      return true; // Always notify government and NGO
    }
    // For public, check if they're in affected areas
    return affectedAreas.some(area => 
      recipient.location?.address.toLowerCase().includes(area.toLowerCase())
    );
  });

  const notification: EmergencyNotification = {
    id: `notification_${Date.now()}`,
    type,
    severity,
    title,
    message,
    affectedAreas,
    recipients: recipients.map(r => r.id),
    channels,
    timestamp: new Date().toISOString(),
    status: 'pending',
    deliveryReports: {}
  };

  // Initialize delivery reports
  channels.forEach(channel => {
    notification.deliveryReports[channel] = { sent: 0, delivered: 0, failed: 0 };
  });

  // Store notification
  notificationsStore.push(notification);

  // Process notification delivery
  await processNotificationDelivery(notification, recipients);

  // Broadcast real-time update via WebSocket if available
  if (global.io) {
    global.io.emit('new-emergency-notification', {
      notification,
      recipientCount: recipients.length
    });
    
    // Send to specific recipients via WebSocket
    recipients.forEach(recipient => {
      global.io.to(recipient.id).emit('personal-notification', notification);
    });
  }

  return NextResponse.json({ success: true, notification });
}

async function processNotificationDelivery(notification: EmergencyNotification, recipients: NotificationRecipient[]) {
  // Simulate async delivery processing
  setTimeout(async () => {
    for (const channel of notification.channels) {
      const channelRecipients = recipients.filter(r => r.preferences[channel]);
      
      if (channelRecipients.length === 0) continue;

      // Simulate sending
      notification.deliveryReports[channel]!.sent = channelRecipients.length;

      // Simulate delivery results
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const delivered = Math.floor(channelRecipients.length * (0.8 + Math.random() * 0.15));
      const failed = channelRecipients.length - delivered;
      
      notification.deliveryReports[channel]!.delivered = delivered;
      notification.deliveryReports[channel]!.failed = failed;

      // Update notification status
      const totalDelivered = Object.values(notification.deliveryReports)
        .reduce((sum, report) => sum + report.delivered, 0);
      const totalSent = Object.values(notification.deliveryReports)
        .reduce((sum, report) => sum + report.sent, 0);

      notification.status = totalDelivered === totalSent ? 'delivered' : 'sent';

      // Broadcast delivery update via WebSocket
      if (global.io) {
        global.io.emit('notification-delivery-update', {
          notificationId: notification.id,
          channel,
          deliveryReport: notification.deliveryReports[channel],
          overallStatus: notification.status
        });
      }
    }
  }, 100);
}

async function addRecipient(payload: any) {
  const { name, email, phone, deviceToken, preferences, role, location } = payload;

  if (!name || !role || !preferences) {
    return NextResponse.json(
      { error: 'Missing required fields for recipient' },
      { status: 400 }
    );
  }

  const recipient: NotificationRecipient = {
    id: `recipient_${Date.now()}`,
    name,
    email,
    phone,
    deviceToken,
    preferences,
    role,
    location
  };

  recipientsStore.push(recipient);

  return NextResponse.json({ success: true, recipient });
}

async function createTemplate(payload: any) {
  const { name, type, subject, message, variables } = payload;

  if (!name || !type || !subject || !message) {
    return NextResponse.json(
      { error: 'Missing required fields for template' },
      { status: 400 }
    );
  }

  const template: NotificationTemplate = {
    id: `template_${Date.now()}`,
    name,
    type,
    subject,
    message,
    variables: variables || [],
    isActive: true
  };

  templatesStore.push(template);

  return NextResponse.json({ success: true, template });
}