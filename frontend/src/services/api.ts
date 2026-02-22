import { getDeviceId } from '@/utils/deviceId';

// Backend URL'lar ro'yxati (fallback mexanizmi)
// Birinchi URL ishlamasa, keyingisiga o'tadi
const getApiBaseUrls = (): string[] => {
  const urls: string[] = [];
  
  // Frontend HTTPS da bo'lsa yoki yo'qligini aniqlash
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Local development (faqat development mode'da) - birinchi o'ringa qo'yamiz
  if (import.meta.env.DEV || isLocalhost) {
    urls.push('http://localhost:5000/api');
  }
  
  // Environment variable'dan URL (agar mavjud bo'lsa)
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    // Agar vergul bilan ajratilgan bo'lsa, ajratish
    const envUrls = envUrl.split(',').map(url => url.trim()).filter(Boolean);
    urls.push(...envUrls);
  }
  
  // External API backend - HTTP versiyasini qo'shamiz (proxy orqali ishlaydi)
  urls.push('http://163.245.212.101:5000/api');
  
  // HTTPS versiyasini ham qo'shamiz (agar mavjud bo'lsa)
  if (isHttps) {
    urls.push('https://163.245.212.101:5000/api');
  }
  
  // Production backend (Render.com)
  urls.push('https://logistic-career.onrender.com/api');
  
  // Duplikatlarni olib tashlash
  return [...new Set(urls)];
};

const API_BASE_URLS = getApiBaseUrls();

// Joriy ishlayotgan backend URL'ni saqlash
let currentApiUrl = API_BASE_URLS[0] || 'http://localhost:5000/api';

// Backend URL'ni localStorage'da saqlash (session davomida)
const STORAGE_KEY = 'logistic_career_api_url';

