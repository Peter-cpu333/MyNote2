'use client';

import { useState } from 'react';
import { CreateFolderData } from '../types';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFolderData) => Promise<void>;
  loading?: boolean;
}

export default function CreateFolderModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}: CreateFolderModalProps) {
  const [formData, setFormData] = useState<CreateFolderData>({
    name: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 重置表单
  const resetForm = () => {
    setFormData({ name: '' });
    setErrors({});
  };

  // 关闭弹窗
  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = '文件夹名称不能为空';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = '文件夹名称不能超过100个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
      });
      resetForm();
      onClose();
    } catch (error) {
      // 错误处理由父组件负责
      console.error('创建文件夹失败:', error);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof CreateFolderData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-sm mx-auto transform transition-all duration-300 ease-out">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">新建文件夹</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full p-1 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4 sm:pb-6">
          {/* 文件夹名称 */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              文件夹名称
            </label>
            <input
              id="folderName"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="输入文件夹名称"
              disabled={loading}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 disabled:bg-gray-100/50 disabled:cursor-not-allowed transition-all duration-200 text-gray-900 text-sm sm:text-base
              }`}
              maxLength={100}
              autoFocus
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* 按钮组 */}
          <div className="flex justify-end space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 sm:px-5 py-2 sm:py-2.5 text-gray-600 bg-gray-100/70 backdrop-blur-sm rounded-xl hover:bg-gray-200/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-lg shadow-blue-500/25 text-sm sm:text-base"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? '创建中...' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}