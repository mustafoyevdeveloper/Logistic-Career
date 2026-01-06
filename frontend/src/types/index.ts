export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  group?: string;
  avatar?: string;
  progress?: number;
  currentLevel?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  topics: string[];
}

export interface LessonModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  feedback?: string;
}

export interface StudentProgress {
  lessonId: string;
  completed: boolean;
  score?: number;
  aiInteractions: number;
  lastAccessed: Date;
}
