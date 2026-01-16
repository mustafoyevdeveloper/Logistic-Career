import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiService } from '@/services/api';
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
  status: 'pending' | 'submitted' | 'graded';
  aiScore?: number | null;
  teacherScore?: number | null;
  feedback?: string | null;
  answer: string;
  assignmentId?: string;
  studentId?: string;
}

export default function TeacherAssignmentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.request<{ submissions: Submission[] }>('/assignments/all-submissions');
      if (response.success && response.data) {
        setSubmissions(response.data.submissions || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Yuborilmalarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedSubmission || !score || !feedback) {
      toast.error('Iltimos, ball va izohni kiriting');
      return;
    }

    if (!selectedSubmission.assignmentId) {
      toast.error('Topshiriq ID topilmadi');
      return;
    }

    try {
      const response = await apiService.request(`/assignments/${selectedSubmission.assignmentId}/grade`, {
        method: 'PUT',
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          score: parseInt(score),
          feedback: feedback,
        }),
      });

      if (response.success) {
        toast.success('Baholash saqlandi!');
        setSelectedSubmission(null);
        setFeedback('');
        setScore('');
        loadSubmissions(); // Yangilash
      }
    } catch (error: any) {
      toast.error(error.message || 'Baholashda xatolik');
    }
  };

  const pendingCount = submissions.filter(s => s.status === 'pending' || s.status === 'submitted').length;
  const reviewedCount = submissions.filter(s => s.status === 'graded').length;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

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
      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Hozircha yuborilmalar yo'q</p>
        </div>
      ) : (
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
                  (submission.status === 'pending' || submission.status === 'submitted')
                    ? "bg-warning/10 text-warning"
                    : "bg-success/10 text-success"
                )}>
                  {(submission.status === 'pending' || submission.status === 'submitted') ? 'Kutilmoqda' : 'Tekshirilgan'}
                </span>
                
                {(submission.status === 'pending' || submission.status === 'submitted') && (
                  <Button 
                    variant="gradient" 
                    size="sm"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    Tekshirish
                  </Button>
                )}
                {submission.status === 'graded' && (
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

                {(submission.status === 'pending' || submission.status === 'submitted') ? (
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
      )}
    </div>
  );
}
