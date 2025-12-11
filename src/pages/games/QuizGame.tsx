import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { HelpCircle, ArrowRight, RotateCcw, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateMetaTags, seoConfig } from '@/lib/seo';

const questions = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct: 2,
    category: 'Geography',
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Leonardo da Vinci', 'Picasso', 'Michelangelo'],
    correct: 1,
    category: 'Art',
  },
  {
    question: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'],
    correct: 2,
    category: 'Science',
  },
  {
    question: 'In what year did World War II end?',
    options: ['1943', '1944', '1945', '1946'],
    correct: 2,
    category: 'History',
  },
  {
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct: 2,
    category: 'Chemistry',
  },
];

export default function QuizGame() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    // Update meta tags for Quiz game page
    updateMetaTags(seoConfig.quiz);
  }, []);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      
      if (user) {
        try {
          await supabase.from('game_scores').insert({
            user_id: user.id,
            game_type: 'quiz',
            score: score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0),
          });
        } catch (error) {
          console.error('Error saving score:', error);
        }
      }
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
  };

  const finalScore = score + (selectedAnswer === questions[currentQuestion]?.correct ? 1 : 0);
  const percentage = Math.round((finalScore / questions.length) * 100);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-game-quiz flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Quiz Master</h1>
            <p className="text-muted-foreground">Test your knowledge</p>
          </div>
        </div>

        {!gameComplete ? (
          <Card variant="glass" className="animate-slide-up">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-primary font-medium uppercase tracking-wide">
                    {questions[currentQuestion].category}
                  </span>
                  <CardTitle className="text-lg mt-1">
                    Question {currentQuestion + 1} of {questions.length}
                  </CardTitle>
                </div>
                <span className="text-sm text-muted-foreground">
                  Score: {score}
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full mt-4">
                <div 
                  className="h-full bg-game-quiz rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xl font-medium">
                {questions[currentQuestion].question}
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="game"
                    className={cn(
                      "justify-start h-auto py-4 px-6 text-left",
                      selectedAnswer === index && showResult && (
                        index === questions[currentQuestion].correct
                          ? "border-green-500 bg-green-500/20"
                          : "border-destructive bg-destructive/20"
                      ),
                      selectedAnswer !== index && showResult && 
                        index === questions[currentQuestion].correct &&
                        "border-green-500 bg-green-500/20"
                    )}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mr-3 font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </Button>
                ))}
              </div>

              {showResult && (
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={nextQuestion}
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      See Results
                      <Trophy className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card variant="glass" className="animate-slide-up text-center">
            <CardContent className="py-12">
              <div className="w-20 h-20 rounded-full bg-game-quiz/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-game-quiz" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-muted-foreground mb-6">
                You scored {finalScore} out of {questions.length}
              </p>
              <div className="text-6xl font-bold text-gradient-primary mb-6">
                {percentage}%
              </div>
              <p className="text-lg mb-8">
                {percentage >= 80 ? '🎯 Outstanding! You\'re a trivia master!' :
                 percentage >= 60 ? '👏 Well done! Great knowledge!' :
                 percentage >= 40 ? '📖 Good try! Keep learning!' :
                 '💪 Keep practicing!'}
              </p>
              <Button variant="hero" onClick={resetGame}>
                <RotateCcw className="w-4 h-4" />
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
