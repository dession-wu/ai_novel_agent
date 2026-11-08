import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, FileText, ListTree, PenLine, Plus, Sparkles, Users } from 'lucide-react'
import './LandingPage.css'

const chapters = [
  { title: '潮湿的车站', text: ['那班凌晨四点的列车，比约定的时间晚了七分钟。站台没有人，只有雨水沿着玻璃顶棚，一道一道地落下来。', '她在长椅下发现那只旧信封时，天还没有亮。信封上没有地址，只写着一个她多年未曾听过的名字。'], suggestion: '从信封上的名字展开，写一段她对旧日往事的回忆。' },
  { title: '失物招领处', text: ['失物招领处的灯亮着。玻璃窗后，老人正低头修理一只停走的钟，仿佛这座车站所有迟到的时间，都收在他的抽屉里。', '她把信封放在柜台上。老人抬头看了一眼，没有接，只轻声问：你等的人，来了吗？'], suggestion: '让老人认出信封，用一段对话留下新的线索。' },
  { title: '没有寄出的信', text: ['天亮以后，雨终于停了。她站在邮筒前，把那封信读了一遍，又折回原来的样子。', '有些话迟了很多年，却依然找得到收信的人。她把信放进口袋，转身走向街角那家刚刚开门的书店。'], suggestion: '借书店的场景，引出信件真正的收件人。' },
]

export default function LandingPage() {
  const [active, setActive] = useState(0)
  const chapter = chapters[active]
  return <main className="story-landing" id="top">
    <header className="story-header story-container">
      <Link to="/" className="story-brand" aria-label="故事工坊首页"><img src="/brand/icon.svg?v=20261103-brand1" width="34" height="34" alt="" /><strong>故事工坊</strong></Link>
      <nav aria-label="首页导航"><a href="#method">创作方式</a><a href="#workspace">工作台预览</a></nav>
      <div className="story-header-actions"><Link to="/login">登录</Link><Link to="/register" className="story-button story-button-small">开始写作 <ArrowRight size={15} /></Link></div>
    </header>

    <section className="story-hero story-container" aria-labelledby="story-title">
      <p className="story-eyebrow"><PenLine size={15} /> 为每一个想写故事的人</p>
      <h1 id="story-title">把脑海里的故事，写成下一章。</h1>
      <p className="story-description">从一个灵感到一部作品，在同一个空间整理大纲、管理角色、打磨章节。</p>
      <div className="story-hero-actions"><Link className="story-button" to="/register">开始我的故事 <ArrowRight size={17} /></Link><a className="story-secondary" href="#workspace">先看看工作台 <span aria-hidden="true">↓</span></a></div>
      <p className="story-small-note">自由写作，也可以连接自己的 API Key 使用 AI 辅助。</p>
    </section>

    <section className="story-container story-preview-section" id="workspace" aria-label="写作工作台示例">
      <div className="story-preview-caption"><span><BookOpen size={14} /> 一间属于你的写作室</span><span>交互示例 · 可切换章节</span></div>
      <div className="story-preview">
        <aside className="story-outline"><div className="story-book"><span className="story-book-cover"><BookOpen size={22} /></span><div><strong>雨季来信</strong><small>悬疑 · 长篇小说</small></div></div><div className="story-outline-label"><span>章节目录</span><ListTree size={15} /></div><div className="story-chapters" role="tablist" aria-label="示例章节">{chapters.map((item, index) => <button key={item.title} id={`chapter-tab-${index}`} role="tab" aria-selected={active === index} aria-controls="chapter-sample" tabIndex={active === index ? 0 : -1} onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); const next = (active + (event.key === 'ArrowDown' ? 1 : -1) + chapters.length) % chapters.length; setActive(next); document.getElementById(`chapter-tab-${next}`)?.focus() } }} onClick={() => setActive(index)}><FileText size={14} /><span>第{['一', '二', '三'][index]}章　{item.title}</span></button>)}</div><Link className="story-outline-add" to="/register"><Plus size={14} /> 写下新的章节</Link><p className="story-outline-foot">让灵感有处安放。</p></aside>
        <article className="story-manuscript" id="chapter-sample" role="tabpanel" aria-labelledby={`chapter-tab-${active}`}><div className="story-manuscript-meta"><span>正文 · 草稿</span><span><Check size={12} /> 示例内容</span></div><h2>第{['一', '二', '三'][active]}章　{chapter.title}</h2>{chapter.text.map(text => <p key={text}>{text}</p>)}<div className="story-cursor" aria-hidden="true" /><div className="story-manuscript-foot">故事由你书写，每一章都值得认真对待。</div></article>
        <aside className="story-assist"><div className="story-assist-title"><Sparkles size={16} /><strong>灵感助手</strong><span>AI</span></div><p className="story-assist-lede">卡住的时候，换一个思路。</p><div className="story-suggestion"><span>试试这样续写</span><p>{chapter.suggestion}</p></div><Link to="/register" className="story-assist-link">进入工作台尝试 <ArrowRight size={14} /></Link><div className="story-assist-note"><PenLine size={16} /><p>AI 提供建议，<br />故事的走向由你决定。</p></div></aside>
      </div>
    </section>

    <section className="story-method story-container" id="method"><div className="story-section-head"><p className="story-eyebrow">从构思到落笔</p><h2>少一点分心，多写一点。</h2><p>把创作需要的东西放在一起，让注意力回到故事本身。</p></div><div className="story-features">{[
      [ListTree, '先理清故事的骨架', '集中整理作品设定与章节大纲，让下一步要写什么更清楚。'],
      [Users, '让人物与世界有迹可循', '记录人物、场景和世界观，创作时随时回看重要细节。'],
      [PenLine, '把每一章慢慢写好', '专注正文，按需使用续写、扩写与润色，再用自己的声音定稿。'],
    ].map(([Icon, title, text], index) => { const Mark = Icon as typeof PenLine; return <article key={index}><div className="story-feature-index"><Mark size={22} strokeWidth={1.5} /><span>0{index + 1}</span></div><h3>{String(title)}</h3><p>{String(text)}</p></article> })}</div></section>
    <section className="story-end story-container"><div><p className="story-eyebrow">下一章，从这里开始</p><h2>给你的故事，一个开始。</h2></div><Link to="/register" className="story-button">创建账号，开始写作 <ArrowRight size={17} /></Link></section>
    <footer className="story-footer story-container"><Link className="story-brand" to="/"><img src="/brand/icon.svg?v=20261103-brand1" width="24" height="24" alt="" /><strong>故事工坊</strong></Link><span>让灵感落在纸上。</span><a href="#top">回到顶部 ↑</a></footer>
  </main>
}
