import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { weekLessons } from '@/data/weekLessons';

interface LessonData {
  _id: string;
  videos: Array<{
    _id: string;
    url: string;
    title: string;
  }>;
  audios: Array<{
    _id: string;
    url: string;
    title: string;
  }>;
}

export default function LessonDetailPage() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  
  const dayNumber = day ? parseInt(day, 10) : null;
  const lesson = dayNumber && weekLessons[dayNumber];

  // Backend'dan lesson ma'lumotlarini olish (video/audio uchun)
  useEffect(() => {
    const loadLessonData = async () => {
      if (!dayNumber || !hasAccess) return;
      
      // Faqat 4, 5, 6 darslar uchun backend'dan ma'lumot olish
      if (dayNumber !== 4 && dayNumber !== 5 && dayNumber !== 6) {
        setLessonData(null);
        return;
      }
      
      // lessonData'ni avval tozalash - yangi darsga o'tilganda eski ma'lumotlar ko'rsatilmasligi uchun
      setLessonData(null);
      
      try {
        const response = await apiService.request<{ lesson: LessonData }>(`/lessons/day/${dayNumber}`);
        // 404 xatolikni tekshirish
        if (response.status === 404 || !response.success) {
          // 404 yoki muvaffaqiyatsiz javob - statik ma'lumotlar ishlatiladi
          return;
        }
        if (response.success && response.data) {
          setLessonData(response.data.lesson);
        }
      } catch (error: any) {
        // Xatolikni e'tiborsiz qoldirish (backend'da route topilmasa ham muammo emas)
        // Statik ma'lumotlar ishlatiladi
      }
    };

    if (hasAccess) {
      loadLessonData();
    }
  }, [dayNumber, hasAccess]);

  // Dars holatini tekshirish
  useEffect(() => {
    const checkLessonAccess = async () => {
      if (!dayNumber) {
        setIsCheckingAccess(false);
        return;
      }

      // 1-dars har doim ochiq
      if (dayNumber === 1) {
        setHasAccess(true);
        setIsCheckingAccess(false);
        // Birinchi mavzuni tanlash
        if (lesson && Object.keys(lesson.topics).length > 0) {
          setSelectedTopic(Object.keys(lesson.topics)[0]);
        }
        return;
      }

      try {
        const response = await apiService.getStudentLessons();
        if (response.success && response.data) {
          interface LessonStatus {
            day: number;
            isUnlocked: boolean;
          }
          const lessonStatus = (response.data.lessons as LessonStatus[]).find((l) => l.day === dayNumber);
          if (lessonStatus && lessonStatus.isUnlocked) {
            setHasAccess(true);
            // Birinchi mavzuni tanlash (faqat selectedTopic null bo'lsa)
            if (lesson && lesson.topics && Object.keys(lesson.topics).length > 0) {
              const firstTopic = Object.keys(lesson.topics)[0];
              if (!selectedTopic || !lesson.topics[selectedTopic]) {
                setSelectedTopic(firstTopic);
              }
            }
          } else {
            toast.error('Bu dars hali ochilmagan');
            navigate('/student/lessons');
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Dars holatini tekshirishda xatolik';
        toast.error(errorMessage);
        navigate('/student/lessons');
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkLessonAccess();
  }, [dayNumber, navigate, lesson]);

  // Darsga kirilganda progress yangilash
  useEffect(() => {
    if (dayNumber && hasAccess) {
      apiService.request(`/lessons/day/${dayNumber}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ timeSpent: 0 }),
      }).catch(() => {
        // Xatolikni e'tiborsiz qoldirish
      });
    }
  }, [dayNumber, hasAccess]);

  // Birinchi mavzuni avtomatik tanlash (faqat yangi darsga o'tilganda)
  useEffect(() => {
    // 5-6 darslar uchun topic tanlash kerak emas
    if (dayNumber === 5 || dayNumber === 6) {
      setSelectedTopic(null);
      return;
    }
    
    // Faqat yangi darsga o'tilganda birinchi mavzuni tanlash
    // Agar selectedTopic allaqachon o'rnatilgan bo'lsa, uni o'zgartirmaslik
    if (lesson && lesson.topics && Object.keys(lesson.topics).length > 0) {
      const firstTopic = Object.keys(lesson.topics)[0];
      // Faqat selectedTopic null yoki mavjud bo'lmagan topic bo'lsa, o'rnatish
      if (!selectedTopic || !lesson.topics[selectedTopic]) {
        setSelectedTopic(firstTopic);
      }
    } else {
      // Topic'lar bo'lmasa, null qilish
      setSelectedTopic(null);
    }
  }, [dayNumber]); // Faqat dayNumber o'zgarganda ishlatish

  if (isCheckingAccess) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Tekshirilmoqda...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !hasAccess) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {!lesson ? 'Dars topilmadi' : 'Bu dars hali ochilmagan'}
          </p>
          <Button onClick={() => navigate('/student/lessons')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Darsliklarga qaytish
          </Button>
        </div>
      </div>
    );
  }

  const topicKeys = lesson.topics ? Object.keys(lesson.topics) : [];
  const currentTopic = selectedTopic && lesson.topics && lesson.topics[selectedTopic] 
    ? lesson.topics[selectedTopic] 
    : null;

  // 5-6 darslar uchun topic'larni ko'rsatmaslik
  const showTopics = dayNumber !== 5 && dayNumber !== 6;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate('/student/lessons')}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {lesson.day}-Kun: {lesson.title}
          </h1>
        </div>
      </div>

      {/* Topics - 5-6 darslar uchun ko'rsatilmaydi */}
      {showTopics && topicKeys.length > 0 && (
        <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Dars mavzulari:</h2>
          <div className="flex flex-wrap gap-2">
            {topicKeys.map((topicKey) => (
              <button
                key={topicKey}
                onClick={() => setSelectedTopic(topicKey)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-all",
                  selectedTopic === topicKey
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {topicKey}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content - 5-6 darslar uchun topic'larsiz video ko'rsatish */}
      {(dayNumber === 5 || dayNumber === 6) ? (
        <>
          <style>{`
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(148, 163, 184, 0.5);
              border-radius: 5px;
              border: 2px solid transparent;
              background-clip: padding-box;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(148, 163, 184, 0.7);
              background-clip: padding-box;
            }
            .video-player-container {
              position: relative;
              width: 100%;
              max-width: 4xl;
              margin: 0 auto;
            }
            .video-player-container video {
              width: 100%;
              height: auto;
              border-radius: 0.5rem;
              background: #000;
            }
          `}</style>
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            {/* 5-6 darslar uchun videolar (backend'dan yoki statik) */}
            <div className="w-full max-w-4xl mx-auto">
              {lessonData && lessonData.videos && lessonData.videos.length > 0 ? (
                // Backend'dan kelgan videolar
                lessonData.videos.map((video) => (
                  <div key={`${dayNumber}-${video._id}`} className="w-full">
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{video.title}</h3>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                      <video 
                        key={`${dayNumber}-${video._id}-player`}
                        className="w-full h-full" 
                        controls 
                        controlsList="nodownload"
                        preload="metadata"
                        style={{ outline: 'none' }}
                      >
                        <source src={video.url} type="video/mp4" />
                        Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
                      </video>
                    </div>
                  </div>
                ))
              ) : (
                // Statik videolar
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                  <video 
                    key={`static-${dayNumber}-player`}
                    className="w-full h-full" 
                    controls 
                    controlsList="nodownload"
                    preload="metadata"
                    style={{ outline: 'none' }}
                  >
                    <source 
                      src={dayNumber === 5 
                        ? "https://pub-e29856519e414c75bfcf296d0dc7f3ad.r2.dev/Trailer/1768883942399-record-5.mp4"
                        : "https://pub-033320f904dd42188d7dc224d58a2682.r2.dev/record-6.mp4"
                      } 
                      type="video/mp4" 
                    />
                    Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
                  </video>
                </div>
              )}
            </div>
          </div>
        </>
      ) : currentTopic && (
        <>
          <style>{`
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(148, 163, 184, 0.5);
              border-radius: 5px;
              border: 2px solid transparent;
              background-clip: padding-box;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(148, 163, 184, 0.7);
              background-clip: padding-box;
            }
            .video-player-container {
              position: relative;
              width: 100%;
              max-width: 4xl;
              margin: 0 auto;
            }
            .video-player-container video {
              width: 100%;
              height: auto;
              border-radius: 0.5rem;
              background: #000;
            }
          `}</style>
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            {/* 4-dars uchun audiolar (backend'dan) - faqat "Yuk ma'lumotlarini olish shablon" topic'i uchun */}
            {dayNumber === 4 && lessonData && lessonData.audios && lessonData.audios.length > 0 && selectedTopic === "Yuk ma'lumotlarini olish shablon" ? (
              <div className="w-full max-w-4xl mx-auto space-y-6">
                {lessonData.audios.map((audio) => (
                  <div key={audio._id} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                      <span>🎵</span>
                      {audio.title}
                    </h3>
                    <audio 
                      controls 
                      controlsList="nodownload"
                      className="w-full"
                      style={{ outline: 'none' }}
                    >
                      <source src={audio.url} type="audio/mpeg" />
                      <source src={audio.url} type="audio/wav" />
                      <source src={audio.url} type="audio/ogg" />
                      Sizning brauzeringiz audio elementini qo'llab-quvvatlamaydi.
                    </audio>
                  </div>
                ))}
                {/* Topic kontentini ham ko'rsatish */}
                {currentTopic && (
                  <div 
                    className="overflow-y-auto pr-2 custom-scrollbar mt-6"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent',
                      maxHeight: 'calc(100vh - 300px)'
                    }}
                  >
                    <div
                      className="prose prose-sm sm:prose-base max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: currentTopic.content }}
                    />
                  </div>
                )}
              </div>
            ) : currentTopic && currentTopic.videos && currentTopic.videos.length > 0 ? (
              /* Frontend'dagi statik videolar */
              <div className="w-full max-w-4xl mx-auto">
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                  <video 
                    className="w-full h-full" 
                    controls 
                    controlsList="nodownload"
                    preload="metadata"
                    style={{ outline: 'none' }}
                  >
                    <source src={currentTopic.videos[0]} type="video/mp4" />
                    Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
                  </video>
                </div>
              </div>
            ) : currentTopic ? (
              /* Oddiy kontent */
              <div 
                className="overflow-y-auto pr-2 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent',
                  maxHeight: 'calc(100vh - 300px)'
                }}
              >
                <div
                  className="prose prose-sm sm:prose-base max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: currentTopic.content }}
                />
              </div>
            ) : null}
          </div>
        </>
      )}

       {/* Agar mavzular bo'sh bo'lsa (5-6 darslar uchun ko'rsatilmaydi) */}
       {dayNumber !== 5 && dayNumber !== 6 && topicKeys.length === 0 && (
         <div className="bg-card rounded-xl p-4 sm:p-6 border border-border text-center py-12">
           <p className="text-muted-foreground">Bu dars uchun mavzular hali qo'shilmagan</p>
         </div>
       )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={() => {
            if (dayNumber && dayNumber > 1) {
              navigate(`/student/lessons/${dayNumber - 1}`);
            } else {
              navigate('/student/lessons');
            }
          }}
          variant="outline"
          disabled={dayNumber === 1}
          className='text-white hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 gradient-primary text-primary-foreground shadow-lg hover:shadow-glow active:scale-[0.98]'
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Oldingi dars
        </Button>

        {dayNumber === 7 ? (
          <Button
            onClick={() => navigate('/student/assignments')}
            variant="gradient"
          >
            Testlar paneli
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (dayNumber && dayNumber < 7) {
                navigate(`/student/lessons/${dayNumber + 1}`);
              }
            }}
            variant="gradient"
            disabled={dayNumber === 7}
          >
            Keyingi dars
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Button>
        )}
      </div>
    </div>
  );
}

