import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import StudentBlockedMessage from '@/components/StudentBlockedMessage';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  ClipboardList,
  User,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const studentNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Bosh sahifa', href: '/student' },
  { icon: BookOpen, label: 'Darsliklar', href: '/student/lessons' },
  { icon: MessageSquare, label: 'AI Yordamchi', href: '/student/ai-chat' },
  { icon: ClipboardList, label: 'Topshiriqlar', href: '/student/assignments' },
  { icon: User, label: 'Profil', href: '/student/profile' },
];

const teacherNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Bosh sahifa', href: '/teacher' },
  { icon: BookOpen, label: 'O\'quvchilar', href: '/teacher/students' },
  { icon: Users, label: 'Guruhlar', href: '/teacher/groups' },
  { icon: ClipboardList, label: 'Topshiriqlar', href: '/teacher/assignments' },
  { icon: Settings, label: 'Sozlamalar', href: '/teacher/settings' },
  { icon: User, label: 'Profil', href: '/teacher/profile' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Student blocked tekshirish
  useEffect(() => {
    if (user?.role === 'student' && user?.isSuspended) {
      // Muzlatilgan o'quvchi - logout qilish
      setTimeout(() => {
        logout();
        navigate('?role=student');
      }, 100);
    }
    
    if (user?.role === 'student' && !user?.isActive) {
      // O'chirilgan o'quvchi - logout qilish
      logout();
      navigate('/login?role=student');
    }
  }, [user, logout, navigate]);

  // Agar student blocked bo'lsa, bloklama xabarini ko'rsatish
  if (user?.role === 'student' && (user?.isSuspended || !user?.isActive)) {
    return <StudentBlockedMessage />;
  }

  const navItems = user?.role === 'teacher' || user?.role === 'admin' ? teacherNavItems : studentNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login?role=student');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <Logo variant="icon" size="sm" />
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-card border-r border-border z-50 transform transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role === 'student' ? 'O\'quvchi' : 'O\'qituvchi'}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 fixed top-0 left-0 bottom-0 flex-col bg-card border-r border-border">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Logo variant="icon" size="md" />
          <span className="ml-3 text-xl font-bold text-foreground">Logistic Carrier</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role === 'student' ? 'O\'quvchi' : 'O\'qituvchi'}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 xl:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
