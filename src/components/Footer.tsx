import { Button } from '@/components/ui/button';
import { Heart, Phone, Globe, Shield, Mail } from 'lucide-react';

interface FooterProps {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

const Footer = ({ language, setLanguage }: FooterProps) => {
  const content = {
    en: {
      brand: 'Saarthi Connect Mind',
      tagline: 'Your Mental Wellness Companion',
      privacy: 'Your data is anonymous and secure',
      crisis: 'Crisis Support',
      crisisNumbers: [
        { label: 'National Suicide Prevention', number: '988' },
        { label: 'Crisis Text Line', number: 'Text HOME to 741741' },
        { label: 'SAMHSA Helpline', number: '1-800-662-4357' }
      ],
      quickLinks: {
        title: 'Quick Links',
        links: ['Assessment', 'Chat Support', 'Book Session', 'Community', 'Resources']
      },
      contact: {
        title: 'Contact',
        email: 'support@saarthiconnect.com',
        phone: '+91-800-123-4567'
      },
      copyright: '© 2024 Saarthi Connect Mind. All rights reserved.',
      disclaimer: 'If you are in immediate danger, please call emergency services or go to your nearest emergency room.'
    },
    hi: {
      brand: 'सारथी कनेक्ट माइंड',
      tagline: 'आपका मानसिक स्वास्थ्य साथी',
      privacy: 'आपका डेटा गुमनाम और सुरक्षित है',
      crisis: 'संकट सहायता',
      crisisNumbers: [
        { label: 'राष्ट्रीय आत्महत्या रोकथाम', number: '988' },
        { label: 'संकट टेक्स्ट लाइन', number: '741741 पर HOME टेक्स्ट करें' },
        { label: 'SAMHSA हेल्पलाइन', number: '1-800-662-4357' }
      ],
      quickLinks: {
        title: 'त्वरित लिंक',
        links: ['मूल्यांकन', 'चैट सपोर्ट', 'सत्र बुक करें', 'कम्युनिटी', 'संसाधन']
      },
      contact: {
        title: 'संपर्क',
        email: 'support@saarthiconnect.com',
        phone: '+91-800-123-4567'
      },
      copyright: '© 2024 सारथी कनेक्ट माइंड। सभी अधिकार सुरक्षित।',
      disclaimer: 'यदि आप तत्काल खतरे में हैं, तो कृपया आपातकालीन सेवाओं को कॉल करें या अपने निकटतम आपातकालीन कक्ष में जाएं।'
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Crisis Banner */}
      <div className="bg-destructive text-destructive-foreground py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4" />
            {content[language].disclaimer}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Privacy */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6" />
              <h3 className="text-xl font-heading font-bold">
                {content[language].brand}
              </h3>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              {content[language].tagline}
            </p>
            <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg p-3">
              <Shield className="h-4 w-4" />
              <span>{content[language].privacy}</span>
            </div>
          </div>

          {/* Crisis Support */}
          <div>
            <h4 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {content[language].crisis}
            </h4>
            <div className="space-y-3">
              {content[language].crisisNumbers.map((crisis, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium">{crisis.label}</div>
                  <div className="text-primary-foreground/80">{crisis.number}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">
              {content[language].quickLinks.title}
            </h4>
            <div className="space-y-2">
              {content[language].quickLinks.links.map((link, index) => {
                const sectionIds = ['assessment', 'chat', 'booking', 'community', 'resources'];
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(sectionIds[index])}
                    className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200 text-left"
                  >
                    {link}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact & Language */}
          <div>
            <h4 className="font-heading font-semibold mb-4">
              {content[language].contact.title}
            </h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>{content[language].contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>{content[language].contact.phone}</span>
              </div>
            </div>
            
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground hover:bg-white/10"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'हिंदी' : 'English'}
            </Button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/80 text-sm">
            {content[language].copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;