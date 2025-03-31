import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  message: string;
  role: 'admin' | 'user' | 'worker';
  email: string;
  name: string;
  _id: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },

  async registerUser(data: RegisterData): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}/register/user`, data);
    return response.data;
  },

  async registerWorker(data: RegisterData): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}/register/worker`, data);
    return response.data;
  }
}; 