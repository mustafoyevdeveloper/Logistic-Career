import { getDeviceId } from '@/utils/deviceId';

// Backend URL'lar ro'yxati (fallback mexanizmi)
// Birinchi URL ishlamasa, keyingisiga o'tadi
const API_BASE_URLS = [
  import.meta.env.VITE_API_BASE_URL, // Environment variable'dan (production)
  'https://logistic-career.onrender.com/api', // Production backend (Render.com)
  'http://localhost:5000/api', // Local development
].filter(Boolean) as string[]; // Bo'sh qiymatlarni olib tashlash

// Joriy ishlayotgan backend URL'ni saqlash
let currentApiUrl = API_BASE_URLS[0] || 'http://localhost:5000/api';

// Backend URL'ni localStorage'da saqlash (session davomida)
const STORAGE_KEY = 'logistic_career_api_url';

// Saqlangan URL'ni yuklash
if (typeof window !== 'undefined') {
  const savedUrl = localStorage.getItem(STORAGE_KEY);
  if (savedUrl && API_BASE_URLS.includes(savedUrl)) {
    currentApiUrl = savedUrl;
  }
}

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

  /**
   * Backend URL'ni sinab ko'rish va ishlayotganini topish
   */
  private async testBackendUrl(url: string): Promise<boolean> {
    try {
      // Health check endpoint'ni sinab ko'rish
      const healthUrl = url.endsWith('/api') ? `${url}/health` : `${url}/api/health`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 soniya timeout

      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Ishlayotgan backend URL'ni topish
   */
  private async findWorkingBackend(): Promise<string | null> {
    // Avval saqlangan URL'ni sinab ko'rish
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem(STORAGE_KEY);
      if (savedUrl && await this.testBackendUrl(savedUrl)) {
        return savedUrl;
      }
    }

    // Barcha URL'larni sinab ko'rish
    for (const url of API_BASE_URLS) {
      if (await this.testBackendUrl(url)) {
        // Ishlayotgan URL'ni saqlash
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, url);
        }
        return url;
      }
    }

    return null;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    // Avval joriy URL'ni sinab ko'rish
    let url = `${currentApiUrl}${endpoint}`;
    let lastError: Error | null = null;

    try {
      const response = await fetch(url, config);
      
      // Agar response ok bo'lsa, muvaffaqiyatli
      if (response.ok) {
        const data = await response.json();
        return data;
      }

      // Agar 500+ xatolik bo'lsa, backend ishlamayotgan bo'lishi mumkin
      if (response.status >= 500) {
        throw new Error(`Backend xatosi: ${response.status}`);
      }

      // Boshqa xatoliklar (400, 401, 403, 404) - bu backend ishlayapti, lekin so'rov noto'g'ri
      const data = await response.json();
      throw new Error(data.message || 'Xatolik yuz berdi');
    } catch (error: any) {
      lastError = error;

      // Network xatolik yoki 500+ xatolik bo'lsa, boshqa backend'ni sinab ko'rish
      if (
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError') ||
        error.message?.includes('Backend xatosi') ||
        error.message?.includes('CORS') ||
        error.name === 'TypeError' ||
        error.name === 'AbortError'
      ) {
        // Development mode'da log'lar ko'rsatish
        if (import.meta.env.DEV) {
          console.warn(`⚠️ Backend ishlamayapti: ${currentApiUrl}, boshqa backend'ni sinab ko'ryapman...`);
        }

        // Ishlayotgan backend'ni topish
        const workingUrl = await this.findWorkingBackend();

        if (workingUrl && workingUrl !== currentApiUrl) {
          if (import.meta.env.DEV) {
            console.log(`✅ Yangi backend topildi: ${workingUrl}`);
          }
          currentApiUrl = workingUrl;
          url = `${currentApiUrl}${endpoint}`;

          // Qayta sinab ko'rish
          try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Xatolik yuz berdi');
            }

            return data;
          } catch (retryError) {
            // Qayta sinab ko'rish ham ishlamadi
            throw lastError;
          }
        } else if (!workingUrl) {
          // Hech qanday backend ishlamayapti
          if (import.meta.env.DEV) {
            console.error('❌ Barcha backend URL\'lar ishlamayapti:', API_BASE_URLS);
          }
        }
      }

      // Boshqa xatoliklar (400, 401, 403, 404) - backend ishlayapti, lekin so'rov noto'g'ri
      throw error;
    }
  }

  /**
   * Joriy backend URL'ni olish
   */
  getCurrentBackendUrl(): string {
    return currentApiUrl;
  }

  /**
   * Barcha backend URL'larini olish
   */
  getAvailableBackendUrls(): string[] {
    return API_BASE_URLS;
  }

  // Auth endpoints
  async login(email: string, password: string, role: string) {
    const deviceId = getDeviceId(email); // Email bilan deviceId olish
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

