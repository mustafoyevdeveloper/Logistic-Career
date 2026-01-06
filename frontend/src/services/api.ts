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

  async request<T>(
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

  async adminLogin(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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
    groupId?: string;
    password?: string;
  }) {
    return this.request<{ student: any; password: string }>('/auth/create-student', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Students management
  async getStudents(params?: { group?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.group) query.append('group', params.group);
    if (params?.search) query.append('search', params.search);
    
    return this.request<{ students: any[] }>(`/users/students?${query.toString()}`);
  }

  async deleteStudent(studentId: string) {
    return this.request(`/students/${studentId}`, {
      method: 'DELETE',
    });
  }

  async suspendStudent(studentId: string, isSuspended: boolean) {
    return this.request<{ student: any }>(`/students/${studentId}/suspend`, {
      method: 'PUT',
      body: JSON.stringify({ isSuspended }),
    });
  }

  async updateStudent(studentId: string, data: {
    firstName?: string;
    lastName?: string;
    groupId?: string;
  }) {
    return this.request<{ student: any }>(`/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Groups management
  async getGroups() {
    return this.request<{ groups: any[] }>('/groups');
  }

  async createGroup(data: { name: string; description?: string }) {
    return this.request<{ group: any }>('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGroup(groupId: string, data: { name?: string; description?: string }) {
    return this.request<{ group: any }>(`/groups/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGroup(groupId: string) {
    return this.request(`/groups/${groupId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

