import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Smile, RotateCcw, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// FUNNY EMOJIS + EXPLOSION EFFECT
const emojis = ["🎯", "🎪", "🎭", "🎨", "🎬", "🎤", "🎧", "🎮", "💥", "🤣", "🐵"];

const funnyMessages = [
  "💥 Boom! Nice hit!",
  "🤣 LOL that emoji didn’t expect that!",
  "🐵 Monkey mode activated!",
  "🔥 You’re too fast!",
  "😱 OMG you're insane!",
  "🎉 Emoji slayer detected!",
];

export default function FunnyGame() {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targets, setTargets] = useState<
    { id: number; x: number; y: number; emoji: string }[]
  >([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // SOUND EFFECTS
  const popSound = useRef<HTMLAudioElement | null>(null);
  const bgMusic = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popSound.current = new Audio("/sounds/pop.mp3");
    bgMusic.current = new Audio("/sounds/fun-music.mp3");
    bgMusic.current.loop = true;
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    let spawnTimer: NodeJS.Timeout;
    if (isPlaying) {
      spawnTimer = setInterval(spawnTarget, 700);
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
    popSound.current?.play();

    setTargets((prev) => prev.filter((t) => t.id !== id));
    setScore((prev) => prev + 10);

    // funny message popup
    setMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
    setTimeout(() => setMessage(null), 800);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setGameOver(false);

    bgMusic.current?.play();
  };

  const endGame = async () => {
    setIsPlaying(false);
    setGameOver(true);
    setTargets([]);

    bgMusic.current?.pause();

    if (user) {
      try {
        await supabase.from("game_scores").insert({
          user_id: user.id,
          game_type: "funny",
          score: score,
        });
      } catch (err) {
        console.error("Error saving score:", err);
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
            <p className="text-muted-foreground">
              Click emojis fast — they’re running away 😂
            </p>
          </div>
        </div>

        {/* FIXED: NO VARIANT PROP */}
        <Card className="animate-slide-up bg-background/60 backdrop-blur border border-border/40 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                <Target className="w-5 h-5 inline-block mr-2 text-game-funny" />
                {isPlaying ? "Catch them all!" : gameOver ? "Game Over!" : "Ready?"}
              </CardTitle>
              <div className="flex gap-6">
                <span className="text-lg">⏱️ {timeLeft}s</span>
                <span className="text-lg font-bold">🎯 {score}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {!isPlaying && !gameOver && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤣</div>
                <p className="text-lg text-muted-foreground mb-6">
                  Try to click emojis — they run fast 😂
                </p>
                <Button size="lg" className="bg-accent text-white" onClick={startGame}>
                  Start Game
                </Button>
              </div>
            )}

            {gameOver && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-game-funny mb-3" />
                <h2 className="text-3xl font-bold">Awesome!</h2>
                <p>You caught {score / 10} emojis 🥳</p>
                <div className="text-4xl font-bold mt-4">{score} points</div>

                <Button className="mt-6 bg-accent text-white" onClick={startGame}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            )}

            {isPlaying && (
              <div
                className="relative bg-secondary/30 rounded-xl overflow-hidden border border-border/20"
                style={{ height: "400px" }}
              >
                {/* funny popup text */}
                {message && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl animate-pulse font-bold">
                    {message}
                  </div>
                )}

                {/* EMOJI TARGETS */}
                {targets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => hitTarget(t.id)}
                    className={cn(
                      "absolute text-4xl transition-all duration-150",
                      "hover:scale-150 active:scale-75",
                      "animate-wiggle"
                    )}
                    style={{
                      left: `${t.x}%`,
                      top: `${t.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {t.emoji}
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
