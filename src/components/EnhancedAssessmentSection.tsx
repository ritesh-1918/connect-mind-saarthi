import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Download, BarChart3 } from 'lucide-react';

interface AssessmentSectionProps {
  language: 'en' | 'hi';
  onOpenChat: () => void;
}

const EnhancedAssessmentSection = ({ language, onOpenChat }: AssessmentSectionProps) => {
  const [assessmentType, setAssessmentType] = useState<'phq9' | 'gad7'>('phq9');
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const content = {
    en: {
      title: 'Mental Health Assessment',
      description: 'Take a confidential assessment to understand your mental wellness',
      assessments: {
        phq9: 'Depression Assessment (PHQ-9)',
        gad7: 'Anxiety Assessment (GAD-7)'
      },
      startAssessment: 'Start Assessment',
      scale: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
      results: {
        title: 'Assessment Results',
        levels: {
          low: 'Low Risk',
          medium: 'Medium Risk', 
          high: 'High Risk'
        },
        suggestions: 'Personalized Recommendations',
        talkToAI: 'Talk to AI Support',
        retake: 'Retake Assessment'
      }
    },
    hi: {
      title: 'मानसिक स्वास्थ्य मूल्यांकन',
      description: 'अपनी मानसिक स्वास्थ्य को समझने के लिए गोपनीय मूल्यांकन करें',
      assessments: {
        phq9: 'अवसाद मूल्यांकन (PHQ-9)',
        gad7: 'चिंता मूल्यांकन (GAD-7)'
      },
      startAssessment: 'मूल्यांकन शुरू करें',
      scale: ['बिल्कुल नहीं', 'कई दिन', 'आधे से ज्यादा दिन', 'लगभग हर दिन'],
      results: {
        title: 'मूल्यांकन परिणाम',
        levels: {
          low: 'कम जोखिम',
          medium: 'मध्यम जोखिम',
          high: 'उच्च जोखिम'
        },
        suggestions: 'व्यक्तिगत सुझाव',
        talkToAI: 'AI सहायता से बात करें',
        retake: 'फिर से मूल्यांकन करें'
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

  const questions = assessmentType === 'phq9' ? phq9Questions[language] : gad7Questions[language];
  const totalScore = answers.reduce((sum, answer) => sum + (answer || 0), 0);
  const maxScore = questions.length * 3;

  const getRiskLevel = () => {
    if (assessmentType === 'phq9') {
      if (totalScore <= 4) return 'low';
      if (totalScore <= 14) return 'medium';
      return 'high';
    } else {
      if (totalScore <= 4) return 'low';
      if (totalScore <= 9) return 'medium';
      return 'high';
    }
  };

  const riskLevel = getRiskLevel();

  const getSuggestions = () => {
    const suggestions = {
      en: {
        low: [
          'Continue maintaining healthy lifestyle habits',
          'Practice regular exercise and good sleep hygiene',
          'Stay connected with friends and family',
          'Consider mindfulness or meditation practices'
        ],
        medium: [
          'Implement stress management techniques',
          'Consider talking to a counselor or therapist',
          'Practice deep breathing and relaxation exercises',
          'Maintain regular sleep schedule',
          'Limit alcohol and caffeine intake'
        ],
        high: [
          'Seek professional mental health support immediately',
          'Contact a crisis helpline if experiencing thoughts of self-harm',
          'Reach out to trusted friends or family members',
          'Consider medication evaluation with a psychiatrist',
          'Avoid making major life decisions during this time'
        ]
      },
      hi: {
        low: [
          'स्वस्थ जीवनशैली की आदतें बनाए रखें',
          'नियमित व्यायाम और अच्छी नींद लें',
          'दोस्तों और परिवार से जुड़े रहें',
          'ध्यान या माइंडफुलनेस का अभ्यास करें'
        ],
        medium: [
          'तनाव प्रबंधन तकनीकों का उपयोग करें',
          'काउंसलर या थेरेपिस्ट से बात करने पर विचार करें',
          'गहरी सांस लेने का अभ्यास करें',
          'नियमित नींद का समय बनाए रखें',
          'शराब और कैफीन का सेवन सीमित करें'
        ],
        high: [
          'तुरंत मानसिक स्वास्थ्य सहायता लें',
          'आत्महत्या के विचार आने पर संकट हेल्पलाइन से संपर्क करें',
          'विश्वसनीय दोस्तों या परिवार से संपर्क करें',
          'मनोचिकित्सक से दवा का मूल्यांकन कराएं',
          'इस समय बड़े जीवन निर्णय लेने से बचें'
        ]
      }
    };

    return suggestions[language][riskLevel];
  };

  const suggestions = getSuggestions();

  const handleAnswerChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === undefined) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const resetAssessment = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setShowQuestions(false);
  };

  const startAssessment = () => {
    setShowQuestions(true);
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const exportToPDF = () => {
    const results = {
      type: assessmentType.toUpperCase(),
      score: totalScore,
      maxScore: maxScore,
      level: riskLevel,
      date: new Date().toLocaleDateString(),
      suggestions: suggestions
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `mental-health-assessment-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Touch/swipe handling for mobile
  useEffect(() => {
    let startX: number;
    let startY: number;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only respond to horizontal swipes
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0 && answers[currentQuestion] !== undefined) {
          // Swipe left - next question
          handleNext();
        } else if (diffX < 0 && currentQuestion > 0) {
          // Swipe right - previous question
          handlePrevious();
        }
      }
    };

    if (showQuestions && !showResults) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showQuestions, showResults, currentQuestion, answers]);

  return (
    <section id="assessment" className="py-20 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
            {content[language].title}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {content[language].description}
          </p>
          
          {!showQuestions && !showResults && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  variant={assessmentType === 'phq9' ? 'wellness' : 'outline'}
                  size="lg"
                  onClick={() => setAssessmentType('phq9')}
                  className="flex items-center gap-2 min-h-[44px]"
                >
                  <CheckCircle className="h-5 w-5" />
                  {content[language].assessments.phq9}
                </Button>
                <Button
                  variant={assessmentType === 'gad7' ? 'wellness' : 'outline'}
                  size="lg"
                  onClick={() => setAssessmentType('gad7')}
                  className="flex items-center gap-2 min-h-[44px]"
                >
                  <AlertTriangle className="h-5 w-5" />
                  {content[language].assessments.gad7}
                </Button>
              </div>

              <Button
                variant="wellness"
                size="lg"
                onClick={startAssessment}
                className="flex items-center gap-2 min-h-[44px]"
              >
                <BarChart3 className="h-5 w-5" />
                {content[language].startAssessment}
              </Button>
            </>
          )}
        </div>

        {showQuestions && !showResults ? (
          <Card className="max-w-2xl mx-auto glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{content[language].assessments[assessmentType]}</span>
                <Badge variant="outline">{currentQuestion + 1}/{questions.length}</Badge>
              </CardTitle>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`space-y-4 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                <h3 className="text-lg font-medium text-foreground">
                  {questions[currentQuestion]}
                </h3>
                
                <RadioGroup
                  value={answers[currentQuestion]?.toString()}
                  onValueChange={(value) => handleAnswerChange(parseInt(value))}
                  className="space-y-3"
                >
                  {[0, 1, 2, 3].map((value) => (
                    <div key={value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/50 transition-colors min-h-[44px]">
                      <RadioGroupItem value={value.toString()} id={`answer-${value}`} />
                      <Label 
                        htmlFor={`answer-${value}`} 
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {content[language].scale[value]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 min-h-[44px]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="wellness"
                  onClick={handleNext}
                  disabled={answers[currentQuestion] === undefined}
                  className="flex items-center gap-2 min-h-[44px]"
                >
                  {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : showResults ? (
          <Card className="max-w-2xl mx-auto glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">
                {content[language].results.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-4">
                {/* Circular Progress Score */}
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-secondary"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(totalScore / maxScore) * 251.2} 251.2`}
                      className={riskLevel === 'low' ? 'text-success' : riskLevel === 'medium' ? 'text-warning' : 'text-destructive'}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalScore}</div>
                      <div className="text-xs text-muted-foreground">/{maxScore}</div>
                    </div>
                  </div>
                </div>
                
                <Badge 
                  variant={riskLevel === 'low' ? 'success' : riskLevel === 'medium' ? 'warning' : 'destructive'}
                  className="text-lg px-4 py-2"
                >
                  {content[language].results.levels[riskLevel]}
                </Badge>
              </div>
              
              <div className="bg-secondary/50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">{content[language].results.suggestions}:</h4>
                <ul className="text-left space-y-2 text-sm">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="wellness"
                  size="lg"
                  onClick={onOpenChat}
                  className="flex items-center gap-2 min-h-[44px]"
                >
                  <ArrowRight className="h-5 w-5" />
                  {content[language].results.talkToAI}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={exportToPDF}
                  className="flex items-center gap-2 min-h-[44px]"
                >
                  <Download className="h-4 w-4" />
                  Export Results
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetAssessment}
                  className="min-h-[44px]"
                >
                  {content[language].results.retake}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
};

export default EnhancedAssessmentSection;