import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { hidePwaSplash } from "./components/PwaSplash";

// Pages
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import LessonsPage from "./pages/student/LessonsPage";
import LessonDetailPage from "./pages/student/LessonDetailPage";
import AIChatPage from "./pages/student/AIChatPage";
import AssignmentsPage from "./pages/student/AssignmentsPage";
import StudentProfilePage from "./pages/student/ProfilePage";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherLessonsPage from "./pages/teacher/LessonsPage";
import TeacherLessonDetailPage from "./pages/teacher/LessonDetailPage";
import StudentsPage from "./pages/teacher/StudentsPage";
import GroupsPage from "./pages/teacher/GroupsPage";
import TeacherAssignmentsPage from "./pages/teacher/AssignmentsPage";
import TeacherTestsPage from "./pages/teacher/TestsPage";
import TeacherProfilePage from "./pages/teacher/ProfilePage";
import SettingsPage from "./pages/teacher/SettingsPage";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'student' | 'teacher' }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  
  // Loading holati
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Authenticated emas bo'lsa, login sahifasiga redirect
  if (!isAuthenticated) {
    // Faqat login sahifasida bo'lmasa redirect qilish (infinite loop'ni oldini olish uchun)
    if (location.pathname !== '/login?role=student') {
      return <Navigate to="/login?role=student" replace />;
    }
    return null; // Login sahifasida bo'lsa, hech narsa qaytarmaslik
  }
  
  // Student blocked tekshirish
  if (user?.role === 'student' && (user?.isSuspended || !user?.isActive)) {
    if (location.pathname !== '/login?role=student') {
      return <Navigate to="/login?role=student" replace />;
    }
    return null;
  }
  
  // Role tekshiruvi
  if (allowedRole && user?.role !== allowedRole && user?.role !== 'admin') {
    const redirectTo = user?.role === 'teacher' ? '/teacher' : '/student';
    // Faqat hozirgi path redirectTo dan farq qilsa redirect qilish
    if (location.pathname !== redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return null;
  }
  
  // Admin ham teacher route'lariga kirishi mumkin
  if (allowedRole === 'teacher' && user?.role === 'admin') {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

function LoginRouteWrapper() {
  const { isAuthenticated, user, isLoading, isAuthReady } = useAuth();
  const location = useLocation();
  
  // Role parametrini location.search dan o'qish (infinite loop'ni oldini olish uchun)
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role');
  
  // Loading holati - isLoading === true bo'lganda redirect qilinmasin
  // isAuthReady faqat isLoading === false bo'lganda tekshiriladi
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // To'liq tekshiruv: isLoading === false && isAuthenticated && user + role
  // Faqat hammasi tayyor bo'lgandan keyin redirect qilish
  // Backend'da isActive va isSuspended tekshirilgan, shuning uchun frontend'da undefined tekshiruvini olib tashlaymiz
  if (!isLoading && isAuthenticated && user && user.role && location.pathname.startsWith('/login')) {
    // Student uchun qo'shimcha tekshiruvlar
    // Backend'da isActive va isSuspended tekshirilgan, agar ular noto'g'ri bo'lsa login qilish mumkin emas
    // Shuning uchun frontend'da faqat mavjud bo'lsa tekshiramiz
    if (user.role === 'student') {
      // Student status tekshiruvi (faqat mavjud bo'lsa)
      if (user.isSuspended === true || user.isActive === false) {
        // Student blocked bo'lsa, login sahifasida qolish
        return <LoginPage />;
      }
    }
    
    // Hammasi tayyor bo'lganda redirect qilish
    const redirectTo = user.role === 'teacher' || user.role === 'admin' ? '/teacher' : '/student';
    return <Navigate to={redirectTo} replace />;
  }
  
  // Agar role parametri bo'lmasa, avtomatik ?role=student qo'shish
  // Bu tekshiruv authenticated bo'lmagan holda qilinadi
  // location.search tekshiruvi infinite loop'ni oldini oladi
  if (!isAuthenticated && !role && location.pathname === '/login' && !location.search.includes('role=')) {
    return <Navigate to="/login?role=student" replace />;
  }
  
  return <LoginPage />;
}

function AppRoutes() {
  const online = useOnlineStatus();
  const { isAuthenticated, user, isLoading } = useAuth();

  if (!online) {
    window.location.replace("/offline.html");
    return null;
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginRouteWrapper />} />
      
      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
      } />
      <Route path="/student/lessons" element={
        <ProtectedRoute allowedRole="student"><LessonsPage /></ProtectedRoute>
      } />
      <Route path="/student/lessons/:day" element={
        <ProtectedRoute allowedRole="student"><LessonDetailPage /></ProtectedRoute>
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
      <Route path="/teacher/lessons" element={
        <ProtectedRoute allowedRole="teacher"><TeacherLessonsPage /></ProtectedRoute>
      } />
      <Route path="/teacher/lessons/:day" element={
        <ProtectedRoute allowedRole="teacher"><TeacherLessonDetailPage /></ProtectedRoute>
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
      <Route path="/teacher/tests" element={
        <ProtectedRoute allowedRole="teacher"><TeacherTestsPage /></ProtectedRoute>
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

function AppContent() {
  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(hidePwaSplash, 100);
    });
  }, []);
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
