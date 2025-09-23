import { Button } from '@/components/ui/button';
import { Heart, Shield, Users } from 'lucide-react';
import heroWaves from '@/assets/hero-waves.jpg';

interface HeroSectionProps {
  language: 'en' | 'hi';
}

const HeroSection = ({ language }: HeroSectionProps) => {
  const content = {
    en: {
      title: 'Saarthi Connect Mind',
      subtitle: 'Your Mental Wellness Companion',
      tagline: 'Anonymous, Professional, Compassionate Support in Hindi & English',
      cta: 'Start Your Wellness Journey',
      features: [
        { icon: Heart, text: 'Compassionate Care' },
        { icon: Shield, text: 'Anonymous & Secure' },
        { icon: Users, text: 'Professional Support' }
      ]
    },
    hi: {
      title: 'सारथी कनेक्ट माइंड',
      subtitle: 'आपका मानसिक स्वास्थ्य साथी',
      tagline: 'हिंदी और अंग्रेजी में गुमनाम, पेशेवर, दयालु सहायता',
      cta: 'अपनी कल्याण यात्रा शुरू करें',
      features: [
        { icon: Heart, text: 'दयालु देखभाल' },
        { icon: Shield, text: 'गुमनाम और सुरक्षित' },
        { icon: Users, text: 'पेशेवर सहायता' }
      ]
    }
  };

  const scrollToAssessment = () => {
    const element = document.getElementById('assessment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroWaves})` }}
      >
        <div className="absolute inset-0 wellness-gradient opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-gentle-float">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight">
            {content[language].title}
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-4 font-medium">
            {content[language].subtitle}
          </p>
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            {content[language].tagline}
          </p>
        </div>

        <div className="mb-12">
          <Button 
            variant="hero" 
            size="xl"
            onClick={scrollToAssessment}
            className="text-xl font-semibold"
          >
            {content[language].cta}
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {content[language].features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glass rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <Icon className="h-12 w-12 text-white mx-auto mb-4" />
                <p className="text-white font-medium text-lg">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;