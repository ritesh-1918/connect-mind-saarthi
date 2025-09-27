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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-gentle-float">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <span className="text-white/90 text-sm font-medium">
                {language === 'en' ? '🌟 Your Mental Wellness Journey Starts Here' : '🌟 आपकी मानसिक कल्याण यात्रा यहाँ शुरू होती है'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              {content[language].title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
              {content[language].subtitle}
            </p>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {content[language].tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="hero" 
                size="xl"
                onClick={scrollToAssessment}
                className="text-lg font-semibold px-8 py-4"
              >
                {content[language].cta}
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="text-lg font-semibold px-8 py-4 border-white/30 text-white hover:bg-white/10"
                onClick={() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {language === 'en' ? 'Join Community' : 'कम्युनिटी में शामिल हों'}
              </Button>
            </div>
          </div>

          {/* Right Content - Features Cards */}
          <div className="space-y-6">
            {content[language].features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="glass rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{feature.text}</h3>
                      <p className="text-white/70 text-sm">
                        {index === 0 && (language === 'en' ? 'Evidence-based support tailored for you' : 'आपके लिए तैयार साक्ष्य-आधारित सहायता')}
                        {index === 1 && (language === 'en' ? 'Your privacy and anonymity protected' : 'आपकी गोपनीयता और गुमनामी सुरक्षित')}
                        {index === 2 && (language === 'en' ? 'Licensed counselors and peer support' : 'लाइसेंसी काउंसलर और सहकर्मी सहायता')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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