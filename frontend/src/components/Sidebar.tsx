import { useState } from 'react';
import { BookOpen, FileText, Plus, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Novel, Chapter } from '../api/api';
import { Button } from './ui/button';

interface SidebarProps {
  novels: Novel[];
  chapters?: Chapter[];
  selectedNovelId?: number;
  selectedChapterId?: number;
  disabled?: boolean;
  onNovelSelect: (id: number) => void;
  onChapterSelect: (id: number) => void;
  onCreateNovel?: () => void;
  onCreateChapter?: (novelId: number) => void;
}

export default function Sidebar({novels, chapters = [], selectedNovelId, selectedChapterId, disabled,
  onNovelSelect, onChapterSelect, onCreateNovel, onCreateChapter}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const [search, setSearch] = useState('');
  return <aside className={`${collapsed ? 'w-14' : 'w-48 md:w-64'} flex shrink-0 flex-col border-r bg-card transition-all`} aria-label="作品与章节">
    <div className="flex items-center justify-between border-b p-3">
      {!collapsed && <h2 className="text-sm font-semibold">作品与章节</h2>}
      <Button variant="ghost" size="icon" aria-label={collapsed ? '展开目录' : '收起目录'} onClick={() => setCollapsed(value => !value)}>
        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </Button>
    </div>
    {!collapsed && <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
      <Button variant="outline" className="w-full" onClick={onCreateNovel} disabled={disabled}><Plus className="mr-2 h-4 w-4" />新建作品</Button>
      <input aria-label="搜索作品" placeholder="搜索作品" className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={search} onChange={event => setSearch(event.target.value)} />
      <nav aria-label="我的作品" className="space-y-1">
        {novels.filter(item => item.title.toLowerCase().includes(search.toLowerCase())).map(item => <div key={item.id}>
          <button disabled={disabled} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${item.id === selectedNovelId ? 'bg-muted font-medium' : 'hover:bg-muted/60'}`}
            aria-current={item.id === selectedNovelId ? 'true' : undefined} onClick={() => onNovelSelect(item.id)}>
            <BookOpen className="h-4 w-4 shrink-0" /><span className="truncate">{item.title}</span>
          </button>
          {item.id === selectedNovelId && <div className="ml-4 mt-1 space-y-1 border-l pl-2">
            {chapters.map(entry => <button key={entry.id} disabled={disabled} onClick={() => onChapterSelect(entry.id)}
              aria-current={entry.id === selectedChapterId ? 'page' : undefined}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm ${entry.id === selectedChapterId ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
              <FileText className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{entry.title}</span>
            </button>)}
            {!chapters.length && <p className="px-2 py-2 text-xs text-muted-foreground">还没有章节</p>}
            <button disabled={disabled} className="flex w-full items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => onCreateChapter?.(item.id)}>
              <Plus className="h-3.5 w-3.5" />新建章节
            </button>
          </div>}
        </div>)}
        {!novels.length && <p className="py-3 text-center text-xs text-muted-foreground">你的故事会出现在这里</p>}
      </nav>
    </div>}
  </aside>;
}
