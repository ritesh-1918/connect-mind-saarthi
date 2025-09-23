import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Paperclip, X, Bot, User } from 'lucide-react';

interface ChatSupportProps {
  language: 'en' | 'hi';
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatSupport = ({ language, isOpen, onClose }: ChatSupportProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const content = {
    en: {
      title: 'AI Mental Health Support',
      placeholder: 'Type your message here...',
      quickReplies: [
        'I feel anxious',
        'I need coping strategies',
        'Connect me with professional',
        'How can I manage stress?'
      ],
      aiGreeting: 'Hello! I\'m here to provide compassionate support. How are you feeling today?',
      send: 'Send',
      attach: 'Attach file'
    },
    hi: {
      title: 'AI मानसिक स्वास्थ्य सहायता',
      placeholder: 'यहाँ अपना संदेश टाइप करें...',
      quickReplies: [
        'मुझे चिंता हो रही है',
        'मुझे सामना करने की रणनीति चाहिए',
        'मुझे पेशेवर से जोड़ें',
        'मैं तनाव कैसे संभालूं?'
      ],
      aiGreeting: 'नमस्ते! मैं दयालु सहायता प्रदान करने के लिए यहाँ हूँ। आज आप कैसा महसूस कर रहे हैं?',
      send: 'भेजें',
      attach: 'फ़ाइल संलग्न करें'
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial AI greeting
      setMessages([{
        id: '1',
        text: content[language].aiGreeting,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = {
        en: [
          "I understand you're going through a difficult time. It's brave of you to reach out for support.",
          "Those feelings are valid. Let's explore some coping strategies that might help you.",
          "Thank you for sharing. Would you like me to connect you with a professional counselor?",
          "I'm here to listen. Can you tell me more about what you're experiencing?"
        ],
        hi: [
          "मैं समझ सकता हूँ कि आप मुश्किल समय से गुजर रहे हैं। सहायता मांगना बहादुरी है।",
          "ये भावनाएं वैध हैं। आइए कुछ सामना करने की रणनीतियों पर नज़र डालते हैं।",
          "साझा करने के लिए धन्यवाद। क्या आप चाहेंगे कि मैं आपको किसी पेशेवर काउंसलर से जोड़ूं?",
          "मैं सुनने के लिए यहाँ हूँ। क्या आप बता सकते हैं कि आप क्या अनुभव कर रहे हैं?"
        ]
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[language][Math.floor(Math.random() * aiResponses[language].length)],
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md h-[600px] flex flex-col glass border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {content[language].title}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'ai' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <p className="text-sm">{message.text}</p>
                    {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick replies:</p>
              <div className="flex flex-wrap gap-2">
                {content[language].quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={content[language].placeholder}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
              className="flex-1"
            />
            <Button
              variant="wellness"
              size="icon"
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatSupport;