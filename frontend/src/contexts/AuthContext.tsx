import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { apiService } from '@/services/api';
import { getDeviceId, clearDeviceId } from '@/utils/deviceId';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthReady: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  createStudent: (data: CreateStudentData) => Promise<{ student: any; password: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'teacher' | 'admin';
}

interface CreateStudentData {
  email: string;
  firstName: string;
  lastName: string;
  group?: string;
  password?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Token'dan user ma'lumotlarini yuklash
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await apiService.getMe();
          if (response.success && response.data) {
            setUser(response.data.user);
            // User to'liq yuklangandan keyin isAuthReady = true
            setIsAuthReady(true);
          } else {
            // Token yaroqsiz bo'lsa, tozalash
            localStorage.removeItem('auth_token');
            setIsAuthReady(true);
          }
        } catch (error) {
          // Token yaroqsiz bo'lsa, tozalash
          localStorage.removeItem('auth_token');
          setIsAuthReady(true);
        }
      } else {
        // Token yo'q bo'lsa ham, auth ready
        setIsAuthReady(true);
      }
      // isLoading false bo'lganda, isAuthReady ham true bo'lishi kerak
      setIsLoading(false);
      // Agar isAuthReady hali false bo'lsa, uni true qilish
      setIsAuthReady(true);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const response = await apiService.login(email, password, role);
      
      if (response.success && response.data) {
        // Token saqlash
        localStorage.setItem('auth_token', response.data.token);
        
        // User ma'lumotlarini saqlash
        setUser(response.data.user);
        
        // User to'liq yuklangandan keyin isAuthReady = true
        setIsAuthReady(true);
        
        // isLoading'ni false qilish (login muvaffaqiyatli bo'lganda)
        setIsLoading(false);
        
        // State yangilanishini kutish
        return response.data.user;
      } else {
        throw new Error(response.message || 'Kirishda xatolik yuz berdi');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Kirishda xatolik yuz berdi');
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await apiService.adminLogin(email, password);
      
      if (response.success && response.data) {
        // Token saqlash
        localStorage.setItem('auth_token', response.data.token);
        
        // User ma'lumotlarini saqlash
        setUser(response.data.user);
        
        // User to'liq yuklangandan keyin isAuthReady = true
        setIsAuthReady(true);
        
        // isLoading'ni false qilish (login muvaffaqiyatli bo'lganda)
        setIsLoading(false);
        
        // State yangilanishini kutish
        return response.data.user;
      } else {
        throw new Error(response.message || 'Kirishda xatolik yuz berdi');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Kirishda xatolik yuz berdi');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiService.register(data);
      
      if (response.success && response.data) {
        // Token saqlash
        localStorage.setItem('auth_token', response.data.token);
        
        // User ma'lumotlarini saqlash
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
    }
  };

  const createStudent = async (data: CreateStudentData) => {
    try {
      const response = await apiService.createStudent(data);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'O\'quvchi yaratishda xatolik yuz berdi');
      }
    } catch (error: any) {
      throw new Error(error.message || 'O\'quvchi yaratishda xatolik yuz berdi');
    }
  };

  const logout = async () => {
    try {
      // Backend'ga logout so'rov yuborish (device ma'lumotlarini tozalash uchun)
      if (user?.role === 'student') {
        // Agar pause davom etmoqda bo'lsa, uni to'xtatish
        try {
          await apiService.pauseEnd();
        } catch (error) {
          // Xatolik bo'lsa ham logout qilishni davom ettiramiz
          console.error('Pause end error:', error);
        }
        await apiService.logout();
      }
    } catch (error) {
      // Xatolik bo'lsa ham logout qilishni davom ettiramiz
      console.error('Logout error:', error);
    } finally {
      // Email bilan deviceId ni tozalash
      if (user?.email) {
        clearDeviceId(user.email);
      }
      localStorage.removeItem('auth_token');
      setUser(null);
      // Auth ready holatini tozalash
      setIsAuthReady(false);
      // isLoading'ni false qilish (logout tugagandan keyin)
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthReady,
        login,
        adminLogin,
        register,
        logout,
        createStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
