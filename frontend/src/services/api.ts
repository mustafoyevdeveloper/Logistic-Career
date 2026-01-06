import { getDeviceId } from '@/utils/deviceId';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    const deviceId = getDeviceId();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Device-ID': deviceId,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Xatolik yuz berdi');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string, role: string) {
    const deviceId = getDeviceId();
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, deviceId }),
    });
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'teacher' | 'admin';
  }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me', {
      method: 'GET',
    });
  }

  // Student creation (Teacher/Admin)
  async createStudent(data: {
    email: string;
    firstName: string;
    lastName: string;
    group?: string;
    password?: string;
  }) {
    return this.request<{ student: any; password: string }>('/auth/create-student', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();

