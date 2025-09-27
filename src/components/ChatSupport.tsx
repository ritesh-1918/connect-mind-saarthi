import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Paperclip, X, Bot, User, Download, Image as ImageIcon } from 'lucide-react';

interface ChatSupportProps {
  language: 'en' | 'hi';
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  file?: {
    name: string;
    type: string;
    url: string;
  };
  quickReplies?: string[];
}

const ChatSupport = ({ language, isOpen, onClose, user }: ChatSupportProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load conversation history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-history');
    if (savedMessages && isOpen) {
      try {
        const parsed = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsed);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, [isOpen]);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-history', JSON.stringify(messages));
    }
  }, [messages]);

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

    // Simulate AI response with quick replies
    setTimeout(() => {
      const aiResponses = {
        en: [
          {
            text: "I understand you're going through a difficult time. It's brave of you to reach out for support.",
            quickReplies: ["Tell me more", "I need help coping", "Connect me with counselor"]
          },
          {
            text: "Those feelings are valid. Let's explore some coping strategies that might help you.",
            quickReplies: ["Breathing exercises", "Meditation techniques", "Physical activities"]
          },
          {
            text: "Thank you for sharing. Would you like me to connect you with a professional counselor?",
            quickReplies: ["Yes, book session", "Not right now", "Tell me more about counselors"]
          },
          {
            text: "I'm here to listen. Can you tell me more about what you're experiencing?",
            quickReplies: ["I feel anxious", "I feel sad", "I can't sleep"]
          }
        ],
        hi: [
          {
            text: "मैं समझ सकता हूँ कि आप मुश्किल समय से गुजर रहे हैं। सहायता मांगना बहादुरी है।",
            quickReplies: ["और बताएं", "मुझे सहायता चाहिए", "काउंसलर से मिलाएं"]
          },
          {
            text: "ये भावनाएं वैध हैं। आइए कुछ सामना करने की रणनीतियों पर नज़र डालते हैं।",
            quickReplies: ["सांस की तकनीक", "ध्यान तकनीक", "शारीरिक गतिविधियां"]
          },
          {
            text: "साझा करने के लिए धन्यवाद। क्या आप चाहेंगे कि मैं आपको किसी पेशेवर काउंसलर से जोड़ूं?",
            quickReplies: ["हां, सत्र बुक करें", "अभी नहीं", "काउंसलर के बारे में बताएं"]
          },
          {
            text: "मैं सुनने के लिए यहाँ हूँ। क्या आप बता सकते हैं कि आप क्या अनुभव कर रहे हैं?",
            quickReplies: ["मुझे चिंता है", "मैं उदास हूँ", "मुझे नींद नहीं आती"]
          }
        ]
      };

      const response = aiResponses[language][Math.floor(Math.random() * aiResponses[language].length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        quickReplies: response.quickReplies
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Preview the file in chat
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `Shared file: ${file.name}`,
        sender: 'user',
        timestamp: new Date(),
        file: {
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file)
        }
      };
      setMessages(prev => [...prev, fileMessage]);
      setSelectedFile(null);
      
      // AI response for file
      setTimeout(() => {
        const fileResponses = {
          en: "Thank you for sharing that file. I can see your mood journal entry. Your feelings are completely valid, and I'm here to support you through this.",
          hi: "फ़ाइल साझा करने के लिए धन्यवाद। मैं आपकी मूड डायरी देख सकता हूं। आपकी भावनाएं बिल्कुल वैध हैं।"
        };
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: fileResponses[language],
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1500);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearHistory = () => {
    setMessages([{
      id: '1',
      text: content[language].aiGreeting,
      sender: 'ai',
      timestamp: new Date()
    }]);
    localStorage.removeItem('chat-history');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 md:p-4">
      <Card className="w-full max-w-md h-[600px] md:h-[600px] h-screen md:rounded-lg rounded-none flex flex-col glass border-0 md:max-h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {content[language].title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              Clear
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
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
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      {message.file && (
                        <div className="mt-2 p-2 bg-background/20 rounded border">
                          <div className="flex items-center gap-2">
                            {message.file.type.startsWith('image/') ? (
                              <ImageIcon className="h-4 w-4" />
                            ) : (
                              <Paperclip className="h-4 w-4" />
                            )}
                            <span className="text-xs">{message.file.name}</span>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={message.file.url} download={message.file.name}>
                                <Download className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                          {message.file.type.startsWith('image/') && (
                            <img 
                              src={message.file.url} 
                              alt={message.file.name}
                              className="mt-2 max-w-full h-32 object-cover rounded"
                            />
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                    {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                  </div>
                  
                  {/* Quick Replies */}
                  {message.sender === 'ai' && message.quickReplies && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs h-7"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.txt,.doc,.docx"
              className="hidden"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={content[language].placeholder}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
              className="flex-1 min-h-[44px]"
            />
            <Button
              variant="wellness"
              size="icon"
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className="min-h-[44px] min-w-[44px]"
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