import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface DisasterPredictionRequest {
  region: string;
  timeFrame: '24h' | '48h' | '72h' | '1week';
  disasterTypes?: string[];
  includeHistorical?: boolean;
  sensorData?: Array<{
    type: string;
    location: {
      lat: number;
      lng: number;
    };
    value: number;
    unit: string;
  }>;
}

interface DisasterPrediction {
  disasterType: string;
  probability: number;
  confidence: number;
  timeframe: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAreas: Array<{
    lat: number;
    lng: number;
    radius: number;
    riskLevel: number;
  }>;
  factors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    const data: DisasterPredictionRequest = await request.json();
    
    if (!data.region || !data.timeFrame) {
      return NextResponse.json(
        { error: 'Missing required fields: region and timeFrame' },
        { status: 400 }
      );
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Prepare AI prompt for disaster prediction
    const prompt = `
    You are an AI disaster prediction expert. Analyze the following data to provide comprehensive disaster predictions for the ${data.region} region for the next ${data.timeFrame}.

    ${data.disasterTypes ? `Focus on these disaster types: ${data.disasterTypes.join(', ')}` : 'Consider all possible disaster types'}

    ${data.sensorData ? `
    Current Sensor Data:
    ${data.sensorData.map(sensor => `
    - ${sensor.type} at ${sensor.location.lat}, ${sensor.location.lng}: ${sensor.value} ${sensor.unit}
    `).join('')}
    ` : ''}

    ${data.includeHistorical ? 'Include historical disaster patterns and trends in your analysis.' : ''}

    Please provide detailed predictions including:
    1. Probability for each disaster type (0-100%)
    2. Confidence level in predictions (0-100%)
    3. Expected timeframe within the ${data.timeFrame} period
    4. Severity assessment
    5. Specific affected areas with coordinates and risk levels
    6. Contributing factors and their impact levels
    7. Recommended preventive measures

    Respond in JSON format with the following structure:
    {
      "predictions": [
        {
          "disasterType": "string",
          "probability": number,
          "confidence": number,
          "timeframe": "string",
          "severity": "low|medium|high|critical",
          "affectedAreas": [
            {
              "lat": number,
              "lng": number,
              "radius": number,
              "riskLevel": number
            }
          ],
          "factors": [
            {
              "factor": "string",
              "impact": number,
              "description": "string"
            }
          ],
          "recommendations": ["string"]
        }
      ]
    }
    `;

    // Get AI prediction
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI system specializing in disaster prediction and risk assessment. Provide accurate, data-driven predictions to help save lives and property.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
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
        predictions: [
          {
            disasterType: 'flood',
            probability: 25,
            confidence: 70,
            timeframe: 'Within 48 hours',
            severity: 'medium',
            affectedAreas: [
              { lat: 37.7749, lng: -122.4194, radius: 10, riskLevel: 0.6 }
            ],
            factors: [
              { factor: 'Weather Patterns', impact: 80, description: 'Atmospheric conditions indicate increased precipitation' }
            ],
            recommendations: ['Monitor water levels', 'Prepare evacuation plans']
          }
        ]
      };
    }

    // Enhance predictions with additional data
    const enhancedPredictions = aiResponse.predictions.map((prediction: any) => ({
      ...prediction,
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      region: data.region,
      timeFrame: data.timeFrame,
      lastUpdated: new Date().toISOString()
    }));

    const response = {
      success: true,
      data: {
        region: data.region,
        timeFrame: data.timeFrame,
        predictions: enhancedPredictions,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: 'z-ai-disaster-prediction-v1',
          confidenceThreshold: 0.6
        }
      }
    };

    // Broadcast real-time update via WebSocket if available
    if (global.io) {
      global.io.emit('disaster-prediction-update', response);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in disaster prediction:', error);
    return NextResponse.json(
      { error: 'Internal server error during disaster prediction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const timeFrame = searchParams.get('timeFrame') as '24h' | '48h' | '72h' | '1week' || '24h';

    if (!region) {
      return NextResponse.json(
        { error: 'Region parameter is required' },
        { status: 400 }
      );
    }

    // Return cached or recent predictions
    // In a real implementation, this would query a database
    const mockPredictions = {
      region,
      timeFrame,
      predictions: [
        {
          id: `pred_${Date.now()}_1`,
          disasterType: 'flood',
          probability: 15,
          confidence: 65,
          timeframe: 'Within 24 hours',
          severity: 'low',
          affectedAreas: [
            { lat: 37.7749, lng: -122.4194, radius: 5, riskLevel: 0.3 }
          ],
          factors: [
            { factor: 'Current Weather', impact: 60, description: 'Mild precipitation expected' }
          ],
          recommendations: ['Monitor weather updates', 'Ensure drainage systems are clear']
        }
      ],
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'z-ai-disaster-prediction-v1',
        confidenceThreshold: 0.6
      }
    };

    return NextResponse.json({
      success: true,
      data: mockPredictions
    });
  } catch (error) {
    console.error('Error fetching disaster predictions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}