import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Smile,
  Sigma,
  HelpCircle,
  Newspaper,
  Calculator,
} from 'lucide-react';

interface GameOption {
  title: string;
  icon: React.ElementType;
  href: string;
  colorGradient: string;
}

const gameOptions: GameOption[] = [
  {
    title: 'Funny Game',
    icon: Smile,
    href: '/games/funny',
    colorGradient: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Advanced Math Game',
    icon: Sigma,
    href: '/games/math-advanced',
    colorGradient: 'from-purple-500 to-indigo-500',
  },
  {
    title: 'Quiz Game',
    icon: HelpCircle,
    href: '/games/quiz',
    colorGradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Daily Newspaper Questions',
    icon: Newspaper,
    href: '/games/news-quiz',
    colorGradient: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Basic Math Game',
    icon: Calculator,
    href: '/games/math-basic',
    colorGradient: 'from-green-500 to-emerald-500',
  },
];

interface GameSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameSelectionModal({ isOpen, onOpenChange }: GameSelectionModalProps) {
  const navigate = useNavigate();

  const handleGameSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-2xl md:max-w-4xl w-[95vw] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center py-2 sm:py-4">
            What do you want to play today?
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 pt-2 sm:pt-4 pb-4 sm:pb-6">
          {gameOptions.map((game, index) => {
            const Icon = game.icon;
            return (
              <button
                key={index}
                onClick={() => handleGameSelect(game.href)}
                className={`group relative h-32 sm:h-40 md:h-48 lg:h-56 cursor-pointer overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br ${game.colorGradient} shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl`}
              >
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300"></div>

                {/* Card content */}
                <div className="relative h-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 text-center">
                  {/* Icon */}
                  <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                    <Icon className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white group-hover:text-yellow-100 transition-colors duration-300 line-clamp-2">
                    {game.title}
                  </h3>

                  {/* Play indicator */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-semibold hidden sm:block">
                    Play →
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center text-gray-400 text-xs sm:text-sm pb-2">
          Click any game to start playing
        </div>
      </DialogContent>
    </Dialog>
  );
}
