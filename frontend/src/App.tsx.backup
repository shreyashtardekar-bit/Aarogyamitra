import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import WorkoutPlan from './pages/WorkoutPlan';
import MealPlan from './pages/MealPlan';
import Progress from './pages/Progress';
import WellnessPlan from './pages/WellnessPlan';
import AICoach from './pages/AICoach';
import Community from './pages/Community';
import Analytics from './pages/Analytics';
import HealthProfile from './pages/HealthProfile';
import Layout from './components/Layout';

import { useAuthStore } from './store/authStore';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

import { FloatingAICoach } from './components/FloatingAICoach';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workouts" element={<WorkoutPlan />} />
          <Route path="nutrition" element={<MealPlan />} />
          <Route path="progress" element={<Progress />} />
          <Route path="wellness" element={<WellnessPlan />} />
          <Route path="ai-coach" element={<AICoach />} />
          <Route path="community" element={<Community />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<HealthProfile />} />
        </Route>
      </Routes>
      <FloatingAICoach />
    </Router>
  );
}

export default App;
