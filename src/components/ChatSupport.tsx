import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Paperclip, X, Bot, User, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

    try {
      // Send message to Gemini API via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: text,
          history: messages
            .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
            .map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            }))
        }
      });

      if (error) {
        throw error;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message || 'I apologize, but I\'m having trouble responding right now. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        quickReplies: language === 'en' 
          ? ["Tell me more", "I need help coping", "Connect me with counselor"]
          : ["और बताएं", "मुझे सहायता चाहिए", "काउंसलर से मिलाएं"]
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'en' 
          ? "I'm here to support you. While I'm having technical difficulties, please know that your feelings are valid and you're not alone."
          : "मैं आपका समर्थन करने के लिए यहाँ हूँ। जबकि मुझे तकनीकी कठिनाइयां हो रही हैं, कृपया जानें कि आपकी भावनाएं वैध हैं और आप अकेले नहीं हैं।",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
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
      <Card className="w-full max-w-lg h-[700px] md:h-[700px] h-screen md:rounded-lg rounded-none flex flex-col glass border-0 md:max-h-[700px] shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
              <Bot className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{content[language].title}</span>
              <span className="text-xs text-muted-foreground">Always here to help</span>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs">
              Clear
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4 p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
              <div className="flex justify-start animate-fade-in">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg max-w-[80%] shadow-md">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">SAARTHI is thinking...</span>
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