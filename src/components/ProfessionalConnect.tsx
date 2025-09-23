import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Star, Languages, Video, MessageSquare } from 'lucide-react';

interface ProfessionalConnectProps {
  language: 'en' | 'hi';
}

const ProfessionalConnect = ({ language }: ProfessionalConnectProps) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

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
      specialization: 'Specialization'
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
      specialization: 'विशेषज्ञता'
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

  const confirmBooking = () => {
    // Here you would typically send the booking data to your backend
    alert(language === 'en' ? 'Booking confirmed!' : 'बुकिंग की पुष्टि हो गई!');
    setShowBookingModal(false);
    setSelectedTime(null);
  };

  return (
    <section id="booking" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
            {content[language].title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {content[language].description}
          </p>
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
              <Card key={counselor.id} className="glass border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                  <p><strong>Counselor:</strong> Dr. Priya Sharma</p>
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
      </div>
    </section>
  );
};

export default ProfessionalConnect;