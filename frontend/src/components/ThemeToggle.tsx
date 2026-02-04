import React from 'react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  // 获取当前主题图标
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '💻';
      default:
        return '☀️';
    }
  };

  // 获取当前主题标签
  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '亮色';
      case 'dark':
        return '暗色';
      case 'system':
        return '系统';
      default:
        return '亮色';
    }
  };

  // 获取下一个主题名称
  const getNextThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '暗色';
      case 'dark':
        return '系统';
      case 'system':
        return '亮色';
      default:
        return '亮色';
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`relative ${className} ${isTransitioning ? 'scale-105' : ''}`}
      onClick={toggleTheme}
      aria-label={`切换到${getNextThemeLabel()}主题`}
      title={`当前主题: ${getThemeLabel()}`}
      disabled={isTransitioning}
    >
      <span 
        className={`text-lg transition-all duration-300 ease-in-out ${isTransitioning ? 'animate-spin' : ''}`}
      >
        {getThemeIcon()}
      </span>
      {isTransitioning && (
        <span className="absolute inset-0 flex items-center justify-center opacity-70">
          <span className="text-sm">切换中...</span>
        </span>
      )}
    </Button>
  );
};
