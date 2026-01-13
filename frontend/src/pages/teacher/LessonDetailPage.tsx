import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { weekLessons } from '@/data/weekLessons';

// Player.js type declaration
declare global {
  interface Window {
    PlayerJS?: new (options: {
      id: string;
      file: string;
      width?: string;
      height?: string;
    }) => {
      api: (method: string) => void;
    };
    Playerjs?: new (options: {
      id: string;
      file: string;
      width?: string;
      height?: string;
    }) => {
      api: (method: string) => void;
    };
  }
}

// Player.js instance type
interface PlayerInstance {
  api: (method: string) => void;
}

// Video player komponenti (player.js bilan)
const VideoPlayer = ({ videoUrl, index }: { videoUrl: string; index: number }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<PlayerInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!playerRef.current || !videoUrl) return;

    setIsLoading(true);

    // player.js script'ni yuklash
    const loadPlayerJS = () => {
      // Agar PlayerJS yoki Playerjs allaqachon yuklangan bo'lsa
      if (window.PlayerJS || window.Playerjs) {
        initializePlayer();
        return;
      }

      // Script allaqachon yuklanmoqda bo'lsa, kutish
      const existingScript = document.querySelector('script[src="/player/playerjs.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', initializePlayer);
        return;
      }

      // Yangi script yaratish va yuklash
      const script = document.createElement('script');
      script.src = '/player/playerjs.js';
      script.async = true;
      script.onload = () => {
        // player.js yuklangandan keyin bir oz kutish
        setTimeout(() => {
          initializePlayer();
        }, 100);
      };
      script.onerror = () => {
        console.error('player.js yuklanmadi');
        setIsLoading(false);
        // player.js yuklanmasa, oddiy HTML5 video player ko'rsatish
        if (playerRef.current) {
          playerRef.current.innerHTML = `
            <video controls class="w-full h-full" style="border-radius: 2px">
              <source src="${videoUrl}" type="video/mp4">
              Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
            </video>
          `;
        }
      };
      document.body.appendChild(script);
    };

    const initializePlayer = () => {
      if (!playerRef.current) return;

      // PlayerJS yoki Playerjs yuklanganligini tekshirish
      const PlayerConstructor = window.PlayerJS || window.Playerjs;
      if (!PlayerConstructor) {
        console.error('player.js yuklanmagan');
        setIsLoading(false);
        // Fallback: oddiy HTML5 video player
        if (playerRef.current) {
          playerRef.current.innerHTML = `
            <video controls class="w-full h-full" style="border-radius: 2px;">
              <source src="${videoUrl}" type="video/mp4">
              Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
            </video>
          `;
        }
        return;
      }

      // Eski player instance'ni tozalash
      if (playerInstanceRef.current) {
        try {
          if (typeof playerInstanceRef.current.api === 'function') {
            playerInstanceRef.current.api('destroy');
          }
        } catch (e) {
          // Xatolikni e'tiborsiz qoldirish
        }
        playerInstanceRef.current = null;
      }

      try {
        const playerId = `player-${Date.now()}-${index}`;
        if (playerRef.current) {
          playerRef.current.innerHTML = `<div id="${playerId}"></div>`;
          setTimeout(() => {
            if (!playerRef.current) return;
            try {
              playerInstanceRef.current = new PlayerConstructor({
                id: playerId,
                file: videoUrl,
                width: '100%',
                height: '100%'
              });
              setIsLoading(false);
            } catch (error) {
              console.error('PlayerJS yaratishda xatolik:', error);
              setIsLoading(false);
              if (playerRef.current) {
                playerRef.current.innerHTML = `
                  <video controls class="w-full h-full" style="border-radius: 2px;">
                    <source src="${videoUrl}" type="video/mp4">
                    Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
                  </video>
                `;
              }
            }
          }, 100);
        }
      } catch (error) {
        console.error('PlayerJS xatosi:', error);
        setIsLoading(false);
        if (playerRef.current) {
          playerRef.current.innerHTML = `
            <video controls class="w-full h-full" style="border-radius: 2px;">
              <source src="${videoUrl}" type="video/mp4">
              Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
            </video>
          `;
        }
      }
    };

    loadPlayerJS();

    return () => {
      if (playerInstanceRef.current) {
        try {
          if (typeof playerInstanceRef.current.api === 'function') {
            playerInstanceRef.current.api('destroy');
          }
        } catch (e) {
          // Xatolikni e'tiborsiz qoldirish
        }
      }
    };
  }, [videoUrl, index]);

  return (
    <div className="w-full aspect-video bg-black rounded-none overflow-hidden mb-4 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white z-10">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div ref={playerRef} className="w-full h-full" />
    </div>
  );
};

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

      {/* Content - Ikki ustunli layout */}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chap ustun - Matn (scroll qilinadigan) */}
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border flex flex-col h-100vh">
              <div 
                className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent',
                  minHeight: 0
                }}
              >
                <div
                  className="prose prose-sm sm:prose-base max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: currentTopic.content }}
                />
              </div>
            </div>

            {/* O'ng ustun - Videolar (scroll qilinadigan) */}
            <div className="bg-card rounded-xl p-2 sm:p-2 border border-border flex flex-col h-100vh">
              <h3 className="text-lg font-semibold text-foreground pl-2 pt-2 mb-4">Video darsliklar</h3>
              <div 
                className="flex-1 overflow-y-auto custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent',
                  minHeight: 0
                }}
              >
                {currentTopic.videos && currentTopic.videos.length > 0 ? (
                  currentTopic.videos.map((videoUrl, index) => (
                    <VideoPlayer key={index} videoUrl={videoUrl} index={index} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground min-h-[200px]">
                    <p>Bu mavzu uchun video mavjud emas</p>
                  </div>
                )}
              </div>
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

