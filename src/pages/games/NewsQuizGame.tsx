import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Newspaper, ArrowRight, RotateCcw, Trophy, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface QuizData {
  topic: string;
  source: string;
  questions: Question[];
}

export default function NewsQuizGame() {
  const { user } = useAuth();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuiz = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-news-quiz');
      
      if (error) {
        throw error;
      }

      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('Please wait a moment before generating another quiz.');
        } else {
          toast.error(data.error);
        }
        return;
      }

      setQuizData(data);
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setGameComplete(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !quizData) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === quizData.questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const nextQuestion = async () => {
    if (!quizData) return;

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      
      if (user) {
        const finalScore = score + (selectedAnswer === quizData.questions[currentQuestion].correct ? 1 : 0);
        try {
          await supabase.from('game_scores').insert({
            user_id: user.id,
            game_type: 'news-quiz',
            score: finalScore * 20,
          });
        } catch (error) {
          console.error('Error saving score:', error);
        }
      }
    }
  };

  const finalScore = quizData 
    ? score + (selectedAnswer === quizData.questions[currentQuestion]?.correct ? 1 : 0)
    : 0;
  const percentage = quizData ? Math.round((finalScore / quizData.questions.length) * 100) : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-game-news flex items-center justify-center">
            <Newspaper className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Daily News Quiz</h1>
            <p className="text-muted-foreground">AI-generated questions from Wikipedia</p>
          </div>
        </div>

        {!quizData && !isLoading ? (
          <Card variant="glass" className="animate-slide-up text-center">
            <CardContent className="py-12">
              <div className="w-20 h-20 rounded-full bg-game-news/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-game-news" />
              </div>
              <h2 className="text-2xl font-bold mb-4">AI-Powered Quiz</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Get a unique quiz generated from real Wikipedia articles. 
                Learn something new every time you play!
              </p>
              <Button variant="hero" size="lg" onClick={generateQuiz}>
                <Sparkles className="w-4 h-4" />
                Generate Quiz
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card variant="glass" className="animate-slide-up text-center">
            <CardContent className="py-16">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-6" />
              <h2 className="text-xl font-bold mb-2">Generating Your Quiz...</h2>
              <p className="text-muted-foreground">
                Fetching article and creating questions with AI
              </p>
            </CardContent>
          </Card>
        ) : quizData && !gameComplete ? (
          <Card variant="glass" className="animate-slide-up">
            <CardHeader>
              <CardDescription className="text-primary font-medium">
                {quizData.source}
              </CardDescription>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  Score: {score}
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full mt-4">
                <div 
                  className="h-full bg-game-news rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xl font-medium">
                {quizData.questions[currentQuestion].question}
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {quizData.questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="game"
                    className={cn(
                      "justify-start h-auto py-4 px-6 text-left",
                      selectedAnswer === index && showResult && (
                        index === quizData.questions[currentQuestion].correct
                          ? "border-green-500 bg-green-500/20"
                          : "border-destructive bg-destructive/20"
                      ),
                      selectedAnswer !== index && showResult && 
                        index === quizData.questions[currentQuestion].correct &&
                        "border-green-500 bg-green-500/20"
                    )}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mr-3 font-bold flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </Button>
                ))}
              </div>

              {showResult && (
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={nextQuestion}
                >
                  {currentQuestion < quizData.questions.length - 1 ? (
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
        ) : quizData && gameComplete ? (
          <Card variant="glass" className="animate-slide-up text-center">
            <CardContent className="py-12">
              <div className="w-20 h-20 rounded-full bg-game-news/20 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-game-news" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-muted-foreground mb-2">
                Topic: {quizData.topic}
              </p>
              <p className="text-muted-foreground mb-6">
                You scored {finalScore} out of {quizData.questions.length}
              </p>
              <div className="text-6xl font-bold text-gradient-primary mb-6">
                {percentage}%
              </div>
              <p className="text-lg mb-8">
                {percentage >= 80 ? '🌟 Amazing! You\'re a knowledge master!' :
                 percentage >= 60 ? '📚 Well done! Great learning!' :
                 percentage >= 40 ? '🔍 Interesting topic, right?' :
                 '💡 Every quiz teaches something new!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" onClick={generateQuiz}>
                  <Sparkles className="w-4 h-4" />
                  New Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </Layout>
  );
}
