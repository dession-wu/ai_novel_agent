// API Configuration
const API_CONFIG = {
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
  simulationDelay: 0, // No delay by default
};

// Interfaces
export interface Novel {
  id: number;
  title: string;
  genre: string;
  style: string;
  synopsis?: string;
  status: string;
  chapters?: number;
  updated_at?: string;
}

export interface Chapter {
  id: number;
  novel_id: number;
  title: string;
  content: string;
  order: number;
  status: string;
}

export interface NovelCreate {
  title: string;
  genre: string;
  style: string;
  synopsis?: string;
}

export interface ChapterCreate {
  title: string;
  order: number;
  outline_snippet: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  username: string;
}

export interface Character {
  id: number;
  novel_id: number;
  name: string;
  role: string;
  gender?: string;
  age?: string;
  description: string;
  traits?: string;
  avatar_url?: string;
}

export interface CharacterCreate {
  name: string;
  role: string;
  gender?: string;
  age?: string;
  description: string;
  traits?: string;
  avatar_url?: string;
}

export interface Location {
  id: number;
  novel_id: number;
  name: string;
  description?: string;
  parent_id?: number;
}

export interface LocationCreate {
  name: string;
  description?: string;
  parent_id?: number;
}

export interface WorldSetting {
  id: number;
  novel_id: number;
  concept: string;
  category: string;
  description: string;
}

export interface WorldSettingCreate {
  concept: string;
  category: string;
  description: string;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private simulationDelay: number;

