import api from './api';
import { User } from './types';
import { StandardResponse } from './types';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  name: string;
}

interface LoginResponseData {
  access_token: string;
  token_type: string;
}

export interface AuthResponse extends StandardResponse<LoginResponseData> {}
export interface VerifyResponse extends StandardResponse<User> {}

interface UsernameAvailability {
  username: string;
  exists: boolean;
  available: boolean;
}

export interface UsernameCheckResponse extends StandardResponse<UsernameAvailability> {}

export const auth = {
  async login(data: LoginData): Promise<AuthResponse> {
    const params = new URLSearchParams();
    params.append('username', data.username);
    params.append('password', data.password);

    const response = await api.post('/auth/login', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.success && response.data.data?.access_token) {
      localStorage.setItem('token', response.data.data.access_token);
    }

    return response.data;
  },

  async register(data: RegisterData): Promise<StandardResponse<void>> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async verify(): Promise<VerifyResponse> {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  async checkUsername(username: string): Promise<UsernameCheckResponse> {
    const response = await api.get(`/user/check-username/${username}`);
    return response.data;
  }
};