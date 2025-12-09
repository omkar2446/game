import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Sigma, RotateCcw, Trophy, Flame } from 'lucide-react';

/* -----------------------------------
   ADVANCED QUESTION GENERATOR BY LEVEL
------------------------------------ */
const generateAdvancedQuestion = (level: number) => {
  const difficulty = level * 5;
  const types = ['equation', 'square', 'percentage', 'division'];
  const type = types[Math.floor(Math.random() * types.length)];

  let question: string, answer: number;

  switch (type) {
    case 'equation': {
      const x = Math.floor(Math.random() * difficulty) + 2;
      const b = Math.floor(Math.random() * (difficulty + 10)) + 5;
      const result = x * 2 + b;
      question = `If 2x + ${b} = ${result}, what is x?`;
      answer = x;
      break;
    }

    case 'square': {
      const num = Math.floor(Math.random() * (difficulty / 2)) + 5;
      question = `What is ${num}²?`;
      answer = num * num;
      break;
    }

    case 'percentage': {
      const base = Math.floor(Math.random() * (difficulty * 10)) + 50;
      const percent = [10, 20, 25, 30, 40, 50][Math.floor(Math.random() * 6)];
      question = `What is ${percent}% of ${base}?`;
      answer = (base * percent) / 100;
      break;
    }

    case 'division': {
      const divisor = Math.floor(Math.random() * level) + 2;
      const quotient = Math.floor(Math.random() * (difficulty / 2)) + 5;
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

/* -----------------------------------
            MAIN GAME COMPONENT
----------------------------------- */

export default function AdvancedMathGame() {
  const { user } = useAuth();

  const [level, setLevel] = useState(1);
  const [currentProblem, setCurrentProblem] = useState(generateAdvancedQuestion(1));
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0); // 0–9 (10 questions per level)
  const [timeLeft, setTimeLeft] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const TOTAL_LEVELS = 10;
  const QUESTIONS_PER_LEVEL = 10;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isPlaying) {
      endGame();
    }

    return () => timer && clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setStreak(0);
    setQuestionIndex(0);
    setTimeLeft(90);
    setIsPlaying(true);
    setFeedback(null);
    setCurrentProblem(generateAdvancedQuestion(1));
    setUserAnswer('');
  };

  const nextStep = () => {
    if (questionIndex + 1 < QUESTIONS_PER_LEVEL) {
      setQuestionIndex(questionIndex + 1);
      setCurrentProblem(generateAdvancedQuestion(level));
    } else {
      if (level < TOTAL_LEVELS) {
        setLevel(level + 1);
        setQuestionIndex(0);
        setCurrentProblem(generateAdvancedQuestion(level + 1));
      } else {
        endGame();
      }
    }
  };

  const endGame = async () => {
    setIsPlaying(false);

    if (user && score > 0) {
      try {
        await supabase.from('game_scores').insert({
          user_id: user.id,
          game_type: 'math-advanced',
          score,
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

    setTimeout(() => {
      setUserAnswer('');
      setFeedback(null);
      nextStep();
    }, 600);
  };

  const gameOver = !isPlaying && (level > 1 || questionIndex > 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-game-math-advanced flex items-center justify-center">
            <Sigma className="w-6 h-6 text-primary-foreground" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Advanced Math</h1>
            <p className="text-muted-foreground">Level-based problem solving</p>
          </div>
        </div>

        {/* Card: removed variant prop and use className for styling */}
        <Card className="animate-slide-up bg-background/60 backdrop-blur border border-border/50">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-game-math-advanced" />
                <span className="text-lg font-semibold">
                  {isPlaying ? `Level ${level}` : gameOver ? 'Finished!' : 'Ready?'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {streak > 0 && <span className="text-accent">🔥 {streak}</span>}
                <span className="text-lg">⏱ {timeLeft}s</span>
                <span className="text-lg font-bold">🎯 {score}</span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Start Screen */}
            {!isPlaying && !gameOver && (
              <div className="text-center py-12">
                <p className="text-xl mb-4">10 Levels • 10 Questions Each</p>

                {/* Button: removed variant prop and replaced with className */}
                <button
                  onClick={startGame}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-lg font-semibold bg-accent text-white hover:opacity-90"
                >
                  Start Challenge
                </button>
              </div>
            )}

            {/* Game Over */}
            {gameOver && !isPlaying && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-game-math-advanced" />
                <h2 className="text-3xl font-bold">Great job!</h2>
                <p>You reached Level {level}</p>
                <p className="text-4xl font-bold mt-2">{score} points</p>

                <button
                  onClick={startGame}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-white font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </button>
              </div>
            )}

            {/* Active Game */}
            {isPlaying && (
              <div className="space-y-8 py-8">
                <div
                  className={`text-center p-6 rounded-xl ${
                    feedback === 'correct'
                      ? 'bg-green-500/20'
                      : feedback === 'wrong'
                      ? 'bg-red-500/20'
                      : 'bg-secondary/50'
                  }`}
                >
                  <p className="text-2xl font-bold">{currentProblem.question}</p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Question {questionIndex + 1} / {QUESTIONS_PER_LEVEL}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-4">
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="text-center text-xl h-14"
                    autoFocus
                  />

                  {/* Button replaced with a plain button element styled via className */}
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-lg bg-accent text-white font-semibold text-lg"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
