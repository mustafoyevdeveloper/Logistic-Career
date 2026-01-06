import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import CreateStudentDialog from '@/components/CreateStudentDialog';
import { 
  Search, 
  Users, 
  Clock, 
  MessageSquare,
  Eye,
  TrendingUp,
  TrendingDown,
  Trash2,
  Ban,
  CheckCircle2,
  Edit2,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Student {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  group?: string;
  progress: number;
  stats?: {
    completedLessons: number;
    totalLessons: number;
    aiChats: number;
    completedAssignments: number;
    avgScore: number;
  };
  lastActive?: string;
  isActive: boolean;
  isSuspended: boolean;
}

interface Group {
  _id: string;
  name: string;
  description?: string;
  studentCount: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    groupId: '',
  });

  // Ma'lumotlarni yuklash
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [studentsRes, groupsRes] = await Promise.all([
        apiService.getStudents(),
        apiService.getGroups(),
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data?.students || []);
      }
      if (groupsRes.success) {
        setGroups(groupsRes.data?.groups || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = !selectedGroup || student.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      await apiService.deleteStudent(studentToDelete._id);
      toast.success('O\'quvchi muvaffaqiyatli o\'chirildi');
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'O\'quvchini o\'chirishda xatolik');
    }
  };

  const handleSuspend = async (student: Student) => {
    try {
      await apiService.suspendStudent(student._id, !student.isSuspended);
      toast.success(student.isSuspended ? 'O\'quvchi faollashtirildi' : 'O\'quvchi muzlatildi');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    }
  };

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setEditForm({
      firstName: student.firstName,
      lastName: student.lastName,
      groupId: student.group || '',
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!studentToEdit) return;

    try {
      await apiService.updateStudent(studentToEdit._id, editForm);
      toast.success('O\'quvchi muvaffaqiyatli yangilandi');
      setEditDialogOpen(false);
      setStudentToEdit(null);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'O\'quvchini yangilashda xatolik');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">O'quvchilar Boshqaruvi</h1>
          <p className="text-muted-foreground">
            Jami {students.length} ta o'quvchi
          </p>
        </div>
        <CreateStudentDialog onSuccess={loadData} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Ism yoki email bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={selectedGroup === null ? 'default' : 'outline'}
            onClick={() => setSelectedGroup(null)}
            size="sm"
          >
            Barchasi
          </Button>
          {groups.map(group => (
            <Button
              key={group._id}
              variant={selectedGroup === group._id ? 'default' : 'outline'}
              onClick={() => setSelectedGroup(group._id)}
              size="sm"
            >
              {group.name} ({group.studentCount})
            </Button>
          ))}
        </div>
      </div>

      {/* Students Grid/List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className={cn(
                "bg-card rounded-lg sm:rounded-xl p-4 sm:p-5 border shadow-card transition-all duration-200",
                selectedStudent?._id === student._id 
                  ? "border-primary shadow-card-hover" 
                  : "border-border hover:border-primary/50",
                !student.isActive && "opacity-60",
                student.isSuspended && "border-warning/50 bg-warning/5"
              )}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Avatar */}
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-primary-foreground font-semibold shrink-0 text-sm sm:text-base",
                  !student.isActive ? "bg-destructive" : student.isSuspended ? "bg-warning" : "gradient-primary"
                )}>
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                      {student.firstName} {student.lastName}
                    </h3>
                    {!student.isActive && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded-full shrink-0">
                        O'chirilgan
                      </span>
                    )}
                    {student.isSuspended && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full shrink-0">
                        Muzlatilgan
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">{student.email}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    {student.group && (
                      <span className="px-2 py-0.5 bg-muted rounded-full">{student.group}</span>
                    )}
                    {student.lastActive && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="truncate">{student.lastActive}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="text-right shrink-0">
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{student.progress}%</p>
                  <Progress value={student.progress} className="w-16 sm:w-20 h-2 mt-1" />
                </div>
              </div>

              {/* Stats */}
              {student.stats && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-semibold text-foreground">
                      {student.stats.completedLessons}/{student.stats.totalLessons}
                    </p>
                    <p className="text-xs text-muted-foreground">Darslar</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-semibold text-foreground">{student.stats.aiChats}</p>
                    <p className="text-xs text-muted-foreground">AI suhbatlar</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-semibold text-foreground">{student.stats.avgScore}%</p>
                    <p className="text-xs text-muted-foreground">O'rtacha ball</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuspend(student)}
                  className="flex-1"
                >
                  {student.isSuspended ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Faollashtirish
                    </>
                  ) : (
                    <>
                      <Ban className="w-4 h-4 mr-2" />
                      Muzlatish
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(student)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setStudentToDelete(student);
                    setDeleteDialogOpen(true);
                  }}
                  disabled={!student.isActive}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">O'quvchi topilmadi</p>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>O'quvchini o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {studentToDelete && (
                <>
                  <strong>{studentToDelete.firstName} {studentToDelete.lastName}</strong> ni o'chirishni tasdiqlaysizmi?
                  <br />
                  O'quvchi saytga kirish imkoniyatini yo'qotadi.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>O'quvchini yangilash</DialogTitle>
            <DialogDescription>
              O'quvchi ma'lumotlarini o'zgartiring
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ism</label>
                <Input
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Familiya</label>
                <Input
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Guruh</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                value={editForm.groupId}
                onChange={(e) => setEditForm({ ...editForm, groupId: e.target.value })}
              >
                <option value="">Guruh tanlang</option>
                {groups.map(group => (
                  <option key={group._id} value={group._id}>{group.name}</option>
                ))}
              </select>
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
    </div>
  );
}
