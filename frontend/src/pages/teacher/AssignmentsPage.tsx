import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiService } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { 
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
    _id?: string;
    title?: string;
    questions?: Array<{
      _id?: string;
      question: string;
      correctAnswer?: string;
      points: number;
    }>;
    maxScore?: number;
    type?: string;
  };
  // Test natijalari (quiz uchun)
  correctCount?: number | null;
  totalQuestions?: number | null;
  passed?: boolean;
  hasPassed?: boolean;
  attemptsUsed?: number;
}

export default function TeacherAssignmentsPage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  // 40 ta savollik testni avtomatik tanlash
  useEffect(() => {
    if (assignments.length > 0 && !selectedAssignmentId) {
      const test40 = assignments.find(a => 
        a.type === 'quiz' && 
        a.questions?.length === 40 &&
        a.title?.includes('XALQARO LOGISTIKA BO\'YICHA 40 TA TEST')
      );
      if (test40) {
        setSelectedAssignmentId(test40._id);
        loadSubmissions(test40._id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments]);

  const loadAssignments = async () => {
    try {
      const response = await apiService.request<{ assignments: any[] }>('/assignments');
      if (response.success && response.data) {
        // Faqat 40 ta savollik testni ko'rsatish
        const filteredAssignments = (response.data.assignments || []).filter((a: any) => 
          a.type === 'quiz' && 
          a.questions?.length === 40 &&
          a.title?.includes('XALQARO LOGISTIKA BO\'YICHA 40 TA TEST')
        );
        setAssignments(filteredAssignments);
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

  // Faqat 40 ta savollik test uchun statistika
  const quizSubmissions = submissions.filter(s => 
    s.assignment?.type === 'quiz' && 
    s.assignment?.questions?.length === 40 &&
    s.assignment?.title?.includes('XALQARO LOGISTIKA BO\'YICHA 40 TA TEST')
  );
  const quizAssignments = assignments.filter(a => 
    a.type === 'quiz' && 
    a.questions?.length === 40 &&
    a.title?.includes('XALQARO LOGISTIKA BO\'YICHA 40 TA TEST')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Testlarning natijasi</h1>
          <p className="text-muted-foreground">
            O'quvchilar testlarining natijalarini ko'ring
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/teacher/tests')}
          className='bg-white/80 hover:bg-white shadow-glow border border-black text-black'
        >
          Testlar
        </Button>
      </div>

      {/* O'quvchilar ro'yxati (faqat tanlangan test uchun) */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {quizAssignments[0]?.title || '40 ta test'} yechgan o'quvchilar
        </h2>
      </div>

      {/* Submissions List */}
      {!selectedAssignmentId || (selectedAssignmentId && submissions.length === 0) ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Bu testni yechgan o'quvchilar hozircha yo'q</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission, submissionIndex) => (
          <div
            key={submission.id || `submission-${submissionIndex}`}
            className={cn(
              "bg-card rounded-xl p-5 border shadow-card transition-all duration-200",
              selectedSubmission?.id === submission.id
                ? "border-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Student Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                  {submission.studentAvatar || '??'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base truncate">
                    {submission.studentName || 'Noma\'lum o\'quvchi'}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{submission.assignmentTitle}</p>
                  {submission.assignment?.type === 'quiz' && submission.attemptsUsed && submission.attemptsUsed > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Imkoniyat: {submission.attemptsUsed}
                    </p>
                  )}
                </div>
              </div>

              {/* Scores - Test natijalari (quiz uchun) */}
              {submission.assignment?.type === 'quiz' && submission.correctCount !== null && submission.totalQuestions !== null ? (
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Test natijasi</p>
                    <p className="text-lg font-semibold text-primary">
                      {submission.correctCount}/{submission.totalQuestions}
                    </p>
                    <p className="text-xs font-medium text-primary">
                      {Math.round((submission.correctCount / submission.totalQuestions) * 100)}%
                    </p>
                    {submission.hasPassed && (
                      <p className="text-xs text-success font-medium mt-1">✅ Sertifikat</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">AI ball</p>
                    <p className="text-lg font-semibold text-primary">{submission.aiScore || 0}%</p>
                  </div>
                  {submission.teacherScore && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Sizning ball</p>
                      <p className="text-lg font-semibold text-success">{submission.teacherScore}%</p>
                    </div>
                  )}
                </div>
              )}

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
                  variant={selectedSubmission?.id === submission.id ? 'outline' : (submission.status === 'graded' ? 'outline' : 'gradient')} 
                  size="sm"
                  className='hover:bg-'
                  onClick={() => {
                    if (selectedSubmission?.id === submission.id) {
                      // Agar ochiq bo'lsa, yopish
                      setSelectedSubmission(null);
                    } else {
                      // Agar yopiq bo'lsa, ochish
                      handleViewStudentAnswers(submission);
                    }
                  }}
                >
                  {selectedSubmission?.id === submission.id ? 'Yopish' : (submission.status === 'graded' ? 'Ko\'rish' : 'Tekshirish')}
                </Button>
              </div>
            </div>

            {/* Expanded Review Section */}
            {selectedSubmission?.id === submission.id && (
              <div className="mt-6 pt-6 border-t border-border space-y-4">
                {/* Test javoblari (quiz uchun) */}
                {selectedSubmission?.assignment?.type === 'quiz' && selectedSubmission?.answers && selectedSubmission.answers.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground mb-4">Savollar va javoblar:</h3>
                    {selectedSubmission.answers.map((qa: QuestionAnswer, index: number) => (
                      <div 
                        key={qa.questionId || `answer-${selectedSubmission.id}-${index}`}
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
                  </div>
                )}

                {(submission.status === 'pending' || submission.status === 'submitted') ? (
                  <>
                    {/* Score Input */}
                    <div>
                    </div>
                    {/* Feedback */}
                    <div>
                  
                    </div>

                  </>
                ) : (
                  <div>
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
