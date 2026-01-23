import { useState, useEffect } from 'react';
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
import { UserPlus, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { apiService } from '@/services/api';

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
    groupId: '',
    password: '',
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  // Dialog ochilganda formani tozalash
  useEffect(() => {
    if (open) {
      // Dialog ochilganda formani tozalash
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        groupId: '',
        password: '',
      });
      setCertificateFile(null);
      setCreatedPassword(null);
      setPasswordCopied(false);
      setShowPassword(false);
    }
  }, [open]);

  const loadGroups = async () => {
    try {
      const response = await apiService.getGroups();
      if (response.success) {
        setGroups(response.data?.groups || []);
      }
    } catch (error) {
      // Silent fail
    }
  };

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
        groupId: formData.groupId || undefined,
        password: formData.password || undefined,
      });

      // Agar sertifikat fayli tanlangan bo'lsa, uni alohida yuklaymiz
      if (certificateFile && result.student?.id) {
        try {
          const file = certificateFile;
          if (file.size > 5 * 1024 * 1024) {
            toast.error('Sertifikat hajmi 5MB dan oshmasligi kerak');
          } else {
            const allowedTypes = [
              'application/pdf',
              'image/png',
              'image/jpeg',
              'image/webp',
            ];
            if (!allowedTypes.includes(file.type)) {
              toast.error('Faqat PDF, PNG, JPG, JPEG va WEBP sertifikatlar qabul qilinadi');
            } else {
              const uploadRes = await apiService.uploadStudentCertificate(result.student.id, file);
              if (!uploadRes.success) {
                toast.error(uploadRes.message || 'Sertifikatni yuklashda xatolik');
              }
            }
          }
        } catch (err: any) {
          console.error('Sertifikat yuklash xatosi:', err);
          const errorMsg = err.message || 'Sertifikatni yuklashda xatolik';
          toast.error(errorMsg);
          // Agar R2 credentials muammosi bo'lsa, aniq xabar ko'rsatish
          if (errorMsg.includes('R2') || errorMsg.includes('credentials') || errorMsg.includes('SECRET')) {
            toast.error('R2 credentials muammosi. Iltimos, backend loglarini tekshiring.');
          }
        }
      }

      setCreatedPassword(result.password);
      toast.success('O\'quvchi muvaffaqiyatli yaratildi!');
      
      // Formani tozalash
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        groupId: '',
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
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.uz"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="off"
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
              <Label htmlFor="groupId">Guruh (ixtiyoriy)</Label>
              <select
                id="groupId"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              >
                <option value="">Guruh tanlang</option>
                {groups.map(group => (
                  <option key={group._id} value={group._id}>{group.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parol (ixtiyoriy - avtomatik yaratiladi)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Agar bo'sh qoldirsangiz, avtomatik yaratiladi"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="off"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate">Sertifikat (ixtiyoriy)</Label>
              <Input
                id="certificate"
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.error('Sertifikat hajmi 5MB dan oshmasligi kerak');
                    e.target.value = '';
                    setCertificateFile(null);
                    return;
                  }
                  setCertificateFile(file);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Ruxsat etilgan formatlar: PDF, PNG, JPG, JPEG, WEBP. Maksimal hajm: 5MB.
              </p>
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

