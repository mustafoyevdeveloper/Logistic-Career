import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { getDeviceId } from '@/utils/deviceId';
import { Trophy, Check, XCircle } from 'lucide-react';
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

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null); // faqat quiz
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({}); // To'g'ri yoki xato
  const [lockedQuestions, setLockedQuestions] = useState<Record<string, boolean>>({}); // Javob berilgan savollar (o'zgartirib bo'lmaydi)
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.request<{ assignments: Assignment[] }>('/assignments');
      if (response.success && response.data) {
        const list = response.data.assignments || [];
        setAssignments(list);

        // Testlar sahifasi: faqat 40 savol testning o'zi
        const quiz =
          list.find((a) => a.type === 'quiz' && a.questions?.length === 40) ||
          list.find((a) => a.type === 'quiz') ||
          null;

        if (quiz) {
          await loadAssignmentDetails(quiz._id);
        }
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
        const submission = response.data.submission;

        // Assignmentga submission va statusni biriktiramiz (frontendda ko'rsatish uchun)
        const assignmentWithSubmission = {
          ...assignment,
          submission,
          status: submission?.status || assignment.status,
        };
        setSelectedAssignment(assignmentWithSubmission);

        // Agar submission mavjud bo'lsa, javoblarni yuklash
        if (submission && submission.answers) {
          const submissionAnswers: Record<string, string> = {};
          submission.answers.forEach((ans: any) => {
            if (ans.questionId) {
              submissionAnswers[ans.questionId.toString()] = typeof ans.answer === 'string' ? ans.answer : JSON.stringify(ans.answer);
            }
          });
          setAnswers(submissionAnswers);

          // Quiz uchun oldingi javoblarni lock qilib, correctness'ni hisoblaymiz
          if (assignment.type === 'quiz') {
            const locked: Record<string, boolean> = {};
            const results: Record<string, boolean> = {};
            assignment.questions.forEach((q, idx) => {
              const qid = q._id?.toString() || idx.toString();
              const ua = submissionAnswers[qid];
              if (ua !== undefined && ua !== '') {
                locked[qid] = true;
                if (q.correctAnswer !== undefined) results[qid] = ua === q.correctAnswer;
              }
            });
            setLockedQuestions(locked);
            setAnsweredQuestions(results);
          }
        } else {
          // Yangi topshiriq uchun bo'sh javoblar
          setAnswers({});
          setAnsweredQuestions({});
          setLockedQuestions({});
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Topshiriq ma\'lumotlarini yuklashda xatolik');
    }
  };

  // To'g'ri javoblar soni (quiz uchun 0..40)
  function calculateCorrectCount() {
    if (!selectedAssignment) return 0;
    let correct = 0;
    selectedAssignment.questions.forEach((question, idx) => {
      const questionId = question._id?.toString() || idx.toString();
      const userAnswer = answers[questionId];
      if (userAnswer !== undefined && question.correctAnswer !== undefined && userAnswer === question.correctAnswer) {
        correct += 1;
      }
    });
    return correct;
  }

  const hasPassedLocal = useMemo(() => {
    const backendPass = selectedAssignment?.submission?.hasPassed;
    if (backendPass !== undefined) return backendPass;
    // Fallback: agar status graded bo'lsa va 30+ bo'lsa, frontendda ham ochib turamiz
    return selectedAssignment?.status === 'graded' && calculateCorrectCount() >= 30;
  }, [selectedAssignment?.submission?.hasPassed, selectedAssignment?.status, selectedAssignment, answers]);

  const canDownloadCertificate = useMemo(() => {
    return Boolean(hasPassedLocal);
  }, [hasPassedLocal]);

  const attemptsUsed = selectedAssignment?.submission?.attemptsUsed ?? 0;
  const maxAttempts = selectedAssignment?.submission?.maxAttempts ?? 2;
  const attemptsText = useMemo(() => {
    return `${Math.min(attemptsUsed, maxAttempts)}/${maxAttempts}`;
  }, [attemptsUsed, maxAttempts]);

  // 1-imkoniyat tugmasi: faqat 30+ (hasPassed) bo'lganda va attemptsUsed < max
  const canReset = useMemo(() => {
    return Boolean(hasPassedLocal) && attemptsUsed < maxAttempts;
  }, [hasPassedLocal, attemptsUsed, maxAttempts]);

  const isSecondAttempt = attemptsUsed >= 1;

  const handleReset = async () => {
    if (!selectedAssignment) return;
    try {
      setIsResetting(true);
      const resp = await apiService.request(`/assignments/${selectedAssignment._id}/reset`, {
        method: 'POST',
      });
      if (resp.success) {
        toast.success('Test qayta ochildi');
        await loadAssignmentDetails(selectedAssignment._id);
      } else {
        toast.error(resp.message || 'Reset qilishda xatolik');
      }
    } catch (e: any) {
      toast.error(e.message || 'Reset qilishda xatolik');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!selectedAssignment) return;
    try {
      setIsDownloadingCert(true);
      const token = localStorage.getItem('auth_token');
      const deviceId = getDeviceId();
      const baseUrl = apiService.getCurrentBackendUrl();
      const url = `${baseUrl}/assignments/${selectedAssignment._id}/certificate.png`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(deviceId ? { 'X-Device-ID': deviceId } : {}),
        },
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const blob = await resp.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'certificate.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Sertifikat yuklab olindi');
    } catch (e: any) {
      toast.error(e.message || 'Sertifikatni yuklab olishda xatolik');
    } finally {
      setIsDownloadingCert(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string, correctAnswer?: any) => {
    // Agar savol allaqachon javob berilgan bo'lsa, o'zgartirib bo'lmaydi
    if (lockedQuestions[questionId]) {
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    if (!selectedAssignment) return;

    // Har bir javobni backendga saqlash (quiz)
    if (selectedAssignment.type === 'quiz') {
      apiService
        .request(`/assignments/${selectedAssignment._id}/answer`, {
          method: 'POST',
          body: JSON.stringify({ questionId, answer }),
        })
        .catch(() => {
          toast.error('Javobni saqlashda xatolik');
        });
    }

    // Real-time natija tekshirish (faqat test topshiriqlari uchun)
    if (correctAnswer !== undefined) {
      const isCorrect = answer === correctAnswer;
      setAnsweredQuestions(prev => ({
        ...prev,
        [questionId]: isCorrect
      }));

      // Savolni qulflash (javob berilganidan keyin o'zgartirib bo'lmaydi)
      setLockedQuestions(prev => ({
        ...prev,
        [questionId]: true
      }));

      // Telegram quiz kabi darhol feedback
      if (isCorrect) toast.success("To'g'ri", { duration: 1200 });
      else toast.error("Xato", { duration: 1200 });
    }
  };

  // Javob berilgan savollar soni
  const getAnsweredCount = () => {
    return Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length;
  };

  const isAllAnswered = useMemo(() => {
    if (!selectedAssignment) return false;
    return getAnsweredCount() === selectedAssignment.questions.length;
  }, [selectedAssignment, answers]);

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
        toast.success('Natija MongoDBga saqlandi!');
        await loadAssignmentDetails(selectedAssignment._id);
      }
    } catch (error: any) {
      toast.error(error.message || 'Topshiriqni yuborishda xatolik');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Testlar</h1>
      </div>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      ) : !selectedAssignment ? (
        <div className="bg-card rounded-xl p-6 border border-border text-center">
          <p className="text-muted-foreground">Test topilmadi</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Questions (faqat multiple-choice) */}
          <div className="space-y-6">
            {selectedAssignment.questions.map((question, index) => {
              const questionId = question._id?.toString() || index.toString();
              const currentAnswer = answers[questionId] || '';
              const isAnswered = currentAnswer !== '';
              const isCorrect = answeredQuestions[questionId];
              const showResult = selectedAssignment.type === 'quiz' && isAnswered;

              return (
                <div
                  key={questionId}
                  className={cn(
                    "border rounded-lg p-4 transition-all duration-200",
                    showResult && isCorrect === true
                      ? "border-success/50 bg-success/10"
                      : showResult && isCorrect === false
                      ? "border-error/50 bg-error/10"
                      : "border-border"
                  )}
                >
                  <div className="mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="font-semibold text-foreground">{index + 1}.</span>
                      <p className="font-medium text-foreground flex-1">{question.question}</p>
                      {showResult && (
                        isCorrect ? (
                          <Check className="w-5 h-5 text-success" />
                        ) : (
                          <XCircle className="w-5 h-5 text-error" />
                        )
                      )}
                    </div>
                  </div>

                  {question.type === 'multiple-choice' && question.options ? (
                    <RadioGroup
                      value={currentAnswer}
                      onValueChange={(value) => handleAnswerChange(questionId, value, question.correctAnswer)}
                      disabled={selectedAssignment.status === 'graded' || selectedAssignment.status === 'submitted' || lockedQuestions[questionId]}
                    >
                      {question.options.map((option, optIndex) => {
                        const isSelected = currentAnswer === option;
                        const showOptionResult = showResult && isSelected;
                        const isLocked = lockedQuestions[questionId];

                        return (
                          <div
                            key={optIndex}
                            className={cn(
                              "flex items-center space-x-2 py-2 px-3 rounded-lg transition-colors",
                              showOptionResult && isCorrect === true
                                ? "bg-success/10 border border-success/30"
                                : showOptionResult && isCorrect === false
                                ? "bg-error/10 border border-error/30"
                                : isLocked && !isSelected
                                ? "opacity-60"
                                : ""
                            )}
                          >
                            <RadioGroupItem
                              value={option}
                              id={`${questionId}-${optIndex}`}
                              disabled={isLocked}
                            />
                            <Label
                              htmlFor={`${questionId}-${optIndex}`}
                              className={cn(
                                "flex-1",
                                isLocked && !isSelected ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                              )}
                            >
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  ) : null}

                  {showResult && (
                    <div
                      className={cn(
                        "mt-3 p-3 rounded-lg flex items-center gap-2",
                        isCorrect
                          ? "bg-success/10 border border-success/20"
                          : "bg-error/10 border border-error/20"
                      )}
                    >
                      {isCorrect ? (
                        <>
                          <Check className="w-5 h-5 text-success" />
                          <p className="text-sm font-medium text-success">To'g'ri</p>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-error" />
                          <div className="flex flex-col text-sm">
                            <span className="font-medium text-error">Xato</span>
                            <span className="text-muted-foreground">Sizning javobingiz: {currentAnswer}</span>
                            {question.correctAnswer && (
                              <span className="text-error font-medium">To'g'ri javob: {question.correctAnswer}</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final result faqat hammasi bajarilganda */}
          {isAllAnswered && (
            <div className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl border-2 border-primary/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Natija</p>
                  <p className="text-3xl font-bold text-foreground">
                    {calculateCorrectCount()}/{selectedAssignment.questions.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    To'g'ri: {Object.values(answeredQuestions).filter(Boolean).length} | Xato: {selectedAssignment.questions.length - Object.values(answeredQuestions).filter(Boolean).length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Foiz: {selectedAssignment.questions.length > 0 ? Math.round((calculateCorrectCount() / selectedAssignment.questions.length) * 100) : 0}%
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-primary" />
                  </div>
                  {selectedAssignment.status !== 'graded' && (
                    <Button variant="gradient" onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Saqlanmoqda...' : 'Natijani saqlash'}
                    </Button>
                  )}
                </div>
              </div>
              {selectedAssignment.status === 'graded' && (
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    Natija MongoDB'ga saqlandi. Imkoniyat:{" "}
                    <span className="font-medium text-foreground">{attemptsText}</span>
                    {isSecondAttempt && <span className="ml-2 text-primary font-semibold">(2-imkoniyat)</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* 30+ bo'lsa va imkoniyat qolgan bo'lsa: Qayta topshirish (reset) */}
                    {canReset && (
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={isResetting}
                        title="Testni qayta boshlash (javoblar tozalanadi)"
                      >
                        {isResetting ? 'Qayta ochilmoqda...' : isSecondAttempt ? 'Imkoniyat tugadi' : 'Qayta topshirish'}
                      </Button>
                    )}

                    {/* Sertifikat tugmasi: faqat 30+ bo'lganda (har ikki imkoniyatda ham) */}
                    {canDownloadCertificate && (
                      <Button
                        variant="gradient"
                        onClick={handleDownloadCertificate}
                        disabled={isDownloadingCert}
                        title="Sertifikatni yuklab olish"
                      >
                        {isDownloadingCert ? 'Yuklanmoqda...' : 'Sertifikatni yuklab olish (PNG)'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
