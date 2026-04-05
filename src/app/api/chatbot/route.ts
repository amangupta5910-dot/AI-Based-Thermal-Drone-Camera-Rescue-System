import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  language?: string;
  disasterType?: string;
  location?: string;
}

interface ChatResponse {
  response: string;
  suggestions?: string[];
  actions?: string[];
}

const disasterKnowledgeBase = {
  flood: {
    preparation: [
      "Move to higher ground immediately",
      "Turn off utilities at the main switches",
      "Disconnect electrical appliances",
      "Do not walk through moving water",
      "Listen to emergency broadcasts for updates"
    ],
    during: [
      "Evacuate if advised by authorities",
      "Do not drive through flooded areas",
      "Stay away from downed power lines",
      "Help others if you can safely do so",
      "Monitor water levels closely"
    ],
    after: [
      "Return home only when authorities say it's safe",
      "Avoid flood water - it may be contaminated",
      "Check for structural damage before entering",
      "Document damage for insurance claims",
      "Use bottled water until told it's safe"
    ]
  },
  earthquake: {
    preparation: [
      "Secure heavy furniture to walls",
      "Create an emergency supply kit",
      "Practice drop, cover, and hold on drills",
      "Know your evacuation routes",
      "Identify safe spots in each room"
    ],
    during: [
      "Drop, cover, and hold on",
      "Stay away from windows and mirrors",
      "If outdoors, move to clear area",
      "If in vehicle, stop and stay inside",
      "Do not use elevators"
    ],
    after: [
      "Check for injuries and provide first aid",
      "Inspect home for damage",
      "Expect aftershocks",
      "Listen to emergency radio",
      "Help neighbors who may need assistance"
    ]
  },
  fire: {
    preparation: [
      "Install smoke detectors on every floor",
      "Create and practice fire escape plan",
      "Keep fire extinguishers accessible",
      "Clear vegetation around your home",
      "Store flammable materials safely"
    ],
    during: [
      "Get out and stay out",
      "Feel doors before opening - if hot, use alternate exit",
      "Crawl low under smoke",
      "Close doors behind you to slow fire spread",
      "Once outside, call emergency services"
    ],
    after: [
      "Do not re-enter until fire department says it's safe",
      "Contact your insurance company",
      "Check for structural damage",
      "Dispose of food exposed to fire and smoke",
      "Seek emotional support if needed"
    ]
  },
  storm: {
    preparation: [
      "Board up windows and doors",
      "Bring outdoor furniture inside",
      "Fill containers with clean water",
      "Charge electronic devices",
      "Know your evacuation zone"
    ],
    during: [
      "Stay indoors and away from windows",
      "Avoid using electrical appliances",
      "Do not go outside during the eye of the storm",
      "Listen to weather updates",
      "Be prepared for flooding"
    ],
    after: [
      "Wait for official all-clear before going outside",
      "Watch for downed power lines",
      "Check for gas leaks",
      "Document property damage",
      "Help community cleanup efforts"
    ]
  }
};

const languageResponses = {
  en: {
    greeting: "Hello! I'm your disaster response assistant. How can I help you today?",
    emergency: "This sounds like an emergency. Please call your local emergency services immediately.",
    location: "I can help you find nearby shelters and resources. What's your current location?",
    shelter: "I'll help you find the nearest emergency shelter.",
    supplies: "Here's what you should have in your emergency kit:",
    evacuation: "Evacuation routes are being updated. Please follow official guidance.",
    safety: "Your safety is the top priority. Please follow these steps:"
  },
  es: {
    greeting: "¡Hola! Soy tu asistente de respuesta a desastres. ¿Cómo puedo ayudarte hoy?",
    emergency: "Esto suena como una emergencia. Por favor, llama a los servicios de emergencia locales inmediatamente.",
    location: "Puedo ayudarte a encontrar refugios y recursos cercanos. ¿Cuál es tu ubicación actual?",
    shelter: "Te ayudaré a encontrar el refugio de emergencia más cercano.",
    supplies: "Esto es lo que deberías tener en tu kit de emergencia:",
    evacuation: "Las rutas de evacuación se están actualizando. Por favor, sigue las indicaciones oficiales.",
    safety: "Tu seguridad es la máxima prioridad. Por favor, sigue estos pasos:"
  },
  fr: {
    greeting: "Bonjour! Je suis votre assistant de réponse aux catastrophes. Comment puis-je vous aider aujourd'hui?",
    emergency: "Ceci semble être une urgence. Veuillez appeler immédiatement les services d'urgence locaux.",
    location: "Je peux vous aider à trouver des abris et des ressources à proximité. Quelle est votre position actuelle?",
    shelter: "Je vais vous aider à trouver l'abri d'urgence le plus proche.",
    supplies: "Voici ce que vous devriez avoir dans votre kit d'urgence:",
    evacuation: "Les itinéraires d'évacuation sont en cours de mise à jour. Veuillez suivre les consignes officielles.",
    safety: "Votre sécurité est la priorité absolue. Veuillez suivre ces étapes:"
  },
  de: {
    greeting: "Hallo! Ich bin Ihr Katastrophenhilfe-Assistent. Wie kann ich Ihnen heute helfen?",
    emergency: "Dies klingt nach einem Notfall. Bitte rufen Sie sofort die örtlichen Notdienste an.",
    location: "Ich kann Ihnen helfen, nahegelegene Unterkünfte und Ressourcen zu finden. Wo ist Ihr aktueller Standort?",
    shelter: "Ich helfe Ihnen, das nächste Notunterkunft zu finden.",
    supplies: "Hier ist, was Sie in Ihrem Notfallkit haben sollten:",
    evacuation: "Evakuierungsrouten werden aktualisiert. Bitte folgen Sie den offiziellen Anweisungen.",
    safety: "Ihre Sicherheit hat oberste Priorität. Bitte befolgen Sie diese Schritte:"
  },
  zh: {
    greeting: "你好！我是您的灾难响应助手。今天我能如何帮助您？",
    emergency: "这听起来像是紧急情况。请立即拨打当地紧急服务电话。",
    location: "我可以帮您找到附近的避难所和资源。您当前位置在哪里？",
    shelter: "我会帮您找到最近的紧急避难所。",
    supplies: "您的应急包中应该包含以下物品：",
    evacuation: "疏散路线正在更新中。请遵循官方指导。",
    safety: "您的安全是重中之重。请遵循以下步骤："
  },
  hi: {
    greeting: "नमस्ते! मैं आपका आपदा प्रतिक्रिया सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    emergency: "यह एक आपातकालीन स्थिति जैसा लग रहा है। कृपया तुरंत स्थानीय आपातकालीन सेवाओं को कॉल करें।",
    location: "मैं आपको निकटवर्ती आश्रय स्थल और संसाधन खोजने में मदद कर सकता हूं। आपका वर्तमान स्थान कहां है?",
    shelter: "मैं आपको निकटतम आपातकालीन आश्रय स्थल खोजने में मदद करूंगा।",
    supplies: "आपके आपातकालीन किट में निम्नलिखित होना चाहिए:",
    evacuation: "निकासी मार्ग अपडेट किए जा रहे हैं। कृपया आधिकारिक मार्गदर्शन का पालन करें।",
    safety: "आपकी सुरक्षा सबसे ऊपर है। कृपया इन चरणों का पालन करें:"
  },
  ar: {
    greeting: "مرحبا! أنا مساعد الاستجابة للكوارث الخاص بك. كيف يمكنني مساعدتك اليوم؟",
    emergency: "يبدو أن هذا حالة طارئة. يرجى الاتصال بخدمات الطوارئ المحلية على الفور.",
    location: "يمكنني مساعدتك في العثور على الملاجئ والموارد القريبة. أين موقعك الحالي؟",
    shelter: "سأساعدك في العثور على أقرب ملجأ طوارئ.",
    supplies: "هذه هي الأشياء التي يجب أن تكون في مجموعة الطوارئ الخاصة بك:",
    evacuation: "يتم تحديث طرق الإخلاء. يرجى اتباع التوجيهات الرسمية.",
    safety: "سلامتك هي الأولوية القصوى. يرجى اتباع هذه الخطوات:"
  },
  ru: {
    greeting: "Привет! Я ваш помощник по реагированию на катастрофы. Чем я могу вам помочь сегодня?",
    emergency: "Это похоже на чрезвычайную ситуацию. Пожалуйста, немедленно позвоните в местные экстренные службы.",
    location: "Я могу помочь вам найти ближайшие убежища и ресурсы. Где ваше текущее местоположение?",
    shelter: "Я помогу вам найти ближайшее аварийное убежище.",
    supplies: "Вот что должно быть в вашем аварийном комплекте:",
    evacuation: "Маршруты эвакуации обновляются. Пожалуйста, следуйте официальным указаниям.",
    safety: "Ваша безопасность - это главный приоритет. Пожалуйста, следуйте этим шагам:"
  },
  ja: {
    greeting: "こんにちは！私は災害対応アシスタントです。今日はどのようにお手伝いできますか？",
    emergency: "これは緊急事態のようです。すぐに地元の緊急サービスに電話してください。",
    location: "近くの避難所とリソースを見つけるお手伝いができます。現在の場所はどこですか？",
    shelter: "最寄りの緊急避難所を見つけるお手伝いをします。",
    supplies: "緊急キットに含まれるべきものは次のとおりです：",
    evacuation: "避難経路が更新されています。公式のガイダンスに従ってください。",
    safety: "あなたの安全が最優先です。これらの手順に従ってください："
  },
  ko: {
    greeting: "안녕하세요! 저는 재난 대응 어시스턴트입니다. 오늘 어떻게 도와드릴까요?",
    emergency: "이것은 긴급 상황으로 보입니다. 즉시 지역 응급 서비스에 전화하세요.",
    location: "근처 대피소와 자원을 찾는 데 도움을 드릴 수 있습니다. 현재 위치가 어디입니까?",
    shelter: "가장 가까운 긴급 대피소를 찾는 데 도움을 드리겠습니다.",
    supplies: "긴급 키트에 포함되어야 할 것들은 다음과 같습니다:",
    evacuation: "대피 경로가 업데이트되고 있습니다. 공식 지침을 따르세요.",
    safety: "당신의 안전이 최우선입니다. 다음 단계를 따르세요:"
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, language = 'en', disasterType, location } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content.toLowerCase();

    // Initialize ZAI
    const zai = await ZAI.create();

    // Get language-specific responses
    const responses = languageResponses[language as keyof typeof languageResponses] || languageResponses.en;

    // Check for emergency keywords
    const emergencyKeywords = ['emergency', 'help', 'danger', 'urgent', 'immediate', 'sos', '911', '救命', 'help me', 'save me'];
    const isEmergency = emergencyKeywords.some(keyword => userMessage.includes(keyword));

    // Check for specific request types
    let response = '';
    let suggestions: string[] = [];
    let actions: string[] = [];

    if (isEmergency) {
      response = responses.emergency;
      actions = ['Call Emergency Services', 'Find Nearest Shelter', 'Get First Aid Instructions'];
    } else if (userMessage.includes('shelter') || userMessage.includes('refuge') || userMessage.includes('safe place')) {
      response = responses.shelter;
      if (location) {
        response += ` Based on your location in ${location}, I can help you find the nearest emergency shelter.`;
      }
      suggestions = [
        'Show me nearby shelters',
        'What should I bring to a shelter?',
        'How do I get to the nearest shelter?'
      ];
      actions = ['Find Shelters', 'Get Directions', 'Call Shelter'];
    } else if (userMessage.includes('supplies') || userMessage.includes('kit') || userMessage.includes('emergency kit')) {
      response = responses.supplies;
      suggestions = [
        'What food should I store?',
        'How much water do I need?',
        'What medical supplies are essential?'
      ];
      actions = ['View Supply Checklist', 'Find Supply Locations', 'Download Supply Guide'];
    } else if (userMessage.includes('evacuat') || userMessage.includes('leave') || userMessage.includes('escape')) {
      response = responses.evacuation;
      suggestions = [
        'What are the evacuation routes?',
        'When should I evacuate?',
        'Where should I go?'
      ];
      actions = ['View Evacuation Map', 'Get Evacuation Alerts', 'Find Safe Routes'];
    } else if (disasterType && disasterType in disasterKnowledgeBase) {
      const disasterInfo = disasterKnowledgeBase[disasterType as keyof typeof disasterKnowledgeBase];
      
      if (userMessage.includes('prepare') || userMessage.includes('before')) {
        response = responses.safety + '\n\n' + disasterInfo.preparation.join('\n• ');
      } else if (userMessage.includes('during') || userMessage.includes('now')) {
        response = responses.safety + '\n\n' + disasterInfo.during.join('\n• ');
      } else if (userMessage.includes('after') || userMessage.includes('recover')) {
        response = responses.safety + '\n\n' + disasterInfo.after.join('\n• ');
      } else {
        response = `I can help you with ${disasterType} disaster information. Are you looking for preparation tips, what to do during the disaster, or recovery steps?`;
        suggestions = [
          'How to prepare for ' + disasterType,
          'What to do during ' + disasterType,
          'Recovery after ' + disasterType
        ];
      }
    } else {
      // Use AI for general responses
      const systemPrompt = `You are a disaster response assistant. Provide helpful, accurate, and potentially life-saving information about disasters, emergency preparedness, and response procedures. Be concise but thorough. Always prioritize safety and official guidance. Respond in ${language}.`;

      const chatMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages
      ];

      try {
        const completion = await zai.chat.completions.create({
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 500
        });

        response = completion.choices[0]?.message?.content || responses.greeting;
      } catch (error) {
        console.error('AI response failed:', error);
        response = responses.greeting;
      }
    }

    // Add default suggestions if none are provided
    if (suggestions.length === 0) {
      suggestions = [
        'What should I do in an emergency?',
        'How do I prepare a disaster kit?',
        'Where are the nearest shelters?',
        'What are the evacuation routes?'
      ];
    }

    // Add default actions if none are provided
    if (actions.length === 0) {
      actions = ['Call Emergency', 'Find Shelter', 'Get Weather Updates', 'View Alerts'];
    }

    const chatResponse: ChatResponse = {
      response,
      suggestions,
      actions
    };

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Disaster Response Chatbot API',
    languages: Object.keys(languageResponses),
    supportedDisasters: Object.keys(disasterKnowledgeBase),
    endpoints: {
      chat: 'POST /api/chatbot',
      health: 'GET /api/chatbot'
    }
  });
}