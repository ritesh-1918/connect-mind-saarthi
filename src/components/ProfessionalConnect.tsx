import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Star, Languages, Video, MessageSquare, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import MentorRegistration from './MentorRegistration';

interface ProfessionalConnectProps {
  language: 'en' | 'hi';
}

const ProfessionalConnect = ({ language }: ProfessionalConnectProps) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMentorRegistration, setShowMentorRegistration] = useState(false);
  const { user } = useAuth();

  const content = {
    en: {
      title: 'Connect with Professional Counselors',
      description: 'Book a session with our qualified mental health professionals',
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      bookSession: 'Book Session',
      confirm: 'Confirm Booking',
      available: 'Available',
      booked: 'Booked',
      timeSlots: ['10:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'],
      rating: 'Rating',
      languages: 'Languages',
      specialization: 'Specialization',
      joinAsProfessional: 'Join as Professional',
      becomeMentor: 'Become a Mentor/Therapist'
    },
    hi: {
      title: 'पेशेवर काउंसलर से जुड़ें',
      description: 'हमारे योग्य मानसिक स्वास्थ्य पेशेवरों के साथ सत्र बुक करें',
      selectDate: 'तारीख चुनें',
      selectTime: 'समय चुनें',
      bookSession: 'सत्र बुक करें',
      confirm: 'बुकिंग की पुष्टि करें',
      available: 'उपलब्ध',
      booked: 'बुक हो गया',
      timeSlots: ['सुबह 10:00', 'दोपहर 2:00', 'शाम 4:00', 'शाम 6:00'],
      rating: 'रेटिंग',
      languages: 'भाषाएं',
      specialization: 'विशेषज्ञता',
      joinAsProfessional: 'पेशेवर के रूप में जुड़ें',
      becomeMentor: 'मेंटर/थेरेपिस्ट बनें'
    }
  };

  const counselors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialization: language === 'en' ? 'Anxiety & Depression' : 'चिंता और अवसाद',
      rating: 4.9,
      languages: ['Hindi', 'English'],
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialization: language === 'en' ? 'Trauma & PTSD' : 'ट्रामा और PTSD',
      rating: 4.8,
      languages: ['Hindi', 'English'],
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Dr. Anjali Patel',
      specialization: language === 'en' ? 'Relationship Counseling' : 'रिश्ते की सलाह',
      rating: 4.9,
      languages: ['Hindi', 'English', 'Gujarati'],
      image: '/placeholder.svg'
    }
  ];

  const [selectedCounselor, setSelectedCounselor] = useState(counselors[0]);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => {
    return language === 'en' 
      ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : date.toLocaleDateString('hi-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleBooking = () => {
    if (selectedTime) {
      setShowBookingModal(true);
    }
  };

  const confirmBooking = async () => {
    if (!user) {
      alert(language === 'en' ? 'Please login to book session' : 'सत्र बुक करने के लिए कृपया लॉगिन करें');
      return;
    }

    try {
      // Save booking to database
      const { error: bookingError } = await supabase
        .from('session_bookings')
        .insert({
          user_id: user.id,
          counselor_name: selectedCounselor.name,
          session_date: dates[selectedDate].toISOString().split('T')[0],
          session_time: selectedTime!,
          booking_type: 'session'
        });

      if (bookingError) {
        console.error('Error saving booking:', bookingError);
        alert(language === 'en' ? 'Error booking session' : 'सत्र बुक करने में त्रुटि');
        return;
      }

      // Send confirmation email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            userEmail: user.email,
            userName: user.user_metadata?.display_name || user.email,
            counselorName: selectedCounselor.name,
            sessionDate: formatDate(dates[selectedDate]),
            sessionTime: selectedTime!
          }
        });

        if (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }
      } catch (emailError) {
        console.error('Email service error:', emailError);
      }

      alert(language === 'en' 
        ? 'Booking confirmed! Check your email for confirmation details.' 
        : 'बुकिंग की पुष्टि हो गई! पुष्टि के विवरण के लिए अपना ईमेल चेक करें।');
      
      setShowBookingModal(false);
      setSelectedTime(null);
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert(language === 'en' ? 'Error booking session' : 'सत्र बुक करने में त्रुटि');
    }
  };

  return (
    <section id="booking" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
            {content[language].title}
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            {content[language].description}
          </p>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowMentorRegistration(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            {content[language].joinAsProfessional}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar & Time Selection */}
          <Card className="glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                {content[language].selectDate}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div className="grid grid-cols-7 gap-2">
                {dates.map((date, index) => (
                  <Button
                    key={index}
                    variant={selectedDate === index ? 'wellness' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDate(index)}
                    className="h-auto py-3 flex flex-col text-center"
                  >
                    <div className="text-xs">{formatDate(date).split(' ')[0]}</div>
                    <div className="text-sm font-semibold">{date.getDate()}</div>
                  </Button>
                ))}
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {content[language].selectTime}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {content[language].timeSlots.map((time, index) => {
                    const isBooked = Math.random() > 0.7; // Simulate some booked slots
                    return (
                      <Button
                        key={index}
                        variant={selectedTime === time ? 'wellness' : isBooked ? 'ghost' : 'outline'}
                        disabled={isBooked}
                        onClick={() => setSelectedTime(time)}
                        className="h-auto py-3 flex flex-col"
                      >
                        <div className="font-semibold">{time}</div>
                        <div className="text-xs">
                          {isBooked ? content[language].booked : content[language].available}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="wellness"
                size="lg"
                onClick={handleBooking}
                disabled={!selectedTime}
                className="w-full"
              >
                {content[language].bookSession}
              </Button>
            </CardContent>
          </Card>

          {/* Counselors List */}
          <div className="space-y-4">
            {counselors.map((counselor) => (
              <Card 
                key={counselor.id} 
                className={`glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  selectedCounselor.id === counselor.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCounselor(counselor)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={counselor.image} alt={counselor.name} />
                      <AvatarFallback>{counselor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold">{counselor.name}</h3>
                      <p className="text-muted-foreground">{counselor.specialization}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{counselor.rating}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Languages className="h-4 w-4" />
                          <span>{counselor.languages.join(', ')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Video Call
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Confirmation Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-md glass border-0">
              <CardHeader>
                <CardTitle>{content[language].confirm}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <p><strong>Date:</strong> {formatDate(dates[selectedDate])}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Counselor:</strong> {selectedCounselor.name}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowBookingModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="wellness" onClick={confirmBooking} className="flex-1">
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mentor Registration Modal */}
        <MentorRegistration
          language={language}
          isOpen={showMentorRegistration}
          onClose={() => setShowMentorRegistration(false)}
        />
      </div>
    </section>
  );
};

export default ProfessionalConnect;