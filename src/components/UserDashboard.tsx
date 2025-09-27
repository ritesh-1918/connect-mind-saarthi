import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Calendar, MessageSquare, Trophy, Settings, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import MoodTracker from './MoodTracker';

interface UserDashboardProps {
  language: 'en' | 'hi';
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const UserDashboard = ({ language, isDarkMode, toggleDarkMode }: UserDashboardProps) => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    assessments: 0,
    chatMessages: 0,
    moodEntries: 0,
    gameScore: 0
  });
  const [showMoodTracker, setShowMoodTracker] = useState(false);

  const content = {
    en: {
      welcome: 'Hello',
      dashboard: 'Personal Dashboard',
      quickActions: 'Quick Actions',
      statistics: 'Your Progress',
      settings: 'Settings',
      signOut: 'Sign Out',
      actions: {
        trackMood: 'Track Mood',
        takeAssessment: 'Take Assessment',
        viewMessages: 'View Messages',
        playGames: 'Play Games'
      },
      stats: {
        assessments: 'Assessments Taken',
        messages: 'Messages Sent',
        moods: 'Mood Entries',
        gameScore: 'Best Game Score'
      }
    },
    hi: {
      welcome: 'नमस्ते',
      dashboard: 'व्यक्तिगत डैशबोर्ड',
      quickActions: 'त्वरित कार्य',
      statistics: 'आपकी प्रगति',
      settings: 'सेटिंग्स',
      signOut: 'साइन आउट',
      actions: {
        trackMood: 'मूड ट्रैक करें',
        takeAssessment: 'मूल्यांकन लें',
        viewMessages: 'संदेश देखें',
        playGames: 'गेम खेलें'
      },
      stats: {
        assessments: 'लिए गए मूल्यांकन',
        messages: 'भेजे गए संदेश',
        moods: 'मूड एंट्री',
        gameScore: 'सर्वोत्तम गेम स्कोर'
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // This would typically fetch from various tables
      // For now, we'll use placeholder data
      setStats({
        assessments: 3,
        chatMessages: 12,
        moodEntries: 7,
        gameScore: 250
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-heading font-bold">
                  {content[language].welcome}, {profile?.display_name || 'Friend'} 👋
                </h1>
                <p className="text-muted-foreground">
                  {content[language].dashboard}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="min-h-[44px] min-w-[44px]"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                onClick={signOut}
                className="min-h-[44px]"
              >
                {content[language].signOut}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{stats.assessments}</div>
            <p className="text-sm text-muted-foreground">{content[language].stats.assessments}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{stats.chatMessages}</div>
            <p className="text-sm text-muted-foreground">{content[language].stats.messages}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{stats.moodEntries}</div>
            <p className="text-sm text-muted-foreground">{content[language].stats.moods}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">{stats.gameScore}</div>
            <p className="text-sm text-muted-foreground">{content[language].stats.gameScore}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle>{content[language].quickActions}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="wellness"
              className="flex flex-col items-center gap-2 h-auto py-4 min-h-[44px]"
              onClick={() => setShowMoodTracker(!showMoodTracker)}
            >
              <Calendar className="h-6 w-6" />
              {content[language].actions.trackMood}
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 min-h-[44px]"
              onClick={() => scrollToSection('assessment')}
            >
              <User className="h-6 w-6" />
              {content[language].actions.takeAssessment}
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 min-h-[44px]"
              onClick={() => scrollToSection('chat')}
            >
              <MessageSquare className="h-6 w-6" />
              {content[language].actions.viewMessages}
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 min-h-[44px]"
              onClick={() => scrollToSection('games')}
            >
              <Trophy className="h-6 w-6" />
              {content[language].actions.playGames}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showMoodTracker && (
        <MoodTracker language={language} user={user} />
      )}
    </div>
  );
};

export default UserDashboard;