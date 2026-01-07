import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
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
import GroupsPage from "./pages/teacher/GroupsPage";
import TeacherAssignmentsPage from "./pages/teacher/AssignmentsPage";
import TeacherProfilePage from "./pages/teacher/ProfilePage";
import SettingsPage from "./pages/teacher/SettingsPage";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'student' | 'teacher' }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Student blocked tekshirish
  if (user?.role === 'student' && (user?.isSuspended || !user?.isActive)) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user?.role !== allowedRole && user?.role !== 'admin') {
    return <Navigate to={user?.role === 'teacher' || user?.role === 'admin' ? '/teacher' : '/student'} replace />;
  }
  
  // Admin ham teacher route'lariga kirishi mumkin
  if (allowedRole === 'teacher' && user?.role === 'admin') {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={user?.role === 'teacher' || user?.role === 'admin' ? '/teacher' : '/student'} replace /> : <LoginPage />
      } />
      
      {/* Admin/Teacher Login Route */}
      <Route path="/teacher/admin/role" element={<LoginPage isAdminRoute />} />
      
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
      <Route path="/teacher/groups" element={
        <ProtectedRoute allowedRole="teacher"><GroupsPage /></ProtectedRoute>
      } />
      <Route path="/teacher/assignments" element={
        <ProtectedRoute allowedRole="teacher"><TeacherAssignmentsPage /></ProtectedRoute>
      } />
      <Route path="/teacher/profile" element={
        <ProtectedRoute allowedRole="teacher"><TeacherProfilePage /></ProtectedRoute>
      } />
      <Route path="/teacher/settings" element={
        <ProtectedRoute allowedRole="teacher"><SettingsPage /></ProtectedRoute>
      } />
      
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
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
