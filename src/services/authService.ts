import { apiClient, tokenStorage } from './apiClient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
}

export interface AuthCompany {
  id: string;
  name: string;
  industry: string;
  businessType: string;
  location: any;
  circularityScore: number;
  verificationStatus: string;
}

export interface AuthResponseData {
  token: string;
  user: AuthUser;
  company?: AuthCompany;
}

export const authService = {
  /**
   * Log in user with email and password
   */
  async login(email: string, password: string): Promise<AuthResponseData> {
    const res = await apiClient.post<AuthResponseData>('/auth/login', { email, password });
    if (res.data?.token) {
      tokenStorage.set(res.data.token);
    }
    return res.data!;
  },

  /**
   * Register a new user & create company
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    companyName: string;
    industry?: string;
    businessType?: string;
    location?: any;
    role?: string;
  }): Promise<AuthResponseData> {
    const res = await apiClient.post<AuthResponseData>('/auth/register', data);
    if (res.data?.token) {
      tokenStorage.set(res.data.token);
    }
    return res.data!;
  },

  /**
   * Get current authenticated user details
   */
  async getMe(): Promise<{ user: AuthUser; company?: AuthCompany } | null> {
    const token = tokenStorage.get();
    if (!token) return null;
    try {
      const res = await apiClient.get<{ user: AuthUser; company?: AuthCompany }>('/auth/me');
      return res.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Logout user by clearing local JWT token
   */
  logout() {
    tokenStorage.clear();
  },

  /**
   * Check if token is present
   */
  isAuthenticated(): boolean {
    return Boolean(tokenStorage.get());
  },
};
