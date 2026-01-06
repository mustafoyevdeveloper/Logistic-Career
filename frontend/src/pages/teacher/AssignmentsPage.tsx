import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  User,
  MessageSquare,
  Star,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Submission {
  id: string;
  studentName: string;
  studentAvatar: string;
  assignmentTitle: string;
  submittedAt: string;
  status: 'pending' | 'reviewed';
  aiScore?: number;
  teacherScore?: number;
  feedback?: string;
  answer: string;
}

const submissions: Submission[] = [
  {
    id: '1',
    studentName: 'Sardor Aliyev',
    studentAvatar: 'SA',
    assignmentTitle: 'Transport tanlash vazifasi',
    submittedAt: '2024-02-14 15:30',
    status: 'pending',
    aiScore: 78,
    answer: 'Texasdan California ga 40FT yuk uchun avtomobil transportini tanlayman, chunki bu eng tezkor va moslashuvchan variant...',
  },
  {
    id: '2',
    studentName: 'Malika Karimova',
    studentAvatar: 'MK',
    assignmentTitle: 'Logistika asoslari testi',
    submittedAt: '2024-02-14 14:20',
    status: 'reviewed',
    aiScore: 85,
    teacherScore: 88,
    feedback: 'Juda yaxshi! Tushunchalarni to\'g\'ri tushungan.',
    answer: 'Test javoblari...',
  },
  {
    id: '3',
    studentName: 'Jahongir Toshev',
    studentAvatar: 'JT',
    assignmentTitle: 'Marshrut rejalashtirish',
    submittedAt: '2024-02-14 12:45',
    status: 'pending',
    aiScore: 65,
    answer: 'Chicago dan Los Angeles gacha marshrut: I-80 orqali...',
  },
  {
    id: '4',
    studentName: 'Dilnoza Rahimova',
    studentAvatar: 'DR',
    assignmentTitle: 'Rate Confirmation tuzish',
    submittedAt: '2024-02-14 10:15',
    status: 'reviewed',
    aiScore: 92,
    teacherScore: 95,
    feedback: 'Mukammal! Barcha ma\'lumotlar to\'g\'ri kiritilgan.',
    answer: 'Rate confirmation hujjati...',
  },
];

export default function TeacherAssignmentsPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');

  const handleSubmitReview = () => {
    if (!score || !feedback) {
      toast.error('Iltimos, ball va izohni kiriting');
      return;
    }
    toast.success('Baholash saqlandi!');
    setSelectedSubmission(null);
    setFeedback('');
    setScore('');
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const reviewedCount = submissions.filter(s => s.status === 'reviewed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Topshiriqlar</h1>
        <p className="text-muted-foreground">
          O'quvchilar topshiriqlarini tekshiring va baholang
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Tekshirilmagan</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{reviewedCount}</p>
              <p className="text-sm text-muted-foreground">Tekshirilgan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className={cn(
              "bg-card rounded-xl p-5 border shadow-card transition-all duration-200",
              selectedSubmission?.id === submission.id
                ? "border-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Student Info */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {submission.studentAvatar}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{submission.studentName}</h3>
                  <p className="text-sm text-muted-foreground">{submission.assignmentTitle}</p>
                </div>
              </div>

              {/* Scores */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">AI ball</p>
                  <p className="text-lg font-semibold text-primary">{submission.aiScore}%</p>
                </div>
                {submission.teacherScore && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Sizning ball</p>
                    <p className="text-lg font-semibold text-success">{submission.teacherScore}%</p>
                  </div>
                )}
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  submission.status === 'pending'
                    ? "bg-warning/10 text-warning"
                    : "bg-success/10 text-success"
                )}>
                  {submission.status === 'pending' ? 'Kutilmoqda' : 'Tekshirilgan'}
                </span>
                
                {submission.status === 'pending' && (
                  <Button 
                    variant="gradient" 
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    Tekshirish
                  </Button>
                )}
                {submission.status === 'reviewed' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    Ko'rish
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Review Section */}
            {selectedSubmission?.id === submission.id && (
              <div className="mt-6 pt-6 border-t border-border space-y-4">
                {/* Answer */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">O'quvchi javobi:</p>
                  <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                    {submission.answer}
                  </div>
                </div>

                {submission.status === 'pending' ? (
                  <>
                    {/* Score Input */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Ball (0-100):</p>
                      <div className="flex items-center gap-2">
                        {[60, 70, 80, 90, 100].map((s) => (
                          <Button
                            key={s}
                            variant={score === String(s) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setScore(String(s))}
                          >
                            {s}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Izoh:</p>
                      <Textarea
                        placeholder="O'quvchiga izoh yozing..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedSubmission(null)}
                      >
                        Bekor qilish
                      </Button>
                      <Button 
                        variant="gradient"
                        onClick={handleSubmitReview}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Saqlash
                      </Button>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Sizning izohingiz:</p>
                    <div className="bg-success/5 border border-success/20 rounded-lg p-4 text-sm text-foreground">
                      {submission.feedback}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
