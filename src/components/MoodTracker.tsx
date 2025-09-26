import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface MoodTrackerProps {
  language: 'en' | 'hi';
  user: any;
}

const MoodTracker = ({ language, user }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const content = {
    en: {
      title: 'Daily Mood Tracker',
      subtitle: 'Track your emotional wellness journey',
      moodLabel: 'How are you feeling today?',
      noteLabel: 'Add a note (optional)',
      notePlaceholder: 'What influenced your mood today?',
      save: 'Save Mood Entry',
      history: 'Mood History',
      noEntries: 'No mood entries yet'
    },
    hi: {
      title: 'दैनिक मूड ट्रैकर',
      subtitle: 'अपनी भावनात्मक कल्याण यात्रा को ट्रैक करें',
      moodLabel: 'आज आप कैसा महसूस कर रहे हैं?',
      noteLabel: 'एक नोट जोड़ें (वैकल्पिक)',
      notePlaceholder: 'आज आपके मूड को किस चीज़ ने प्रभावित किया?',
      save: 'मूड एंट्री सेव करें',
      history: 'मूड हिस्ट्री',
      noEntries: 'अभी तक कोई मूड एंट्री नहीं'
    }
  };

  const moods = [
    { score: 1, emoji: '😢', label: language === 'en' ? 'Very Sad' : 'बहुत उदास', color: 'bg-red-100 text-red-800' },
    { score: 2, emoji: '😔', label: language === 'en' ? 'Sad' : 'उदास', color: 'bg-orange-100 text-orange-800' },
    { score: 3, emoji: '😐', label: language === 'en' ? 'Neutral' : 'तटस्थ', color: 'bg-yellow-100 text-yellow-800' },
    { score: 4, emoji: '😊', label: language === 'en' ? 'Happy' : 'खुश', color: 'bg-green-100 text-green-800' },
    { score: 5, emoji: '😃', label: language === 'en' ? 'Very Happy' : 'बहुत खुश', color: 'bg-blue-100 text-blue-800' },
  ];

  useEffect(() => {
    if (user) {
      fetchMoodHistory();
    }
  }, [user]);

  const fetchMoodHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMoodHistory(data || []);
    } catch (error) {
      console.error('Error fetching mood history:', error);
    }
  };

  const saveMoodEntry = async () => {
    if (!selectedMood || !user) return;

    setLoading(true);
    try {
      const moodData = moods.find(m => m.score === selectedMood);
      
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood_score: selectedMood,
          mood_emoji: moodData?.emoji || '😐',
          note: note.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Mood saved!",
        description: "Your mood entry has been recorded.",
      });

      setSelectedMood(null);
      setNote('');
      fetchMoodHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save mood entry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="glass border-0 shadow-xl">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            {language === 'en' ? 'Please log in to track your mood' : 'अपना मूड ट्रैक करने के लिए कृपया लॉग इन करें'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center">
            {content[language].title}
          </CardTitle>
          <p className="text-center text-muted-foreground">
            {content[language].subtitle}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              {content[language].moodLabel}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.score}
                  onClick={() => setSelectedMood(mood.score)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 min-h-[60px] flex flex-col items-center gap-2 ${
                    selectedMood === mood.score
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs text-center">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              {content[language].noteLabel}
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={content[language].notePlaceholder}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button
            onClick={saveMoodEntry}
            variant="wellness"
            size="lg"
            className="w-full min-h-[44px]"
            disabled={!selectedMood || loading}
          >
            {loading ? 'Saving...' : content[language].save}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle>{content[language].history}</CardTitle>
        </CardHeader>
        <CardContent>
          {moodHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {content[language].noEntries}
            </p>
          ) : (
            <div className="space-y-3">
              {moodHistory.map((entry) => {
                const mood = moods.find(m => m.score === entry.mood_score);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{entry.mood_emoji}</span>
                      <div>
                        <Badge variant="outline" className={mood?.color}>
                          {mood?.label}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-muted-foreground max-w-xs text-right">
                        {entry.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;