import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Settings,
  Mail,
  Bell,
  Sparkles,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/services/api';

interface SettingsData {
  emailNotifications: boolean;
  newAssignmentNotifications: boolean;
  aiGrading: boolean;
  showAiScores: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    emailNotifications: true,
    newAssignmentNotifications: true,
    aiGrading: true,
    showAiScores: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.request<{ settings: SettingsData }>('/users/settings');
      if (response.success && response.data) {
        setSettings(response.data.settings);
      }
    } catch (error: any) {
      // Agar settings yo'q bo'lsa, default qiymatlar ishlatiladi
      console.log('Settings yuklanmadi, default qiymatlar ishlatilmoqda');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await apiService.request('/users/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      
      if (response.success) {
        toast.success('Sozlamalar muvaffaqiyatli saqlandi');
      } else {
        toast.error(response.message || 'Sozlamalarni saqlashda xatolik');
      }
    } catch (error: any) {
      toast.error(error.message || 'Sozlamalarni saqlashda xatolik');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: keyof SettingsData) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Sozlamalar</h1>
          <p className="text-muted-foreground">
            Platforma sozlamalarini boshqaring
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} variant="gradient">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
        </Button>
      </div>

      {/* Email Bildirishnomalar */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Email bildirishnomalar</h2>
            <p className="text-sm text-muted-foreground">
              Email orqali xabarlar olish
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="emailNotifications" className="text-base font-medium cursor-pointer">
                Email bildirishnomalar
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Barcha xabarlarni email orqali olish
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="newAssignmentNotifications" className="text-base font-medium cursor-pointer">
                Yangi topshiriqlar haqida xabar olish
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Yangi topshiriq yaratilganda email orqali xabar olish
              </p>
            </div>
            <Switch
              id="newAssignmentNotifications"
              checked={settings.newAssignmentNotifications}
              onCheckedChange={() => handleToggle('newAssignmentNotifications')}
            />
          </div>
        </div>
      </div>

      {/* AI Baholash */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI baholash</h2>
            <p className="text-sm text-muted-foreground">
              AI yordamida avtomatik baholash sozlamalari
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="aiGrading" className="text-base font-medium cursor-pointer">
                AI baholash
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                AI tomonidan dastlabki baholarni ko'rsatish
              </p>
            </div>
            <Switch
              id="aiGrading"
              checked={settings.aiGrading}
              onCheckedChange={() => handleToggle('aiGrading')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="showAiScores" className="text-base font-medium cursor-pointer">
                AI dastlabki baholarni ko'rsatish
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                O'quvchilarga AI tomonidan berilgan dastlabki baholarni ko'rsatish
              </p>
            </div>
            <Switch
              id="showAiScores"
              checked={settings.showAiScores}
              onCheckedChange={() => handleToggle('showAiScores')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

