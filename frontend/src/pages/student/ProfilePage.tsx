import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';
import { 
  User, 
  Mail, 
  Users, 
  BookOpen, 
  Trophy,
  Clock,
  Edit2,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    completedLessons: 0,
    openedLessons: 0,
    totalLessons: 0,
    timeSpent: 0,
    timeSpentFormatted: '0:00',
    onlineTimeFormatted: '0:00:00',
    totalScore: 0,
    maxScore: 0,
    avgScore: 0,
    progressPercent: 0,
    achievementsCount: 0,
    totalAchievements: 3,
  });
  const [achievements, setAchievements] = useState({
    firstLesson: false,
    aiChatter: false,
    consistentLearner: false,
  });
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [onlineTime, setOnlineTime] = useState('0:00:00');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  // Real-time timer (har sekundda yangilanadi) va har 5 sekundda MongoDB'ga yangilash
  const lastUpdateTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!sessionStartTime) {
      console.log('⚠️ sessionStartTime yo\'q:', sessionStartTime);
      setOnlineTime('0:00:00');
      return;
    }

    console.log('✅ sessionStartTime mavjud:', sessionStartTime);

    const updateTime = () => {
      const now = new Date();
      const start = new Date(sessionStartTime);
      
      // Debug
      if (isNaN(start.getTime())) {
        console.error('❌ sessionStartTime noto\'g\'ri format:', sessionStartTime);
        return;
      }

      const diffMs = now.getTime() - start.getTime();
      const totalSeconds = Math.floor(diffMs / 1000);
      
      // Agar vaqt manfiy bo'lsa (kelajakda bo'lsa), 0 qaytaramiz
      if (totalSeconds < 0) {
        setOnlineTime('0:00:00');
        return;
      }

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setOnlineTime(formatted);

      // Har 5 sekundda MongoDB'ga yangilash
      const nowMs = Date.now();
      if (nowMs - lastUpdateTimeRef.current >= 5000) {
        lastUpdateTimeRef.current = nowMs;
        // Backend'ga so'rov yuborish (xatoliklarni ahamiyatsiz qoldirish)
        apiService.updateOnlineTime(totalSeconds).catch((error) => {
          console.error('❌ updateOnlineTime xatosi:', error);
        });
      }
    };

    // Darhol yangilash
    updateTime();

    // Har sekundda yangilash
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.request<{
        stats: {
          completedLessons: number;
          openedLessons: number;
          totalLessons: number;
          timeSpent: number;
          timeSpentFormatted: string;
          onlineTimeFormatted?: string;
          totalScore: number;
          maxScore: number;
          avgScore: number;
          progressPercent: number;
          achievementsCount: number;
          totalAchievements: number;
        };
        achievements: {
          firstLesson: boolean;
          aiChatter: boolean;
          consistentLearner: boolean;
        };
        sessionStartTime?: string | null;
      }>('/auth/me/stats');
      
      if (response.success && response.data) {
        setStats(response.data.stats);
        setAchievements(response.data.achievements);
        console.log('📥 Backend\'dan kelgan sessionStartTime:', response.data.sessionStartTime);
        if (response.data.sessionStartTime) {
          setSessionStartTime(response.data.sessionStartTime);
          console.log('✅ sessionStartTime o\'rnatildi:', response.data.sessionStartTime);
        } else {
          console.warn('⚠️ sessionStartTime backend\'dan kelmadi yoki null');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Statistikani yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const achievementsList = [
    { icon: BookOpen, title: 'Birinchi dars', description: 'Birinchi darsni ochdingiz', unlocked: achievements.firstLesson },
    { icon: Award, title: 'AI suhbatchi', description: '10 ta AI suhbat olib boring', unlocked: achievements.aiChatter },
    { icon: Clock, title: 'Izchil o\'quvchi', description: '7 ta dars ochdingiz', unlocked: achievements.consistentLearner },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Card */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-muted-foreground mb-4">O'quvchi • {user?.group || 'Guruh topilmadi'}</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {user?.email}
              </span>
              {user?.group && (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {user.group}
                </span>
              )}
            </div>
          </div>

          {/* Progress Circle */}
          <div className="text-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${stats.progressPercent * 2.51} 251`}
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{stats.progressPercent}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Umumiy progress</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border shadow-card">
          <BookOpen className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.openedLessons || stats.completedLessons}/{stats.totalLessons}</p>
          <p className="text-sm text-muted-foreground">Darslar</p>
          <Progress value={stats.progressPercent} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">{stats.progressPercent}%</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border shadow-card">
          <Trophy className="w-5 h-5 text-warning mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.totalScore}/{stats.maxScore}</p>
          <p className="text-sm text-muted-foreground">Ball</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border shadow-card">
          <Clock className="w-5 h-5 text-success mb-2" />
          <p className="text-2xl font-bold text-foreground">{onlineTime || stats.onlineTimeFormatted || '0:00:00'}</p>
          <p className="text-sm text-muted-foreground">O'qish</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border shadow-card">
          <Award className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.achievementsCount}/{stats.totalAchievements}</p>
          <p className="text-sm text-muted-foreground">Yutuqlar</p>
        </div>
      </div>

      {/* Current Level */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Joriy daraja</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Boshlang'ich</span>
            <span className="text-primary font-medium">
              {stats.progressPercent < 50 
                ? `O'rta darajaga ${50 - stats.progressPercent}% qoldi`
                : stats.progressPercent < 80
                ? `Yuqori darajaga ${80 - stats.progressPercent}% qoldi`
                : 'Yuqori daraja'}
            </span>
          </div>
          <Progress value={stats.progressPercent} className="h-3" />
          <p className="text-sm text-muted-foreground">
            Keyingi daraja: <span className="text-foreground font-medium">
              {stats.progressPercent < 50 
                ? "O'rta daraja (Intermediate)"
                : stats.progressPercent < 80
                ? "Yuqori daraja (Advanced)"
                : 'Professional'}
            </span>
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Yutuqlar</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {achievementsList.map((achievement, index) => (
            <div 
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                achievement.unlocked 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-border opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                achievement.unlocked ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <achievement.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-foreground">{achievement.title}</p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
