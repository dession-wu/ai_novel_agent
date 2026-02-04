import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// 主题类型
type Theme = 'light' | 'dark' | 'system';

// 主题上下文类型
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isTransitioning: boolean;
  toggleTheme: () => void;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供器组件
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
}) => {
  // 初始化主题状态
  const [theme, setTheme] = useState<Theme>(() => {
    // 从本地存储获取主题偏好
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    return storedTheme || defaultTheme;
  });

  // 主题切换状态
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 计算当前是否为暗色主题
  const isDark = React.useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // 系统主题检测
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [theme]);

  // 主题切换处理函数
  const handleSetTheme = useCallback((newTheme: Theme) => {
    // 开始主题切换
    setIsTransitioning(true);
    
    // 设置新主题
    setTheme(newTheme);
    
    // 主题切换完成后，重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // 与CSS过渡时间匹配
  }, []);

  // 主题切换方法
  const toggleTheme = useCallback(() => {
    if (theme === 'light') {
      handleSetTheme('dark');
    } else if (theme === 'dark') {
      handleSetTheme('system');
    } else {
      handleSetTheme('light');
    }
  }, [theme, handleSetTheme]);

  // 更新文档根元素的主题类
  useEffect(() => {
    const root = document.documentElement;
    
    // 添加过渡中类
    if (isTransitioning) {
      root.classList.add('theme-transitioning');
    } else {
      root.classList.remove('theme-transitioning');
    }
    
    // 应用主题
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark, isTransitioning]);

  // 保存主题到本地存储
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 监听系统主题变化
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // 触发重渲染
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 初始化时应用主题
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    }
  }, []);

  const value = {
    theme,
    setTheme: handleSetTheme,
    isDark,
    isTransitioning,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义钩子，用于访问主题上下文
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
