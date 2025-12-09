import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Calculator, RotateCcw, Trophy, Zap } from 'lucide-react';

const generateQuestion = () => {
  const operations = ['+', '-', '×'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let a: number, b: number, answer: number;

  switch (operation) {
    case '+':
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a - b;
      break;
    case '×':
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      break;
    default:
      a = 1;
      b = 1;
      answer = 2;
  }

  return { question: `${a} ${operation} ${b}`, answer };
};

export default function BasicMathGame() {
  const { user } = useAuth();
  const [currentProblem, setCurrentProblem] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setQuestionsAnswered(0);
    setTimeLeft(60);
    setCurrentProblem(generateQuestion());
    setUserAnswer('');
    setFeedback(null);
  };

  const endGame = async () => {
    setIsPlaying(false);

    if (user && score > 0) {
      try {
        await supabase.from('game_scores').insert({
          user_id: user.id,
          game_type: 'math-basic',
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
      setScore(score + 10);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);

    setTimeout(() => {
      setCurrentProblem(generateQuestion());
      setUserAnswer('');
      setFeedback(null);
    }, 500);
  };

  const gameOver = !isPlaying && questionsAnswered > 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-game-math-basic flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Basic Math</h1>
            <p className="text-muted-foreground">Quick arithmetic challenges</p>
          </div>
        </div>

        <Card variant="glass" className="animate-slide-up">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-game-math-basic" />
                {isPlaying ? 'Solve Fast!' : gameOver ? 'Time\'s Up!' : 'Ready?'}
              </CardTitle>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold">⏱️ {timeLeft}s</span>
                <span className="text-lg font-bold text-primary">🎯 {score}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isPlaying && !gameOver ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🧮</div>
                <p className="text-lg text-muted-foreground mb-6">
                  Solve as many math problems as you can in 60 seconds!
                </p>
                <Button variant="hero" size="lg" onClick={startGame}>
                  Start Game
                </Button>
              </div>
            ) : gameOver ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-game-math-basic/20 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-game-math-basic" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Great Work!</h2>
                <p className="text-muted-foreground mb-4">
                  You answered {questionsAnswered} questions
                </p>
                <div className="text-5xl font-bold text-gradient-primary mb-6">
                  {score} points
                </div>
                <Button variant="hero" onClick={startGame}>
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
                  <p className="text-5xl font-bold">
                    {currentProblem.question} = ?
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
                  <Button type="submit" variant="hero" size="lg">
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
