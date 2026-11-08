import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, FileText, Plus, RefreshCw } from 'lucide-react'
import { novelApi, Novel } from '../api/api'

export default function DashboardPage() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const load = async () => {
    setLoading(true); setError('')
    try { const data = await novelApi.getNovels(); setNovels(Array.isArray(data) ? data : []) }
    catch { setError('暂时无法读取作品，请重试。') }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  const recent = [...novels].sort((a, b) => (Date.parse(b.updated_at || '') || 0) - (Date.parse(a.updated_at || '') || 0)).slice(0, 5)
  return <div className="story-dashboard"><div className="story-dashboard-heading"><div><p className="story-dashboard-kicker">你的创作空间</p><h1>今天，想写一个怎样的故事？</h1><p>整理思绪，打开作品，从上次停下的地方继续。</p></div><button className="story-work-primary" onClick={() => navigate('/editor')}><Plus size={16} /> 开始写作</button></div>
    {loading ? <div className="story-dashboard-state" role="status">正在整理你的书架…</div> : error ? <div className="story-dashboard-state" role="alert"><p>{error}</p><button className="story-work-outline" onClick={() => void load()}><RefreshCw size={15} /> 重新加载</button></div> : <>
      <div className="story-stats"><div><span>我的作品</span><strong>{novels.length}<small>部</small></strong></div><div><span>创作中</span><strong>{novels.filter(item => item.status === 'ongoing').length}<small>部</small></strong></div><div><span>已完成</span><strong>{novels.filter(item => item.status === 'completed').length}<small>部</small></strong></div></div>
      <section className="story-bookshelf"><div className="story-bookshelf-heading"><h2>最近的作品</h2><button onClick={() => navigate('/works')}>全部作品 <ArrowRight size={14} /></button></div>{recent.length ? <div>{recent.map((novel, index) => <button className="story-work-row" key={novel.id} onClick={() => navigate(`/editor?novelId=${novel.id}`)}><span className="story-work-cover"><BookOpen size={24} strokeWidth={1.4} /><small>0{index + 1}</small></span><span className="story-work-info"><strong>{novel.title}</strong><small>{novel.genre || '未分类'} · {novel.status === 'completed' ? '已完成' : novel.status === 'paused' ? '暂歇中' : '创作中'}</small></span><span className="story-work-date">{novel.updated_at && !Number.isNaN(Date.parse(novel.updated_at)) ? new Date(novel.updated_at).toLocaleDateString('zh-CN') : '尚未更新'}</span><ArrowRight size={17} /></button>)}</div> : <div className="story-empty-shelf"><BookOpen size={35} strokeWidth={1.3} /><h3>书架空着，故事还在等你。</h3><p>创建第一部作品，写下你一直想写的那一句。</p><button className="story-work-primary" onClick={() => navigate('/editor')}><Plus size={15} /> 写下第一章</button></div>}</section>
      <div className="story-writing-tip"><FileText size={20} strokeWidth={1.4} /><div><strong>先写下来，再慢慢打磨。</strong><p>不必等一个完美的开头。你可以先自由写作，再按需使用 AI 续写与润色。</p></div><button onClick={() => navigate('/settings')}>配置 AI <ArrowRight size={14} /></button></div>
    </>}
  </div>
}