// Saqlangan URL'ni yuklash va tozalash
// Localhost'da ishlayotgan bo'lsak, localhost backend'ni birinchi o'ringa qo'yamiz
if (typeof window !== 'undefined') {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    // Localhost'da ishlayotgan bo'lsak, localhost backend'ni majburiy qilib qo'yamiz
    const localhostUrl = 'http://localhost:5000/api';
    if (API_BASE_URLS.includes(localhostUrl)) {
      currentApiUrl = localhostUrl;
      // localStorage'ni tozalash (eski Render URL'ni o'chirish)
      localStorage.removeItem(STORAGE_KEY);
    }
  } else {
    // Production'da saqlangan URL'ni ishlatish
    const savedUrl = localStorage.getItem(STORAGE_KEY);
    if (savedUrl) {
      // URL'ni tozalash (vergul, bo'sh joy va boshqa belgilarni olib tashlash)
      let cleanedUrl = savedUrl.trim().split(',')[0].trim();
      
      // Noto'g'ri URL'larni filtrlash (ikkita URL birlashtirilgan)
      if (cleanedUrl.includes('http://') && cleanedUrl.includes('https://')) {
        // Noto'g'ri URL - localStorage'dan olib tashlash
        localStorage.removeItem(STORAGE_KEY);
        cleanedUrl = '';
      }
      
      // URL validatsiyasi
      if (cleanedUrl && (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://'))) {
        if (API_BASE_URLS.includes(cleanedUrl)) {
          currentApiUrl = cleanedUrl;
        } else {
          // Noto'g'ri URL'ni localStorage'dan olib tashlash
          localStorage.removeItem(STORAGE_KEY);
        }
      } else if (cleanedUrl) {
        // Noto'g'ri format - localStorage'dan olib tashlash
        localStorage.removeItem(STORAGE_KEY);
      }
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
      // URL'ni tozalash va validatsiya qilish
      let cleanUrl = url.trim().split(',')[0].trim();
      if (!cleanUrl) return false;

      // Noto'g'ri URL'larni filtrlash (masalan, ikkita URL birlashtirilgan)
      if (cleanUrl.includes('http://') && cleanUrl.includes('https://')) {
        // Agar ikkita protocol bo'lsa, birinchisini olish
        const httpIndex = cleanUrl.indexOf('http://');
        const httpsIndex = cleanUrl.indexOf('https://');
        if (httpIndex < httpsIndex) {
          cleanUrl = cleanUrl.substring(0, httpsIndex);
        } else {
          cleanUrl = cleanUrl.substring(0, httpIndex);
        }
        cleanUrl = cleanUrl.trim();
      }

      // URL validatsiyasi
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        return false;
      }

      // Health check endpoint'ni yaratish
      let healthUrl: string;
      if (cleanUrl.endsWith('/api')) {
        healthUrl = `${cleanUrl}/health`;
      } else if (cleanUrl.endsWith('/api/')) {
        healthUrl = `${cleanUrl}health`;
      } else if (cleanUrl.includes('/api/')) {
        // /api/ dan keyingi qismni /health bilan almashtirish
        healthUrl = cleanUrl.replace(/\/api\/.*$/, '/api/health');
      } else {
        healthUrl = `${cleanUrl}/api/health`;
      }

      // URL'ni yana bir bor validatsiya qilish
      try {
        new URL(healthUrl);
      } catch {
        return false;
      }

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
   * Proxy orqali so'rov yuborish (mixed content muammosini hal qilish uchun)
   */
  private async requestViaProxy<T>(
    targetUrl: string,
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    // Joriy backend URL'ni olish (proxy server)
    // Avval HTTPS backend'larni topish, keyin HTTP
    const proxyBaseUrl = API_BASE_URLS.find(url => 
      (url.includes('onrender.com') || 
       url.includes('vercel.app') ||
       url.includes('asliddin-logistic.online')) &&
      url.startsWith('https://')
    ) || API_BASE_URLS.find(url => 
      url.includes('localhost') || 
      url.includes('onrender.com') || 
      url.includes('vercel.app') ||
      url.includes('asliddin-logistic.online')
    ) || API_BASE_URLS[0] || 'http://localhost:5000/api';

    // Endpoint'ni tozalash va query parametrlarni ajratish
    const [endpointPath, queryString] = endpoint.split('?');
    const proxyEndpoint = endpointPath || '';
    
    // Proxy URL'ni yaratish
    const proxyUrl = `${proxyBaseUrl}/proxy${proxyEndpoint}?target=${encodeURIComponent(targetUrl)}${queryString ? '&' + queryString : ''}`;

    try {
      const response = await fetch(proxyUrl, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Proxy orqali so\'rov xatolik');
      }

      return data;
    } catch (error: any) {
      throw new Error(`Proxy xatolik: ${error.message}`);
    }
  }

  /**
   * Ishlayotgan backend URL'ni topish
   */
  private async findWorkingBackend(): Promise<string | null> {
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    
    // Avval saqlangan URL'ni sinab ko'rish
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem(STORAGE_KEY);
      if (savedUrl) {
        // URL'ni tozalash
        let cleanUrl = savedUrl.trim().split(',')[0].trim();
        
        // Noto'g'ri URL'larni filtrlash
        if (cleanUrl.includes('http://') && cleanUrl.includes('https://')) {
          return null; // Noto'g'ri URL
        }

        // HTTPS da bo'lsa va HTTP backend bo'lsa, proxy orqali ishlatish mumkin
        if (cleanUrl && await this.testBackendUrl(cleanUrl)) {
          return cleanUrl;
        }
      }
    }

    // Barcha URL'larni sinab ko'rish
    // HTTPS da bo'lsa, avval HTTPS URL'larni sinab ko'rish
    const urlsToTest = isHttps 
      ? [...API_BASE_URLS.filter(url => url.startsWith('https://')), ...API_BASE_URLS.filter(url => url.startsWith('http://'))]
      : API_BASE_URLS;

    for (const url of urlsToTest) {
      // HTTPS da bo'lsa va HTTP URL bo'lsa, proxy orqali ishlatish mumkin
      if (isHttps && url.startsWith('http://') && !url.includes('localhost')) {
        // Proxy orqali sinab ko'rish
        try {
          // Avval barcha HTTPS backend'larni sinab ko'rish (proxy server sifatida)
          const proxyCandidates = API_BASE_URLS.filter(u => 
            u.startsWith('https://') && 
            (u.includes('onrender.com') || 
             u.includes('asliddin-logistic.online') ||
             u.includes('vercel.app'))
          );
          
          for (const proxyBaseUrl of proxyCandidates) {
            try {
              // Proxy orqali health check
              const proxyUrl = `${proxyBaseUrl}/proxy/health?target=${encodeURIComponent(url)}`;
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000);
              
              const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
              });
              
              clearTimeout(timeoutId);
              
              if (response.ok) {
                if (typeof window !== 'undefined') {
                  localStorage.setItem(STORAGE_KEY, url);
                }
                return url;
              }
            } catch (proxyError) {
              // Bu proxy ishlamadi, keyingisini sinab ko'rish
              continue;
            }
          }
        } catch {
          // Proxy ishlamasa, keyingi URL'ni sinab ko'rish
          continue;
        }
      } else {
        // To'g'ridan-to'g'ri sinab ko'rish
        if (await this.testBackendUrl(url)) {
          // Ishlayotgan URL'ni saqlash
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, url);
          }
          return url;
        }
      }
    }

    return null;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // FormData bo'lsa, Content-Type o'rnatilmaydi (browser o'zi o'rnatadi)
    const isFormData = options.body instanceof FormData;
    
    const token = localStorage.getItem('auth_token');
    const deviceId = getDeviceId();
    
    const config: RequestInit = {
      ...options,
      headers: isFormData
        ? {
            // FormData uchun faqat Authorization va Device-ID header'lar
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(deviceId && { 'X-Device-ID': deviceId }),
            ...options.headers,
          }
        : {
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

      // 404 xatolikni alohida handle qilish - xatolikni throw qilmaslik va console'da ko'rsatmaslik
      if (response.status === 404) {
        // 404 xatolikni silent qilish - frontend'da handle qilinadi
        // Console'da ko'rsatmaslik
        return {
          success: false,
          message: 'Route topilmadi',
          status: 404,
        } as ApiResponse<T>;
      }

      // Agar 500+ xatolik bo'lsa, backend'dan aniq xato xabarini olishga harakat qilamiz
      if (response.status >= 500) {
        let errorMessage = `Backend xatosi: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('❌ Backend 500 xatolik:', {
            status: response.status,
            message: errorData.message,
            error: errorData.error,
            data: errorData,
          });
        } catch (parseError) {
          // JSON parse qilishda xatolik bo'lsa, faqat status kodini ko'rsatamiz
          console.error('❌ Backend 500 xatolik (JSON parse qilib bo\'lmadi):', response.status);
        }
        throw new Error(errorMessage);
      }

      // Boshqa xatoliklar (400, 401, 403) - bu backend ishlayapti, lekin so'rov noto'g'ri
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
        console.error('❌ Backend xatolik:', errorMessage);
      }
      throw new Error(errorMessage);
    } catch (error: any) {
      lastError = error;

      // Mixed content xatolikni aniqlash (HTTPS frontend HTTP backend'ga so'rov yuborish)
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const isHttpBackend = cleanCurrentUrl.startsWith('http://') && !cleanCurrentUrl.includes('localhost');
      const isMixedContentError = 
        isHttps && isHttpBackend && (
          error.message?.includes('Mixed Content') ||
          error.message?.includes('blocked:mixed-content') ||
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('NetworkError') ||
          error.name === 'TypeError'
        );

      // Mixed content xatolik bo'lsa, proxy orqali so'rov yuborish
      if (isMixedContentError) {
        if (import.meta.env.DEV) {
          console.warn(`⚠️ Mixed content xatolik: ${cleanCurrentUrl}, proxy orqali so'rov yuborilmoqda...`);
        }

        try {
          // Proxy orqali so'rov yuborish
          const proxyResponse = await this.requestViaProxy<T>(cleanCurrentUrl, endpoint, config);
          
          if (import.meta.env.DEV) {
            console.log(`✅ Proxy orqali so'rov muvaffaqiyatli: ${cleanCurrentUrl}`);
          }

          // Proxy orqali ishlagan URL'ni saqlash (keyingi so'rovlar uchun)
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, cleanCurrentUrl);
          }

          return proxyResponse;
        } catch (proxyError: any) {
          if (import.meta.env.DEV) {
            console.error('❌ Proxy orqali so\'rov xatolik:', proxyError);
          }
          // Proxy ham ishlamasa, boshqa backend'ni sinab ko'rish
        }
      }

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

  async logout(pauseTimeMs?: number) {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ pauseTimeMs: pauseTimeMs || 0 }),
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

  async uploadStudentCertificate(studentId: string, file: File) {
    const formData = new FormData();
    formData.append('certificate', file);

    return this.request<{ certificateUrl: string }>(`/students/${studentId}/certificate`, {
      method: 'POST',
      body: formData,
    });
  }

  async downloadStudentCertificate(): Promise<Blob> {
    const token = localStorage.getItem('auth_token');
    const deviceId = getDeviceId();
    const baseUrl = this.getCurrentBackendUrl();
    const url = `${baseUrl}/students/certificate/download`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(deviceId ? { 'X-Device-ID': deviceId } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Sertifikatni yuklab olishda xatolik');
    }

    return response.blob();
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

  // Teacher stats
  async getTeacherStats() {
    return this.request<{
      totalStudents: number;
      activeLessons: number;
      avgProgress: number;
      totalChats: number;
    }>('/users/teacher/stats');
  }

  // Update online time
  async updateOnlineTime(totalSeconds: number) {
    return this.request<{ totalOnlineTimeSeconds: number }>('/auth/me/update-online-time', {
      method: 'PUT',
      body: JSON.stringify({ totalSeconds }),
    });
  }

  // Pause start (offline bo'lganda)
  async pauseStart() {
    return this.request('/auth/me/pause-start', {
      method: 'POST',
    });
  }

  // Pause end (online bo'lganda)
  async pauseEnd() {
    return this.request('/auth/me/pause-end', {
      method: 'POST',
    });
  }

  // Notifications
  async getNotifications(params?: { isRead?: boolean; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.isRead !== undefined) query.append('isRead', String(params.isRead));
    if (params?.limit) query.append('limit', String(params.limit));
    
    return this.request<{ notifications: any[]; unreadCount: number }>(`/notifications?${query.toString()}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Lessons
  async getStudentLessons() {
    return this.request<{
      lessons: Array<{
        day: number;
        isUnlocked: boolean;
        unlockTime: string | null;
        timeRemaining: number | null;
      }>;
    }>('/lessons/student/lessons');
  }

  async unlockLessonSecret(day: number) {
    return this.request(`/lessons/day/${day}/unlock`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();

/**
 * Backend /api/health javob bergunicha kutadi. Splash screen backend yuklangach yopilishi uchun ishlatiladi.
 * @param options timeoutMs - maksimum kutish (ms), default 20s; retryIntervalMs - qayta urinish orasidagi vaqt
 * @returns true agar backend tayyor bo'lsa, false agar timeout bo'lsa
 */
export async function waitForBackendReady(options?: {
  timeoutMs?: number;
  retryIntervalMs?: number;
}): Promise<boolean> {
  const timeoutMs = options?.timeoutMs ?? 20000;
  const retryIntervalMs = options?.retryIntervalMs ?? 600;
  const start = Date.now();
  const urls = apiService.getAvailableBackendUrls();

  const toHealthUrl = (base: string): string => {
    const b = base.trim();
    if (b.endsWith('/api')) return `${b}/health`;
    if (b.endsWith('/api/')) return `${b}health`;
    if (b.includes('/api/')) return b.replace(/\/api\/.*$/, '/api/health');
    return `${b.replace(/\/$/, '')}/api/health`;
  };

  while (Date.now() - start < timeoutMs) {
    for (const base of urls) {
      try {
        const healthUrl = toHealthUrl(base);
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(healthUrl, { method: 'GET', signal: controller.signal });
        clearTimeout(t);
        if (res.ok) return true;
      } catch {
        // keyingi URL
      }
    }
    await new Promise((r) => setTimeout(r, retryIntervalMs));
  }
  return false;
}

