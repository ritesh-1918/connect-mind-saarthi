import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, MessageCircle } from 'lucide-react';

interface AssessmentSectionProps {
  language: 'en' | 'hi';
  onOpenChat: () => void;
}

const AssessmentSection = ({ language, onOpenChat }: AssessmentSectionProps) => {
  const [activeAssessment, setActiveAssessment] = useState<'phq9' | 'gad7'>('phq9');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const content = {
    en: {
      title: 'Mental Health Assessment',
      description: 'Take a confidential assessment to understand your mental wellness',
      phq9: 'Depression Assessment (PHQ-9)',
      gad7: 'Anxiety Assessment (GAD-7)',
      start: 'Start Assessment',
      next: 'Next Question',
      complete: 'Complete Assessment',
      restart: 'Take Another Assessment',
      chatSupport: 'Talk to AI Support',
      riskLevels: {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk'
      },
      suggestions: {
        low: 'You\'re doing well! Keep maintaining healthy habits.',
        medium: 'Consider implementing stress management techniques.',
        high: 'We recommend speaking with a mental health professional.'
      }
    },
    hi: {
      title: 'मानसिक स्वास्थ्य मूल्यांकन',
      description: 'अपनी मानसिक स्वास्थ्य को समझने के लिए गोपनीय मूल्यांकन करें',
      phq9: 'अवसाद मूल्यांकन (PHQ-9)',
      gad7: 'चिंता मूल्यांकन (GAD-7)',
      start: 'मूल्यांकन शुरू करें',
      next: 'अगला प्रश्न',
      complete: 'मूल्यांकन पूरा करें',
      restart: 'दूसरा मूल्यांकन लें',
      chatSupport: 'AI सहायता से बात करें',
      riskLevels: {
        low: 'कम जोखिम',
        medium: 'मध्यम जोखिम',
        high: 'उच्च जोखिम'
      },
      suggestions: {
        low: 'आप अच्छा कर रहे हैं! स्वस्थ आदतें बनाए रखें।',
        medium: 'तनाव प्रबंधन तकनीकों को लागू करने पर विचार करें।',
        high: 'हम मानसिक स्वास्थ्य पेशेवर से बात करने की सलाह देते हैं।'
      }
    }
  };

  const phq9Questions = {
    en: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself or that you are a failure',
      'Trouble concentrating on things',
      'Moving or speaking slowly, or being fidgety/restless',
      'Thoughts that you would be better off dead'
    ],
    hi: [
      'काम में रुचि या खुशी की कमी',
      'उदास, हताश, या निराश महसूस करना',
      'सोने में परेशानी, या बहुत ज्यादा सोना',
      'थका हुआ महसूस करना या ऊर्जा की कमी',
      'भूख न लगना या ज्यादा खाना',
      'अपने बारे में बुरा महसूस करना या असफल महसूस करना',
      'चीजों पर ध्यान केंद्रित करने में परेशानी',
      'धीरे बोलना या हिलना, या बेचैनी महसूस करना',
      'मृत्यु के विचार आना'
    ]
  };

  const gad7Questions = {
    en: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it\'s hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid as if something awful might happen'
    ],
    hi: [
      'घबराहट, चिंता, या परेशानी महसूस करना',
      'चिंता को रोकने या नियंत्रित न कर पाना',
      'अलग-अलग चीजों के बारे में बहुत चिंता करना',
      'आराम करने में परेशानी',
      'इतनी बेचैनी कि बैठना मुश्किल हो',
      'आसानी से नाराज या चिड़चिड़ाना',
      'डर लगना कि कुछ भयानक हो सकता है'
    ]
  };

  const scaleLabels = {
    en: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    hi: ['बिल्कुल नहीं', 'कई दिन', 'आधे से ज्यादा दिन', 'लगभग हर दिन']
  };

  const questions = activeAssessment === 'phq9' ? phq9Questions[language] : gad7Questions[language];
  const totalQuestions = questions.length;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and complete assessment
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      setScore(totalScore);
      setIsCompleted(true);
    }
  };

  const getRiskLevel = (score: number) => {
    if (activeAssessment === 'phq9') {
      if (score <= 4) return 'low';
      if (score <= 14) return 'medium';
      return 'high';
    } else {
      if (score <= 4) return 'low';
      if (score <= 9) return 'medium';
      return 'high';
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
    setScore(0);
  };

  const riskLevel = getRiskLevel(score);
  const riskColors = {
    low: 'success',
    medium: 'warning',
    high: 'destructive'
  } as const;

  return (
    <section id="assessment" className="py-20 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
            {content[language].title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {content[language].description}
          </p>
        </div>

        <Card className="glass border-0 shadow-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {activeAssessment === 'phq9' ? <Brain className="h-6 w-6" /> : <Heart className="h-6 w-6" />}
                {activeAssessment === 'phq9' ? content[language].phq9 : content[language].gad7}
              </CardTitle>
              
              <div className="flex gap-2">
                <Button
                  variant={activeAssessment === 'phq9' ? 'wellness' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setActiveAssessment('phq9');
                    resetAssessment();
                  }}
                >
                  PHQ-9
                </Button>
                <Button
                  variant={activeAssessment === 'gad7' ? 'wellness' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setActiveAssessment('gad7');
                    resetAssessment();
                  }}
                >
                  GAD-7
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isCompleted ? (
              <>
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Question {currentQuestion + 1} of {totalQuestions}</span>
                    <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%</span>
                  </div>
                  <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="h-2" />
                </div>

                {/* Question */}
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold mb-8">
                    {questions[currentQuestion]}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {scaleLabels[language].map((label, index) => (
                      <Button
                        key={index}
                        variant={answers[currentQuestion] === index ? 'wellness' : 'outline'}
                        onClick={() => handleAnswer(index)}
                        className="h-auto py-4 px-3 text-center"
                      >
                        <div>
                          <div className="font-semibold">{index}</div>
                          <div className="text-xs mt-1">{label}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Results */
              <div className="text-center py-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Assessment Complete</h3>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-3xl font-bold">{score}</div>
                    <Badge variant={riskColors[riskLevel]} className="text-lg px-4 py-2">
                      {content[language].riskLevels[riskLevel]}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-8">
                    {content[language].suggestions[riskLevel]}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="wellness" onClick={onOpenChat} className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {content[language].chatSupport}
                  </Button>
                  <Button variant="outline" onClick={resetAssessment}>
                    {content[language].restart}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AssessmentSection;