import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '../components/ui/dialog';
import { novelApi, Novel, Chapter } from '../api/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Filter, 
  Search,
  MoreVertical,
  FileText,
  Calendar,
  Tag
} from 'lucide-react';


const WorksPage = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedNovels, setSelectedNovels] = useState<Set<number>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newNovel, setNewNovel] = useState({
    title: '',
    genre: '',
    style: '',
    synopsis: ''
  });
  
  const navigate = useNavigate();

  // 获取小说列表
  const fetchNovels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await novelApi.getNovels();
      const novelsArray = Array.isArray(data) ? data : [];
      setNovels(novelsArray);
      setFilteredNovels(novelsArray);
    } catch (err: any) {
      setError('获取小说列表失败：' + (err.message || '未知错误'));
      console.error('获取小说列表失败：', err);
      // 使用模拟数据
      const mockNovels: Novel[] = [
        {
          id: 1,
          title: '星际征途',
          genre: '科幻',
          style: '硬核',
          synopsis: '一个关于人类探索宇宙的故事',
          status: 'ongoing',
          chapters: 15,
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          title: '魔法学院',
          genre: '奇幻',
          style: '轻松',
          synopsis: '年轻魔法师的成长之路',
          status: 'completed',
          chapters: 25,
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setNovels(mockNovels);
      setFilteredNovels(mockNovels);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNovels();
  }, []);

  // 搜索和筛选
  useEffect(() => {
    let filtered = novels.filter(novel => {
      const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           novel.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           novel.style.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || novel.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // 排序
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'genre':
          aValue = a.genre;
          bValue = b.genre;
          break;
        case 'chapters':
          aValue = a.chapters || 0;
          bValue = b.chapters || 0;
          break;
        case 'updated_at':
        default:
          aValue = a.updated_at || '';
          bValue = b.updated_at || '';
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredNovels(filtered);
  }, [novels, searchTerm, statusFilter, sortBy, sortOrder]);

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return '暂无更新';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '日期无效';
      return date.toLocaleDateString();
    } catch (e) {
      return '未知';
    }
  };

  // 获取状态显示文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'ongoing': '连载中',
      'completed': '已完成',
      'paused': '暂停',
      'draft': '草稿'
    };
    return statusMap[status] || status;
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'ongoing': 'text-green-600 bg-green-100',
      'completed': 'text-blue-600 bg-blue-100',
      'paused': 'text-yellow-600 bg-yellow-100',
      'draft': 'text-gray-600 bg-gray-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  };

  // 处理小说选择
  const handleNovelSelect = (novelId: number) => {
    setSelectedNovels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(novelId)) {
        newSet.delete(novelId);
      } else {
        newSet.add(novelId);
      }
      return newSet;
    });
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedNovels.size === filteredNovels.length) {
      setSelectedNovels(new Set());
    } else {
      setSelectedNovels(new Set(filteredNovels.map(n => n.id)));
    }
  };

  // 处理编辑
  const handleEdit = (novelId: number) => {
    navigate(`/editor?novelId=${novelId}`);
  };

  // 处理预览
  const handlePreview = (novelId: number) => {
    navigate(`/preview?novelId=${novelId}`);
  };

  // 处理复制链接
  const handleCopyLink = (novelId: number) => {
    const link = `${window.location.origin}/preview?novelId=${novelId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('链接已复制到剪贴板');
    });
  };

  // 处理删除
  const handleDelete = async (novelId: number, title: string) => {
    if (window.confirm(`确定要删除小说《${title}》吗？此操作将删除所有相关章节，不可撤销。`)) {
      try {
        await novelApi.deleteNovel(novelId);
        await fetchNovels();
        setSelectedNovels(prev => {
          const newSet = new Set(prev);
          newSet.delete(novelId);
          return newSet;
        });
      } catch (err: any) {
        alert('删除失败: ' + (err.message || '未知错误'));
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedNovels.size === 0) {
      alert('请先选择要删除的小说');
      return;
    }
    
    if (window.confirm(`确定要删除选中的 ${selectedNovels.size} 本小说吗？此操作不可撤销。`)) {
      try {
        // 批量删除
        for (const novelId of selectedNovels) {
          await novelApi.deleteNovel(novelId);
        }
        await fetchNovels();
        setSelectedNovels(new Set());
      } catch (err: any) {
        alert('批量删除失败: ' + (err.message || '未知错误'));
      }
    }
  };

  // 批量更新状态
  const handleBatchUpdateStatus = async (status: string) => {
    if (selectedNovels.size === 0) {
      alert('请先选择要更新的小说');
      return;
    }
    
    try {
      // 这里需要实现批量更新状态的API
      // 暂时使用单个更新
      for (const novelId of selectedNovels) {
        // await novelApi.updateNovelStatus(novelId, status);
      }
      await fetchNovels();
      setSelectedNovels(new Set());
    } catch (err: any) {
      alert('批量更新状态失败: ' + (err.message || '未知错误'));
    }
  };

  // 创建新小说
  const handleCreateNovel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const novel = await novelApi.createNovel(newNovel);
      await fetchNovels();
      setIsCreateDialogOpen(false);
      setNewNovel({ title: '', genre: '', style: '', synopsis: '' });
    } catch (err: any) {
      alert('创建失败: ' + (err.message || '未知错误'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* 页面头部 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">作品管理</h1>
        <p className="text-muted-foreground mt-1">管理您的所有创作作品</p>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
          {error}
        </div>
      )}
      
      {/* 搜索和筛选工具栏 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索作品标题、类型或风格..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* 状态筛选 */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">全部状态</option>
              <option value="ongoing">连载中</option>
              <option value="completed">已完成</option>
              <option value="paused">暂停</option>
              <option value="draft">草稿</option>
            </select>
            
            {/* 排序 */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border rounded-md"
            >
              <option value="updated_at-desc">最近更新</option>
              <option value="updated_at-asc">最早更新</option>
              <option value="title-asc">标题 A-Z</option>
              <option value="title-desc">标题 Z-A</option>
              <option value="chapters-desc">章节数最多</option>
              <option value="chapters-asc">章节数最少</option>
            </select>
          </div>
        </div>
        
        {/* 批量操作 */}
        {selectedNovels.size > 0 && (
          <div className="flex gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground flex items-center">
              已选择 {selectedNovels.size} 本作品
            </span>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedNovels.size === filteredNovels.length ? '取消全选' : '全选'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleBatchDelete}>
              批量删除
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBatchUpdateStatus('completed')}>
              标记完成
            </Button>
          </div>
        )}
      </div>
      
      {/* 操作栏 */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          共 {filteredNovels.length} 本作品
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              创建新作品
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>创建新作品</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateNovel} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">作品标题</Label>
                <Input
                  id="title"
                  value={newNovel.title}
                  onChange={(e) => setNewNovel(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="例如：星际征途"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre">类型</Label>
                <Input
                  id="genre"
                  value={newNovel.genre}
                  onChange={(e) => setNewNovel(prev => ({ ...prev, genre: e.target.value }))}
                  placeholder="例如：科幻"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="style">风格</Label>
                <Input
                  id="style"
                  value={newNovel.style}
                  onChange={(e) => setNewNovel(prev => ({ ...prev, style: e.target.value }))}
                  placeholder="例如：硬核、轻松"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="synopsis">简介</Label>
                <Textarea
                  id="synopsis"
                  value={newNovel.synopsis}
                  onChange={(e) => setNewNovel(prev => ({ ...prev, synopsis: e.target.value }))}
                  placeholder="简要描述故事背景和核心情节..."
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? '创建中...' : '确认创建'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* 作品列表 */}
      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex justify-center">
              <div className="text-muted-foreground">加载中...</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNovels.map((novel) => (
            <Card key={novel.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedNovels.has(novel.id)}
                      onChange={() => handleNovelSelect(novel.id)}
                      className="rounded"
                    />
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(novel.id)} title="编辑">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handlePreview(novel.id)} title="预览">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleCopyLink(novel.id)} title="复制链接">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
                      onClick={() => handleDelete(novel.id, novel.title)}
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                  {novel.title}
                </CardTitle>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>{novel.genre} · {novel.style}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{novel.chapters || 0} 章节</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>更新于 {formatDate(novel.updated_at)}</span>
                  </div>
                </div>
                
                {novel.synopsis && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {novel.synopsis}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(novel.status)}`}>
                    {getStatusText(novel.status)}
                  </span>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(novel.id)}>
                      编辑
                    </Button>
                    <Button size="sm" onClick={() => handlePreview(novel.id)}>
                      预览
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* 空状态 */}
      {!isLoading && filteredNovels.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">暂无作品</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? '没有找到符合条件的作品' 
                : '还没有创建任何作品，开始您的创作之旅吧！'}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              创建新作品
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorksPage;