"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  MapPin, 
  Home, 
  AlertTriangle,
  Users,
  Volume2,
  VolumeX,
  Languages,
  Mic,
  MicOff
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatResponse {
  response: string;
  suggestions?: string[];
  actions?: string[];
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your disaster response assistant. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [disasterType, setDisasterType] = useState('');
  const [location, setLocation] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ar', name: 'العربية' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
  ];

  const disasterTypes = [
    'flood', 'earthquake', 'fire', 'storm', 'hurricane', 'tornado', 'tsunami', 'wildfire', 'landslide', 'other'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          language: selectedLanguage,
          disasterType: disasterType || undefined,
          location: location || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: ChatResponse = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Play sound if enabled
      if (soundEnabled) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
        audio.play().catch(() => {});
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again or call emergency services if you need immediate help.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  const handleEmergencyCall = () => {
    window.open('tel:911', '_self');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would integrate with speech recognition API
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">AI Disaster Assistant</h1>
                <p className="text-sm text-muted-foreground">24/7 Multilingual Emergency Support</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="destructive" onClick={handleEmergencyCall}>
                <Phone className="h-4 w-4 mr-2" />
                Emergency Call
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Emergency Chat</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <Badge variant="outline">
                      {languages.find(l => l.code === selectedLanguage)?.name}
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  Get instant help and guidance for any disaster situation
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">Thinking...</p>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleRecording}
                      className={isRecording ? 'text-red-500' : ''}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction("I need help finding a shelter")}
                    >
                      <Home className="h-3 w-3 mr-1" />
                      Find Shelter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction("What should I do in an emergency?")}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Emergency Help
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction("Show me evacuation routes")}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Evacuation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction("How do I prepare an emergency kit?")}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Emergency Kit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Context Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Disaster Type</label>
                  <Select value={disasterType} onValueChange={setDisasterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select disaster type" />
                    </SelectTrigger>
                    <SelectContent>
                      {disasterTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Your Location</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Emergency Services</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleEmergencyCall}>
                    911
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Disaster Hotline</span>
                  </div>
                  <Button variant="outline" size="sm">
                    1-800-621-3362
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Red Cross</span>
                  </div>
                  <Button variant="outline" size="sm">
                    1-800-RED-CROSS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• Stay calm and follow official instructions</div>
                <div>• Have an emergency kit ready</div>
                <div>• Know your evacuation routes</div>
                <div>• Keep important documents safe</div>
                <div>• Help others when possible</div>
                <div>• Stay informed through official channels</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}