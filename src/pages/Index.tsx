import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import EnhancedAssessmentSection from '@/components/EnhancedAssessmentSection';
import ChatSupport from '@/components/ChatSupport';
import ProfessionalConnect from '@/components/ProfessionalConnect';
import CommunityForum from '@/components/CommunityForum';
import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation language={language} setLanguage={setLanguage} />

      {/* Hero Section */}
      <HeroSection language={language} />

      {/* Assessment Section */}
      <EnhancedAssessmentSection language={language} onOpenChat={() => setIsChatOpen(true)} />

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
      />
    </div>
  );
};

export default Index;
