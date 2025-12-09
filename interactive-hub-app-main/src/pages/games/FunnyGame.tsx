import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Smile, RotateCcw, Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const emojis = ['🎯', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎮'];

export default function FunnyGame() {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [gameOver, setGameOver] = useState(false);

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

  useEffect(() => {
    let spawnTimer: NodeJS.Timeout;
    if (isPlaying) {
      spawnTimer = setInterval(() => {
        spawnTarget();
      }, 800);
    }
    return () => clearInterval(spawnTimer);
  }, [isPlaying]);

  const spawnTarget = () => {
    const newTarget = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    };
    setTargets((prev) => [...prev.slice(-5), newTarget]);
  };

  const hitTarget = (id: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setScore((prev) => prev + 10);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setGameOver(false);
  };

  const endGame = async () => {
    setIsPlaying(false);
    setGameOver(true);
    setTargets([]);

    if (user) {
      try {
        await supabase.from('game_scores').insert({
          user_id: user.id,
          game_type: 'funny',
          score: score,
        });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-game-funny flex items-center justify-center">
            <Smile className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Emoji Catch</h1>
            <p className="text-muted-foreground">Click the emojis as fast as you can!</p>
          </div>
        </div>

        <Card variant="glass" className="animate-slide-up">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-game-funny" />
                {isPlaying ? 'Catch them all!' : gameOver ? 'Game Over!' : 'Ready?'}
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
                <div className="text-6xl mb-6">🎮</div>
                <p className="text-lg text-muted-foreground mb-6">
                  Click on the emojis as they appear. The faster you click, the higher your score!
                </p>
                <Button variant="hero" size="lg" onClick={startGame}>
                  Start Game
                </Button>
              </div>
            ) : gameOver ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-game-funny/20 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-game-funny" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Great Job!</h2>
                <p className="text-muted-foreground mb-4">You caught {score / 10} emojis!</p>
                <div className="text-5xl font-bold text-gradient-accent mb-6">
                  {score} points
                </div>
                <Button variant="hero" onClick={startGame}>
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </Button>
              </div>
            ) : (
              <div 
                className="relative bg-secondary/30 rounded-xl overflow-hidden"
                style={{ height: '400px' }}
              >
                {targets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => hitTarget(target.id)}
                    className={cn(
                      "absolute text-4xl cursor-pointer transition-all duration-200",
                      "hover:scale-125 active:scale-90 animate-bounce"
                    )}
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {target.emoji}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
