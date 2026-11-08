import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, PenLine } from 'lucide-react'
import './LoginPage.css'

export default function StoryAuth({ children, register = false }: { children: ReactNode; register?: boolean }) {
  return <div className="story-auth"><header><Link to="/" className="story-auth-brand"><img src="/brand/icon.svg?v=20261103-brand1" width="34" height="34" alt="" /><strong>故事工坊</strong></Link><Link to="/" className="story-auth-back"><ArrowLeft size={14} /> 返回首页</Link></header><main><aside className="story-auth-intro"><p className="story-auth-kicker"><PenLine size={15} /> 给故事留一点时间</p><h1>{register ? '每个故事，都有第一页。' : '欢迎回来，继续下一章。'}</h1><p>{register ? '从一个名字、一段对白，或一个迟迟放不下的念头开始。' : '让灵感接着生长，把还没讲完的故事慢慢写好。'}</p><div className="story-auth-excerpt"><BookOpen size={22} strokeWidth={1.4} /><p>“她把信放进口袋，<br />转身走向街角那家刚刚开门的书店。”</p><span>《雨季来信》 · 示例片段</span></div></aside><section className="story-auth-form-panel">{children}</section></main><footer>故事工坊 · 让灵感落在纸上。</footer></div>
}
