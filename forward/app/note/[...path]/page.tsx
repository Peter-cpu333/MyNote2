'use client';
import { useEffect, useState, use } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import { noteApi } from '@/services/api';
import { Note } from '@/types';

export default function NotePage({ params }: { params: Promise<{ path: string[] }> }) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteId, setNoteId] = useState<number | null>(null);
  
  // 使用 React.use() 来解包 params Promise
  const resolvedParams = use(params);
  
  useEffect(() => {
    if (resolvedParams?.path && resolvedParams.path.length > 0) {
      // 假设路径的第一个参数是笔记ID
      const id = parseInt(resolvedParams.path[0]);
      if (!isNaN(id)) {
        setNoteId(id);
      }
    }
  }, [resolvedParams?.path]);

  // 从后端获取笔记内容
  useEffect(() => {
    const fetchNote = async () => {
      if (noteId === null) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await noteApi.getOne(noteId) as unknown as Note;
        setNote(data);
      } catch (err) {
        console.error('获取笔记失败:', err);
        setError('获取笔记失败: Note not found or you don\'t have permission');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  // 构建返回链接，如果有文件夹ID则返回到对应文件夹的笔记列表
  const getBackLink = () => {
    if (note?.folder_id) {
      return `/?folder_id=${note.folder_id}`;
    }
    return '/';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif' }}>
        <div className="max-w-4xl mx-auto p-8">
          <Link
            href={getBackLink()}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <IoArrowBack />
            <span>返回笔记列表</span>
          </Link>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-900">加载中...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !note) {
    return (
      <main className="min-h-screen bg-gray-50" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif' }}>
        <div className="max-w-4xl mx-auto p-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <IoArrowBack />
            <span>返回笔记列表</span>
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error || '笔记不存在'}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif' }}>
      <div className="max-w-4xl mx-auto p-8">
        <Link
          href={getBackLink()}
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <IoArrowBack />
          <span>返回笔记列表</span>
        </Link>
        
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 leading-tight border-b border-gray-200 pb-4">{note.title}</h1>
            <div className="text-sm text-gray-600 mb-8 flex flex-wrap gap-4">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                创建: {new Date(note.created_at).toLocaleString('zh-CN')}
              </span>
              {note.updated_at !== note.created_at && (
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  更新: {new Date(note.updated_at).toLocaleString('zh-CN')}
                </span>
              )}
            </div>
            
            <div className="prose prose-lg prose-slate max-w-none text-gray-900
                          prose-headings:text-gray-900 prose-headings:font-semibold
                          prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-gray-200
                          prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                          prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2
                          prose-p:text-gray-900 prose-p:leading-relaxed prose-p:mb-4
                          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline
                          prose-strong:text-gray-900 prose-strong:font-semibold
                          prose-em:text-gray-800
                          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:my-4 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-800 prose-blockquote:italic
                          prose-ul:list-disc prose-ul:list-inside prose-ul:space-y-1 prose-ul:mb-4 prose-ul:text-gray-900
                          prose-ol:list-decimal prose-ol:list-inside prose-ol:space-y-1 prose-ol:mb-4 prose-ol:text-gray-900
                          prose-li:ml-4 prose-li:text-gray-900
                          prose-table:min-w-full prose-table:divide-y prose-table:divide-gray-200 prose-table:border prose-table:border-gray-300 prose-table:rounded-lg prose-table:my-6
                          prose-thead:bg-gray-50
                          prose-th:px-6 prose-th:py-3 prose-th:text-left prose-th:text-xs prose-th:font-medium prose-th:text-gray-500 prose-th:uppercase prose-th:tracking-wider prose-th:border-b prose-th:border-gray-200
                          prose-td:px-6 prose-td:py-4 prose-td:whitespace-nowrap prose-td:text-sm prose-td:text-gray-900 prose-td:border-b prose-td:border-gray-200
                          prose-hr:border-gray-300 prose-hr:my-8">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  code({className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return !isInline ? (
                      <SyntaxHighlighter
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg my-4 shadow-sm"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono border" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p({children}) {
                    return <p className="text-gray-900 leading-relaxed mb-4">{children}</p>;
                  },
                  h1({children}) {
                    return <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200">{children}</h1>;
                  },
                  h2({children}) {
                    return <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{children}</h2>;
                  },
                  h3({children}) {
                    return <h3 className="text-lg font-medium text-gray-900 mt-5 mb-2">{children}</h3>;
                  },
                  ul({children}) {
                    return <ul className="list-disc list-inside space-y-1 mb-4 text-gray-900">{children}</ul>;
                  },
                  ol({children}) {
                    return <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-900">{children}</ol>;
                  },
                  li({children}) {
                    return <li className="ml-4 text-gray-900">{children}</li>;
                  },
                  blockquote({children}) {
                    return (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-800 italic">
                        {children}
                      </blockquote>
                    );
                  },
                  strong({children}) {
                    return <strong className="font-semibold text-gray-900">{children}</strong>;
                  },
                  em({children}) {
                    return <em className="italic text-gray-800">{children}</em>;
                  }
                }}
              >
                {note.content || '这个笔记还没有内容'}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}