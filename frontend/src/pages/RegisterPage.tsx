import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { 
  GraduationCap, 
  ArrowRight, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  Users,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    group: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'teacher'>('teacher');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Parollar mos kelmadi');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }
    
    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: selectedRole,
        group: formData.group || undefined,
      });
      toast.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
      navigate(selectedRole === 'student' ? '/student' : '/teacher');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Back to login */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kirish sahifasiga qaytish</span>
        </Link>

        <div className="bg-card rounded-2xl shadow-card p-6 sm:p-8 border border-border">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <Logo variant="icon" size="md" />
            <span className="text-xl font-bold text-foreground">Logstic Career</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            Ro'yxatdan o'tish
          </h2>
          <p className="text-muted-foreground mb-6">
            Faqat o'qituvchilar ro'yxatdan o'tishi mumkin
          </p>

          {/* Info Alert */}
          <div className="bg-info/10 border border-info/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-foreground">
              <strong>Eslatma:</strong> O'quvchilar o'zi ro'yxatdan o'tmaydi. 
              O'quvchilar faqat o'qituvchi yoki admin tomonidan tizimga qo'shiladi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ism</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Sardor"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Familiya</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Aliyev"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="sizning@email.uz"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-11"
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-11"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Parolni tasdiqlang</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Ro'yxatdan o'tish
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