  constructor(config: { baseURL: string; timeout: number; simulationDelay?: number }) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.simulationDelay = config.simulationDelay || 0;
  }

  // Get stored token
  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Set token
  public setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Remove token
  public removeToken(): void {
    localStorage.removeItem('access_token');
  }

  // Generic request method
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;
    
    // Simulate network delay
    if (this.simulationDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.simulationDelay));
    }

    // Add auth token
    const headers = new Headers(options.headers || {});
    const token = this.getToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const mergedOptions: RequestInit = {
      ...options,
      headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(fullUrl, {
        ...mergedOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Token expired or invalid
        this.removeToken();
        window.location.reload();
        throw new Error('Authentication failed, please login again');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = 'An error occurred';
        
        if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        // Handle FastAPI validation errors
        errorMessage = errorData.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
      } else if (errorData.detail && typeof errorData.detail === 'object') {
        // Handle case where detail is a complex object
        errorMessage = JSON.stringify(errorData.detail);
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else {
        errorMessage = `HTTP Error! Status: ${response.status}`;
      }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // GET request
  public get<T>(url: string, params: Record<string, string> = {}): Promise<T> {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.request<T>(fullUrl, { method: 'GET' });
  }

  // POST request
  public post<T>(url: string, data: any = {}, options: RequestInit = {}): Promise<T> {
    const isFormData = data instanceof FormData;
    const isUrlSearchParams = data instanceof URLSearchParams;
    
    const headers = new Headers(options.headers || {});
    // Only set Content-Type: application/json if data is not FormData or URLSearchParams
    // Browsers will automatically set the correct Content-Type for FormData and URLSearchParams
    if (!isFormData && !isUrlSearchParams && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return this.request<T>(url, {
      method: 'POST',
      body: isFormData || isUrlSearchParams ? data : JSON.stringify(data),
      ...options,
      headers,
    });
  }

  // PUT request
  public put<T>(url: string, data: any = {}): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // DELETE request
  public delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

// Instantiate API Client
const apiClient = new ApiClient(API_CONFIG);

// Novel API
export const novelApi = {
  // Get list of novels
  getNovels: () => apiClient.get<Novel[]>('/novels/'),
  
  // Get single novel
  getNovel: (novelId: number) => apiClient.get<Novel>(`/novels/${novelId}`),
  
  // Create novel
  createNovel: (novelData: NovelCreate) => apiClient.post<Novel>('/novels/', novelData),
  
  // Generate outline
  generateOutline: (novelId: number) => apiClient.post<string>(`/novels/${novelId}/generate_outline`),
  
  // Delete novel
  deleteNovel: (novelId: number) => apiClient.delete(`/novels/${novelId}`),
  
  // Get chapters
  getChapters: (novelId: number) => apiClient.get<Chapter[]>(`/novels/${novelId}/chapters`),
  
  // Create chapter
  createChapter: (novelId: number, chapterData: ChapterCreate) => apiClient.post<Chapter>(`/novels/${novelId}/chapters`, chapterData),
  
  // Proofread chapter
  proofreadChapter: (novelId: number, chapterId: number) => apiClient.post<any>(`/novels/${novelId}/chapters/${chapterId}/proofread`),
  
  // Change chapter status
  changeChapterStatus: (novelId: number, chapterId: number, status: string) => apiClient.post<any>(`/novels/${novelId}/chapters/${chapterId}/status/${status}`),

  // Stream continue chapter (SSE)
  getStreamContinueUrl: (novelId: number, chapterId: number) => 
    `${API_CONFIG.baseURL}/novels/${novelId}/chapters/${chapterId}/stream_continue`,
  
  // Stream improve text (SSE)
  getStreamImproveUrl: (novelId: number, chapterId: number) => 
    `${API_CONFIG.baseURL}/novels/${novelId}/chapters/${chapterId}/stream_improve`,
  
  // Stream expand text (SSE)
  getStreamExpandUrl: (novelId: number, chapterId: number) => 
    `${API_CONFIG.baseURL}/novels/${novelId}/chapters/${chapterId}/stream_expand`,
  
  // Stream generate chapter (SSE)
  getStreamGenerateUrl: (novelId: number, chapterId: number) => 
    `${API_CONFIG.baseURL}/novels/${novelId}/chapters/${chapterId}/stream_generate`,
  
  // Consistency Check
  checkConsistency: (novelId: number, chapterId: number) => apiClient.post<any>(`/novels/${novelId}/chapters/${chapterId}/consistency_check`),
};

// Auth API
export const authApi = {
  // Login
  login: (data: FormData | URLSearchParams) => apiClient.post<TokenResponse>('/auth/token', data),
  
  // Register
  register: (userData: any) => apiClient.post<User>('/auth/register', userData),
  
  // Get current user
  me: () => apiClient.get<User>('/auth/me'),
  
  // Update user profile
  updateProfile: (userData: { username?: string; email?: string }) => apiClient.put<User>('/auth/me', userData),
  
  // Change password
  changePassword: (passwordData: { current_password: string; new_password: string }) => apiClient.post('/auth/change_password', passwordData),
};

export const chapterApi = {
  getChapter: (chapterId: number) => apiClient.get<Chapter>(`/novels/chapters/${chapterId}`),
  updateChapter: (chapterId: number, data: any) => apiClient.put<Chapter>(`/novels/chapters/${chapterId}`, data),
  deleteChapter: (chapterId: number) => apiClient.delete(`/novels/chapters/${chapterId}`),
};

export const worldApi = {
  // Characters
  getCharacters: (novelId: number) => apiClient.get<Character[]>(`/novels/${novelId}/characters`),
  createCharacter: (novelId: number, data: CharacterCreate) => apiClient.post<Character>(`/novels/${novelId}/characters`, data),
  updateCharacter: (characterId: number, data: Partial<CharacterCreate>) => apiClient.put<Character>(`/characters/${characterId}`, data),
  deleteCharacter: (characterId: number) => apiClient.delete(`/characters/${characterId}`),

  // Locations
  getLocations: (novelId: number) => apiClient.get<Location[]>(`/novels/${novelId}/locations`),
  createLocation: (novelId: number, data: LocationCreate) => apiClient.post<Location>(`/novels/${novelId}/locations`, data),
  updateLocation: (locationId: number, data: Partial<LocationCreate>) => apiClient.put<Location>(`/locations/${locationId}`, data),
  deleteLocation: (locationId: number) => apiClient.delete(`/locations/${locationId}`),

  // Settings
  getSettings: (novelId: number) => apiClient.get<WorldSetting[]>(`/novels/${novelId}/world-settings`),
  createSetting: (novelId: number, data: WorldSettingCreate) => apiClient.post<WorldSetting>(`/novels/${novelId}/world-settings`, data),
  updateSetting: (settingId: number, data: Partial<WorldSettingCreate>) => apiClient.put<WorldSetting>(`/world-settings/${settingId}`, data),
  deleteSetting: (settingId: number) => apiClient.delete(`/world-settings/${settingId}`),
};

export default apiClient;
