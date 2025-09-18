'use client';
import { useState } from 'react';
import { IoChatbubbleEllipses, IoClose } from 'react-icons/io5';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 悬浮图标 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <IoChatbubbleEllipses className="text-2xl" />
      </button>

      {/* 对话框 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">对话框</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-gray-600">
                这里可以放置对话框的内容，比如聊天界面、快捷操作等。
              </p>
            </div>
            
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}