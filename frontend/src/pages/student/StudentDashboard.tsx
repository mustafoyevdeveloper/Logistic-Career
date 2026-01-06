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
import { lessonModules } from '@/data/lessons';

export default function StudentDashboard() {
  const { user } = useAuth();
  
  const totalLessons = lessonModules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessons = 1; // Demo data
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Tugatilgan darslar', 
      value: `${completedLessons}/${totalLessons}`,
      color: 'text-primary'
    },
    { 
      icon: MessageSquare, 
      label: 'AI suhbatlar', 
      value: '12',
      color: 'text-accent'
    },
    { 
      icon: Trophy, 
      label: 'Ball', 
      value: '850',
      color: 'text-warning'
    },
    { 
      icon: Clock, 
      label: 'O\'qish vaqti', 
      value: '8 soat',
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
              <Button variant="outline" className="border-primary-foreground/30 text-white/80 hover:text-white/80 transition duration-400 bg-primary-foreground/10 hover:bg-primary-foreground/15" >
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="w-4 h-4" />
          <span>Keyingi maqsad: "Xalqaro logistika tushunchasi" darsini tugatish</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
          {lessonModules[0].lessons.slice(0, 3).map((lesson, index) => (
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
                  2 ta yangi topshiriq mavjud
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
