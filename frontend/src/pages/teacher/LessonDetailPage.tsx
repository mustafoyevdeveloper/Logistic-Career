import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { weekLessons } from '@/data/weekLessons';

export default function TeacherLessonDetailPage() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const dayNumber = day ? parseInt(day, 10) : null;
  const lesson = dayNumber && weekLessons[dayNumber];
  const topicKeys = lesson ? Object.keys(lesson.topics || {}) : [];

  // Birinchi mavzuni avtomatik tanlash
  useEffect(() => {
    if (lesson && topicKeys.length > 0 && !selectedTopic) {
      setSelectedTopic(topicKeys[0]);
    }
  }, [lesson, topicKeys, selectedTopic]);

  if (!lesson) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Dars topilmadi</p>
          <Button onClick={() => navigate('/teacher/lessons')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Darsliklarga qaytish
          </Button>
        </div>
      </div>
    );
  }

  const currentTopic = selectedTopic && lesson.topics[selectedTopic] 
    ? lesson.topics[selectedTopic] 
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate('/teacher/lessons')}
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

      {/* Topics */}
      {topicKeys.length > 0 && (
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

      {/* Content - Bitta ustunli layout */}
      {currentTopic && (
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
          `}</style>
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
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
          </div>
        </>
      )}

      {/* Agar mavzular bo'sh bo'lsa */}
      {topicKeys.length === 0 && (
        <div className="bg-card rounded-xl p-4 sm:p-6 border border-border text-center py-12">
          <p className="text-muted-foreground">Bu dars uchun mavzular hali qo'shilmagan</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={() => {
            if (dayNumber && dayNumber > 1) {
              navigate(`/teacher/lessons/${dayNumber - 1}`);
            } else {
              navigate('/teacher/lessons');
            }
          }}
          variant="outline"
          disabled={dayNumber === 1}
          className='text-white hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 gradient-primary text-primary-foreground shadow-lg hover:shadow-glow active:scale-[0.98]'
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Oldingi dars
        </Button>

        <Button
          onClick={() => {
            if (dayNumber && dayNumber < 7) {
              navigate(`/teacher/lessons/${dayNumber + 1}`);
            }
          }}
          variant="gradient"
          disabled={dayNumber === 7}
        >
          Keyingi dars
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        </Button>
      </div>
    </div>
  );
}

