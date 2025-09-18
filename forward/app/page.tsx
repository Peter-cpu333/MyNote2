'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FolderCard from '../components/FolderCard';
import NoteCard from '../components/NoteCard';
import CreateFolderModal from '../components/CreateFolderModal';
import { folderApi, noteApi } from '../services/api';
import { Folder, Note, CreateFolderData } from '../types';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // 获取文件夹列表
  const fetchFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await folderApi.getAll() as unknown as Folder[];
      setFolders(data);
    } catch (err) {
      console.error('获取文件夹失败:', err);
      setError('获取文件夹失败，请检查后端服务是否正常运行');
    } finally {
      setLoading(false);
    }
  };

  // 获取指定文件夹的笔记
  const fetchNotes = async (folderId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await noteApi.getAll(folderId) as unknown as Note[];
      setNotes(data);
    } catch (err) {
      console.error('获取笔记失败:', err);
      setError('获取笔记失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取文件夹
  useEffect(() => {
    fetchFolders();
  }, []);

  // 检查URL参数中是否有folder_id，如果有则直接显示该文件夹的笔记
  useEffect(() => {
    const folderId = searchParams.get('folder_id');
    if (folderId) {
      const id = parseInt(folderId);
      if (!isNaN(id)) {
        setSelectedFolder(id);
      }
    }
  }, [searchParams]);

  // 当选择文件夹时获取笔记
  useEffect(() => {
    if (selectedFolder !== null) {
      fetchNotes(selectedFolder);
    }
  }, [selectedFolder]);

  const handleFolderClick = (folderId: number) => {
    setSelectedFolder(folderId);
    // 使用 replace 而不是 push，避免 RSC 请求冲突
    router.replace(`/?folder_id=${folderId}`, { scroll: false });
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setNotes([]);
    // 使用 replace 返回到主页面，清除URL参数
    router.replace('/', { scroll: false });
  };

  const handleCreateNote = () => {
    if (selectedFolder) {
      router.push(`/note/create?folder_id=${selectedFolder}`);
    } else {
      router.push('/note/create');
    }
  };

  // 创建文件夹
  const handleCreateFolder = async (data: CreateFolderData) => {
    try {
      setCreateLoading(true);
      setError(null);
      
      const newFolder = await folderApi.create(data) as unknown as Folder;
      
      // 更新文件夹列表
      setFolders(prev => [...prev, newFolder]);
      
      // 关闭弹窗
      setIsCreateModalOpen(false);
      
      console.log('文件夹创建成功:', newFolder);
    } catch (err: unknown) {
      console.error('创建文件夹失败:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || '创建文件夹失败';
      setError(errorMessage);
      throw err; // 重新抛出错误，让弹窗组件处理
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">加载中...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                fetchFolders();
              }} 
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              重试
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">我的笔记</h1>
        
        {selectedFolder === null ? (
          // 显示文件夹列表
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">文件夹</h2>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                + 新建文件夹
              </button>
            </div>
            
            {folders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">还没有文件夹</p>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors"
                >
                  创建第一个文件夹
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    name={folder.name}
                    onClick={() => handleFolderClick(folder.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // 显示选中文件夹中的笔记列表
          <div>
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={handleBackToFolders}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                ← 返回文件夹列表
              </button>
              <button 
                onClick={handleCreateNote}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                + 新建笔记
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {folders.find(f => f.id === selectedFolder)?.name || '文件夹'} 中的笔记
            </h2>
            
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">这个文件夹还没有笔记</p>
                <button 
                  onClick={handleCreateNote}
                  className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                >
                  创建第一个笔记
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    title={note.title}
                    path={note.id.toString()}
                    lastModified={new Date(note.updated_at).toLocaleDateString('zh-CN')}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 新建文件夹弹窗 */}
      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateFolder}
        loading={createLoading}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">加载中...</div>}>
      <HomeContent />
    </Suspense>
  );
}
