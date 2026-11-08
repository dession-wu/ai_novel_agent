import { Bold, Italic, List, Save, BookOpen, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import { Button } from './ui/button'

export default function Toolbar({ onAction, className = '' }: { onAction: (action: string) => void; className?: string }) {
  return <div className={`story-editor-toolbar ${className}`} role="toolbar" aria-label="编辑工具栏">
    <div role="group" aria-label="文本格式化" className="story-toolbar-group">
      {[[Bold, 'bold', '粗体'], [Italic, 'italic', '斜体'], [List, 'bullet', '无序列表']].map(([Icon, id, label]) => { const Mark = Icon as typeof Bold; return <Button key={String(id)} variant="ghost" size="icon" aria-label={String(label)} title={String(label)} onClick={() => onAction(String(id))}><Mark size={16} /></Button> })}
      <select aria-label="更多文本格式" value="" onChange={event => { if(event.target.value) onAction(event.target.value) }}><option value="">更多格式</option><option value="h1">一级标题</option><option value="h2">二级标题</option><option value="h3">三级标题</option><option value="underline">下划线</option><option value="strikethrough">删除线</option><option value="number">有序列表</option><option value="quote">引用</option><option value="code">代码</option><option value="link">链接</option></select>
    </div>
    <div role="group" aria-label="编辑工具" className="story-toolbar-group">
      <Button variant="ghost" size="sm" onClick={() => onAction('world')}><BookOpen size={15} />设定</Button>
      <Button variant="ghost" size="sm" onClick={() => onAction('consistency')}><ShieldCheck size={15} />审校</Button>
      <Button variant="ghost" size="icon" aria-label="清空" title="清空当前章节" onClick={() => onAction('clear')}><Trash2 size={15} /></Button>
    </div>
    <div role="group" aria-label="AI辅助与保存" className="story-toolbar-group story-toolbar-actions"><Sparkles size={15} />
      <select aria-label="AI写作辅助" value="" onChange={event => { if(event.target.value) onAction(event.target.value) }}><option value="">AI 辅助</option><option value="ai-continue">续写</option><option value="ai-generate">生成</option><option value="ai-improve">润色</option><option value="ai-expand">扩写</option></select>
      <Button size="sm" onClick={() => onAction('save')}><Save size={15} />保存</Button>
    </div>
  </div>
}
