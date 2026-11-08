import './Studio.css';
import React, { useState, useEffect } from 'react';
import { BookOpen, Edit3, Settings, Menu, X, Home, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { authApi, User } from '../api/api';
import apiClient from '../api/api';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.me();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    try { await apiClient.post('/auth/logout', {}); } catch { window.alert('退出未完成，请检查网络后重试。'); return; }
    apiClient.removeToken();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: '概览', href: '/dashboard' },
    { icon: BookOpen, label: '作品管理', href: '/works' },
    { icon: Edit3, label: '写作', href: '/editor' },
    { icon: Settings, label: '设置', href: '/settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={`story-studio ${location.pathname === "/editor" ? "story-studio-editor" : ""} min-h-screen bg-background text-foreground flex`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`story-studio-sidebar fixed md:sticky top-0 left-0 z-50 h-screen w-64 
        bg-card
        border-r border-border/50
        transition-all duration-300 ease-out transform md:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Logo区域 */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/brand/icon.svg?v=20261103-brand1" width="40" height="40" alt="" className="shrink-0 rounded-lg" />
              <div>
                <h1 className="text-lg font-bold text-gradient">故事工坊</h1>
                <p className="text-xs text-muted-foreground">你的创作空间</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" aria-label="关闭导航" className="md:hidden h-8 w-8" onClick={toggleSidebar}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* 导航菜单 */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start gap-3 h-11 px-4 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                onClick={() => { navigate(item.href); setIsSidebarOpen(false); }}
              >
                <item.icon className={`h-5 w-5 transition-colors ${active ? 'text-primary' : ''}`} />
                {item.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Button>
            );
          })}
        </nav>

        {/* 底部信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground text-center">
            让灵感落在纸上。
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-xl flex items-center px-6 justify-between sticky top-0 z-30">
          <Button variant="ghost" size="icon" aria-label="打开导航" aria-expanded={isSidebarOpen} className="md:hidden h-9 w-9 rounded-lg" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <span className="story-studio-page-title">{navItems.find(item => isActive(item.href))?.label || "创作空间"}</span><div className="flex items-center gap-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                  <UserIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground">创作者</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout} 
                  title="退出登录"
                  className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="rounded-lg">
                <UserIcon className="h-4 w-4 mr-2" />
                登录
              </Button>
            )}
          </div>
        </header>
        
        {/* Page Content */}
        <div className="story-studio-main-content flex-1 p-6 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

