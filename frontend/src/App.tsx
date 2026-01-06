import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import LessonsPage from "./pages/student/LessonsPage";
import AIChatPage from "./pages/student/AIChatPage";
import AssignmentsPage from "./pages/student/AssignmentsPage";
import StudentProfilePage from "./pages/student/ProfilePage";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentsPage from "./pages/teacher/StudentsPage";
import TeacherAssignmentsPage from "./pages/teacher/AssignmentsPage";
import TeacherProfilePage from "./pages/teacher/ProfilePage";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'student' | 'teacher' }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={user?.role === 'teacher' ? '/teacher' : '/student'} replace /> : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to={user?.role === 'teacher' ? '/teacher' : '/student'} replace /> : <RegisterPage />
      } />
      
      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
      } />
      <Route path="/student/lessons" element={
        <ProtectedRoute allowedRole="student"><LessonsPage /></ProtectedRoute>
      } />
      <Route path="/student/ai-chat" element={
        <ProtectedRoute allowedRole="student"><AIChatPage /></ProtectedRoute>
      } />
      <Route path="/student/assignments" element={
        <ProtectedRoute allowedRole="student"><AssignmentsPage /></ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute allowedRole="student"><StudentProfilePage /></ProtectedRoute>
      } />
      
      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>
      } />
      <Route path="/teacher/students" element={
        <ProtectedRoute allowedRole="teacher"><StudentsPage /></ProtectedRoute>
      } />
      <Route path="/teacher/assignments" element={
        <ProtectedRoute allowedRole="teacher"><TeacherAssignmentsPage /></ProtectedRoute>
      } />
      <Route path="/teacher/profile" element={
        <ProtectedRoute allowedRole="teacher"><TeacherProfilePage /></ProtectedRoute>
      } />
      
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
