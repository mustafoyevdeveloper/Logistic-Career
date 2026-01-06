import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  BookOpen,
  Target,
  CheckCircle2,
  AlertCircle,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LoginPageProps {
  isAdminRoute?: boolean;
}

export default function LoginPage({ isAdminRoute = false }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Admin route tekshirish
  useEffect(() => {
    if (searchParams.get('role') === 'admin' || isAdminRoute) {
      // Admin login uchun default qiymatlar
      setEmail('mustafoyevdevelopment@gmail.com');
    }
  }, [searchParams, isAdminRoute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }
    
    setIsLoading(true);
    try {
      // Admin login tekshirish
      if (isAdminRoute || searchParams.get('role') === 'admin') {
        await adminLogin(email, password);
        toast.success('Muvaffaqiyatli kirdingiz!');
        navigate('/teacher');
      } else {
        // Student login
        await login(email, password, 'student');
        toast.success('Muvaffaqiyatli kirdingiz!');
        navigate('/student');
      }
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: BookOpen, text: 'Bosqichma-bosqich darsliklar' },
    { icon: Target, text: 'AI yordamida o\'qitish' },
    { icon: Users, text: 'Professional dispetcherlik' },
    { icon: CheckCircle2, text: 'Sertifikat olish imkoniyati' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          <div className="mb-8">
            <Logo variant="icon" size="lg" className="mb-4" />
            <span className="text-2xl font-bold text-primary-foreground">Logstic Career</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Xalqaro logistikani<br />
            <span className="text-accent">professional</span> darajada<br />
            o'rganing
          </h1>
          
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-md">
            0 darajadan dispetcherlik darajasigacha AI yordamida bosqichma-bosqich o'qing
          </p>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 text-primary-foreground/90"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-accent" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-16 bg-background">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <Logo variant="icon" size="md" />
            <span className="text-xl font-bold text-foreground">Logstic Career</span>
          </div>

          {isAdminRoute || searchParams.get('role') === 'admin' ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Admin/Teacher Kirish
              </h2>
              <p className="text-muted-foreground mb-8">
                Admin paneliga kirish
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                O'quvchi Kirish
              </h2>
              <p className="text-muted-foreground mb-8">
                O'qituvchi tomonidan berilgan email va parol bilan kiring
              </p>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="sizning@email.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Kirish
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {!isAdminRoute && searchParams.get('role') !== 'admin' && (
            <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-info shrink-0 mt-0.5" />
                <div className="text-sm text-foreground">
                  <p className="font-medium mb-1">Eslatma</p>
                  <p className="text-muted-foreground">
                    O'quvchilar o'zi ro'yxatdan o'tmaydi. Email va parolni o'qituvchidan oling.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
