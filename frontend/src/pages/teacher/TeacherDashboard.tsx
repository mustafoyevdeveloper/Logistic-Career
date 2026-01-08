import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Group,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  studentId?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeLessons: 0,
    avgProgress: 0,
    totalChats: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    loadNotifications();
    
    // Notification'larni har 30 soniyada yangilash
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getStudents();
      if (response.success && response.data) {
        const studentsData = response.data.students || [];
        setStudents(studentsData.slice(0, 4)); // Faqat 4 tasini ko'rsatish
        
        // Stats hisoblash
        const totalStudents = studentsData.length;
        const avgProgress = studentsData.length > 0
          ? Math.round(studentsData.reduce((acc: number, s: any) => acc + (s.progress || 0), 0) / studentsData.length)
          : 0;
        const totalChats = studentsData.reduce((acc: number, s: any) => acc + (s.stats?.aiChats || 0), 0);
        
        setStats({
          totalStudents,
          activeLessons: 12, // Bu backend'dan kelishi kerak
          avgProgress,
          totalChats,
        });
      }
    } catch (error) {
      console.error('Dashboard data load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await apiService.request<{ notifications: Notification[]; unreadCount: number }>('/notifications');
      if (response.success && response.data) {
        setNotifications(response.data.notifications.slice(0, 5)); // Faqat 5 tasini ko'rsatish
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Notifications load error:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await apiService.request(`/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      if (response.success) {
        loadNotifications();
      }
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    }
  };

  const dashboardStats = [
    { icon: Users, label: 'Jami o\'quvchilar', value: stats.totalStudents.toString(), color: 'text-primary' },
    { icon: BookOpen, label: 'Faol darslar', value: stats.activeLessons.toString(), color: 'text-accent' },
    { icon: TrendingUp, label: 'O\'rtacha progress', value: `${stats.avgProgress}%`, color: 'text-success' },
    { icon: MessageSquare, label: 'AI suhbatlar', value: stats.totalChats.toString(), color: 'text-warning' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="gradient-hero rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Xush kelibsiz, {user?.firstName}! 👋
            </h1>
            {unreadCount > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-destructive rounded-full flex items-center justify-center text-xs font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </div>
          <p className="text-sm sm:text-base text-primary-foreground/80 mb-4 sm:mb-6 max-w-lg">
            {unreadCount > 0 
              ? `${unreadCount} ta yangi bildirish mavjud`
              : 'Bugun 3 ta yangi AI suhbat va 2 ta yangi topshiriq tekshirishingiz kerak'}
          </p>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link to="/teacher/students">
              <Button variant="hero" size="sm" className="bg-accent hover:bg-accent/90 text-white/90 text-sm sm:text-base">
                O'quvchilarni ko'rish
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              Yangi bildirishlar
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-3 sm:p-4 rounded-lg border transition-all ${
                  notification.isRead 
                    ? 'border-border bg-muted/30' 
                    : 'border-warning/50 bg-warning/5 cursor-pointer hover:bg-warning/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 ${
                    notification.isRead ? 'text-muted-foreground' : 'text-warning'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-sm sm:text-base text-foreground">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs shrink-0"
                          onClick={() => handleMarkAsRead(notification._id)}
                        >
                          O'qildi
                        </Button>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    {notification.studentId && (
                      <p className="text-xs text-muted-foreground">
                        O'quvchi: {notification.studentId.firstName} {notification.studentId.lastName} ({notification.studentId.email})
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-warning rounded-full shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {dashboardStats.map((stat, index) => (
          <div 
            key={index}
            className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-border shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center mb-2 sm:mb-3 ${stat.color}`}>
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Students */}
      <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-card">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">So'nggi faoliyat</h2>
          <Link to="/teacher/students" className="text-primary text-xs sm:text-sm font-medium hover:underline flex items-center gap-1">
            Barchasi <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">Yuklanmoqda...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {students.map((student) => (
              <div 
                key={student._id}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base shrink-0">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm sm:text-base text-foreground truncate">
                      {student.firstName} {student.lastName}
                    </h3>
                    {student.isSuspended && (
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-warning shrink-0" />
                    )}
                    {!student.isActive && (
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-destructive shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    {student.group && <span className="truncate">{student.group}</span>}
                    {student.group && student.lastActive && <span>•</span>}
                    {student.lastActive && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="truncate">{student.lastActive}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-base sm:text-lg font-semibold text-foreground">{student.progress || 0}%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">Hozircha o'quvchilar yo'q</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Link to="/teacher/students" className="group">
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-card hover:shadow-card-hover hover:border-primary/50 transition-all duration-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                  O'quvchilarni boshqarish
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Progress va AI suhbatlarni ko'ring
                </p>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0 ml-2 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        <Link to="/teacher/lesson" className="group">
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-card hover:shadow-card-hover hover:border-primary/50 transition-all duration-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                <Group className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                  Darsliklarni ko'rish
                </h3>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0 ml-2 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
