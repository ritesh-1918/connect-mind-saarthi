import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

const Navigation = ({ language, setLanguage }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const content = {
    en: {
      brand: 'Saarthi Connect Mind',
      nav: ['Assessment', 'Chat Support', 'Book Session', 'Community', 'Resources'],
      crisis: 'Crisis Support'
    },
    hi: {
      brand: 'सारथी कनेक्ट माइंड',
      nav: ['मूल्यांकन', 'चैट सपोर्ट', 'सत्र बुक करें', 'कम्युनिटी', 'संसाधन'],
      crisis: 'संकट सहायता'
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-heading font-bold text-gradient">
              {content[language].brand}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {content[language].nav.map((item, index) => {
              const sectionIds = ['assessment', 'chat', 'booking', 'community', 'resources'];
              return (
                <button
                  key={item}
                  onClick={() => scrollToSection(sectionIds[index])}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Language Toggle & Crisis Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'हिं' : 'EN'}
            </Button>
            <Button variant="warning" size="sm">
              {content[language].crisis}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-lg rounded-lg mt-2">
              {content[language].nav.map((item, index) => {
                const sectionIds = ['assessment', 'chat', 'booking', 'community', 'resources'];
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(sectionIds[index])}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors duration-200"
                  >
                    {item}
                  </button>
                );
              })}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  {language === 'en' ? 'हिं' : 'EN'}
                </Button>
                <Button variant="warning" size="sm">
                  {content[language].crisis}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;