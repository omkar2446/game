import { Layout } from '@/components/layout/Layout';
import { GameCard } from '@/components/games/GameCard';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
  Zap
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
];

export default function Index() {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Brain Training</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Train Your Brain,{' '}
              <span className="text-gradient-primary">Have Fun</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 animate-slide-up stagger-1">
              Challenge yourself with our collection of brain games, from IQ tests to 
              AI-generated news quizzes. Track your progress and compete with friends.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-2">
                <Link to="/auth">
                  <Button variant="hero" size="xl">
                    Get Started Free
                  </Button>
                </Link>
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-16">
            {[
              { icon: Trophy, label: 'Games', value: '6+' },
              { icon: Users, label: 'Players', value: '10K+' },
              { icon: Zap, label: 'Questions', value: '1000+' },
            ].map((stat, i) => (
              <div 
                key={stat.label}
                className="text-center p-4 glass rounded-xl animate-slide-up"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Challenge</h2>
          <p className="text-muted-foreground">Select a game and start training your brain</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
