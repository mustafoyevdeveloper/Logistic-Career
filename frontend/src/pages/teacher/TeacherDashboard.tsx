import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const demoStudents = [
  { id: '1', name: 'Sardor Aliyev', group: 'LOG-2024-A', progress: 75, lastActive: '2 soat oldin', status: 'active' },
  { id: '2', name: 'Malika Karimova', group: 'LOG-2024-A', progress: 60, lastActive: '1 kun oldin', status: 'active' },
  { id: '3', name: 'Jahongir Toshev', group: 'LOG-2024-B', progress: 45, lastActive: '3 kun oldin', status: 'warning' },
  { id: '4', name: 'Dilnoza Rahimova', group: 'LOG-2024-A', progress: 90, lastActive: '30 daqiqa oldin', status: 'active' },
];

export default function TeacherDashboard() {
  const { user } = useAuth();

  const stats = [
    { icon: Users, label: 'Jami o\'quvchilar', value: '24', color: 'text-primary' },
    { icon: BookOpen, label: 'Faol darslar', value: '12', color: 'text-accent' },
    { icon: TrendingUp, label: 'O\'rtacha progress', value: '68%', color: 'text-success' },
    { icon: MessageSquare, label: 'AI suhbatlar', value: '156', color: 'text-warning' },
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
            Bugun 3 ta yangi AI suhbat va 2 ta yangi topshiriq tekshirishingiz kerak
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Link to="/teacher/students">
              <Button variant="hero" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                O'quvchilarni ko'rish
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
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

      {/* Recent Students */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">So'nggi faoliyat</h2>
          <Link to="/teacher/students" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            Barchasi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {demoStudents.map((student) => (
            <div 
              key={student.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">{student.name}</h3>
                  {student.status === 'warning' && (
                    <AlertCircle className="w-4 h-4 text-warning shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{student.group}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {student.lastActive}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">{student.progress}%</p>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/teacher/students" className="group">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover hover:border-primary/50 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  O'quvchilarni boshqarish
                </h3>
                <p className="text-sm text-muted-foreground">
                  Progress va AI suhbatlarni ko'ring
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        <Link to="/teacher/assignments" className="group">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover hover:border-primary/50 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Topshiriqlarni tekshirish
                </h3>
                <p className="text-sm text-muted-foreground">
                  5 ta yangi topshiriq kutmoqda
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
