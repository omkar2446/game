import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";

interface Enemy {
  x: number;
  y: number;
}

export default function CarGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef({
    active: true,
    playerX: 175,
    playerY: 500,
    score: 0,
    frame: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize
    canvas.width = 350;
    canvas.height = 600;

    const enemies: Enemy[] = [];
    const keys: Record<string, boolean> = {};
    let audioContext: AudioContext | null = null;

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      // Audio context not available
    }

    // Audio functions
    const playSound = (freq: number, duration: number) => {
      if (!audioContext) return;
      try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        osc.start();
        osc.stop(audioContext.currentTime + duration);
      } catch (e) {}
    };

    // Event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX < canvas.width / 2) {
        keys["left"] = true;
      } else {
        keys["right"] = true;
      }
    };

    const handleTouchEnd = () => {
      keys["left"] = false;
      keys["right"] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    // Main game loop
    const animate = () => {
      if (!gameRef.current.active) return;

      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road lanes
      ctx.strokeStyle = "#ffff00";
      ctx.setLineDash([20, 10]);
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 3 + i * 40, 0);
        ctx.lineTo(canvas.width / 3 + i * 40, canvas.height);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw road borders
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(10, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvas.width - 10, 0);
      ctx.lineTo(canvas.width - 10, canvas.height);
      ctx.stroke();

      // Player movement
      if (keys["arrowleft"] || keys["a"]) gameRef.current.playerX -= 6;
      if (keys["arrowright"] || keys["d"]) gameRef.current.playerX += 6;
      if (keys["left"]) gameRef.current.playerX -= 6;
      if (keys["right"]) gameRef.current.playerX += 6;

      // Keep player in bounds
      gameRef.current.playerX = Math.max(15, Math.min(canvas.width - 65, gameRef.current.playerX));

      // Draw player car (green)
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(gameRef.current.playerX, gameRef.current.playerY, 50, 70);
      ctx.fillStyle = "#87ceeb";
      ctx.fillRect(gameRef.current.playerX + 5, gameRef.current.playerY + 5, 40, 15);
      ctx.fillRect(gameRef.current.playerX + 5, gameRef.current.playerY + 45, 40, 15);

      // Spawn enemies
      if (gameRef.current.frame > 30 && Math.random() < 0.012) {
        const lanes = [50, 150, 250];
        enemies.push({
          x: lanes[Math.floor(Math.random() * lanes.length)],
          y: -80
        });
      }

      // Update and draw enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += 2.5;

        // Draw enemy car (red)
        ctx.fillStyle = "#ff3333";
        ctx.fillRect(enemies[i].x, enemies[i].y, 50, 70);
        ctx.fillStyle = "#ffff00";
        ctx.fillRect(enemies[i].x + 5, enemies[i].y + 5, 40, 15);
        ctx.fillRect(enemies[i].x + 5, enemies[i].y + 45, 40, 15);

        // Check collision - ONLY trigger if truly overlapping
        const playerRect = {
          left: gameRef.current.playerX + 5,
          right: gameRef.current.playerX + 45,
          top: gameRef.current.playerY + 5,
          bottom: gameRef.current.playerY + 65
        };

        const enemyRect = {
          left: enemies[i].x + 5,
          right: enemies[i].x + 45,
          top: enemies[i].y + 5,
          bottom: enemies[i].y + 65
        };

        if (
          playerRect.right > enemyRect.left &&
          playerRect.left < enemyRect.right &&
          playerRect.bottom > enemyRect.top &&
          playerRect.top < enemyRect.bottom
        ) {
          // Collision detected
          playSound(100, 0.3);
          gameRef.current.active = false;
          setScore(gameRef.current.score);
          setGameOver(true);
          return;
        }

        // Remove off-screen enemies and add score
        if (enemies[i].y > canvas.height) {
          enemies.splice(i, 1);
          gameRef.current.score += 10;
          setScore(gameRef.current.score);
          playSound(600, 0.1);
        }
      }

      // Draw score
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`Score: ${gameRef.current.score}`, 20, 40);

      gameRef.current.frame++;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    window.location.reload();
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-2 sm:p-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          🚗 Avoid Traffic
        </h1>

        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border-4 border-yellow-400 rounded-lg bg-gray-800 touch-none"
          />

          {gameOver && (
            <div className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center flex-col gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-red-500">Game Over!</h2>
              <p className="text-xl sm:text-2xl text-yellow-400">Score: {score}</p>
              <button
                onClick={handleRestart}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-bold text-base sm:text-lg hover:scale-105 transition-transform"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-xs sm:text-sm mt-3 sm:mt-4 max-w-sm">
          <p className="mb-1 font-semibold">⬅️ Arrow Keys or A/D to Move ➡️</p>
          <p className="text-yellow-300">Tap left/right on mobile • Dodge incoming cars!</p>
        </div>
      </div>
    </Layout>
  );
}
