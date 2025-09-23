'use client';
import { useEffect, useState, use } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';
import Image from 'next/image';
import { IoArrowBack } from 'react-icons/io5';
import { noteApi, folderApi } from '@/services/api';
import { Note, Folder } from '@/types';

export default function NotePage({ params }: { params: Promise<{ path: string[] }> }) {
  const [note, setNote] = useState<Note | null>(null);
  const [folder, setFolder] = useState<Folder | null>(null);
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
        
        // 如果笔记有文件夹ID，获取文件夹信息
        if (data.folder_id) {
          try {
            const folders = await folderApi.getAll() as unknown as Folder[];
            const noteFolder = folders.find(f => f.id === data.folder_id);
            setFolder(noteFolder || null);
          } catch (folderErr) {
            console.error('获取文件夹信息失败:', folderErr);
            // 文件夹获取失败不影响笔记显示
          }
        }
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
            className="inline-flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full mb-6 transition-colors"
            title="返回笔记列表"
          >
            <IoArrowBack />
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
            className="inline-flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full mb-6 transition-colors"
            title="返回笔记列表"
          >
            <IoArrowBack />
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
      {/* 固定头部：返回按钮和标题 */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm navbar-height">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 navbar-padding flex items-center">
        <div className="flex items-center gap-3 sm:gap-4 w-full max-w-4xl mx-auto">
          <Link
            href={getBackLink()}
            className="navbar-button text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0 flex items-center justify-center"
            title="返回笔记列表"
          >
            <IoArrowBack className="navbar-icon" />
          </Link>
          <h1 className="navbar-title font-bold text-gray-900 leading-tight flex-1 break-words">
            {note.title}
          </h1>
        </div>
      </div>
      </div>
      
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="max-w-4xl mx-auto">
            {/* 第二行：文件夹信息和更新时间 */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {folder && (
                  <>
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white"
                      style={{ backgroundColor: folder.color || '#6B73FF' }}
                    >
                      {folder.name}
                    </span>
                  </>
                )}
                {!folder && note.folder_id && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-500 text-white">
                    文件夹
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {new Date(note.updated_at).toLocaleString('zh-CN')}
              </div>
            </div>
            
            {/* 笔记内容区域 - 移除卡片样式 */}
            <div className="prose prose-lg prose-slate max-w-none text-gray-900
                      prose-headings:text-gray-900 prose-headings:font-semibold
                      prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-6 prose-h1:pb-3 prose-h1:border-b-2 prose-h1:border-gray-300
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
                      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:font-medium
                      prose-h4:text-lg prose-h4:mt-5 prose-h4:mb-2
                      prose-h5:text-base prose-h5:mt-4 prose-h5:mb-2 prose-h5:font-medium
                      prose-h6:text-sm prose-h6:mt-3 prose-h6:mb-2 prose-h6:font-medium prose-h6:text-gray-600
                      prose-p:text-gray-900 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline prose-a:transition-colors
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-em:text-gray-800 prose-em:italic
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:py-3 prose-blockquote:my-6 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-800 prose-blockquote:italic prose-blockquote:rounded-r-md
                      prose-ul:list-none prose-ul:space-y-2 prose-ul:mb-6 prose-ul:text-gray-900
                      prose-ol:list-none prose-ol:space-y-2 prose-ol:mb-6 prose-ol:text-gray-900
                      prose-li:relative prose-li:pl-6 prose-li:text-gray-900 prose-li:leading-relaxed
                      prose-table:min-w-full prose-table:divide-y prose-table:divide-gray-200 prose-table:border prose-table:border-gray-300 prose-table:rounded-lg prose-table:my-8 prose-table:shadow-sm
                      prose-thead:bg-gray-50
                      prose-th:px-6 prose-th:py-4 prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-gray-700 prose-th:uppercase prose-th:tracking-wider prose-th:border-b prose-th:border-gray-200
                      prose-td:px-6 prose-td:py-4 prose-td:text-sm prose-td:text-gray-900 prose-td:border-b prose-td:border-gray-200
                      prose-hr:border-gray-300 prose-hr:my-8 prose-hr:border-t-2
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-6 prose-pre:overflow-x-auto
                      prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:border
                      prose-img:rounded-lg prose-img:shadow-md prose-img:my-6">
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
                    className="rounded-lg my-6 shadow-lg border border-gray-200"
                    showLineNumbers={true}
                    wrapLines={true}
                    customStyle={{
                      margin: '1.5rem 0',
                      padding: '1rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm font-mono border border-red-200" {...props}>
                    {children}
                  </code>
                );
              },
              p({children}) {
                return <p className="text-gray-900 leading-relaxed mb-4 text-base">{children}</p>;
              },
              h1({children}) {
                return <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-6 pb-3 border-b-2 border-gray-300">{children}</h1>;
              },
              h2({children}) {
                return <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200">{children}</h2>;
              },
              h3({children}) {
                return <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">{children}</h3>;
              },
              h4({children}) {
                return <h4 className="text-lg font-medium text-gray-900 mt-5 mb-2">{children}</h4>;
              },
              h5({children}) {
                return <h5 className="text-base font-medium text-gray-900 mt-4 mb-2">{children}</h5>;
              },
              h6({children}) {
                return <h6 className="text-sm font-medium text-gray-600 mt-3 mb-2">{children}</h6>;
              },
              ul({children}) {
                return <ul className="space-y-2 mb-6 text-gray-900">{children}</ul>;
              },
              ol({children, start}) {
                return <ol className="space-y-2 mb-6 text-gray-900" start={start}>{children}</ol>;
              },
              li({children}) {
                return (
                  <li className="relative pl-6 text-gray-900 leading-relaxed">
                    <span className="absolute left-0 top-0 text-blue-500 font-medium">
                      •
                    </span>
                    {children}
                  </li>
                );
              },
              blockquote({children}) {
                return (
                  <blockquote className="border-l-4 border-blue-500 pl-6 py-3 my-6 bg-blue-50 text-gray-800 italic rounded-r-md">
                    {children}
                  </blockquote>
                );
              },
              strong({children}) {
                return <strong className="font-semibold text-gray-900">{children}</strong>;
              },
              em({children}) {
                return <em className="italic text-gray-800">{children}</em>;
              },
              hr() {
                return <hr className="border-gray-300 my-8 border-t-2" />;
              },
              img({src, alt}) {
                // 对于Markdown中的图片，使用普通img标签但添加unoptimized属性
                // 因为Markdown中的图片路径可能是动态的，不适合Next.js Image组件
                return (
                  <Image 
                    src={src as string || ''} 
                    alt={alt || ''} 
                    width={800}
                    height={600}
                    className="rounded-lg shadow-md my-6 max-w-full h-auto"
                    style={{ width: 'auto', height: 'auto' }}
                    unoptimized
                  />
                );
              },
              table({children}) {
                return (
                  <div className="overflow-x-auto my-8">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg shadow-sm">
                      {children}
                    </table>
                  </div>
                );
              },
              thead({children}) {
                return <thead className="bg-gray-50">{children}</thead>;
              },
              th({children}) {
                return (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    {children}
                  </th>
                );
              },
              td({children}) {
                return (
                  <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-200">
                    {children}
                  </td>
                );
              }
            }}
          >
            {note.content || '这个笔记还没有内容'}
          </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}