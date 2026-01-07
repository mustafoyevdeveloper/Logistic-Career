import { getDeviceId } from '@/utils/deviceId';

// Backend URL'lar ro'yxati (fallback mexanizmi)
// Birinchi URL ishlamasa, keyingisiga o'tadi
const getApiBaseUrls = (): string[] => {
  const urls: string[] = [];
  
  // Environment variable'dan URL (agar mavjud bo'lsa)
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    // Agar vergul bilan ajratilgan bo'lsa, ajratish
    const envUrls = envUrl.split(',').map(url => url.trim()).filter(Boolean);
    urls.push(...envUrls);
  }
  
  // Production backend (Render.com)
  urls.push('https://logistic-career.onrender.com/api');
  
  // Local development (faqat development mode'da)
  if (import.meta.env.DEV || window.location.hostname === 'localhost') {
    urls.push('http://localhost:5000/api');
  }
  
  // Duplikatlarni olib tashlash
  return [...new Set(urls)];
};

const API_BASE_URLS = getApiBaseUrls();

// Joriy ishlayotgan backend URL'ni saqlash
let currentApiUrl = API_BASE_URLS[0] || 'http://localhost:5000/api';

// Backend URL'ni localStorage'da saqlash (session davomida)
const STORAGE_KEY = 'logistic_career_api_url';

// Saqlangan URL'ni yuklash va tozalash
if (typeof window !== 'undefined') {
  const savedUrl = localStorage.getItem(STORAGE_KEY);
  if (savedUrl) {
    // URL'ni tozalash (vergul, bo'sh joy va boshqa belgilarni olib tashlash)
    const cleanedUrl = savedUrl.trim().split(',')[0].trim();
    if (cleanedUrl && API_BASE_URLS.includes(cleanedUrl)) {
      currentApiUrl = cleanedUrl;
    } else {
      // Noto'g'ri URL'ni localStorage'dan olib tashlash
      localStorage.removeItem(STORAGE_KEY);
    }
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
      // URL'ni tozalash
      const cleanUrl = url.trim().split(',')[0].trim();
      if (!cleanUrl) return false;

      // Health check endpoint'ni sinab ko'rish
      const healthUrl = cleanUrl.endsWith('/api') 
        ? `${cleanUrl}/health` 
        : cleanUrl.includes('/api/') 
          ? `${cleanUrl.replace(/\/api\/.*$/, '/api/health')}`
          : `${cleanUrl}/api/health`;
      
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

    // Avval joriy URL'ni sinab ko'rish va tozalash
    let cleanCurrentUrl = currentApiUrl.trim().split(',')[0].trim();
    if (!cleanCurrentUrl) {
      cleanCurrentUrl = API_BASE_URLS[0] || 'http://localhost:5000/api';
      currentApiUrl = cleanCurrentUrl;
    }
    let url = `${cleanCurrentUrl}${endpoint}`;
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
      let errorMessage = 'Xatolik yuz berdi';
      try {
        const data = await response.json();
        errorMessage = data.message || data.debug?.message || errorMessage;
        console.error('❌ Backend xatolik:', {
          status: response.status,
          message: data.message,
          debug: data.debug,
        });
      } catch (parseError) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
          // URL'ni tozalash
          const cleanUrl = workingUrl.trim().split(',')[0].trim();
          currentApiUrl = cleanUrl;
          // To'g'ri URL'ni localStorage'da saqlash
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, cleanUrl);
          }
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

  /**
   * LocalStorage'dan backend URL'ni tozalash
   */
  clearBackendUrlCache(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      // Birinchi URL'ga qaytish
      currentApiUrl = API_BASE_URLS[0] || 'http://localhost:5000/api';
    }
  }

  // Auth endpoints
  async login(email: string, password: string, role: string) {
    const deviceId = getDeviceId(email); // Email bilan deviceId olish
    return this.request<{ user: any; token: string }>('/auth/login?role=student', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, deviceId }),
    });
  }

  async adminLogin(email: string, password: string) {
    // Debug logging
    console.log('📤 Admin login request:', { email, password: password ? '***' : undefined });
    
    const requestBody = { email, password };
    console.log('📤 Request body:', JSON.stringify(requestBody));
    
    return this.request<{ user: any; token: string }>('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(requestBody),
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

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
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
    email?: string;
    password?: string;
    deviceName?: string;
  }) {
    return this.request<{ student: any }>(`/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async clearStudentDevice(studentId: string) {
    return this.request(`/students/${studentId}/clear-device`, {
      method: 'POST',
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

