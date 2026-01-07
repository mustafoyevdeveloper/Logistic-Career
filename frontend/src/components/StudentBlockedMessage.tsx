import { AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StudentBlockedMessage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login?role=student');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-2xl p-8 border border-destructive/20 shadow-lg text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Hisobingiz Muzlatilgan
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Sizning hisobingiz o'qituvchi tomonidan muzlatilgan. 
          Platformadan foydalanish imkoniyati cheklangan.
        </p>
        
        <p className="text-sm text-muted-foreground mb-8">
          Iltimos, o'qituvchi yoki administrator bilan bog'laning.
        </p>
        
        <Button onClick={handleLogout} variant="outline" className="w-full">
          Chiqish
        </Button>
      </div>
    </div>
  );
}

