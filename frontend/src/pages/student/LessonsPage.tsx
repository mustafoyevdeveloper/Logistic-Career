import { useState, useEffect } from 'react';
import { getLevelColor, getLevelLabel } from '@/data/lessons';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiService } from '@/services/api';
import { 
  BookOpen, 
  Clock, 
  Lock, 
  CheckCircle2, 
  PlayCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function LessonsPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.request<{ modules: any[] }>('/lessons/modules');
      if (response.success && response.data) {
        setModules(response.data.modules || []);
        // Birinchi modulni ochiq qilish
        if (response.data.modules.length > 0) {
          setExpandedModule(response.data.modules[0]._id);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Darsliklarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Darsliklar</h1>
        <p className="text-muted-foreground">
          Xalqaro logistikani bosqichma-bosqich o'rganing
        </p>
      </div>

      {/* Modules */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((module, moduleIndex) => (
          <div 
            key={module.id}
            className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
          >
            {/* Module Header */}
            <button
              onClick={() => toggleModule(module._id)}
              className="w-full p-5 sm:p-6 flex items-center gap-4 hover:bg-muted/50 transition-colors"
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg",
                moduleIndex === 0 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {moduleIndex + 1}
              </div>
              
              <div className="flex-1 text-left">
                <h2 className="text-lg font-semibold text-foreground mb-1">{module.title}</h2>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </div>

              <div className="hidden sm:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{module.lessons?.length || 0} dars</p>
                  <Progress value={module.progress || 0} className="w-24 h-2 mt-1" />
                </div>
                {expandedModule === module._id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Lessons List */}
            {expandedModule === module._id && (
              <div className="border-t border-border">
                {module.lessons?.map((lesson: any, lessonIndex: number) => (
                  <div
                    key={lesson._id || lessonIndex}
                    className={cn(
                      "p-4 sm:p-5 border-b border-border last:border-b-0 transition-all duration-200",
                      lesson.isLocked 
                        ? "opacity-60 cursor-not-allowed" 
                        : "hover:bg-muted/50 cursor-pointer",
                      selectedLesson === lesson._id && "bg-primary/5 border-l-4 border-l-primary"
                    )}
                    onClick={() => !lesson.isLocked && setSelectedLesson(lesson._id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Lesson Number/Status */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        lesson.isCompleted 
                          ? "bg-success/10 text-success"
                          : lesson.isLocked
                          ? "bg-muted text-muted-foreground"
                          : lessonIndex === 0 
                          ? "gradient-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      )}>
                        {lesson.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : lesson.isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <span className="font-semibold">{lessonIndex + 1}</span>
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">{lesson.title}</h3>
                          <span className={cn(
                            "hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
                            getLevelColor(lesson.level)
                          )}>
                            {getLevelLabel(lesson.level)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {lesson.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {lesson.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {lesson.topics.length} mavzu
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      {!lesson.isLocked && (
                        <Button 
                          size="sm" 
                          variant={lessonIndex === 0 && !lesson.isCompleted ? "gradient" : "outline"}
                          className="shrink-0"
                        >
                          {lesson.isCompleted ? (
                            <>Takrorlash</>
                          ) : lessonIndex === 0 ? (
                            <>
                              <PlayCircle className="w-4 h-4" />
                              Boshlash
                            </>
                          ) : (
                            <>Boshlash</>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Topics */}
                    {selectedLesson === lesson._id && !lesson.isLocked && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm font-medium text-foreground mb-2">Mavzular:</p>
                        <div className="flex flex-wrap gap-2">
                          {lesson.topics.map((topic, i) => (
                            <span 
                              key={i}
                              className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
