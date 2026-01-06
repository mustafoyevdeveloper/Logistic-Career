import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Users, 
  Clock, 
  MessageSquare,
  Eye,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  email: string;
  group: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  aiChats: number;
  lastActive: string;
  trend: 'up' | 'down' | 'stable';
  avgScore: number;
}

const students: Student[] = [
  { id: '1', name: 'Sardor Aliyev', email: 'sardor@email.uz', group: 'LOG-2024-A', progress: 75, lessonsCompleted: 9, totalLessons: 12, aiChats: 24, lastActive: '2 soat oldin', trend: 'up', avgScore: 85 },
  { id: '2', name: 'Malika Karimova', email: 'malika@email.uz', group: 'LOG-2024-A', progress: 60, lessonsCompleted: 7, totalLessons: 12, aiChats: 18, lastActive: '1 kun oldin', trend: 'stable', avgScore: 78 },
  { id: '3', name: 'Jahongir Toshev', email: 'jahongir@email.uz', group: 'LOG-2024-B', progress: 45, lessonsCompleted: 5, totalLessons: 12, aiChats: 8, lastActive: '3 kun oldin', trend: 'down', avgScore: 65 },
  { id: '4', name: 'Dilnoza Rahimova', email: 'dilnoza@email.uz', group: 'LOG-2024-A', progress: 90, lessonsCompleted: 11, totalLessons: 12, aiChats: 32, lastActive: '30 daqiqa oldin', trend: 'up', avgScore: 92 },
  { id: '5', name: 'Bobur Saidov', email: 'bobur@email.uz', group: 'LOG-2024-B', progress: 55, lessonsCompleted: 6, totalLessons: 12, aiChats: 15, lastActive: '5 soat oldin', trend: 'stable', avgScore: 72 },
  { id: '6', name: 'Nodira Azimova', email: 'nodira@email.uz', group: 'LOG-2024-A', progress: 80, lessonsCompleted: 10, totalLessons: 12, aiChats: 28, lastActive: '1 soat oldin', trend: 'up', avgScore: 88 },
];

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = !selectedGroup || student.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const groups = [...new Set(students.map(s => s.group))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">O'quvchilar</h1>
          <p className="text-muted-foreground">
            Jami {students.length} ta o'quvchi
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Ism yoki email bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedGroup === null ? 'default' : 'outline'}
            onClick={() => setSelectedGroup(null)}
          >
            Barchasi
          </Button>
          {groups.map(group => (
            <Button
              key={group}
              variant={selectedGroup === group ? 'default' : 'outline'}
              onClick={() => setSelectedGroup(group)}
            >
              {group}
            </Button>
          ))}
        </div>
      </div>

      {/* Students Grid/List */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
            className={cn(
              "bg-card rounded-xl p-5 border shadow-card cursor-pointer transition-all duration-200",
              selectedStudent?.id === student.id 
                ? "border-primary shadow-card-hover" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold shrink-0">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{student.name}</h3>
                  {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                  {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive" />}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{student.email}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded-full">{student.group}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {student.lastActive}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-foreground">{student.progress}%</p>
                <Progress value={student.progress} className="w-20 h-2 mt-1" />
              </div>
            </div>

            {/* Expanded Details */}
            {selectedStudent?.id === student.id && (
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{student.lessonsCompleted}/{student.totalLessons}</p>
                  <p className="text-xs text-muted-foreground">Darslar</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{student.aiChats}</p>
                  <p className="text-xs text-muted-foreground">AI suhbatlar</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{student.avgScore}%</p>
                  <p className="text-xs text-muted-foreground">O'rtacha ball</p>
                </div>
              </div>
            )}

            {selectedStudent?.id === student.id && (
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  AI suhbatlarni ko'rish
                </Button>
                <Button variant="gradient" size="sm" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Izoh qoldirish
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">O'quvchi topilmadi</p>
        </div>
      )}
    </div>
  );
}
