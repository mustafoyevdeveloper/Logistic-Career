import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { 
  User, 
  Mail, 
  Users,
  BookOpen,
  Edit2,
  Settings,
  Volume2
} from 'lucide-react';

export default function TeacherProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeLessons: 7,
    avgProgress: 0,
    totalChats: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [buttonSoundEnabled, setButtonSoundEnabled] = useState(true);

  useEffect(() => {
    loadStats();
    // localStorage'dan ovoz holatini o'qish
    const soundEnabled = localStorage.getItem('buttonSoundEnabled');
    if (soundEnabled !== null) {
      setButtonSoundEnabled(soundEnabled === 'true');
    } else {
      // Default: yoqilgan
      setButtonSoundEnabled(true);
      localStorage.setItem('buttonSoundEnabled', 'true');
    }
  }, []);

  const handleButtonSoundToggle = (checked: boolean) => {
    setButtonSoundEnabled(checked);
    localStorage.setItem('buttonSoundEnabled', checked.toString());
    // Storage event yuborish barcha tab'larga xabar berish uchun
    window.dispatchEvent(new Event('storage'));
  };

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getTeacherStats();
      if (response.success && response.data) {
        setStats({
          totalStudents: response.data.totalStudents || 0,
          activeLessons: 7, // doimiy 7 ta
          avgProgress: response.data.avgProgress || 0,
          totalChats: response.data.totalChats || 0,
        });
      }
    } catch (error: any) {
      console.error('Stats load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsList = [
    { label: 'Jami o\'quvchilar', value: stats.totalStudents.toString() },
    { label: 'Faol darslar', value: stats.activeLessons.toString() },
    { label: 'O\'rtacha progress', value: `${stats.avgProgress}%` },
    { label: 'AI suhbatlar', value: stats.totalChats.toString() },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profil</h1>
        <Button variant="outline" size="sm">
          <Edit2 className="w-4 h-4 mr-2" />
          Tahrirlash
        </Button>
      </div> */}

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
            <p className="text-muted-foreground mb-4">O'qituvchi • Logistika bo'limi</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border shadow-card">
                <div className="w-16 h-6 bg-muted animate-pulse rounded mb-2" />
                <div className="w-24 h-4 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </>
        ) : (
          statsList.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-4 border border-border shadow-card">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      {/* Settings */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Sozlamalar
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="button-sound" className="font-medium text-foreground cursor-pointer">
                  Tugmalar ovozi
                </Label>
                <p className="text-sm text-muted-foreground">Tugmalar bosilganda ovoz chiqishi</p>
              </div>
            </div>
            <Switch
              id="button-sound"
              checked={buttonSoundEnabled}
              onCheckedChange={handleButtonSoundToggle}
            />
          </div>
        </div>
      </div>

      {/* <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Sozlamalar
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="font-medium text-foreground">Email bildirishnomalar</p>
              <p className="text-sm text-muted-foreground">Yangi topshiriqlar haqida xabar olish</p>
            </div>
            <Button variant="outline" size="sm">Yoqilgan</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="font-medium text-foreground">AI baholash</p>
              <p className="text-sm text-muted-foreground">AI dastlabki baholarni ko'rsatish</p>
            </div>
            <Button variant="outline" size="sm">Yoqilgan</Button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
