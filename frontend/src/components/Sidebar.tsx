import React, { useState, useRef, useEffect } from 'react';
import { Novel, Chapter } from '../api/api';

interface SidebarProps {
  novels: Novel[];
  selectedNovelId?: number;
  selectedChapterId?: number;
  onNovelSelect: (novelId: number) => void;
  onChapterSelect: (chapterId: number) => void;
  onCreateNovel?: () => void;
  onCreateChapter?: (novelId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  novels, 
  selectedNovelId, 
  selectedChapterId, 
  onNovelSelect, 
  onChapterSelect,
  onCreateNovel,
  onCreateChapter
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedNovels, setExpandedNovels] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarRef = useRef<HTMLElement>(null);

  // 切换小说展开/折叠状态
  const toggleNovelExpanded = (novelId: number) => {
    const newExpanded = new Set(expandedNovels);
    if (newExpanded.has(novelId)) {
      newExpanded.delete(novelId);
    } else {
      newExpanded.add(novelId);
    }
    setExpandedNovels(newExpanded);
  };

  // 键盘导航处理
  const handleKeyDown = (event: React.KeyboardEvent, novelId: number, hasChapters: boolean = false) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (hasChapters) {
        toggleNovelExpanded(novelId);
      } else {
        onNovelSelect(novelId);
      }
    } else if (event.key === 'ArrowRight' && hasChapters) {
      event.preventDefault();
      setExpandedNovels(new Set(expandedNovels).add(novelId));
    } else if (event.key === 'ArrowLeft' && hasChapters) {
      event.preventDefault();
      const newExpanded = new Set(expandedNovels);
      newExpanded.delete(novelId);
      setExpandedNovels(newExpanded);
    }
  };

  // 过滤小说
  const filteredNovels = novels.filter(novel => {
    return novel.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 切换侧边栏折叠状态
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 点击外部关闭侧边栏（移动端）
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* 移动端侧边栏切换按钮 */}
      <button
        onClick={toggleCollapse}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-blue-600 text-white shadow-lg md:hidden"
        aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
      >
        {isCollapsed ? '☰' : '✕'}
      </button>
      
      {/* 侧边栏 */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:relative top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out z-40 overflow-hidden
          ${isCollapsed ? 'w-0 md:w-20' : 'w-64 md:w-72'}
          ${window.innerWidth >= 768 ? 'block' : (isCollapsed ? 'hidden' : 'block')}
        `}
        aria-label="侧边导航栏"
        role="navigation"
      >
        <div className={`h-full flex flex-col overflow-y-auto`}>
          {/* 侧边栏头部 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold text-gray-800 dark:text-white transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                小说管理
              </h2>
              <button
                onClick={toggleCollapse}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
              >
                {isCollapsed ? '→' : '←'}
              </button>
            </div>
            
            {/* 搜索框 */}
            <div className={`mt-4 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
              <input
                type="text"
                placeholder="搜索小说..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="搜索小说"
              />
            </div>
          </div>
          
          {/* 小说列表 */}
          <nav className="flex-1 p-4 space-y-2">
            {/* 新建小说按钮 */}
            {onCreateNovel && (
              <button
                onClick={onCreateNovel}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                aria-label="新建小说"
              >
                <span>+</span>
                <span className={`transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>新建小说</span>
              </button>
            )}
            
            {/* 小说列表 */}
            <div className="mt-4 space-y-2">
              <h3 className={`text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                我的小说
              </h3>
              
              {filteredNovels.map((novel) => (
                <div key={novel.id} className="space-y-1">
                  {/* 小说标题行 */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors
                      ${selectedNovelId === novel.id 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none'}
                    `}
                    onClick={() => onNovelSelect(novel.id)}
                    onKeyDown={(e) => handleKeyDown(e, novel.id, (novel.chapters || 0) > 0)}
                    role="treeitem"
                    aria-expanded={expandedNovels.has(novel.id)}
                    aria-selected={selectedNovelId === novel.id}
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">📖</span>
                      <span className={`transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'} truncate`}>
                        {novel.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </aside>
      
      {/* 侧边栏展开时的背景遮罩（移动端） */}
      {!isCollapsed && window.innerWidth < 768 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsCollapsed(true)}></div>
      )}
    </>
  );
};

export default Sidebar;
