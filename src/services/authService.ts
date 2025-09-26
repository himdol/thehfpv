const API_BASE_URL = 'http://localhost:8080/api';

export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  userRole: 'PUBLIC' | 'ADMIN' | 'ROOT';
  emailVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface ApiError {
  message: string;
  error?: string;
}

class AuthService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Login request:', credentials);
      console.log('API URL:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // 응답이 비어있는지 확인
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!responseText) {
        throw new Error('서버에서 응답을 받지 못했습니다.');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }

      if (!response.ok) {
        throw new Error(data.message || `로그인에 실패했습니다. (${response.status})`);
      }

      // 토큰을 localStorage에 저장
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      // 응답이 비어있는지 확인
      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('서버에서 응답을 받지 못했습니다.');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }

      if (!response.ok) {
        throw new Error(data.message || `회원가입에 실패했습니다. (${response.status})`);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // 토큰 제거
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async updateProfile(userData: UpdateProfileRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      // 응답이 비어있는지 확인
      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('서버에서 응답을 받지 못했습니다.');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }

      if (!response.ok) {
        throw new Error(data.message || `프로필 수정에 실패했습니다. (${response.status})`);
      }

      // 업데이트된 사용자 정보를 localStorage에 저장
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }
}

export const authService = new AuthService();

