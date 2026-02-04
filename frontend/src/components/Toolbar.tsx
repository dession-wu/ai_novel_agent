import React from 'react';
import { Button } from './ui/button';

interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  category: 'formatting' | 'editing' | 'ai';
}

interface ToolbarProps {
  onAction: (actionId: string) => void;
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAction, className }) => {
  // 工具栏动作列表
  const toolbarActions: ToolbarAction[] = [
    // 格式化选项
    { id: 'bold', label: '粗体', icon: '𝐁', category: 'formatting' },
    { id: 'italic', label: '斜体', icon: '𝐼', category: 'formatting' },
    { id: 'underline', label: '下划线', icon: '𝑼', category: 'formatting' },
    { id: 'strikethrough', label: '删除线', icon: '𝑆', category: 'formatting' },
    { id: 'h1', label: '标题1', icon: 'H1', category: 'formatting' },
    { id: 'h2', label: '标题2', icon: 'H2', category: 'formatting' },
    { id: 'h3', label: '标题3', icon: 'H3', category: 'formatting' },
    { id: 'bullet', label: '无序列表', icon: '• 列表', category: 'formatting' },
    { id: 'number', label: '有序列表', icon: '1. 列表', category: 'formatting' },
    { id: 'quote', label: '引用', icon: '" 引用', category: 'formatting' },
    { id: 'code', label: '代码', icon: '</> 代码', category: 'formatting' },
    { id: 'link', label: '链接', icon: '🔗 链接', category: 'formatting' },
    
    // 编辑工具
    { id: 'save', label: '保存', icon: '💾 保存', category: 'editing' },
    { id: 'world', label: '设定集', icon: '🌍 设定', category: 'editing' },
    { id: 'consistency', label: '逻辑检查', icon: '🛡️ 审校', category: 'editing' },
    { id: 'preview', label: '预览', icon: '👁️ 预览', category: 'editing' },
    { id: 'clear', label: '清空', icon: '🗑️ 清空', category: 'editing' },
    
    // AI辅助功能
    { id: 'ai-continue', label: 'AI续写', icon: '✨ AI续写', category: 'ai' },
    { id: 'ai-generate', label: 'AI生成', icon: '🤖 AI生成', category: 'ai' },
    { id: 'ai-improve', label: 'AI润色', icon: '✨ AI润色', category: 'ai' },
    { id: 'ai-expand', label: 'AI扩展', icon: '📝 AI扩展', category: 'ai' },
  ];

  // 按类别分组动作
  const groupedActions = toolbarActions.reduce((groups, action) => {
    if (!groups[action.category]) {
      groups[action.category] = [];
    }
    groups[action.category].push(action);
    return groups;
  }, {} as Record<string, ToolbarAction[]>);

  return (
    <div 
      className={`flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm ${className || ''}`}
      role="toolbar"
      aria-label="编辑工具栏"
      aria-orientation="horizontal"
    >
      {/* 格式化选项组 */}
      <div className="flex items-center gap-1" role="group" aria-label="文本格式化">
        {groupedActions.formatting?.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            className="gap-1 h-9 focus:ring-2 focus:ring-primary focus:outline-none"
            onClick={() => onAction(action.id)}
            aria-label={action.label}
            title={action.label}
            tabIndex={0}
          >
            <span className="text-sm">{action.icon}</span>
          </Button>
        ))}
      </div>

      {/* 分隔线 */}
      <div className="w-px h-8 bg-border mx-1" aria-hidden="true"></div>

      {/* 编辑工具组 */}
      <div className="flex items-center gap-1" role="group" aria-label="编辑工具">
        {groupedActions.editing?.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            className="gap-1 h-9 focus:ring-2 focus:ring-primary focus:outline-none"
            onClick={() => onAction(action.id)}
            aria-label={action.label}
            title={action.label}
            tabIndex={0}
          >
            <span className="text-sm">{action.icon}</span>
          </Button>
        ))}
      </div>

      {/* 分隔线 */}
      <div className="w-px h-8 bg-border mx-1" aria-hidden="true"></div>

      {/* AI辅助功能组 */}
      <div className="flex items-center gap-1" role="group" aria-label="AI辅助功能">
        {groupedActions.ai?.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            className="gap-1 h-9 focus:ring-2 focus:ring-primary focus:outline-none"
            onClick={() => onAction(action.id)}
            aria-label={action.label}
            title={action.label}
            tabIndex={0}
          >
            <span className="text-sm">{action.icon}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
