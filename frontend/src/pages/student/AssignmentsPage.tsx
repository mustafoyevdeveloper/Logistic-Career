import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore: number;
  type: 'quiz' | 'practical' | 'scenario';
}

const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Logistika asoslari testi',
    description: 'Logistika tushunchasi, transport turlari va supply chain bo\'yicha 10 ta savol',
    dueDate: '2024-02-15',
    status: 'graded',
    score: 85,
    maxScore: 100,
    type: 'quiz',
  },
  {
    id: '2',
    title: 'Transport tanlash vazifasi',
    description: 'Berilgan senariy uchun optimal transport turini tanlang va asoslang',
    dueDate: '2024-02-20',
    status: 'pending',
    maxScore: 100,
    type: 'scenario',
  },
  {
    id: '3',
    title: 'Marshrut rejalashtirish',
    description: 'Chicago dan Los Angeles gacha optimal marshrut tuzing',
    dueDate: '2024-02-25',
    status: 'pending',
    maxScore: 100,
    type: 'practical',
  },
  {
    id: '4',
    title: 'Rate Confirmation tuzish',
    description: 'Berilgan ma\'lumotlar asosida Rate Confirmation hujjatini to\'ldiring',
    dueDate: '2024-02-28',
    status: 'pending',
    maxScore: 100,
    type: 'practical',
  },
];

const getStatusColor = (status: Assignment['status']) => {
  switch (status) {
    case 'graded':
      return 'bg-success/10 text-success';
    case 'submitted':
      return 'bg-info/10 text-info';
    case 'pending':
      return 'bg-warning/10 text-warning';
  }
};

const getStatusLabel = (status: Assignment['status']) => {
  switch (status) {
    case 'graded':
      return 'Baholangan';
    case 'submitted':
      return 'Yuborilgan';
    case 'pending':
      return 'Kutilmoqda';
  }
};

const getTypeLabel = (type: Assignment['type']) => {
  switch (type) {
    case 'quiz':
      return 'Test';
    case 'practical':
      return 'Amaliy';
    case 'scenario':
      return 'Senariy';
  }
};

export default function AssignmentsPage() {
  const completedCount = assignments.filter(a => a.status === 'graded').length;
  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const avgScore = assignments
    .filter(a => a.score !== undefined)
    .reduce((acc, a) => acc + (a.score || 0), 0) / completedCount || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Topshiriqlar</h1>
        <p className="text-muted-foreground">
          Vazifalarni bajaring va o'z bilimingizni sinab ko'ring
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Kutilmoqda</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Bajarilgan</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{Math.round(avgScore)}%</p>
              <p className="text-sm text-muted-foreground">O'rtacha ball</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-card rounded-xl p-5 border border-border shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                  <span className="px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground">
                    {getTypeLabel(assignment.type)}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    getStatusColor(assignment.status)
                  )}>
                    {getStatusLabel(assignment.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(assignment.dueDate).toLocaleDateString('uz-UZ')}
                  </span>
                  {assignment.score !== undefined && (
                    <span className="flex items-center gap-1 text-success font-medium">
                      <Trophy className="w-4 h-4" />
                      {assignment.score}/{assignment.maxScore} ball
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <Button 
                variant={assignment.status === 'pending' ? 'gradient' : 'outline'}
                className="shrink-0"
              >
                {assignment.status === 'pending' ? (
                  <>
                    Boshlash
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : assignment.status === 'graded' ? (
                  'Ko\'rish'
                ) : (
                  'Kutilmoqda'
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
