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

interface QuestionAnswer {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  correctAnswer?: string;
  question?: string;
}

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
  answers?: QuestionAnswer[];
  assignment?: {
    questions?: Array<{
      _id?: string;
      question: string;
      correctAnswer?: string;
      points: number;
    }>;
    maxScore?: number;
    type?: string;
  };
}

export default function TeacherAssignmentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    loadAssignments();
    loadSubmissions();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await apiService.request<{ assignments: any[] }>('/assignments');
      if (response.success && response.data) {
        setAssignments(response.data.assignments || []);
      }
    } catch (error: any) {
      console.error('Assignments yuklashda xatolik:', error);
    }
  };

  const loadSubmissions = async (assignmentId?: string) => {
    try {
      setIsLoading(true);
      const url = assignmentId 
        ? `/assignments/${assignmentId}/submissions`
        : '/assignments/all-submissions';
      const response = await apiService.request<{ submissions: Submission[] }>(url);
      if (response.success && response.data) {
        // Agar assignmentId bo'lsa, har bir submissionga assignment ma'lumotlarini qo'shish
        const submissionsWithDetails = response.data.submissions.map(sub => {
          const assignment = assignments.find(a => a._id === sub.assignmentId);
          return {
            ...sub,
            assignment: assignment || sub.assignment
          };
        });
        setSubmissions(submissionsWithDetails);
      }
    } catch (error: any) {
      toast.error(error.message || 'Yuborilmalarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAssignment = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    loadSubmissions(assignmentId);
  };

  const handleViewStudentAnswers = async (submission: Submission) => {
    try {
      // Assignment ma'lumotlarini olish
      const assignmentResponse = await apiService.request<{ assignment: any }>(`/assignments/${submission.assignmentId}`);
      if (assignmentResponse.success && assignmentResponse.data) {
        const assignment = assignmentResponse.data.assignment;
        
        // Submission ma'lumotlarini formatlash
        const formattedSubmission: Submission = {
          ...submission,
          assignment: assignment,
          answers: submission.answers || (submission.answer ? [] : [])
        };

        // Agar answers array bo'lmasa, assignment questions bilan solishtirish
        if (assignment.questions && assignment.type === 'quiz') {
          const questionAnswers: QuestionAnswer[] = assignment.questions.map((q: any, index: number) => {
            const questionId = q._id?.toString() || index.toString();
            const userAnswer = formattedSubmission.answers?.find((a: any) => 
              a.questionId?.toString() === questionId
            )?.answer || '';
            
            const isCorrect = userAnswer === q.correctAnswer;
            
            return {
              questionId,
              answer: userAnswer,
              isCorrect,
              correctAnswer: q.correctAnswer,
              question: q.question
            };
          });
          
          formattedSubmission.answers = questionAnswers;
        }
        
        setSelectedSubmission(formattedSubmission);
      }
    } catch (error: any) {
      toast.error(error.message || 'Ma\'lumotlarni yuklashda xatolik');
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

  // Faqat testlar (quiz) uchun statistika
  const quizSubmissions = submissions.filter(s => s.assignment?.type === 'quiz');
  const quizAssignments = assignments.filter(a => a.type === 'quiz');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Testlar</h1>
        <p className="text-muted-foreground">
          O'quvchilar testlarini tekshiring va baholang
        </p>
      </div>

      {/* Testlar ro'yxati */}
      {quizAssignments.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Testlar ro'yxati</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizAssignments.map((assignment) => {
              const assignmentSubmissions = quizSubmissions.filter(s => s.assignmentId === assignment._id);
              return (
                <div
                  key={assignment._id}
                  className={cn(
                    "bg-card rounded-xl p-4 border cursor-pointer transition-all",
                    selectedAssignmentId === assignment._id
                      ? "border-primary shadow-lg"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleSelectAssignment(assignment._id)}
                >
                  <h3 className="font-semibold text-foreground mb-2">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {assignmentSubmissions.length} ta o'quvchi yechgan
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {assignment.questions?.length || 0} ta savol
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {/* O'quvchilar ro'yxati (faqat tanlangan test uchun) */}
      {selectedAssignmentId && (
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {assignments.find(a => a._id === selectedAssignmentId)?.title || 'Test'} yechgan o'quvchilar
          </h2>
        </div>
      )}

      {/* Submissions List */}
      {selectedAssignmentId && submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Bu testni yechgan o'quvchilar hozircha yo'q</p>
        </div>
      ) : !selectedAssignmentId ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Iltimos, testni tanlang</p>
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
                
                <Button 
                  variant={submission.status === 'graded' ? 'outline' : 'gradient'} 
                  size="sm"
                  onClick={() => handleViewStudentAnswers(submission)}
                >
                  {submission.status === 'graded' ? 'Ko\'rish' : 'Tekshirish'}
                </Button>
              </div>
            </div>

            {/* Expanded Review Section */}
            {selectedSubmission?.id === submission.id && (
              <div className="mt-6 pt-6 border-t border-border space-y-4">
                {/* Test javoblari (quiz uchun) */}
                {selectedSubmission.assignment?.type === 'quiz' && selectedSubmission.answers && selectedSubmission.answers.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground mb-4">Savollar va javoblar:</h3>
                    {selectedSubmission.answers.map((qa: QuestionAnswer, index: number) => (
                      <div 
                        key={qa.questionId || index}
                        className={cn(
                          "border rounded-lg p-4",
                          qa.isCorrect 
                            ? "border-success/50 bg-success/5" 
                            : "border-error/50 bg-error/5"
                        )}
                      >
                        <div className="flex items-start gap-2 mb-3">
                          <span className="font-semibold text-foreground">{index + 1}.</span>
                          <p className="font-medium text-foreground flex-1">{qa.question || 'Savol'}</p>
                          {qa.isCorrect !== undefined && (
                            <div className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              qa.isCorrect 
                                ? "bg-success/20 text-success" 
                                : "bg-error/20 text-error"
                            )}>
                              {qa.isCorrect ? '✅ To\'g\'ri' : '❌ Xato'}
                            </div>
                          )}
                        </div>
                        <div className="ml-6 space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">O'quvchi javobi:</p>
                            <p className={cn(
                              "text-sm font-medium",
                              qa.isCorrect ? "text-success" : "text-error"
                            )}>
                              {qa.answer || 'Javob berilmagan'}
                            </p>
                          </div>
                          {qa.correctAnswer && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">To'g'ri javob:</p>
                              <p className="text-sm font-medium text-success">{qa.correctAnswer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* Umumiy natija */}
                    <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Umumiy natija:</span>
                        <span className="text-2xl font-bold text-primary">
                          {selectedSubmission.answers.filter((a: QuestionAnswer) => a.isCorrect).length}/
                          {selectedSubmission.answers.length} (
                          {Math.round((selectedSubmission.answers.filter((a: QuestionAnswer) => a.isCorrect).length / selectedSubmission.answers.length) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Oddiy topshiriq javobi */
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">O'quvchi javobi:</p>
                    <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                      {submission.answer}
                    </div>
                  </div>
                )}

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
