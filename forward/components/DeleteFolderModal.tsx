'use client';

import { FC } from 'react';
import { DeleteFolderData } from '../types';

interface DeleteFolderModalProps {
  isOpen: boolean;
  folder?: DeleteFolderData; // 当前要删除的文件夹
  onClose: () => void;
  onConfirm: (folder: DeleteFolderData) => Promise<void>;
  loading?: boolean;
}

const DeleteFolderModal: FC<DeleteFolderModalProps> = ({ isOpen, folder, onClose, onConfirm, loading = false }) => {
  if (!isOpen || !folder) return null;

  const handleConfirm = async () => {
    await onConfirm(folder);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">确认删除文件夹？</h2>
        <p className="text-sm text-gray-600 mb-6">
          确定要删除文件夹 <span className="font-medium text-red-600">{folder.name}</span> 吗？此操作不可撤销。
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? '删除中...' : '删除'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderModal;
