import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, 
  Brain, 
  Phone, 
  BookOpen, 
  Download, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Play,
  FileText
} from 'lucide-react';

interface ResourcesSectionProps {
  language: 'en' | 'hi';
}

const ResourcesSection = ({ language }: ResourcesSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('breathing');

  const content = {
    en: {
      title: 'Mental Health Resources',
      description: 'Comprehensive resources to support your mental wellness journey',
      searchPlaceholder: 'Search resources...',
      categories: {
        breathing: 'Breathing Exercises',
        meditation: 'Meditation Guides',
        crisis: 'Crisis Helplines',
        articles: 'Educational Articles'
      },
      download: 'Download',
      listen: 'Listen',
      read: 'Read',
      call: 'Call Now',
      available247: 'Available 24/7'
    },
    hi: {
      title: 'मानसिक स्वास्थ्य संसाधन',
      description: 'आपकी मानसिक स्वास्थ्य यात्रा का समर्थन करने के लिए व्यापक संसाधन',
      searchPlaceholder: 'संसाधन खोजें...',
      categories: {
        breathing: 'श्वास अभ्यास',
        meditation: 'ध्यान गाइड',
        crisis: 'संकट हेल्पलाइन',
        articles: 'शैक्षिक लेख'
      },
      download: 'डाउनलोड',
      listen: 'सुनें',
      read: 'पढ़ें',
      call: 'अभी कॉल करें',
      available247: '24/7 उपलब्ध'
    }
  };

  const resources = {
    breathing: [
      {
        id: 1,
        title: language === 'en' ? '4-7-8 Breathing Technique' : '4-7-8 श्वास तकनीक',
        description: language === 'en' 
          ? 'A simple technique to reduce anxiety and promote sleep'
          : 'चिंता कम करने और नींद को बढ़ावा देने की सरल तकनीक',
        type: 'audio',
        duration: '5 min',
        category: 'breathing'
      },
      {
        id: 2,
        title: language === 'en' ? 'Box Breathing Exercise' : 'बॉक्स श्वास अभ्यास',
        description: language === 'en'
          ? 'Used by Navy SEALs to stay calm under pressure'
          : 'दबाव में शांत रहने के लिए नेवी सील्स द्वारा उपयोग',
        type: 'guide',
        duration: '3 min',
        category: 'breathing'
      }
    ],
    meditation: [
      {
        id: 3,
        title: language === 'en' ? 'Mindfulness for Beginners' : 'शुरुआती लोगों के लिए माइंडफुलनेस',
        description: language === 'en'
          ? 'Introduction to mindfulness meditation practice'
          : 'माइंडफुलनेस ध्यान अभ्यास का परिचय',
        type: 'audio',
        duration: '10 min',
        category: 'meditation'
      },
      {
        id: 4,
        title: language === 'en' ? 'Body Scan Meditation' : 'बॉडी स्कैन मेडिटेशन',
        description: language === 'en'
          ? 'Guided meditation for body awareness and relaxation'
          : 'शरीर की जागरूकता और आराम के लिए निर्देशित ध्यान',
        type: 'audio',
        duration: '15 min',
        category: 'meditation'
      }
    ],
    crisis: [
      {
        id: 5,
        title: language === 'en' ? 'National Suicide Prevention Lifeline' : 'राष्ट्रीय आत्महत्या रोकथाम लाइफलाइन',
        description: language === 'en'
          ? 'Free and confidential emotional support'
          : 'मुफ्त और गोपनीय भावनात्मक सहायता',
        type: 'phone',
        duration: '24/7',
        number: '988',
        category: 'crisis'
      },
      {
        id: 6,
        title: language === 'en' ? 'Crisis Text Line' : 'संकट टेक्स्ट लाइन',
        description: language === 'en'
          ? 'Text HOME to 741741 for crisis support'
          : 'संकट सहायता के लिए 741741 पर HOME टेक्स्ट करें',
        type: 'text',
        duration: '24/7',
        number: '741741',
        category: 'crisis'
      }
    ],
    articles: [
      {
        id: 7,
        title: language === 'en' ? 'Understanding Anxiety Disorders' : 'चिंता विकारों को समझना',
        description: language === 'en'
          ? 'Comprehensive guide to anxiety symptoms and treatment'
          : 'चिंता के लक्षण और उपचार की व्यापक गाइड',
        type: 'article',
        duration: '8 min read',
        category: 'articles'
      },
      {
        id: 8,
        title: language === 'en' ? 'Building Resilience' : 'लचीलापन बनाना',
        description: language === 'en'
          ? 'Strategies for developing emotional resilience'
          : 'भावनात्मक लचीलापन विकसित करने की रणनीतियां',
        type: 'article',
        duration: '6 min read',
        category: 'articles'
      }
    ]
  };

  const filteredResources = Object.entries(resources).reduce((acc, [category, items]) => {
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof resources[keyof typeof resources]>);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Play className="h-4 w-4" />;
      case 'guide': return <Waves className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'text': return <Phone className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getResourceAction = (resource: any) => {
    switch (resource.type) {
      case 'audio':
        return (
          <Button variant="wellness" size="sm" className="flex items-center gap-1">
            <Play className="h-4 w-4" />
            {content[language].listen}
          </Button>
        );
      case 'guide':
        return (
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {content[language].download}
          </Button>
        );
      case 'phone':
      case 'text':
        return (
          <Button variant="warning" size="sm" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            {content[language].call}
          </Button>
        );
      case 'article':
        return (
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {content[language].read}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <section id="resources" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
            {content[language].title}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {content[language].description}
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={content[language].searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Resource Categories */}
        <div className="space-y-6">
          {Object.entries(filteredResources).map(([category, items]) => (
            <Card key={category} className="glass border-0 shadow-lg">
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category === 'breathing' && <Waves className="h-6 w-6" />}
                    {category === 'meditation' && <Brain className="h-6 w-6" />}
                    {category === 'crisis' && <Phone className="h-6 w-6" />}
                    {category === 'articles' && <BookOpen className="h-6 w-6" />}
                    {content[language].categories[category as keyof typeof content[typeof language]['categories']]}
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>
                  {expandedCategory === category ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>

              {expandedCategory === category && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((resource) => (
                      <Card key={resource.id} className="border hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getResourceIcon(resource.type)}
                              <h3 className="font-semibold text-sm">{resource.title}</h3>
                            </div>
                            {resource.duration && (
                              <Badge variant="outline" className="text-xs">
                                {resource.duration}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground text-sm mb-4">
                            {resource.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            {getResourceAction(resource)}
                            {resource.type === 'phone' && (
                              <Badge variant="warning" className="text-xs">
                                {content[language].available247}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;