import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { novelApi, Novel } from '../api/api';
import { 
  BookOpen, 
  PenTool, 
  TrendingUp, 
  Clock,
  Plus,
  Edit3,
  ChevronRight,
  Bell,
  Activity,
  Sparkles
} from 'lucide-react';

// 优化的图表组件
const SimpleBarChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3 group">
          <span className="text-sm text-muted-foreground w-16 font-medium">{item.label}</span>
          <div className="flex-1 h-7 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out group-hover:brightness-110`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold w-8 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const SimplePieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg viewBox="0 0 100 100" className="w-28 h-28 transform -rotate-90">
          {data.map((item, index) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;
            
            const x1 = 50 + 35 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 35 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 35 * Math.cos(((startAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 35 * Math.sin(((startAngle + angle) * Math.PI) / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-xs text-muted-foreground block">总计</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-bold ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 统计卡片组件
const StatCard = ({ title, value, description, icon: Icon, color, delay }: any) => (
  <Card className="hover-lift overflow-hidden group">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
        {value}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
      </p>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNovels: 0,
    activeNovels: 0,
    completedNovels: 0,
    totalChapters: 0,
    recentUpdates: 0
  });
  const navigate = useNavigate();

  // 获取小说列表
  useEffect(() => {
    const fetchNovels = async () => {
      setIsLoading(true);
      try {
        const data = await novelApi.getNovels();
        const novelsArray = Array.isArray(data) ? data : [];
        setNovels(novelsArray);
        
        // 计算统计数据
        const totalNovels = novelsArray.length;
        const activeNovels = novelsArray.filter(n => n.status === 'ongoing').length;
        const completedNovels = novelsArray.filter(n => n.status === 'completed').length;
        const totalChapters = novelsArray.reduce((sum, n) => sum + (n.chapters || 0), 0);
        const recentUpdates = novelsArray.filter(n => {
          if (!n.updated_at) return false;
          const updateDate = new Date(n.updated_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return updateDate >= weekAgo;
        }).length;
        
        setStats({
          totalNovels,
          activeNovels,
          completedNovels,
          totalChapters,
          recentUpdates
        });
      } catch (err) {
        console.error('获取小说列表失败:', err);
        // 使用模拟数据
        const mockNovels: Novel[] = [
          { id: 1, title: '星际征途', genre: '科幻', style: '硬核', status: 'ongoing', chapters: 15, updated_at: new Date().toISOString() },
          { id: 2, title: '魔法学院', genre: '奇幻', style: '轻松', status: 'completed', chapters: 25, updated_at: new Date(Date.now() - 86400000).toISOString() },
          { id: 3, title: '都市传说', genre: '悬疑', style: '暗黑', status: 'paused', chapters: 8, updated_at: new Date(Date.now() - 172800000).toISOString() }
        ];
        setNovels(mockNovels);
        setStats({
          totalNovels: 3,
          activeNovels: 1,
          completedNovels: 1,
          totalChapters: 48,
          recentUpdates: 2
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNovels();
  }, []);

  // 获取最近更新的作品
  const recentNovels = [...novels]
    .filter(n => n.updated_at)
    .sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
    .slice(0, 5);

  // 按类型统计
  const genreStats = novels.reduce((acc, novel) => {
    acc[novel.genre] = (acc[novel.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genreData = Object.entries(genreStats).map(([genre, count], index) => ({
    label: genre,
    value: count,
    color: ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][index % 5]
  }));

  // 按状态统计
  const statusData = [
    { label: '连载中', value: stats.activeNovels, color: '#22c55e' },
    { label: '已完成', value: stats.completedNovels, color: '#3b82f6' },
    { label: '暂停', value: novels.filter(n => n.status === 'paused').length, color: '#eab308' },
    { label: '草稿', value: novels.filter(n => n.status === 'draft').length, color: '#9ca3af' }
  ].filter(item => item.value > 0);

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return '未知';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '未知';
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return '今天';
      if (days === 1) return '昨天';
      if (days < 7) return `${days}天前`;
      return date.toLocaleDateString();
    } catch (e) {
      return '未知';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">概览</h1>
            <p className="text-muted-foreground">查看您的创作数据和统计信息</p>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button onClick={() => navigate('/works')} className="rounded-xl">
          <BookOpen className="h-4 w-4 mr-2" />
          管理作品
        </Button>
        <Button variant="outline" onClick={() => navigate('/editor')} className="rounded-xl">
          <Edit3 className="h-4 w-4 mr-2" />
          开始写作
        </Button>
        <Button variant="outline" onClick={() => navigate('/works')} className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          创建新作品
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="作品总数" 
          value={stats.totalNovels} 
          description={`包含${stats.activeNovels}本连载中作品`}
          icon={BookOpen}
          color="bg-blue-500"
          delay={0}
        />
        <StatCard 
          title="总章节数" 
          value={stats.totalChapters} 
          description={`平均每本${stats.totalNovels > 0 ? Math.round(stats.totalChapters / stats.totalNovels) : 0}章`}
          icon={PenTool}
          color="bg-green-500"
          delay={100}
        />
        <StatCard 
          title="已完成作品" 
          value={stats.completedNovels} 
          description={`完成率${stats.totalNovels > 0 ? Math.round((stats.completedNovels / stats.totalNovels) * 100) : 0}%`}
          icon={TrendingUp}
          color="bg-purple-500"
          delay={200}
        />
        <StatCard 
          title="本周更新" 
          value={stats.recentUpdates} 
          description="最近7天有更新的作品"
          icon={Clock}
          color="bg-yellow-500"
          delay={300}
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 类型分布 */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              作品类型分布
            </CardTitle>
            <CardDescription>按类型统计作品数量</CardDescription>
          </CardHeader>
          <CardContent>
            {genreData.length > 0 ? (
              <SimpleBarChart data={genreData} />
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">暂无数据</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 状态分布 */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              作品状态分布
            </CardTitle>
            <CardDescription>按状态统计作品数量</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <SimplePieChart data={statusData} />
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">暂无数据</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 最近更新 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              最近更新
            </CardTitle>
            <CardDescription>最近更新的作品列表</CardDescription>
          </CardHeader>
          <CardContent>
            {recentNovels.length > 0 ? (
              <div className="space-y-3">
                {recentNovels.map((novel, index) => (
                  <div 
                    key={novel.id} 
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 cursor-pointer transition-all duration-200 group"
                    onClick={() => navigate('/works')}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">{novel.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {novel.genre} · {novel.chapters || 0}章
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {formatDate(novel.updated_at)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">暂无更新记录</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 通知/动态 */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Bell className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              创作动态
            </CardTitle>
            <CardDescription>最近的创作活动和提醒</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">创作提醒</p>
                  <p className="text-xs text-green-600/80 dark:text-green-300/80 mt-1">
                    您有{stats.activeNovels}本作品正在连载中，记得定期更新哦！
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">进度统计</p>
                  <p className="text-xs text-blue-600/80 dark:text-blue-300/80 mt-1">
                    已完成{stats.completedNovels}本作品，继续保持！
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">更新提醒</p>
                  <p className="text-xs text-yellow-600/80 dark:text-yellow-300/80 mt-1">
                    本周已有{stats.recentUpdates}本作品更新
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
