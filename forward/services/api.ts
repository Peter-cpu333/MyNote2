import axios from 'axios';
import {
  User,
  LoginData,
  RegisterData,
  Folder,
  CreateFolderData,
  UpdateFolderData,
  Note,
  CreateNoteData,
  UpdateNoteData,
} from '../types';

// 定义登录响应类型
interface LoginResponse {
  access_token: string;
  token_type: string;
}

// 创建 Axios 实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证 token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response: any) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 如果是 401 错误，清除 token 并跳转到登录页面
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// **Auth API**
export const authApi = {
  register: (data: RegisterData) => api.post<User>('/api/users/', data),
  login: async (data: LoginData) => {
    try {
      const response = await api.post<LoginResponse>('/api/users/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Login Response:', response); // 调试日志
      return response;
    } catch (error) {
      console.error('API Login Error:', error); // 错误日志
      throw error;
    }
  },
  getProfile: () => api.get<User>('/auth/me'),
  checkHealth: () => api.get('/health'),
};

// 文件夹 API
export const folderApi = {
  create: (data: CreateFolderData) => api.post<Folder>('/api/folders/', data),
  getAll: (parent_id: number | null = null, skip: number = 0, limit: number = 100) =>
    api.get<Folder[]>('/api/folders/', { params: { parent_id, skip, limit } }),
  getTree: () => api.get<Folder[]>('/api/folders/tree'),
  update: (id: number, data: UpdateFolderData) => api.put<Folder>(`/api/folders/${id}`, data),
  delete: (id: number) => api.delete(`/api/folders/${id}`),
};

// 笔记 API
export const noteApi = {
  create: (data: CreateNoteData) => api.post<Note>('/api/notes/', data),
  getAll: (folder_id?: number, skip: number = 0, limit: number = 100) =>
    api.get<Note[]>('/api/notes/', { params: { folder_id, skip, limit } }),
  getOne: (id: number) => api.get<Note>(`/api/notes/${id}`),
  update: (id: number, data: UpdateNoteData) => api.put<Note>(`/api/notes/${id}`, data),
  delete: (id: number) => api.delete(`/api/notes/${id}`),
  getPublic: (skip: number = 0, limit: number = 100) =>
    api.get<Note[]>('/api/notes/public', { params: { skip, limit } }),
};
