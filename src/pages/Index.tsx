import { Layout } from '@/components/layout/Layout';
import { GameCard } from '@/components/games/GameCard';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GameSelectionModal } from '@/components/GameSelectionModal';
import { updateMetaTags, seoConfig } from '@/lib/seo';

import { 
  Brain, 
  HelpCircle, 
  Smile, 
  Calculator, 
  Sigma, 
  Newspaper,
  Sparkles,
  Trophy,
  Users,
  Zap,
  Car
} from 'lucide-react';

const games = [
  {
    title: 'IQ Test',
    description: 'Challenge your logical thinking with pattern recognition and problem-solving puzzles.',
    icon: Brain,
    href: '/games/iq-test',
    colorClass: 'bg-game-iq',
  },
  {
    title: 'Quiz Master',
    description: 'Test your knowledge across various topics from science to pop culture.',
    icon: HelpCircle,
    href: '/games/quiz',
    colorClass: 'bg-game-quiz',
  },
  {
    title: 'Funny Games',
    description: 'Lighten up with fun mini-games that will make you laugh while thinking.',
    icon: Smile,
    href: '/games/funny',
    colorClass: 'bg-game-funny',
  },
  {
    title: 'Basic Math',
    description: 'Sharpen your arithmetic skills with quick calculation challenges.',
    icon: Calculator,
    href: '/games/math-basic',
    colorClass: 'bg-game-math-basic',
  },
  {
    title: 'Advanced Math',
    description: 'Push your limits with complex equations and mathematical puzzles.',
    icon: Sigma,
    href: '/games/math-advanced',
    colorClass: 'bg-game-math-advanced',
  },
  {
    title: 'Daily News Quiz',
    description: 'AI-generated questions based on today\'s trending news and Wikipedia articles.',
    icon: Newspaper,
    href: '/games/news-quiz',
    colorClass: 'bg-game-news',
  },
  {
    title: 'Car Game',
    description: 'Drive your car and navigate through the streets using arrow keys.',
    icon: Car,
    href: '/car-game',
    colorClass: 'bg-red-600',
  },
];

export default function Index() {
  const { user } = useAuth();
  const [showGameModal, setShowGameModal] = useState(true);

  useEffect(() => {
    // Update meta tags for home page
    updateMetaTags(seoConfig.home);
  }, []);

  return (
    <>
      <GameSelectionModal isOpen={showGameModal} onOpenChange={setShowGameModal} />
      <Layout>
        {/* Hero Section */}
        <section className="relative overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="w-full px-3 sm:px-4 md:px-6 py-8 sm:py-16 md:py-24 mx-auto max-w-full">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass mb-4 sm:mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium">AI-Powered Brain Training</span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 animate-slide-up px-2">
                Train Your Brain,{' '}
                <span className="text-gradient-primary">Have Fun</span>
              </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 animate-slide-up stagger-1">
              Challenge yourself with our collection of brain games, from IQ tests to 
              AI-generated news quizzes. Track your progress and compete with friends.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center animate-slide-up stagger-2">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto mt-8 sm:mt-16 px-2">
            {[
              { icon: Trophy, label: 'Games', value: '7+' },
              { icon: Users, label: 'Players', value: '10K+' },
              { icon: Zap, label: 'Questions', value: '1000+' },
            ].map((stat, i) => (
              <div 
                key={stat.label}
                className="text-center p-2 sm:p-4 glass rounded-xl animate-slide-up"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <stat.icon className="w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
                <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="w-full px-3 sm:px-4 md:px-6 py-8 sm:py-12 mx-auto max-w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 px-2">Choose Your Challenge</h2>
          <p className="text-sm sm:text-base text-muted-foreground px-2">Select a game and start training your brain</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 auto-rows-max">
          {games.map((game, i) => (
            <GameCard 
              key={game.title}
              {...game}
              delay={i * 100}
            />
          ))}
        </div>
      </section>
      </Layout>
    </>
  );
}
