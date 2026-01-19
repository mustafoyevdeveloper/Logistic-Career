import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

interface Group {
  _id: string;
  name: string;
  description?: string;
  studentCount: number;
  createdAt: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getGroups();
      if (response.success && response.data) {
        setGroups(response.data.groups || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Guruhlarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Guruh nomi kiritilishi shart');
      return;
    }

    try {
      await apiService.createGroup(formData);
      toast.success('Guruh muvaffaqiyatli yaratildi');
      setCreateDialogOpen(false);
      setFormData({ name: '', description: '' });
      loadGroups();
    } catch (error: any) {
      toast.error(error.message || 'Guruh yaratishda xatolik');
    }
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedGroup || !formData.name.trim()) {
      toast.error('Guruh nomi kiritilishi shart');
      return;
    }

    try {
      await apiService.updateGroup(selectedGroup._id, formData);
      toast.success('Guruh muvaffaqiyatli yangilandi');
      setEditDialogOpen(false);
      setSelectedGroup(null);
      setFormData({ name: '', description: '' });
      loadGroups();
    } catch (error: any) {
      toast.error(error.message || 'Guruhni yangilashda xatolik');
    }
  };

  const handleDelete = async () => {
    if (!selectedGroup) return;

    try {
      await apiService.deleteGroup(selectedGroup._id);
      toast.success('Guruh muvaffaqiyatli o\'chirildi');
      setDeleteDialogOpen(false);
      setSelectedGroup(null);
      loadGroups();
    } catch (error: any) {
      toast.error(error.message || 'Guruhni o\'chirishda xatolik');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Guruhlar</h1>
          <p className="text-muted-foreground">
            Jami {groups.length} ta guruh
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="w-4 h-4 mr-2" />
              Yangi guruh
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi guruh yaratish</DialogTitle>
              <DialogDescription>
                Masalan: 2025-Noyabr-D, 2026-Yanvar-A
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Guruh nomi *</label>
                <Input
                  placeholder="2025-Noyabr-D"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tavsif (ixtiyoriy)</label>
                <Input
                  placeholder="Guruh haqida qisqa ma'lumot"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                  Bekor qilish
                </Button>
                <Button onClick={handleCreate} className="flex-1">
                  Yaratish
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group._id}
              className="bg-card rounded-xl p-5 border border-border shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(group)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedGroup(group);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{group.studentCount} ta o'quvchi</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && groups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Guruhlar topilmadi</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guruhni yangilash</DialogTitle>
            <DialogDescription>
              Guruh ma'lumotlarini o'zgartiring
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Guruh nomi *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tavsif</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="flex-1">
                Bekor qilish
              </Button>
              <Button onClick={handleUpdate} className="flex-1">
                Saqlash
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Guruhni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedGroup && (
                <>
                  <strong>{selectedGroup.name}</strong> ni o'chirishni tasdiqlaysizmi?
                  <br />
                  {selectedGroup.studentCount > 0 && (
                    <span className="text-warning">
                      Bu guruhda {selectedGroup.studentCount} ta o'quvchi bor. Avval o'quvchilarni boshqa guruhga ko'chiring.
                    </span>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground"
              disabled={selectedGroup?.studentCount && selectedGroup.studentCount > 0}
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

