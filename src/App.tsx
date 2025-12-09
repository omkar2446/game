import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import IQTestGame from "./pages/games/IQTestGame";
import QuizGame from "./pages/games/QuizGame";
import FunnyGame from "./pages/games/FunnyGame";
import BasicMathGame from "./pages/games/BasicMathGame";
import AdvancedMathGame from "./pages/games/AdvancedMathGame";
import NewsQuizGame from "./pages/games/NewsQuizGame";
import NotFound from "./pages/NotFound";
import CarGame from "./pages/games/CarGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/games/iq-test" element={<IQTestGame />} />
            <Route path="/games/quiz" element={<QuizGame />} />
            <Route path="/games/funny" element={<FunnyGame />} />
            <Route path="/games/math-basic" element={<BasicMathGame />} />
            <Route path="/games/math-advanced" element={<AdvancedMathGame />} />
            <Route path="/games/news-quiz" element={<NewsQuizGame />} />
             <Route path="/car-game" element={<CarGame />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
