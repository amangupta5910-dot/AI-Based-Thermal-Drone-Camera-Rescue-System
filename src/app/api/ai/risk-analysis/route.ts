import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface RiskAnalysisRequest {
  region: string;
  sensorData: Array<{
    deviceType: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    metrics: {
      value: number;
      unit: string;
    };
  }>;
  historicalData?: Array<{
    date: string;
    disasterType: string;
    severity: number;
    affectedArea: string;
  }>;
}

interface RiskAnalysisResponse {
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
  heatmapData: Array<{
    lat: number;
    lng: number;
    riskLevel: number;
    riskType: string;
  }>;
  recommendations: string[];
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: RiskAnalysisRequest = await request.json();
    
    if (!data.region || !data.sensorData) {
      return NextResponse.json(
        { error: 'Missing required fields: region and sensorData' },
        { status: 400 }
      );
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Prepare AI prompt for risk analysis
    const prompt = `
    You are an AI disaster risk analysis expert. Analyze the following sensor data and historical information to provide a comprehensive risk assessment for the ${data.region} region.

    Current Sensor Data:
    ${data.sensorData.map(sensor => `
    - ${sensor.deviceType} at ${sensor.location.address}: ${sensor.metrics.value} ${sensor.metrics.unit}
    `).join('')}

    ${data.historicalData ? `
    Historical Disaster Data:
    ${data.historicalData.map(event => `
    - ${event.date}: ${event.disasterType} (Severity: ${event.severity}) in ${event.affectedArea}
    `).join('')}
    ` : ''}

    Please provide a detailed risk analysis including:
    1. Overall risk level (low, medium, high, critical)
    2. Key risk factors with their risk scores (0-100)
    3. Disaster predictions with probabilities and timeframes
    4. Specific recommendations for authorities

    Respond in JSON format with the following structure:
    {
      "overallRiskLevel": "low|medium|high|critical",
      "riskFactors": [
        {
          "factor": "string",
          "risk": number,
          "description": "string"
        }
      ],
      "predictions": [
        {
          "disasterType": "string",
          "probability": number,
          "timeframe": "string",
          "confidence": number
        }
      ],
      "recommendations": ["string"]
    }
    `;

    // Get AI analysis
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI system specializing in disaster risk analysis and prediction. Provide accurate, data-driven assessments to help save lives and property.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    let aiResponse;
    try {
      let content = completion.choices[0]?.message?.content || '{}';
      
      // Clean the response - remove markdown formatting if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to parse the cleaned content
      aiResponse = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.log('Raw AI response:', completion.choices[0]?.message?.content);
      // Fallback response
      aiResponse = {
        overallRiskLevel: 'medium',
        riskFactors: [
          { factor: 'Sensor Data Analysis', risk: 50, description: 'Based on available sensor readings' }
        ],
        predictions: [
          { disasterType: 'flood', probability: 30, timeframe: '24-48 hours', confidence: 60 }
        ],
        recommendations: ['Monitor sensor data closely', 'Prepare emergency response teams']
      };
    }

    // Generate heatmap data based on sensor locations and risk levels
    const heatmapData = data.sensorData.map(sensor => ({
      lat: sensor.location.lat + (Math.random() - 0.5) * 0.01, // Add small random offset
      lng: sensor.location.lng + (Math.random() - 0.5) * 0.01,
      riskLevel: calculateRiskLevel(sensor.deviceType, sensor.metrics.value),
      riskType: sensor.deviceType
    }));

    // Add additional heatmap points for areas between sensors
    const additionalPoints = generateInterpolatedRiskPoints(data.sensorData);
    heatmapData.push(...additionalPoints);

    const response: RiskAnalysisResponse = {
      region: data.region,
      overallRiskLevel: aiResponse.overallRiskLevel,
      riskFactors: aiResponse.riskFactors,
      predictions: aiResponse.predictions,
      heatmapData,
      recommendations: aiResponse.recommendations,
      timestamp: new Date().toISOString()
    };

    // Broadcast real-time update via WebSocket if available
    if (global.io) {
      global.io.emit('risk-analysis-update', response);
    }

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error in AI risk analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error during risk analysis' },
      { status: 500 }
    );
  }
}

function calculateRiskLevel(deviceType: string, value: number): number {
  // Calculate risk level (0-100) based on device type and value
  switch (deviceType) {
    case 'water_sensor':
      return Math.min((value / 15) * 100, 100); // Risk increases with water level
    case 'seismic_sensor':
      return Math.min((value / 6) * 100, 100); // Risk increases with magnitude
    case 'crowd_sensor':
      return Math.min((value / 100) * 100, 100); // Risk increases with crowd density
    case 'weather_sensor':
      return Math.min(Math.max((value - 20) / 20 * 100, 0), 100); // Risk increases with temperature
    default:
      return 50; // Default moderate risk
  }
}

function generateInterpolatedRiskPoints(sensorData: any[]): Array<{
  lat: number;
  lng: number;
  riskLevel: number;
  riskType: string;
}> {
  const points: Array<{
    lat: number;
    lng: number;
    riskLevel: number;
    riskType: string;
  }> = [];

  // Generate interpolated points between sensors
  for (let i = 0; i < sensorData.length - 1; i++) {
    for (let j = i + 1; j < sensorData.length; j++) {
      const sensor1 = sensorData[i];
      const sensor2 = sensorData[j];
      
      // Calculate midpoint
      const midLat = (sensor1.location.lat + sensor2.location.lat) / 2;
      const midLng = (sensor1.location.lng + sensor2.location.lng) / 2;
      
      // Calculate average risk
      const risk1 = calculateRiskLevel(sensor1.deviceType, sensor1.metrics.value);
      const risk2 = calculateRiskLevel(sensor2.deviceType, sensor2.metrics.value);
      const avgRisk = (risk1 + risk2) / 2;
      
      points.push({
        lat: midLat,
        lng: midLng,
        riskLevel: avgRisk,
        riskType: 'interpolated'
      });
    }
  }

  return points;
}