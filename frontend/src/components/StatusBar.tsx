import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  status: {
    saveStatus: 'saved' | 'saving' | 'unsaved';
    wordCount: number;
    charCount: number;
    writeTime: number;
  };
  className?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ status, className }) => {
  // 格式化时间（分钟和秒）
  const formatWriteTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div 
      className={cn(
        'flex items-center justify-between px-4 py-2 bg-card border-t border-border text-sm text-muted-foreground',
        className
      )}
    >
      {/* 左侧：保存状态 */}
      <div className="flex items-center gap-2">
        <span 
          className={`inline-block w-2 h-2 rounded-full ${status.saveStatus === 'saved' ? 'bg-green-500' : 
                      status.saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}
          aria-label={status.saveStatus === 'saved' ? '已保存' : 
                     status.saveStatus === 'saving' ? '保存中' : '未保存'}
        ></span>
        <span>
          {status.saveStatus === 'saved' && '已保存'}
          {status.saveStatus === 'saving' && '保存中...'}
          {status.saveStatus === 'unsaved' && '未保存'}
        </span>
      </div>

      {/* 中间：字数统计 */}
      <div className="flex items-center gap-4">
        <div>
          <span className="font-medium">{status.wordCount}</span>
          <span className="ml-1">字</span>
        </div>
        <div>
          <span className="font-medium">{status.charCount}</span>
          <span className="ml-1">字符</span>
        </div>
        <div>
          <span className="font-medium">{formatWriteTime(status.writeTime)}</span>
          <span className="ml-1">创作时间</span>
        </div>
      </div>

      {/* 右侧：当前时间 */}
      <div>
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default StatusBar;
