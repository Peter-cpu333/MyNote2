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
    <main className="min-h-screen bg-gray-50">
      {selectedFolder === null ? (
        // 文件夹列表页面的固定头部
        <>
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-8 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">我的笔记</h2>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title="新建文件夹"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto p-8">
            <div>
            
            {folders.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl p-12 shadow-sm border max-w-md mx-auto">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">开始你的笔记之旅</h3>
                  <p className="text-gray-600 mb-6">创建第一个文件夹来整理你的想法和知识</p>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    创建第一个文件夹
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </>
      ) : (
        // 笔记列表页面的固定头部
        <>
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-8 py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToFolders}
                  className="w-10 h-10 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full flex items-center justify-center transition-colors"
                  title="返回文件夹列表"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h2 className="text-2xl font-bold text-gray-800 flex-1">
                  {folders.find(f => f.id === selectedFolder)?.name || '文件夹'}
                </h2>
                <button 
                  onClick={handleCreateNote}
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title="新建笔记"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto p-8">
            <div>
            
            {notes.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl p-12 shadow-sm border max-w-md mx-auto">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">这里还很空呢</h3>
                  <p className="text-gray-600 mb-6">在这个文件夹中创建你的第一篇笔记吧</p>
                  <button 
                    onClick={handleCreateNote}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    创建第一个笔记
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    title={note.title}
                    path={note.id.toString()}
                    lastModified={new Date(note.updated_at).toLocaleDateString('zh-CN')}
                    preview={note.content ? note.content.split('\n')[0].substring(0, 100) : undefined}
                  />
                ))}
              </div>
            )}
            </div>
          </div>
        </>
      )}

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
