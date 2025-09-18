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
    <main 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative"
      style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif' }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={getBackLink()}
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-all duration-200 hover:scale-105"
          >
            <IoArrowBack className="text-lg" />
            <span className="font-medium">返回</span>
          </Link>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            新建笔记
          </h1>
          
          <div className="w-16"></div> {/* 占位符保持居中 */}
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300"
        >
          {error && (
            <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="mb-8">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
              笔记标题 *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-gray-900 placeholder-gray-500 transition-all duration-200"
              placeholder="请输入笔记标题"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-3">
              笔记内容
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 font-mono text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 resize-none"
              placeholder="请输入笔记内容，支持 Markdown 格式"
            />
            <p className="mt-2 text-sm text-gray-600 bg-gray-50/50 backdrop-blur-sm px-3 py-2 rounded-lg">
              💡 支持 Markdown 语法：**粗体**、*斜体*、`代码`、# 标题 等
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 bg-gray-100/70 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-gray-200/70 focus:outline-none focus:ring-2 focus:ring-gray-400/50 transition-all duration-200 font-medium"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <IoSave className="text-lg" />
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