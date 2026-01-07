import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  MessageSquare, 
  Trophy, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalLessons: 0,
    aiChats: 0,
    avgScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.request<{ modules: any[] }>('/lessons/modules');
      if (response.success && response.data) {
        setModules(response.data.modules || []);
        
        // Stats hisoblash
        const totalLessons = response.data.modules.reduce((acc: number, mod: any) => 
          acc + (mod.lessons?.length || 0), 0
        );
        const completedLessons = response.data.modules.reduce((acc: number, mod: any) => 
          acc + (mod.lessons?.filter((l: any) => l.progress?.completed).length || 0), 0
        );
        
        setStats(prev => ({
          ...prev,
          completedLessons,
          totalLessons,
        }));
      }
    } catch (error) {
      console.error('Dashboard data load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercent = stats.totalLessons > 0 
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100) 
    : 0;

  const dashboardStats = [
    { 
      icon: BookOpen, 
      label: 'Tugatilgan darslar', 
      value: `${stats.completedLessons}/${stats.totalLessons}`,
      color: 'text-primary'
    },
    { 
      icon: MessageSquare, 
      label: 'AI suhbatlar', 
      value: stats.aiChats.toString(),
      color: 'text-accent'
    },
    { 
      icon: Trophy, 
      label: 'O\'rtacha ball', 
      value: `${stats.avgScore}%`,
      color: 'text-warning'
    },
    { 
      icon: Clock, 
      label: 'Progress', 
      value: `${progressPercent}%`,
      color: 'text-success'
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="gradient-hero rounded-2xl p-6 sm:p-8 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Xush kelibsiz, {user?.firstName}! 👋
          </h1>
          <p className="text-primary-foreground/80 mb-6 max-w-lg">
            Bugungi maqsadingiz: Logistika asoslarini o'rganishni davom ettiring
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Link to="/student/lessons">
              <Button variant="hero" className="bg-accent hover:bg-accent/90 text-white">
                Davom etish
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/student/ai-chat">
              <Button variant="outline" className="border-primary-foreground/30 text-black transition duration-400 bg-white/95 hover:bg-white" >
                AI bilan mashq
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Umumiy progress</h2>
          <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-3 mb-4" />
        {modules.length > 0 && modules[0]?.lessons?.[0] && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>Keyingi maqsad: "{modules[0].lessons[0].title}" darsini tugatish</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <div 
            key={index}
            className="bg-card rounded-xl p-4 sm:p-5 border border-border shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Current Module */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Joriy modul</h2>
          <Link to="/student/lessons" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            Barchasi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {modules.length > 0 && modules[0]?.lessons?.slice(0, 3).map((lesson: any, index: number) => (
            <div 
              key={lesson.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                index === 0 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold ${
                index === 0 
                  ? 'gradient-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground">{lesson.duration}</p>
              </div>
              {index === 0 && (
                <Link to="/student/lessons">
                  <Button size="sm" variant="gradient">
                    Davom etish
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/student/ai-chat" className="group">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover hover:border-primary/50 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  AI bilan mashq qiling
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real logistika senariylarini o'rganing
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        <Link to="/student/assignments" className="group">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover hover:border-primary/50 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Topshiriqlar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Topshiriqlarni ko'rish
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
