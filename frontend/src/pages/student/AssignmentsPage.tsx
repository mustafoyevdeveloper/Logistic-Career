import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Trophy,
  Send,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Question {
  _id?: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'scenario';
  options?: string[];
  correctAnswer?: any;
  points: number;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore: number;
  type: 'quiz' | 'practical' | 'scenario';
  questions: Question[];
  submission?: any;
}

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
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.request<{ assignments: Assignment[] }>('/assignments');
      if (response.success && response.data) {
        setAssignments(response.data.assignments || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Topshiriqlarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssignmentDetails = async (assignmentId: string) => {
    try {
      const response = await apiService.request<{ assignment: Assignment; submission?: any }>(`/assignments/${assignmentId}`);
      if (response.success && response.data) {
        const assignment = response.data.assignment;
        setSelectedAssignment(assignment);
        
        // Agar submission mavjud bo'lsa, javoblarni yuklash
        if (response.data.submission && response.data.submission.answers) {
          const submissionAnswers: Record<string, string> = {};
          response.data.submission.answers.forEach((ans: any) => {
            if (ans.questionId) {
              submissionAnswers[ans.questionId.toString()] = typeof ans.answer === 'string' ? ans.answer : JSON.stringify(ans.answer);
            }
          });
          setAnswers(submissionAnswers);
        } else {
          // Yangi topshiriq uchun bo'sh javoblar
          setAnswers({});
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Topshiriq ma\'lumotlarini yuklashda xatolik');
    }
  };

  const handleOpenAssignment = (assignment: Assignment) => {
    if (assignment.status === 'graded' || assignment.status === 'submitted') {
      // Baholangan yoki yuborilgan topshiriqni ko'rish
      loadAssignmentDetails(assignment._id);
    } else {
      // Yangi topshiriqni ochish
      loadAssignmentDetails(assignment._id);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return;

    // Barcha savollarga javob berilganini tekshirish
    const unansweredQuestions = selectedAssignment.questions.filter(q => {
      const questionId = q._id?.toString() || '';
      return !answers[questionId] || answers[questionId].trim() === '';
    });

    if (unansweredQuestions.length > 0) {
      toast.error('Iltimos, barcha savollarga javob bering');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Answers formatini backend'ga moslashtirish
      const formattedAnswers = selectedAssignment.questions.map(q => ({
        questionId: q._id,
        answer: answers[q._id?.toString() || '']
      }));

      const response = await apiService.request(`/assignments/${selectedAssignment._id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      if (response.success) {
        toast.success('Topshiriq muvaffaqiyatli yuborildi!');
        setSelectedAssignment(null);
        setAnswers({});
        loadAssignments(); // Ro'yxatni yangilash
      }
    } catch (error: any) {
      toast.error(error.message || 'Topshiriqni yuborishda xatolik');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border shadow-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedAssignment.title}</h2>
                  <p className="text-muted-foreground mt-1">{selectedAssignment.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedAssignment(null);
                    setAnswers({});
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {selectedAssignment.questions.map((question, index) => {
                  const questionId = question._id?.toString() || index.toString();
                  const currentAnswer = answers[questionId] || '';

                  return (
                    <div key={questionId} className="border border-border rounded-lg p-4">
                      <div className="mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="font-semibold text-foreground">{index + 1}.</span>
                          <p className="font-medium text-foreground flex-1">{question.question}</p>
                          <span className="text-sm text-muted-foreground">({question.points} ball)</span>
                        </div>
                      </div>

                      {question.type === 'multiple-choice' && question.options ? (
                        <RadioGroup
                          value={currentAnswer}
                          onValueChange={(value) => handleAnswerChange(questionId, value)}
                          disabled={selectedAssignment.status === 'graded' || selectedAssignment.status === 'submitted'}
                        >
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2 py-2">
                              <RadioGroupItem value={option} id={`${questionId}-${optIndex}`} />
                              <Label htmlFor={`${questionId}-${optIndex}`} className="cursor-pointer flex-1">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <Textarea
                          value={currentAnswer}
                          onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                          placeholder="Javobingizni yozing..."
                          disabled={selectedAssignment.status === 'graded' || selectedAssignment.status === 'submitted'}
                          rows={4}
                          className="w-full"
                        />
                      )}

                      {/* Correct answer (if graded) */}
                      {selectedAssignment.status === 'graded' && question.correctAnswer && question.type === 'multiple-choice' && (
                        <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                          <p className="text-sm font-medium text-success">To'g'ri javob: {question.correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submission Info */}
              {selectedAssignment.submission && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Yuborilgan vaqt:</p>
                      <p className="font-medium text-foreground">
                        {selectedAssignment.submission.submittedAt 
                          ? new Date(selectedAssignment.submission.submittedAt).toLocaleString('uz-UZ')
                          : 'Noma\'lum'}
                      </p>
                    </div>
                    {selectedAssignment.status === 'graded' && selectedAssignment.score !== undefined && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Ball:</p>
                        <p className="text-2xl font-bold text-success">
                          {selectedAssignment.score}/{selectedAssignment.maxScore}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedAssignment.submission.teacherFeedback && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">O'qituvchi izohi:</p>
                      <p className="text-sm text-muted-foreground">{selectedAssignment.submission.teacherFeedback}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {selectedAssignment.status === 'pending' && (
                <div className="mt-6 flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedAssignment(null);
                      setAnswers({});
                    }}
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    variant="gradient"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Yuborish
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assignments List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
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
                  onClick={() => handleOpenAssignment(assignment)}
              >
                {assignment.status === 'pending' ? (
                  <>
                    Boshlash
                      <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : assignment.status === 'graded' ? (
                    'Natijani ko\'rish'
                  ) : (
                  'Ko\'rish'
                )}
              </Button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
