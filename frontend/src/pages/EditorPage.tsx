import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, FilePlus2, Plus } from 'lucide-react';
import MarkdownEditor, { MarkdownEditorRef } from '../components/MarkdownEditor';
import Toolbar from '../components/Toolbar';
import StatusBar from '../components/StatusBar';
import Sidebar from '../components/Sidebar';
import WorldBible from '../components/WorldBible';
import ConsistencyPanel from '../components/ConsistencyPanel';
import { novelApi, chapterApi, Novel, Chapter } from '../api/api';
import { loadWritingSession } from '../lib/writingSession.mjs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';

const EditorPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [novel, setNovel] = useState<Novel>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapter, setChapter] = useState<Chapter>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  const [draft, setDraft] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [writeTime, setWriteTime] = useState(0);
  const [isWorldBibleOpen, setIsWorldBibleOpen] = useState(false);
  const [isConsistencyPanelOpen, setIsConsistencyPanelOpen] = useState(false);
  const [dialog, setDialog] = useState<'novel' | 'chapter' | null>(null);
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [dialogError, setDialogError] = useState('');
  const [switching, setSwitching] = useState(false);
  const editorRef = useRef<MarkdownEditorRef>(null);
  const savedContent = useRef('');
  const requestKey = searchParams.toString();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError('');
    loadWritingSession({ ...novelApi, getChapter: chapterApi.getChapter }, new URLSearchParams(requestKey))
      .then(result => {
        if (cancelled) return;
        setNovels(result.novels);
        setNovel(result.novel);
        setChapters(result.chapters);
        setChapter(result.chapter);
        setNotice(result.notice);
        savedContent.current = result.chapter?.content || '';
        setDraft(savedContent.current);
        setSaveStatus('saved');
      })
      .catch(err => { if (!cancelled) setError('暂时无法打开写作空间：' + err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [requestKey, reload]);

  useEffect(() => {
    if (!chapter) return;
    const timer = setInterval(() => setWriteTime(value => value + 1), 1000);
    return () => clearInterval(timer);
  }, [chapter?.id]);

  useEffect(() => {
    if (saveStatus === 'saved') return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [saveStatus]);

  const saveChapterContent = useCallback(async (content: string) => {
    if (!chapter) return false;
    setSaveStatus('saving');
    try {
      await chapterApi.updateChapter(chapter.id, { content });
      savedContent.current = content;
      setSaveStatus(editorRef.current?.getContent() === content ? 'saved' : 'unsaved');
      setError('');
      return true;
    } catch (err: any) {
      setSaveStatus('unsaved');
      setError('保存失败，内容仍保留在编辑器中：' + err.message);
      return false;
    }
  }, [chapter?.id]);

  const handleContentChange = useCallback((content: string) => {
    setDraft(content);
    setSaveStatus(content === savedContent.current ? 'saved' : 'unsaved');
  }, []);

  const saveBeforeLeaving = async () => {
    const content = editorRef.current?.getContent();
    return !chapter || content === undefined || content === savedContent.current || await saveChapterContent(content);
  };

  const select = async (params: { novelId: string; chapterId?: string }) => {
    if (switching || creating) return;
    setSwitching(true);
    try { if (await saveBeforeLeaving()) setSearchParams(params); }
    finally { setSwitching(false); }
  };

  const openCreate = (kind: 'novel' | 'chapter') => {
    setTitle(kind === 'chapter' ? `第 ${Math.max(0, ...chapters.map(item => item.order)) + 1} 章` : '');
    setDialogError('');
    setDialog(kind);
  };

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || creating) return;
    setCreating(true);
    setDialogError('');
    try {
      if (!await saveBeforeLeaving()) { setDialogError('当前章节尚未保存，请保存成功后再新建。'); return; }
      if (dialog === 'novel') {
        const created = await novelApi.createNovel({title: title.trim(), genre: '其他', style: '自然', synopsis: ''});
        setSearchParams({novelId: String(created.id)});
      } else if (novel) {
        const created = await novelApi.createChapter(novel.id, {
          title: title.trim(), order: Math.max(0, ...chapters.map(item => item.order)) + 1, outline_snippet: ''
        });
        setSearchParams({novelId: String(novel.id), chapterId: String(created.id)});
      }
      setDialog(null);
    } catch (err: any) { setDialogError('创建失败：' + err.message); }
    finally { setCreating(false); }
  };

  const toolbarAction = (action: string) => {
    if (action.startsWith('ai-')) {
      editorRef.current?.handleAIAction(action.replace('ai-', '') as 'continue' | 'generate' | 'improve' | 'expand');
    } else if (action === 'save') {
      editorRef.current?.save();
    } else if (action === 'world') {
      setIsWorldBibleOpen(value => !value); setIsConsistencyPanelOpen(false);
    } else if (action === 'consistency') {
      setIsConsistencyPanelOpen(value => !value); setIsWorldBibleOpen(false);
    } else if (action === 'clear') {
      if (window.confirm('确定清空当前章节内容吗？保存后将覆盖原内容。')) editorRef.current?.setContent('');
    } else editorRef.current?.insertFormatting(action);
  };

  if (isLoading) return <div className="flex h-full items-center justify-center text-muted-foreground" role="status">正在打开写作空间…</div>;

  return <div className="flex h-full w-full overflow-hidden bg-background">
    <Sidebar novels={novels} chapters={chapters} selectedNovelId={novel?.id} selectedChapterId={chapter?.id}
      disabled={switching || creating}
      onNovelSelect={id => { void select({novelId: String(id)}); }}
      onChapterSelect={id => { if (novel) void select({novelId: String(novel.id), chapterId: String(id)}); }}
      onCreateNovel={() => openCreate('novel')} onCreateChapter={() => openCreate('chapter')} />
    <div className="flex min-w-0 flex-1 flex-col">
      {notice && <div className="border-b px-5 py-3 text-sm text-muted-foreground" role="status">{notice}</div>}
      {error && <div className="border-b border-destructive/30 px-5 py-3 text-sm text-destructive" role="alert">
        {error} {!chapter && <Button variant="outline" className="ml-3" onClick={() => setReload(value => value + 1)}>重试</Button>}
      </div>}
      {chapter ? <>
        <div className="border-b px-5 py-3 text-sm"><span className="text-muted-foreground">{novel?.title} / </span>{chapter.title}</div>
        <Toolbar onAction={toolbarAction} />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="min-w-0 flex-1 overflow-auto bg-card/50">
            <MarkdownEditor key={chapter.id} ref={editorRef} initialContent={chapter.content || ''}
              onSave={saveChapterContent} onContentChange={handleContentChange} chapterId={chapter.id} novelId={novel?.id} />
          </div>
          {isWorldBibleOpen && novel && <WorldBible novelId={novel.id} />}
          {isConsistencyPanelOpen && novel && <ConsistencyPanel novelId={novel.id} chapterId={chapter.id} />}
        </div>
        <StatusBar status={{saveStatus, wordCount: (draft.match(/[\u4e00-\u9fa5]|[a-zA-Z0-9]+/g) || []).length, charCount: draft.length, writeTime}} />
      </> : !error && <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <BookOpen className="mx-auto mb-5 h-9 w-9 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">{novel ? '从第一章开始。' : '先给故事起个名字。'}</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{novel ? `《${novel.title}》还没有章节，新建一章就可以开始写作。` : '创建作品，再添加章节，随时保存你的灵感与正文。'}</p>
          <Button className="mt-6" onClick={() => openCreate(novel ? 'chapter' : 'novel')}>
            {novel ? <FilePlus2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}{novel ? '新建第一章' : '新建作品'}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">手动写作无需 API Key，使用 AI 协作时再到设置中配置。</p>
        </div>
      </div>}
    </div>
    <Dialog open={dialog !== null} onOpenChange={open => { if (!open && !creating) setDialog(null); }}>
      <DialogContent><DialogHeader><DialogTitle>{dialog === 'novel' ? '新建作品' : '新建章节'}</DialogTitle></DialogHeader>
        <form onSubmit={create} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="writing-title">{dialog === 'novel' ? '作品名称' : '章节标题'}</Label>
            <Input id="writing-title" autoFocus required maxLength={100} value={title} onChange={event => setTitle(event.target.value)} disabled={creating} /></div>
          {dialogError && <p role="alert" className="text-sm text-destructive">{dialogError}</p>}
          <DialogFooter><Button type="button" variant="outline" onClick={() => setDialog(null)} disabled={creating}>取消</Button>
            <Button type="submit" disabled={creating || !title.trim()}>{creating ? '正在创建…' : '创建'}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>;
};

export default EditorPage;
