export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  username: string;  // 修改为username，因为后端使用username
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface Folder {
  id: number;
  name: string;
  description?: string;
  color?: string;
  is_default?: boolean;
  parent_id?: number | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  children?: Folder[];
  notes?: Note[];
}

export interface CreateFolderData {
  name: string;
  description?: string;
  parent_id?: number;
}

export interface UpdateFolderData {
  name?: string;
  description?: string;
  parent_id?: number;
}

export interface Note {
  id: number;
  title: string;
  content?: string;
  folder_id?: number;
  is_public: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  owner?: User;
  folder?: Folder;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  folder_id?: number;
  is_public?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  folder_id?: number;
  is_public?: boolean;
}