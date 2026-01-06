import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Users,
  BookOpen,
  Edit2,
  Settings
} from 'lucide-react';

export default function TeacherProfilePage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Jami o\'quvchilar', value: '24' },
    { label: 'Faol darslar', value: '12' },
    { label: 'Tekshirilgan topshiriqlar', value: '156' },
    { label: 'O\'rtacha baho', value: '82%' },
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
        {stats.map((stat, index) => (
          <div key={index} className="bg-card rounded-xl p-4 border border-border shadow-card">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Settings Section */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
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
      </div>
    </div>
  );
}
