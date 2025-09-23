'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IoArrowBack, IoSave } from 'react-icons/io5';
import { noteApi } from '@/services/api';
import { CreateNoteData } from '@/types';

function CreateNoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams.get('folder_id');
  
  const [formData, setFormData] = useState<CreateNoteData>({
    title: '',
    content: '',
    folder_id: folderId ? parseInt(folderId) : undefined,
    is_public: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('请输入笔记标题');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await noteApi.create(formData);
      console.log('创建笔记成功:', response);
      
      // 创建成功后跳转到笔记详情页
      if (response && typeof response === 'object' && 'id' in response) {
        router.push(`/note/${response.id}`);
      } else {
        // 如果没有返回ID，跳转回主页
        router.push('/');
      }
    } catch (err) {
      console.error('创建笔记失败:', err);
      setError('创建笔记失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // 构建返回链接，如果有文件夹ID则返回到对应文件夹的笔记列表
  const getBackLink = () => {
    if (folderId) {
      return `/?folder_id=${folderId}`;
    }
    return '/';
  };

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif' }}>
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm navbar-height">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 navbar-padding flex items-center">
          <div className="flex items-center justify-between w-full">
            <Link
              href={getBackLink()}
              className="navbar-button text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0 flex items-center justify-center"
            >
              <IoArrowBack className="navbar-icon" />
            </Link>
            
            <h1 className="navbar-title font-bold text-gray-900">新建笔记</h1>
            
            <div className="navbar-button"></div> {/* 占位符保持居中 */}
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              笔记标题 *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="请输入笔记标题"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              笔记内容
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-gray-900"
              placeholder="请输入笔记内容，支持 Markdown 格式"
            />
            <p className="mt-1 text-sm text-gray-500">
              支持 Markdown 语法，如 **粗体**、*斜体*、`代码`、# 标题 等
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              <IoSave />
              <span>{loading ? '创建中...' : '创建笔记'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function CreateNotePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">加载中...</div>}>
      <CreateNoteContent />
    </Suspense>
  );
}