'use client';
import { useState } from 'react';
import { IoChatbubbleEllipses, IoClose, IoSend, IoSparkles } from 'react-icons/io5';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      {/* 悬浮图标 - 美化设计 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 transform ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <IoChatbubbleEllipses className="text-2xl" />
      </button>

      {/* AI聊天框 - 美化版本 */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t z-50 transition-all duration-500 ease-out ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`} style={{ height: '66.67vh', backgroundColor: 'rgba(255, 255, 255, 1)' }}>
        {/* 头部 - 渐变背景 */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center space-x-2">
            <IoSparkles className="text-xl text-yellow-300" />
            <h3 className="text-lg font-semibold">AI 智能助手</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
          >
            <IoClose className="text-xl" />
          </button>
        </div>
        
        {/* 聊天内容区域 - 美化背景 */}
        <div className="flex-1 p-4 overflow-y-auto" style={{ height: 'calc(66.67vh - 140px)', backgroundColor: 'rgba(249, 250, 251, 1)' }}>
          <div className="space-y-4">
            {/* AI欢迎消息 - 美化样式 */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <IoSparkles className="text-white text-sm" />
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl rounded-tl-md max-w-xs shadow-sm border border-blue-100">
                <p className="text-sm text-gray-800 leading-relaxed">
                  你好！我是AI智能助手 ✨<br/>
                  有什么可以帮助你的吗？
                </p>
              </div>
            </div>
            
            {/* 示例用户消息 */}
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl rounded-tr-md max-w-xs shadow-sm">
                <p className="text-sm text-white leading-relaxed">
                  帮我整理一下今天的笔记
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">我</span>
              </div>
            </div>
            
            {/* AI回复消息 */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <IoSparkles className="text-white text-sm" />
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl rounded-tl-md max-w-xs shadow-sm border border-blue-100">
                <p className="text-sm text-gray-800 leading-relaxed">
                  好的！我可以帮你整理笔记。请告诉我你想要整理哪些内容，或者上传你的笔记文件。
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 输入区域 - 美化设计 */}
        <div className="border-t p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
          <div className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="输入你的问题..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setMessage('');
                }
              }}
            />
            <button
              onClick={() => {
                setMessage('');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <IoSend className="text-lg" />
            </button>
          </div>
          
          {/* 快捷操作按钮 */}
          <div className="flex space-x-2 mt-3">
            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors">
              📝 整理笔记
            </button>
            <button className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors">
              💡 创意建议
            </button>
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors">
              🔍 搜索内容
            </button>
          </div>
        </div>
      </div>

      {/* 背景遮罩 - 美化效果 */}
      {isOpen && (
        <div 
          className="fixed inset-0 transition-opacity duration-500 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}