import React, { useState, useEffect, useRef, useCallback, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useNotification } from './NotificationContext';
import { novelApi } from '../api/api';
import { aiConfigService } from '../services/aiConfigService';
import { AIServiceFactory } from '../services/aiServiceFactory';

// 增强的Markdown渲染函数
const enhancedMarkdownRender = (text) => {
  let html = text;
  
  // 1. 处理代码块
  html = html.replace(/```([\s\S]*?)```/g, (_match, code) => {
    // 简单的代码高亮模拟
    return `<pre><code class="code-block">${code.trim()}</code></pre>`;
  });
  
  // 2. 处理表格
  // 匹配表格头
  html = html.replace(/^(\|.*\|)\n(\|---*\|.*\|)((\n\|.*\|)+)/gm, (_match, header, _separator, rows) => {
    let tableHtml = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; margin: 10px 0;">';
    
    // 处理表头
    tableHtml += '<thead><tr>';
    const headers = (header).split('|').filter(h => h.trim() !== '');
    headers.forEach(h => {
      tableHtml += `<th>${h.trim()}</th>`;
    });
    tableHtml += '</tr></thead>';
    
    // 处理表体
    tableHtml += '<tbody>';
    const rowsArr = (rows).split('\n').filter(r => r.trim() !== '');
    rowsArr.forEach(row => {
      tableHtml += '<tr>';
      const cells = row.split('|').filter(c => c.trim() !== '');
      cells.forEach(cell => {
        tableHtml += `<td>${cell.trim()}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';
    
    return tableHtml;
  });
  
  // 3. 处理无序列表
  html = html.replace(/^[\s]*[-*+]\s+(.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)(?!<li>)/gs, '<ul>$1</ul>');
  
  // 4. 处理有序列表
  html = html.replace(/^[\s]*\d+\.\s+(.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)(?!<li>)/gs, '<ol>$1</ol>');
  
  // 5. 处理粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 6. 处理斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 7. 处理标题
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // 8. 处理换行
  html = html.replace(/\n/g, '<br />');
  
  return { __html: html };
};

const MarkdownEditor = forwardRef(({ initialContent = '', onSave, chapterId, novelId }, ref) => {
  const { addNotification } = useNotification();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [previewMode, setPreviewMode] = useState('split'); // split, edit, preview
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConfig, setAiConfig] = useState(null);
  const [aiConnectionStatus, setAiConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected
  const textareaRef = useRef(null);

  // 加载AI配置
  useEffect(() => {
    const loadAIConfig = async () => {
      const config = await aiConfigService.getConfig();
      if (config) {
        setAiConfig(config);
        setAiConnectionStatus('connected');
      }
    };
    loadAIConfig();
  }, []);

  // 监听AI配置变化
  useEffect(() => {
    const handleConfigChange = async () => {
      const config = await aiConfigService.getConfig();
      if (config) {
        setAiConfig(config);
        setAiConnectionStatus('connected');
      } else {
        setAiConfig(null);
        setAiConnectionStatus('disconnected');
      }
    };

    // 添加事件监听器
    window.addEventListener('ai-config-changed', handleConfigChange);
    return () => {
      window.removeEventListener('ai-config-changed', handleConfigChange);
    };
  }, []);

  // 格式化工具函数
  const insertFormatting = useCallback((format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || '粗体文本'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || '斜体文本'}*`;
        break;
      case 'heading1':
      case 'h1':
        formattedText = `# ${selectedText || '一级标题'}`;
        break;
      case 'heading2':
      case 'h2':
        formattedText = `## ${selectedText || '二级标题'}`;
        break;
      case 'heading3':
      case 'h3':
        formattedText = `### ${selectedText || '三级标题'}`;
        break;
      case 'list':
      case 'bullet':
        formattedText = `- ${selectedText || '列表项'}`;
        break;
      case 'orderedList':
      case 'number':
        formattedText = `1. ${selectedText || '有序列表项'}`;
        break;
      case 'code':
        formattedText = `\`${selectedText || '代码'}\``;
        break;
      case 'codeBlock':
        formattedText = `\`\`\`\n${selectedText || '代码块内容'}\n\`\`\``;
        break;
      case 'quote':
        formattedText = `> ${selectedText || '引用内容'}`;
        break;
      case 'table':
        formattedText = `| 列1 | 列2 |\n|-----|-----|\n| 内容1 | 内容2 |`;
        break;
      case 'link':
        formattedText = `[${selectedText || '链接文字'}](url)`;
        break;
      default:
        return;
    }

    const newContent = textarea.value.substring(0, startPos) + formattedText + textarea.value.substring(endPos);
    setContent(newContent);

    // 设置光标位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = startPos + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, []);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    insertFormatting,
    handleAIAction: async (type) => {
      switch (type) {
        case 'continue':
          await handleAIContinueStream();
          break;
        case 'generate':
          await handleAIGenerateStream();
          break;
        case 'improve':
          await handleAIImproveStream();
          break;
        case 'expand':
          await handleAIExpandStream();
          break;
      }
    },
    save: handleSave,
    getContent: () => content,
    setContent: (newContent) => setContent(newContent)
  }));

  // 同步外部传入的内容
  useEffect(() => {
    if (initialContent !== undefined) {
      setContent(initialContent);
    }
  }, [initialContent]);

  // 记忆化渲染的Markdown内容
  const renderedContent = useMemo(() => {
    return enhancedMarkdownRender(content);
  }, [content]);

  // 计算字数统计
  const calculateStats = useCallback((text) => {
    // 字数统计（中文按单个字计算，英文按单词计算）
    const charCount = text.length;
    // 匹配中文、英文单词和数字
    const wordMatches = text.match(/[\u4e00-\u9fa5]|[a-zA-Z0-9]+/g);
    const wordCount = wordMatches ? wordMatches.length : 0;
    return { wordCount, charCount };
  }, []);

  // 更新字数统计
  useEffect(() => {
    const stats = calculateStats(content);
    setWordCount(stats.wordCount);
    setCharCount(stats.charCount);
  }, [content, calculateStats]);

  // 自动保存功能
  useEffect(() => {
    if (!content.trim()) return;

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      try {
        if (onSave) {
          await onSave(content);
          setLastSaved(new Date());
          // 显示自动保存成功通知
          addNotification({
            type: 'success',
            message: '内容已自动保存',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('自动保存失败:', error);
        // 显示自动保存失败通知
        addNotification({
          type: 'error',
          message: '自动保存失败，请手动保存',
          duration: 4000
        });
      } finally {
        setIsSaving(false);
      }
    }, 30000); // 30秒自动保存

    return () => clearTimeout(saveTimeout);
  }, [content, onSave, addNotification]);

  // 处理内容变化
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // 手动保存
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(content);
        setLastSaved(new Date());
        // 显示手动保存成功通知
        addNotification({
          type: 'success',
          message: '章节内容已成功保存',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('手动保存失败:', error);
      // 显示手动保存失败通知
      addNotification({
        type: 'error',
        message: '保存失败，请稍后重试',
        duration: 4000
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 优化的流式插入逻辑
  const insertStreamChunk = useCallback((chunk, startPos, offset) => {
    setContent(prev => {
        const insertPos = startPos + offset;
        return prev.slice(0, insertPos) + chunk + prev.slice(insertPos);
    });
  }, []);

  // AI 生成章节内容
  const handleAIGenerateStream = async () => {
    if (isGenerating || !novelId) return;
    
    // 检查AI配置
    if (!aiConfig) {
      addNotification({
        type: 'error',
        message: 'AI服务未配置，请先在设置页面配置AI服务',
        duration: 5000
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // 使用新的AI服务工厂
      const aiService = AIServiceFactory.createService(aiConfig);
      const prompt = `请为小说《${novelId}》的第${chapterId}章生成内容，风格要连贯，情节要吸引人。`;
      
      // 使用流式生成
      const textarea = textareaRef.current;
      const startPos = textarea ? textarea.selectionStart : content.length;
      let generatedLength = 0;
      
      // 如果当前有内容，在末尾换行
      if (content.length > 0 && !content.endsWith('\n')) {
        setContent(prev => prev + '\n\n');
        generatedLength += 2;
      }
      
      await aiService.generateTextStream(prompt, {
        maxTokens: 1000,
        temperature: 0.7
      }, (chunk) => {
        insertStreamChunk(chunk, startPos, generatedLength);
        generatedLength += chunk.length;
      });
      
      addNotification({
        type: 'success',
        message: 'AI生成完成',
        duration: 2000
      });
    } catch (error) {
      console.error('AI生成失败:', error);
      addNotification({
        type: 'error',
        message: `AI生成失败: ${error.message}，请检查AI服务配置`,
        duration: 5000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // AI 润色选中内容
  const handleAIImproveStream = async () => {
    const textarea = textareaRef.current;
    if (!textarea || isGenerating || !novelId) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = content.substring(startPos, endPos);

    if (!selectedText) {
        addNotification({ type: 'info', message: '请先选择需要润色的文本' });
        return;
    }

    // 检查AI配置
    if (!aiConfig) {
      addNotification({
        type: 'error',
        message: 'AI服务未配置，请先在设置页面配置AI服务',
        duration: 5000
      });
      return;
    }

    setIsGenerating(true);
    try {
        // 使用新的AI服务工厂
        const aiService = AIServiceFactory.createService(aiConfig);
        const prompt = `请润色以下文本，保持原意不变，提高语言质量和流畅度：\n\n${selectedText}`;
        
        // 先清空选中的内容，准备插入新的
        const contentBefore = content.substring(0, startPos);
        const contentAfter = content.substring(endPos);
        setContent(contentBefore + contentAfter);

        let generatedLength = 0;

        await aiService.generateTextStream(prompt, {
          maxTokens: 1000,
          temperature: 0.7
        }, (chunk) => {
          insertStreamChunk(chunk, startPos, generatedLength);
          generatedLength += chunk.length;
        });
        
        addNotification({
          type: 'success',
          message: 'AI润色完成',
          duration: 2000
        });
    } catch (error) {
        console.error('AI润色失败:', error);
        addNotification({
          type: 'error',
          message: `AI润色失败: ${error.message}，请检查AI服务配置`,
          duration: 5000
        });
    } finally {
        setIsGenerating(false);
    }
  };

  // AI 扩展选中内容
  const handleAIExpandStream = async () => {
    const textarea = textareaRef.current;
    if (!textarea || isGenerating || !novelId) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = content.substring(startPos, endPos);

    if (!selectedText) {
        addNotification({ type: 'info', message: '请先选择需要扩展的文本' });
        return;
    }

    // 检查AI配置
    if (!aiConfig) {
      addNotification({
        type: 'error',
        message: 'AI服务未配置，请先在设置页面配置AI服务',
        duration: 5000
      });
      return;
    }

    setIsGenerating(true);
    try {
        // 使用新的AI服务工厂
        const aiService = AIServiceFactory.createService(aiConfig);
        const prompt = `请扩展以下文本，保持原意不变，丰富细节和内容，使其更加生动和详细：\n\n${selectedText}`;
        
        // 先清空选中的内容，准备插入新的
        const contentBefore = content.substring(0, startPos);
        const contentAfter = content.substring(endPos);
        setContent(contentBefore + contentAfter);

        let generatedLength = 0;

        await aiService.generateTextStream(prompt, {
          maxTokens: 1500,
          temperature: 0.7
        }, (chunk) => {
          insertStreamChunk(chunk, startPos, generatedLength);
          generatedLength += chunk.length;
        });
        
        addNotification({
          type: 'success',
          message: 'AI扩展完成',
          duration: 2000
        });
    } catch (error) {
        console.error('AI扩展失败:', error);
        addNotification({
          type: 'error',
          message: `AI扩展失败: ${error.message}，请检查AI服务配置`,
          duration: 5000
        });
    } finally {
        setIsGenerating(false);
    }
  };

  // 重写 AI 续写逻辑以修复光标问题
  const handleAIContinueStream = async () => {
    console.log('Triggering AI Continue...', { novelId, isGenerating });
    
    if (isGenerating) return;

    if (!novelId) {
        console.error('Missing novelId');
        addNotification({
            type: 'error',
            message: '无法获取小说信息，请尝试刷新页面',
            duration: 3000
        });
        return;
    }

    // 检查AI配置
    if (!aiConfig) {
      addNotification({
        type: 'error',
        message: 'AI服务未配置，请先在设置页面配置AI服务',
        duration: 5000
      });
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    setIsGenerating(true);
    const startPos = textarea.selectionStart;
    let generatedLength = 0;
    
    // 截取上下文
    const textBeforeCursor = textarea.value.substring(0, startPos);
    const textAfterCursor = textarea.value.substring(startPos);
    const precedingText = textBeforeCursor.slice(-2000);
    const followingText = textAfterCursor.slice(0, 500);

    try {
        // 使用新的AI服务工厂
        const aiService = AIServiceFactory.createService(aiConfig);
        const prompt = `请续写以下文本，保持风格一致，情节连贯：\n\n${precedingText}[续写位置]${followingText}\n\n请从[续写位置]开始续写，不要重复已有内容。`;
        
        console.log('Using AI service:', aiConfig.serviceType);
        
        await aiService.generateTextStream(prompt, {
            maxTokens: 1000,
            temperature: 0.7
        }, (chunk) => {
            insertStreamChunk(chunk, startPos, generatedLength);
            generatedLength += chunk.length;
        });
        
        addNotification({
            type: 'success',
            message: 'AI续写完成',
            duration: 2000
        });
    } catch (error) {
        console.error('AI Stream Error:', error);
        addNotification({
            type: 'error',
            message: `AI续写失败: ${error.message || '未知错误'}，请检查AI服务配置`,
            duration: 5000
        });
    } finally {
        setIsGenerating(false);
        // 恢复焦点并移动光标到生成内容末尾
        if (textareaRef.current) {
            textareaRef.current.focus();
            const newPos = startPos + generatedLength;
            textareaRef.current.setSelectionRange(newPos, newPos);
        }
    }
  };

  // 切换预览模式
  const togglePreviewMode = (mode) => {
    setPreviewMode(mode);
  };

  // 处理键盘事件（快捷键）
  const handleKeyDown = (e) => {
    // Ctrl+S: 保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
    }
    // Ctrl+J: AI续写
    if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        handleAIContinueStream();
    }
    // Ctrl+G: AI生成
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        handleAIGenerateStream();
    }
    // Ctrl+I: AI润色
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        handleAIImproveStream();
    }
    // Ctrl+E: AI扩展
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleAIExpandStream();
    }
  };

  return (
    <div className="markdown-editor w-full h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* 工具栏 */}
      <div className="editor-toolbar bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex flex-wrap gap-2 items-center" role="toolbar" aria-label="Markdown格式化工具栏" aria-orientation="horizontal">
        {/* 格式化工具 */}
        <div className="format-tools flex gap-1" role="group" aria-label="文本格式化选项">
            {/* AI功能按钮组 */}
            <div className="ai-tools flex gap-1" role="group" aria-label="AI辅助功能">
                {/* AI生成按钮 */}
                <button
                    onClick={handleAIGenerateStream}
                    disabled={isGenerating}
                    className={`p-2 rounded transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none flex items-center gap-1 ${isGenerating ? 'bg-purple-100 text-purple-400 cursor-not-allowed' : (!novelId ? 'opacity-50 cursor-not-allowed hover:bg-transparent text-gray-400' : 'hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-300')}`}
                    title={!novelId ? "小说信息加载中..." : "AI 生成"}
                    aria-label="AI智能生成章节内容"
                >
                    {isGenerating ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            <span>生成中...</span>
                        </>
                    ) : (
                        <>
                            <span>🤖</span>
                            <span>AI生成</span>
                        </>
                    )}
                </button>
                
                {/* AI续写按钮 */}
                <button
                    onClick={handleAIContinueStream}
                    disabled={isGenerating}
                    className={`p-2 rounded transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none flex items-center gap-1 ${isGenerating ? 'bg-purple-100 text-purple-400 cursor-not-allowed' : (!novelId ? 'opacity-50 cursor-not-allowed hover:bg-transparent text-gray-400' : 'hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-300')}`}
                    title={!novelId ? "小说信息加载中..." : "AI 续写 (Ctrl+J)"}
                    aria-label="AI智能续写"
                >
                    {isGenerating ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            <span>续写中...</span>
                        </>
                    ) : (
                        <>
                            <span>✨</span>
                            <span>AI续写</span>
                        </>
                    )}
                </button>
                
                {/* AI润色按钮 */}
                <button
                    onClick={handleAIImproveStream}
                    disabled={isGenerating}
                    className={`p-2 rounded transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none flex items-center gap-1 ${isGenerating ? 'bg-purple-100 text-purple-400 cursor-not-allowed' : (!novelId ? 'opacity-50 cursor-not-allowed hover:bg-transparent text-gray-400' : 'hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-300')}`}
                    title={!novelId ? "小说信息加载中..." : "AI 润色"}
                    aria-label="AI智能润色选中内容"
                >
                    {isGenerating ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            <span>润色中...</span>
                        </>
                    ) : (
                        <>
                            <span>✏️</span>
                            <span>AI润色</span>
                        </>
                    )}
                </button>
                
                {/* AI扩展按钮 */}
                <button
                    onClick={handleAIExpandStream}
                    disabled={isGenerating}
                    className={`p-2 rounded transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none flex items-center gap-1 ${isGenerating ? 'bg-purple-100 text-purple-400 cursor-not-allowed' : (!novelId ? 'opacity-50 cursor-not-allowed hover:bg-transparent text-gray-400' : 'hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-300')}`}
                    title={!novelId ? "小说信息加载中..." : "AI 扩展"}
                    aria-label="AI智能扩展选中内容"
                >
                    {isGenerating ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            <span>扩展中...</span>
                        </>
                    ) : (
                        <>
                            <span>📝</span>
                            <span>AI扩展</span>
                        </>
                    )}
                </button>
            </div>
            <div className="h-5 border-l border-gray-300 dark:border-gray-600 mx-1" aria-hidden="true"></div>
            
          <button
            onClick={() => insertFormatting('bold')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('bold');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="粗体 (Ctrl+B)"
            aria-label="添加粗体格式"
            tabIndex={0}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => insertFormatting('italic')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('italic');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="斜体 (Ctrl+I)"
            aria-label="添加斜体格式"
            tabIndex={0}
          >
            <em>I</em>
          </button>
          <div className="h-5 border-l border-gray-300 dark:border-gray-600 mx-1" aria-hidden="true"></div>
          <button
            onClick={() => insertFormatting('heading1')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('heading1');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="一级标题"
            aria-label="添加一级标题"
            tabIndex={0}
          >
            H1
          </button>
          <button
            onClick={() => insertFormatting('heading2')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('heading2');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="二级标题"
            aria-label="添加二级标题"
            tabIndex={0}
          >
            H2
          </button>
          <button
            onClick={() => insertFormatting('heading3')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('heading3');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="三级标题"
            aria-label="添加三级标题"
            tabIndex={0}
          >
            H3
          </button>
          <div className="h-5 border-l border-gray-300 dark:border-gray-600 mx-1" aria-hidden="true"></div>
          <button
            onClick={() => insertFormatting('list')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('list');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="无序列表"
            aria-label="添加无序列表"
            tabIndex={0}
          >
            • 列表
          </button>
          <button
            onClick={() => insertFormatting('orderedList')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('orderedList');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="有序列表"
            aria-label="添加有序列表"
            tabIndex={0}
          >
            1. 列表
          </button>
          <div className="h-5 border-l border-gray-300 dark:border-gray-600 mx-1" aria-hidden="true"></div>
          <button
            onClick={() => insertFormatting('code')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('code');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="行内代码"
            aria-label="添加行内代码"
            tabIndex={0}
          >
            &lt;/&gt;
          </button>
          <button
            onClick={() => insertFormatting('codeBlock')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('codeBlock');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="代码块"
            aria-label="添加代码块"
            tabIndex={0}
          >
            {} {}
          </button>
          <button
            onClick={() => insertFormatting('table')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                insertFormatting('table');
              }
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            title="表格"
            aria-label="添加表格"
            tabIndex={0}
          >
            表格
          </button>
        </div>
      </div>
      
      {/* 模式切换栏 */}
      <div className="editor-header bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 p-2 flex justify-between items-center">
        <div className="mode-buttons flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600" role="group" aria-label="编辑器模式切换">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary focus:outline-none ${previewMode === 'edit' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
            onClick={() => togglePreviewMode('edit')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePreviewMode('edit');
              }
            }}
            aria-pressed={previewMode === 'edit'}
            tabIndex={0}
          >
            编辑
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary focus:outline-none ${previewMode === 'split' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
            onClick={() => togglePreviewMode('split')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePreviewMode('split');
              }
            }}
            aria-pressed={previewMode === 'split'}
            tabIndex={0}
          >
            分屏
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary focus:outline-none ${previewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
            onClick={() => togglePreviewMode('preview')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePreviewMode('preview');
              }
            }}
            aria-pressed={previewMode === 'preview'}
            tabIndex={0}
          >
            预览
          </button>
        </div>
        <div className="save-info flex items-center gap-4">
          <div className="text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
            字数: {wordCount} | 字符数: {charCount}
          </div>
          <button 
            onClick={handleSave} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!isSaving) {
                  handleSave();
                }
              }
            }}
            disabled={isSaving}
            className={`px-4 py-2 rounded transition-all font-medium text-sm focus:ring-2 focus:ring-primary focus:outline-none ${isSaving ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'}`}
            aria-label={isSaving ? '保存中...' : '保存内容'}
            aria-disabled={isSaving}
            tabIndex={0}
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
          {lastSaved && (
            <span className="text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
              上次保存: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      {/* 编辑区域 */}
      <div className={`editor-body flex flex-1 overflow-hidden transition-all duration-300 ease-in-out`} role="group" aria-label="编辑和预览区域">
        {(previewMode === 'edit' || previewMode === 'split') && (
          <div className={`edit-panel flex-1 overflow-hidden ${previewMode === 'split' ? 'border-r border-gray-200 dark:border-gray-700' : ''}`}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="开始编写你的小说章节...\n\n支持 Markdown 语法，例如：\n# 标题\n**粗体** *斜体*\n- 列表项\n1. 有序列表项\n\n按 Ctrl+J 使用 AI 续写..."
              className="editor-textarea w-full h-full p-5 border-none resize-none font-sans text-base dark:text-gray-200 dark:bg-gray-900 bg-white focus:ring-2 focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 line-height-relaxed"
              aria-label="Markdown编辑器"
              role="textbox"
              spellCheck={false}
              aria-multiline="true"
              aria-describedby="editor-placeholder"
              tabIndex={0}
            />
            <div id="editor-placeholder" className="sr-only">
              开始编写你的小说章节... 支持 Markdown 语法，例如：# 标题，**粗体**，*斜体*，- 列表项，1. 有序列表项
            </div>
          </div>
        )}
        
        {(previewMode === 'preview' || previewMode === 'split') && (
          <div 
            className={`preview-panel flex-1 overflow-y-auto ${previewMode === 'split' ? '' : ''}`}
            aria-live="polite"
          >
            <div 
              className="preview-content p-5 dark:text-gray-200 dark:bg-gray-900 bg-white min-h-full"
              dangerouslySetInnerHTML={renderedContent}
              role="region"
              aria-label="Markdown预览"
              tabIndex={0}
              aria-describedby="preview-description"
            />
            <div id="preview-description" className="sr-only">
              Markdown预览区域，实时显示编辑内容的渲染效果
            </div>
          </div>
        )}
      </div>
      
      {/* 底部状态栏 */}
      <div className="editor-footer bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <div className="status-info">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${previewMode === 'edit' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : previewMode === 'split' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}>
            {previewMode === 'edit' ? '编辑模式' : previewMode === 'split' ? '分屏模式' : '预览模式'}
          </span>
        </div>
        <div className="shortcuts-info flex gap-4">
          <span>快捷键: Ctrl+S 保存</span>
          <span>Ctrl+J 续写 | Ctrl+G 生成</span>
          <span>Ctrl+I 润色 | Ctrl+E 扩展</span>
        </div>
      </div>

      <style jsx global>{`
        /* 编辑器全局样式 */
        .markdown-editor {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        /* 编辑区域样式 */
        .editor-textarea {
          font-size: 16px;
          line-height: 1.7;
          tab-size: 2;
        }

        /* 预览区域样式 */
        .preview-content {
          font-size: 16px;
          line-height: 1.7;
          color: #1f2937;
        }

        .dark .preview-content {
          color: #e5e7eb;
        }

        .preview-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #111827;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .dark .preview-content h1 {
          color: #f3f4f6;
          border-bottom-color: #374151;
        }

        .preview-content h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #111827;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.375rem;
        }

        .dark .preview-content h2 {
          color: #f3f4f6;
          border-bottom-color: #374151;
        }

        .preview-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .dark .preview-content h3 {
          color: #f3f4f6;
        }

        .preview-content p {
          margin-bottom: 1rem;
        }

        .preview-content strong {
          font-weight: 600;
          color: #111827;
        }

        .dark .preview-content strong {
          color: #f3f4f6;
        }

        .preview-content em {
          font-style: italic;
        }

        /* 代码块样式 */
        .preview-content pre {
          background-color: #f9fafb;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
          border: 1px solid #e5e7eb;
        }

        .dark .preview-content pre {
          background-color: #111827;
          border-color: #374151;
        }

        .preview-content code {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          color: #d97706;
        }

        .dark .preview-content code {
          background-color: #374151;
          color: #fbbf24;
        }

        .preview-content .code-block {
          background-color: transparent;
          border: none;
          padding: 0;
          margin: 0;
          color: #374151;
          display: block;
        }

        .dark .preview-content .code-block {
          color: #e5e7eb;
        }

        /* 表格样式 */
        .preview-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .preview-content th {
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #111827;
        }

        .dark .preview-content th {
          background-color: #374151;
          border-color: #4b5563;
          color: #f3f4f6;
        }

        .preview-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          color: #374151;
        }

        .dark .preview-content td {
          border-color: #4b5563;
          color: #e5e7eb;
        }

        .preview-content tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .dark .preview-content tr:nth-child(even) {
          background-color: #1f2937;
        }

        /* 列表样式 */
        .preview-content ul,
        .preview-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .preview-content li {
          margin: 0.5rem 0;
          color: #374151;
        }

        .dark .preview-content li {
          color: #e5e7eb;
        }

        /* 滚动条样式 */
        .editor-body::-webkit-scrollbar,
        .preview-panel::-webkit-scrollbar,
        .edit-panel::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .editor-body::-webkit-scrollbar-track,
        .preview-panel::-webkit-scrollbar-track,
        .edit-panel::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .dark .editor-body::-webkit-scrollbar-track,
        .dark .preview-panel::-webkit-scrollbar-track,
        .dark .edit-panel::-webkit-scrollbar-track {
          background: #1f2937;
        }

        .editor-body::-webkit-scrollbar-thumb,
        .preview-panel::-webkit-scrollbar-thumb,
        .edit-panel::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .dark .editor-body::-webkit-scrollbar-thumb,
        .dark .preview-panel::-webkit-scrollbar-thumb,
        .dark .edit-panel::-webkit-scrollbar-thumb {
          background: #666;
        }

        .editor-body::-webkit-scrollbar-thumb:hover,
        .preview-panel::-webkit-scrollbar-thumb:hover,
        .edit-panel::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .dark .editor-body::-webkit-scrollbar-thumb:hover,
        .dark .preview-panel::-webkit-scrollbar-thumb:hover,
        .dark .edit-panel::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </div>
  );
});

// 使用React.memo优化组件渲染
export default React.memo(MarkdownEditor);