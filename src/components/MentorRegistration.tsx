import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, UserCheck, GraduationCap, Heart, Languages, Phone, Mail, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface MentorRegistrationProps {
  language: 'en' | 'hi';
  isOpen: boolean;
  onClose: () => void;
}

const MentorRegistration = ({ language, isOpen, onClose }: MentorRegistrationProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    experienceYears: '',
    qualifications: '',
    languages: [] as string[],
    bio: '',
    type: 'mentor' as 'mentor' | 'therapist'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    en: {
      title: 'Join as Mental Health Professional',
      subtitle: 'Help others on their mental wellness journey',
      mentorTab: 'Mentor',
      therapistTab: 'Licensed Therapist',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number (Optional)',
      specialization: 'Area of Specialization',
      experienceYears: 'Years of Experience',
      qualifications: 'Qualifications & Certifications',
      languages: 'Languages You Speak',
      bio: 'Professional Bio',
      submit: 'Submit Application',
      cancel: 'Cancel',
      success: 'Application submitted successfully! We will review your application and get back to you within 48 hours.',
      placeholders: {
        fullName: 'Enter your full name',
        email: 'your.email@example.com',
        phone: '+91 9876543210',
        specialization: 'e.g., Anxiety, Depression, Trauma, Relationship Counseling',
        experienceYears: 'e.g., 5',
        qualifications: 'List your degrees, certifications, and relevant training',
        bio: 'Tell us about your experience and approach to mental health support...',
      },
      availableLanguages: ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi']
    },
    hi: {
      title: 'मानसिक स्वास्थ्य पेशेवर के रूप में जुड़ें',
      subtitle: 'दूसरों की मानसिक कल्याण यात्रा में सहायता करें',
      mentorTab: 'मेंटर',
      therapistTab: 'लाइसेंसी थेरेपिस्ट',
      fullName: 'पूरा नाम',
      email: 'ईमेल पता',
      phone: 'फोन नंबर (वैकल्पिक)',
      specialization: 'विशेषज्ञता का क्षेत्र',
      experienceYears: 'अनुभव के वर्ष',
      qualifications: 'योग्यताएं और प्रमाणपत्र',
      languages: 'आप जो भाषाएं बोलते हैं',
      bio: 'पेशेवर परिचय',
      submit: 'आवेदन जमा करें',
      cancel: 'रद्द करें',
      success: 'आवेदन सफलतापूर्वक जमा किया गया! हम आपके आवेदन की समीक्षा करेंगे और 48 घंटों के भीतर संपर्क करेंगे।',
      placeholders: {
        fullName: 'अपना पूरा नाम दर्ज करें',
        email: 'your.email@example.com',
        phone: '+91 9876543210',
        specialization: 'जैसे: चिंता, अवसाद, ट्रामा, रिश्ते की सलाह',
        experienceYears: 'जैसे: 5',
        qualifications: 'अपनी डिग्री, प्रमाणपत्र और संबंधित प्रशिक्षण की सूची दें',
        bio: 'मानसिक स्वास्थ्य सहायता के लिए अपने अनुभव और दृष्टिकोण के बारे में बताएं...',
      },
      availableLanguages: ['अंग्रेजी', 'हिंदी', 'बंगाली', 'तमिल', 'तेलुगु', 'मराठी', 'गुजराती', 'पंजाबी']
    }
  };

  const handleLanguageToggle = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert(language === 'en' ? 'Please login to submit application' : 'आवेदन जमा करने के लिए कृपया लॉगिन करें');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('mentor_applications')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          specialization: formData.specialization,
          experience_years: parseInt(formData.experienceYears),
          qualifications: formData.qualifications,
          languages: formData.languages,
          bio: formData.bio,
          type: formData.type
        });

      if (error) {
        console.error('Error submitting application:', error);
        alert(language === 'en' ? 'Error submitting application' : 'आवेदन जमा करने में त्रुटि');
        return;
      }

      alert(content[language].success);
      onClose();
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        specialization: '',
        experienceYears: '',
        qualifications: '',
        languages: [],
        bio: '',
        type: 'mentor'
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(language === 'en' ? 'Error submitting application' : 'आवेदन जमा करने में त्रुटि');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-heading flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary" />
                {content[language].title}
              </CardTitle>
              <p className="text-muted-foreground mt-1">{content[language].subtitle}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={formData.type === 'mentor' ? 'wellness' : 'outline'}
              onClick={() => setFormData(prev => ({ ...prev, type: 'mentor' }))}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Heart className="h-6 w-6" />
              <span>{content[language].mentorTab}</span>
            </Button>
            <Button
              type="button"
              variant={formData.type === 'therapist' ? 'wellness' : 'outline'}
              onClick={() => setFormData(prev => ({ ...prev, type: 'therapist' }))}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <GraduationCap className="h-6 w-6" />
              <span>{content[language].therapistTab}</span>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {content[language].fullName}
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder={content[language].placeholders.fullName}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {content[language].email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={content[language].placeholders.email}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {content[language].phone}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={content[language].placeholders.phone}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceYears" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  {content[language].experienceYears}
                </Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                  placeholder={content[language].placeholders.experienceYears}
                  required
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">{content[language].specialization}</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder={content[language].placeholders.specialization}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">{content[language].qualifications}</Label>
                <Textarea
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                  placeholder={content[language].placeholders.qualifications}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  {content[language].languages}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {content[language].availableLanguages.map((lang) => (
                    <Badge
                      key={lang}
                      variant={formData.languages.includes(lang) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/20"
                      onClick={() => handleLanguageToggle(lang)}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{content[language].bio}</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={content[language].placeholders.bio}
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                {content[language].cancel}
              </Button>
              <Button 
                type="submit" 
                variant="wellness" 
                className="flex-1"
                disabled={isSubmitting || !formData.fullName || !formData.email || !formData.specialization || !formData.qualifications || !formData.bio || formData.languages.length === 0}
              >
                {isSubmitting ? 'Submitting...' : content[language].submit}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorRegistration;