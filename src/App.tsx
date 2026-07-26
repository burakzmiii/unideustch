import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { DecisionProvider } from '@/context/DecisionContext';
import { GradeProvider } from '@/context/GradeContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useRoute } from '@/lib/router';
import { HomePage } from '@/pages/HomePage';
import { UniversitiesPage } from '@/pages/UniversitiesPage';
import { UniversityDetailPage } from '@/pages/UniversityDetailPage';
import { QuizPage } from '@/pages/QuizPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ForumPage } from '@/pages/ForumPage';
import { ForumUniversityPage } from '@/pages/ForumUniversityPage';
import { QuestionPage } from '@/pages/QuestionPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ProfilePage } from '@/pages/ProfilePage';

function PageRouter() {
  const route = useRoute();

  switch (route.name) {
    case 'home':
      return <HomePage />;
    case 'universities':
      return <UniversitiesPage />;
    case 'university':
      return <UniversityDetailPage id={route.id} />;
    case 'quiz':
      return <QuizPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'forum':
      return <ForumPage />;
    case 'forum-university':
      return <ForumUniversityPage id={route.id} />;
    case 'question':
      return <QuestionPage id={route.id} />;
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <ThemeProvider>
      <DecisionProvider>
        <AuthProvider>
          <GradeProvider>
          <div className="min-h-screen flex flex-col bg-surface">
            <Navbar />
            <main className="flex-1">
              <PageRouter />
            </main>
            <Footer />
          </div>
          </GradeProvider>
        </AuthProvider>
      </DecisionProvider>
    </ThemeProvider>
  );
}

export default App;
