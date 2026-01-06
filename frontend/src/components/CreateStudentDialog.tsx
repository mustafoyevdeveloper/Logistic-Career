import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { UserPlus, Copy, Check } from 'lucide-react';

interface CreateStudentDialogProps {
  onSuccess?: () => void;
}

export default function CreateStudentDialog({ onSuccess }: CreateStudentDialogProps) {
  const { createStudent } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    group: '',
    password: '',
  });
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Email, ism va familiya kiritilishi shart');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createStudent({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        group: formData.group || undefined,
        password: formData.password || undefined,
      });

      setCreatedPassword(result.password);
      toast.success('O\'quvchi muvaffaqiyatli yaratildi!');
      
      // Formani tozalash
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        group: '',
        password: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'O\'quvchi yaratishda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPassword = () => {
    if (createdPassword) {
      navigator.clipboard.writeText(createdPassword);
      setPasswordCopied(true);
      toast.success('Parol nusxalandi!');
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient">
          <UserPlus className="w-4 h-4 mr-2" />
          Yangi o'quvchi qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yangi o'quvchi qo'shish</DialogTitle>
          <DialogDescription>
            O'quvchi email va parol bilan tizimga kirishi mumkin bo'ladi
          </DialogDescription>
        </DialogHeader>

        {createdPassword ? (
          <div className="space-y-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-2">
                O'quvchi muvaffaqiyatli yaratildi!
              </p>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{formData.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Parol</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                      {createdPassword}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyPassword}
                    >
                      {passwordCopied ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bu parolni o'quvchiga berishni unutmang!
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                setOpen(false);
                setCreatedPassword(null);
              }}
              className="w-full"
            >
              Yopish
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.uz"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ism *</Label>
                <Input
                  id="firstName"
                  placeholder="Sardor"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Familiya *</Label>
                <Input
                  id="lastName"
                  placeholder="Aliyev"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Guruh (ixtiyoriy)</Label>
              <Input
                id="group"
                placeholder="LOG-2024-A"
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parol (ixtiyoriy - avtomatik yaratiladi)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Agar bo'sh qoldirsangiz, avtomatik yaratiladi"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Bekor qilish
              </Button>
              <Button type="submit" variant="gradient" disabled={isLoading} className="flex-1">
                {isLoading ? 'Yaratilmoqda...' : 'Yaratish'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

