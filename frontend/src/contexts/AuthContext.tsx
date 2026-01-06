import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  group?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: Record<string, User> = {
  'student@demo.uz': {
    id: '1',
    email: 'student@demo.uz',
    firstName: 'Sardor',
    lastName: 'Aliyev',
    role: 'student',
    group: 'LOG-2024-A',
    progress: 35,
    currentLevel: 'Boshlang\'ich',
  },
  'teacher@demo.uz': {
    id: '2',
    email: 'teacher@demo.uz',
    firstName: 'Akmal',
    lastName: 'Karimov',
    role: 'teacher',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For demo, accept any credentials with role
    const demoUser = demoUsers[email] || {
      id: Date.now().toString(),
      email,
      firstName: role === 'student' ? 'O\'quvchi' : 'O\'qituvchi',
      lastName: '',
      role,
      progress: role === 'student' ? 0 : undefined,
      currentLevel: role === 'student' ? 'Boshlang\'ich' : undefined,
      group: role === 'student' ? 'LOG-2024-B' : undefined,
    };
    
    setUser(demoUser);
  };

  const register = async (data: RegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      group: data.group,
      progress: data.role === 'student' ? 0 : undefined,
      currentLevel: data.role === 'student' ? 'Boshlang\'ich' : undefined,
    };
    
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
