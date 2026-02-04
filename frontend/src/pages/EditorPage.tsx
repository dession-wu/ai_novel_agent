import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import MarkdownEditor, { MarkdownEditorRef } from '../components/MarkdownEditor';
import Toolbar from '../components/Toolbar';
import StatusBar from '../components/StatusBar';
import Sidebar from '../components/Sidebar';
import WorldBible from '../components/WorldBible';
import ConsistencyPanel from '../components/ConsistencyPanel';
import { novelApi, chapterApi, Novel, Chapter } from '../api/api';
import { Button } from '../components/ui/button';

const EditorPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [chapterId, setChapterId] = useState<number>(
    parseInt(searchParams.get('chapterId') || '1')
  );
  const [novels, setNovels] = useState<Novel[]>([]);
  const [selectedNovelId, setSelectedNovelId] = useState<number | undefined>();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [writeTime, setWriteTime] = useState<number>(0);
  const [isWorldBibleOpen, setIsWorldBibleOpen] = useState(false);
  const [isConsistencyPanelOpen, setIsConsistencyPanelOpen] = useState(false);
  const editorRef = useRef<MarkdownEditorRef>(null);

  // 获取所有小说列表
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const data = await novelApi.getNovels();
        setNovels(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('获取小说列表失败:', err);
        // 如果是授权错误，使用模拟数据
        if (err.message?.includes('Not authorized') || err.message?.includes('Authentication failed')) {
          console.log('使用模拟小说数据');
          setNovels([{
            id: 1,
            title: '示例小说',
            genre: '玄幻',
            style: '轻松',
            synopsis: '这是一个示例小说',
            status: 'ongoing',
            chapters: 10,
            updated_at: new Date().toISOString()
          }]);
        }
      }
    };
    fetchNovels();
  }, []);

  // 当 chapterId 改变时更新 URL
  useEffect(() => {
    setSearchParams({ chapterId: chapterId.toString() });
  }, [chapterId, setSearchParams]);

  // 获取章节详情
  useEffect(() => {
    const fetchChapterDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const chapter = await chapterApi.getChapter(chapterId);
        setContent(chapter.content || '');
        setSelectedNovelId(chapter.novel_id);
        setSaveStatus('saved');
      } catch (err: any) {
        console.error('加载章节失败:', err);
        // 如果是授权错误，使用模拟数据而不是显示错误
        if (err.message?.includes('Not authorized') || err.message?.includes('Authentication failed')) {
          console.log('使用模拟章节数据');
          setContent('# 第一章 开始\n\n这是示例章节内容。您可以开始写作了...\n\n## 小标题\n\n这里是正文内容。');
          setSelectedNovelId(1);
          setSaveStatus('saved');
        } else {
          setError('加载章节失败: ' + (err.message || '未知错误'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterDetails();
  }, [chapterId]);

  // 计算字数
  const countWords = (text: string) => {
    if (!text) return 0;
    // 匹配中文、英文单词和数字
    const wordMatches = text.match(/[\u4e00-\u9fa5]|[a-zA-Z0-9]+/g);
    return wordMatches ? wordMatches.length : 0;
  };

  // 计算字符数
  const countChars = (text: string) => {
    return text ? text.length : 0;
  };

  // 写作时间计时器
  useEffect(() => {
    const timer = setInterval(() => {
      setWriteTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 保存章节内容
  const saveChapterContent = async (newContent: string) => {
    setSaveStatus('saving');
    try {
      await chapterApi.updateChapter(chapterId, { content: newContent });
      setContent(newContent);
      setSaveStatus('saved');
      return true;
    } catch (err) {
      console.error('保存章节失败:', err);
      setSaveStatus('unsaved');
      return false;
    }
  };

  // 工具栏动作处理
  const handleToolbarAction = (actionId: string) => {
    console.log('Toolbar action:', actionId);
    
    // AI 动作处理
    if (actionId.startsWith('ai-')) {
      const aiType = actionId.replace('ai-', '') as 'continue' | 'generate' | 'improve' | 'expand';
      editorRef.current?.handleAIAction(aiType);
      return;
    }

    // 格式化动作处理
    const formattingActions = ['bold', 'italic', 'underline', 'strikethrough', 'h1', 'h2', 'h3', 'bullet', 'number', 'quote', 'code', 'link'];
    if (formattingActions.includes(actionId)) {
      editorRef.current?.insertFormatting(actionId);
      return;
    }

    // 其他编辑动作处理
    switch (actionId) {
      case 'save':
        if (editorRef.current) {
          saveChapterContent(editorRef.current.getContent());
        }
        break;
      case 'world':
        setIsWorldBibleOpen(!isWorldBibleOpen);
        setIsConsistencyPanelOpen(false);
        break;
      case 'consistency':
        setIsConsistencyPanelOpen(!isConsistencyPanelOpen);
        setIsWorldBibleOpen(false);
        break;
      case 'clear':
        if (window.confirm('确定要清空当前内容吗？此操作不可撤销。')) {
          editorRef.current?.setContent('');
        }
        break;
      case 'preview':
        // MarkdownEditor 内部处理预览，或者这里可以切换全局预览模式
        break;
    }
  };

  const handleChapterSelect = (id: number) => {
    setChapterId(id);
  };

  const handleNovelSelect = (id: number) => {
    setSelectedNovelId(id);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-lg">
        <div className="animate-pulse">正在加载内容...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-lg text-destructive">
        <div className="text-center">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* 侧边栏 */}
      <Sidebar 
        novels={novels}
        selectedNovelId={selectedNovelId}
        selectedChapterId={chapterId}
        onNovelSelect={handleNovelSelect}
        onChapterSelect={handleChapterSelect}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* 工具栏 */}
        <Toolbar onAction={handleToolbarAction} />
        
        {/* 编辑器与设定集容器 */}
        <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto bg-card/50">
              <MarkdownEditor
                ref={editorRef}
                initialContent={content}
                onSave={saveChapterContent}
                chapterId={chapterId}
                novelId={selectedNovelId}
              />
            </div>
            
            {/* 设定集侧边栏 */}
            {isWorldBibleOpen && selectedNovelId && (
              <WorldBible novelId={selectedNovelId} />
            )}

            {/* 一致性检查侧边栏 */}
            {isConsistencyPanelOpen && selectedNovelId && (
              <ConsistencyPanel novelId={selectedNovelId} chapterId={chapterId} />
            )}
        </div>
        
        {/* 状态栏 */}
        <StatusBar 
          status={{
            saveStatus,
            wordCount: countWords(content),
            charCount: countChars(content),
            writeTime
          }} 
        />
      </div>
    </div>
  );
};

export default EditorPage;
