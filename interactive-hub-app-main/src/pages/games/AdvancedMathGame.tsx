import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Sigma, RotateCcw, Trophy, Flame } from 'lucide-react';

const generateAdvancedQuestion = () => {
  const types = ['equation', 'square', 'percentage', 'division'];
  const type = types[Math.floor(Math.random() * types.length)];
  let question: string, answer: number;

  switch (type) {
    case 'equation': {
      const x = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 20) + 5;
      const result = x * 2 + b;
      question = `If 2x + ${b} = ${result}, what is x?`;
      answer = x;
      break;
    }
    case 'square': {
      const num = Math.floor(Math.random() * 12) + 3;
      question = `What is ${num}²?`;
      answer = num * num;
      break;
    }
    case 'percentage': {
      const base = [100, 200, 150, 250, 50][Math.floor(Math.random() * 5)];
      const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      question = `What is ${percent}% of ${base}?`;
      answer = (base * percent) / 100;
      break;
    }
    case 'division': {
      const divisor = Math.floor(Math.random() * 10) + 2;
      const quotient = Math.floor(Math.random() * 15) + 5;
      const dividend = divisor * quotient;
      question = `${dividend} ÷ ${divisor} = ?`;
      answer = quotient;
      break;
    }
    default:
      question = '5 + 5';
      answer = 10;
  }

  return { question, answer };
};

export default function AdvancedMathGame() {
  const { user } = useAuth();
  const [currentProblem, setCurrentProblem] = useState(generateAdvancedQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => {
      if (timer !== undefined) {
        clearInterval(timer as unknown as number);
      }
    };
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setTimeLeft(90);
    setCurrentProblem(generateAdvancedQuestion());
    setUserAnswer('');
    setFeedback(null);
  };

  const endGame = async () => {
    setIsPlaying(false);

    if (user && score > 0) {
      try {
        await supabase.from('game_scores').insert({
          user_id: user.id,
          game_type: 'math-advanced',
          score: score,
        });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPlaying || !userAnswer) return;

    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      const bonus = Math.min(streak, 5) * 5;
      setScore(score + 20 + bonus);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);

    setTimeout(() => {
      setCurrentProblem(generateAdvancedQuestion());
      setUserAnswer('');
      setFeedback(null);
    }, 600);
  };

  const gameOver = !isPlaying && questionsAnswered > 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-game-math-advanced flex items-center justify-center">
            <Sigma className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Advanced Math</h1>
            <p className="text-muted-foreground">Complex equations & puzzles</p>
          </div>
        </div>

        <Card variant="glass" className="animate-slide-up">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-game-math-advanced" />
                {isPlaying ? 'Challenge Mode!' : gameOver ? 'Time\'s Up!' : 'Ready?'}
              </CardTitle>
              <div className="flex items-center gap-4">
                {streak > 0 && (
                  <span className="text-sm font-bold text-accent">
                    🔥 {streak} streak
                  </span>
                )}
                <span className="text-lg font-bold">⏱️ {timeLeft}s</span>
                <span className="text-lg font-bold text-primary">🎯 {score}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isPlaying && !gameOver ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🧠</div>
                <p className="text-lg text-muted-foreground mb-4">
                  Tackle advanced math problems with equations, squares, percentages & more!
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Build streaks for bonus points!
                </p>
                <Button variant="accent" size="lg" onClick={startGame}>
                  Start Challenge
                </Button>
              </div>
            ) : gameOver ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-game-math-advanced/20 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-game-math-advanced" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Impressive!</h2>
                <p className="text-muted-foreground mb-4">
                  You solved {questionsAnswered} problems
                </p>
                <div className="text-5xl font-bold text-gradient-accent mb-6">
                  {score} points
                </div>
                <Button variant="accent" onClick={startGame}>
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </Button>
              </div>
            ) : (
              <div className="space-y-8 py-8">
                <div 
                  className={`text-center p-8 rounded-2xl transition-colors duration-300 ${
                    feedback === 'correct' ? 'bg-green-500/20' : 
                    feedback === 'wrong' ? 'bg-destructive/20' : 
                    'bg-secondary/50'
                  }`}
                >
                  <p className="text-2xl font-bold">
                    {currentProblem.question}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-4">
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="text-center text-2xl h-14"
                    autoFocus
                  />
                  <Button type="submit" variant="accent" size="lg">
                    Submit
                  </Button>
                </form>

                <div className="text-center text-muted-foreground">
                  Questions answered: {questionsAnswered}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
