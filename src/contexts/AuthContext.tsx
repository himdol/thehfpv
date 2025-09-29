import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginRequest, RegisterRequest, UpdateProfileRequest } from '../services/authService';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  socialLogin: (userData: User) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: UpdateProfileRequest) => Promise<void>;
  checkAuthStatus: () => boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (userData: User) => {
    try {
      console.log('=== socialLogin 함수 시작 ===');
      console.log('받은 사용자 데이터:', userData);
      
      setLoading(true);
      setError(null);
      
      setUser(userData);
      setIsLoggedIn(true);
      
      console.log('AuthContext 상태 업데이트 완료');
      console.log('isLoggedIn:', true);
      console.log('user:', userData);
    } catch (err) {
      console.error('socialLogin 에러:', err);
      setError(err instanceof Error ? err.message : '소셜 로그인에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      // 회원가입 성공 시 자동으로 로그인 상태로 만들기
      if (response && response.user) {
        setUser(response.user);
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그아웃에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: UpdateProfileRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.updateProfile(userData);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 수정에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = (): boolean => {
    return authService.isAuthenticated();
  };

  useEffect(() => {
    // 앱 시작 시 인증 상태 확인
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        // 인증 실패 시 토큰 제거
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    isLoggedIn,
    user,
    token,
    login,
    socialLogin,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
