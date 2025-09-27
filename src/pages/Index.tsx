import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import EnhancedAssessmentSection from '@/components/EnhancedAssessmentSection';
import GamesSection from '@/components/GamesSection';
import ChatSupport from '@/components/ChatSupport';
import ProfessionalConnect from '@/components/ProfessionalConnect';
import CommunityForum from '@/components/CommunityForum';
import ResourcesSection from '@/components/ResourcesSection';
import UserDashboard from '@/components/UserDashboard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        language={language} 
        setLanguage={setLanguage} 
        user={user}
        onAuthClick={() => navigate('/auth')}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* User Dashboard (only for logged in users) */}
      {user && (
        <section className="pt-20 pb-10 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <UserDashboard 
              language={language} 
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>
        </section>
      )}

      {/* Hero Section (only for non-logged in users) */}
      {!user && <HeroSection language={language} />}

      {/* Assessment Section */}
      <EnhancedAssessmentSection language={language} onOpenChat={() => setIsChatOpen(true)} />

      {/* Games Section */}
      <GamesSection language={language} />

      {/* Professional Connect */}
      <ProfessionalConnect language={language} />

      {/* Community Forum */}
      <CommunityForum language={language} />

      {/* Resources Section */}
      <ResourcesSection language={language} />

      {/* Footer */}
      <Footer language={language} setLanguage={setLanguage} />

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Button
          variant="wellness"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl hover:shadow-2xl z-40 animate-pulse-glow"
          onClick={() => setIsChatOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Support */}
      <ChatSupport
        language={language}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Index;
