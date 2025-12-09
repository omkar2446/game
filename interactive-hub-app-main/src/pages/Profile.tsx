import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { User, Loader2, Trophy, Gamepad2, TrendingUp } from 'lucide-react';

interface GameScore {
  id: string;
  game_type: string;
  score: number;
  created_at: string;
}

const gameTypeLabels: Record<string, string> = {
  'iq-test': 'IQ Test',
  'quiz': 'Quiz Master',
  'funny': 'Emoji Catch',
  'math-basic': 'Basic Math',
  'math-advanced': 'Advanced Math',
  'news-quiz': 'News Quiz',
};

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [scores, setScores] = useState<GameScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchScores();
    }
  }, [user]);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const totalScore = scores.reduce((acc, s) => acc + s.score, 0);
  const gamesPlayed = scores.length;
  const averageScore = gamesPlayed > 0 ? Math.round(totalScore / gamesPlayed) : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="gradient" className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Score</p>
                  <p className="text-3xl font-bold mt-1">{totalScore}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="gradient" className="animate-slide-up stagger-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Games Played</p>
                  <p className="text-3xl font-bold mt-1">{gamesPlayed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-game-quiz/20 flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-game-quiz" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="gradient" className="animate-slide-up stagger-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Average Score</p>
                  <p className="text-3xl font-bold mt-1">{averageScore}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Games */}
        <Card variant="glass" className="animate-slide-up stagger-3">
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : scores.length === 0 ? (
              <div className="text-center py-8">
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No games played yet. Start playing!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scores.map((score) => (
                  <div 
                    key={score.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium">{gameTypeLabels[score.game_type] || score.game_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(score.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {score.score} pts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
