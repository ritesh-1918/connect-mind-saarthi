import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Brain, Zap, RotateCcw, Play, Pause } from 'lucide-react';

interface GamesSectionProps {
  language: 'en' | 'hi';
}

const GamesSection = ({ language }: GamesSectionProps) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [scores, setScores] = useState({ breathing: 0, puzzle: 0, stress: 0 });

  const content = {
    en: {
      title: 'Wellness Games',
      subtitle: 'Interactive games to help manage stress and anxiety',
      games: {
        breathing: {
          title: 'Breathing Exercise',
          description: 'Follow the guided breathing pattern to relax',
          instruction: 'Breathe in and out with the circle'
        },
        puzzle: {
          title: 'Focus Puzzle',
          description: 'Memory matching game to improve concentration',
          instruction: 'Match the colored patterns'
        },
        stress: {
          title: 'Stress Relief',
          description: 'Tap bubbles to release stress and tension',
          instruction: 'Tap the bubbles to pop them'
        }
      },
      actions: {
        start: 'Start Game',
        reset: 'Reset',
        score: 'Score'
      }
    },
    hi: {
      title: 'वेलनेस गेम्स',
      subtitle: 'तनाव और चिंता को प्रबंधित करने के लिए इंटरैक्टिव गेम्स',
      games: {
        breathing: {
          title: 'सांस लेने का अभ्यास',
          description: 'आराम करने के लिए निर्देशित सांस लेने के पैटर्न का पालन करें',
          instruction: 'सर्कल के साथ सांस अंदर और बाहर लें'
        },
        puzzle: {
          title: 'फोकस पज़ल',
          description: 'एकाग्रता में सुधार के लिए मेमोरी मैचिंग गेम',
          instruction: 'रंगीन पैटर्न का मिलान करें'
        },
        stress: {
          title: 'तनाव मुक्ति',
          description: 'तनाव और तनाव को मुक्त करने के लिए बुलबुले पर टैप करें',
          instruction: 'बुलबुलों को फोड़ने के लिए टैप करें'
        }
      },
      actions: {
        start: 'गेम शुरू करें',
        reset: 'रीसेट',
        score: 'स्कोर'
      }
    }
  };

  const BreathingGame = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
    const [cycles, setCycles] = useState(0);

    useEffect(() => {
      if (!isActive) return;

      const interval = setInterval(() => {
        setPhase(prev => {
          if (prev === 'inhale') {
            return 'exhale';
          } else {
            setCycles(c => c + 1);
            return 'inhale';
          }
        });
      }, 4000);

      return () => clearInterval(interval);
    }, [isActive]);

    return (
      <div className="text-center space-y-6">
        <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full border-4 border-primary transition-all duration-4000 ease-in-out ${
              phase === 'inhale' 
                ? 'scale-100 bg-primary/20' 
                : 'scale-75 bg-primary/10'
            }`}
          />
          <div className="text-lg font-medium text-primary">
            {phase === 'inhale' ? (language === 'en' ? 'Breathe In' : 'सांस अंदर लें') : (language === 'en' ? 'Breathe Out' : 'सांस छोड़ें')}
          </div>
        </div>
        
        <div className="space-y-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {content[language].actions.score}: {cycles}
          </Badge>
          
          <div className="flex gap-2 justify-center">
            <Button
              variant={isActive ? "secondary" : "wellness"}
              onClick={() => setIsActive(!isActive)}
              className="min-h-[44px]"
            >
              {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isActive ? 'Pause' : content[language].actions.start}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setIsActive(false);
                setCycles(0);
                setPhase('inhale');
              }}
              className="min-h-[44px]"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {content[language].actions.reset}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const PuzzleGame = () => {
    const [cards, setCards] = useState<{ id: number; color: string; isFlipped: boolean; isMatched: boolean }[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matches, setMatches] = useState(0);
    const [started, setStarted] = useState(false);

    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

    const initializeGame = () => {
      const gameCards = [];
      for (let i = 0; i < 6; i++) {
        gameCards.push(
          { id: i * 2, color: colors[i], isFlipped: false, isMatched: false },
          { id: i * 2 + 1, color: colors[i], isFlipped: false, isMatched: false }
        );
      }
      setCards(gameCards.sort(() => Math.random() - 0.5));
      setFlippedCards([]);
      setMatches(0);
      setStarted(true);
    };

    const handleCardClick = (id: number) => {
      if (flippedCards.length === 2 || cards.find(c => c.id === id)?.isFlipped) return;

      const newCards = cards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      );
      setCards(newCards);

      const newFlipped = [...flippedCards, id];
      setFlippedCards(newFlipped);

      if (newFlipped.length === 2) {
        const [first, second] = newFlipped;
        const firstCard = newCards.find(c => c.id === first);
        const secondCard = newCards.find(c => c.id === second);

        if (firstCard?.color === secondCard?.color) {
          setTimeout(() => {
            setCards(prev => prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            ));
            setMatches(m => m + 1);
            setFlippedCards([]);
          }, 500);
        } else {
          setTimeout(() => {
            setCards(prev => prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            ));
            setFlippedCards([]);
          }, 1000);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Badge variant="outline" className="text-lg px-4 py-2 mb-4">
            {content[language].actions.score}: {matches}/6
          </Badge>
        </div>

        {!started ? (
          <div className="text-center">
            <Button
              variant="wellness"
              onClick={initializeGame}
              className="min-h-[44px]"
            >
              <Play className="mr-2 h-4 w-4" />
              {content[language].actions.start}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`aspect-square rounded-lg border-2 border-border cursor-pointer transition-all duration-300 min-h-[44px] flex items-center justify-center ${
                    card.isFlipped || card.isMatched
                      ? 'opacity-100'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  style={{
                    backgroundColor: card.isFlipped || card.isMatched ? card.color : undefined
                  }}
                  onClick={() => handleCardClick(card.id)}
                />
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setStarted(false)}
                className="min-h-[44px]"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {content[language].actions.reset}
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  const StressReliefGame = () => {
    const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
    const [poppedCount, setPoppedCount] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const gameAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isActive) return;

      const interval = setInterval(() => {
        if (gameAreaRef.current) {
          const newBubble = {
            id: Date.now(),
            x: Math.random() * (gameAreaRef.current.offsetWidth - 60),
            y: Math.random() * (gameAreaRef.current.offsetHeight - 60),
            size: 30 + Math.random() * 30
          };
          setBubbles(prev => [...prev, newBubble]);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [isActive]);

    const popBubble = (id: number) => {
      setBubbles(prev => prev.filter(bubble => bubble.id !== id));
      setPoppedCount(count => count + 1);
    };

    const resetGame = () => {
      setIsActive(false);
      setBubbles([]);
      setPoppedCount(0);
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Badge variant="outline" className="text-lg px-4 py-2 mb-4">
            {content[language].actions.score}: {poppedCount}
          </Badge>
        </div>

        <div
          ref={gameAreaRef}
          className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg border-2 border-border overflow-hidden"
        >
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute rounded-full bg-blue-400/60 border-2 border-blue-300 cursor-pointer hover:scale-110 transition-transform duration-200 animate-bounce"
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                minWidth: '44px',
                minHeight: '44px'
              }}
              onClick={() => popBubble(bubble.id)}
            />
          ))}
          
          {!isActive && bubbles.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              {language === 'en' ? 'Click Start to begin popping bubbles!' : 'बुलबुले फोड़ना शुरू करने के लिए स्टार्ट पर क्लिक करें!'}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            variant={isActive ? "secondary" : "wellness"}
            onClick={() => setIsActive(!isActive)}
            className="min-h-[44px]"
          >
            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isActive ? 'Pause' : content[language].actions.start}
          </Button>
          
          <Button
            variant="outline"
            onClick={resetGame}
            className="min-h-[44px]"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {content[language].actions.reset}
          </Button>
        </div>
      </div>
    );
  };

  const renderActiveGame = () => {
    switch (activeGame) {
      case 'breathing':
        return <BreathingGame />;
      case 'puzzle':
        return <PuzzleGame />;
      case 'stress':
        return <StressReliefGame />;
      default:
        return null;
    }
  };

  return (
    <section id="games" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
            {content[language].title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {content[language].subtitle}
          </p>
        </div>

        {!activeGame ? (
          <div className="grid md:grid-cols-3 gap-6">
            <Card 
              className="glass hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => setActiveGame('breathing')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wind className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-center">
                  {content[language].games.breathing.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  {content[language].games.breathing.description}
                </p>
                <Button variant="wellness" className="w-full min-h-[44px]">
                  {content[language].actions.start}
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="glass hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => setActiveGame('puzzle')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-center">
                  {content[language].games.puzzle.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  {content[language].games.puzzle.description}
                </p>
                <Button variant="wellness" className="w-full min-h-[44px]">
                  {content[language].actions.start}
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="glass hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => setActiveGame('stress')}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-center">
                  {content[language].games.stress.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  {content[language].games.stress.description}
                </p>
                <Button variant="wellness" className="w-full min-h-[44px]">
                  {content[language].actions.start}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto glass border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {content[language].games[activeGame as keyof typeof content[typeof language]['games']].title}
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setActiveGame(null)}
                  className="min-h-[44px] min-w-[44px]"
                >
                  ←
                </Button>
              </div>
              <p className="text-muted-foreground">
                {content[language].games[activeGame as keyof typeof content[typeof language]['games']].instruction}
              </p>
            </CardHeader>
            <CardContent>
              {renderActiveGame()}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default GamesSection;