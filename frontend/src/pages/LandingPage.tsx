import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, BookOpen, Cpu, Feather, ListTree, PenLine, Sparkles, Users } from 'lucide-react'
import './LandingPage.css'

const FEATURES = [
  ['01', ListTree, '先搭骨架，再让故事生长', '把散落的灵感整理成章节、冲突和转折，写作过程中始终知道下一步往哪里走。'],
  ['02', PenLine, '保持你的声音', 'AI 接住上下文与文风，提供可以继续修改的段落，而不是替你交出一篇陌生的成稿。'],
  ['03', Users, '人物关系不再失控', '角色、动机和世界观集中管理，让长篇创作的细节有迹可循，伏笔能够被重新拾起。'],
  ['04', Cpu, '把重复劳动交给 AI', '从续写、改写到情节发散，选择合适的协作方式，把时间留给真正重要的判断。'],
] as const
const OUTLINE = ['雨停在凌晨四点', '失物招领处的陌生名字', '一封没有寄出的信']

export default function LandingPage() {
  return <main className="lp-page">
    <div className="lp-paper-noise" aria-hidden="true" /><div className="lp-grid-line lp-grid-line--left" aria-hidden="true" /><div className="lp-grid-line lp-grid-line--right" aria-hidden="true" />
    <header className="lp-header lp-container">
      <Link to="/" className="lp-brand" aria-label="AI Novel Agent 首页"><span className="lp-brand-mark"><Feather size={17} strokeWidth={1.8} /></span><span><strong>AI NOVEL AGENT</strong><small>WRITING STUDIO / 01</small></span></Link>
      <nav className="lp-nav" aria-label="页面导航"><a href="#method"><span>01</span> 写作方法</a><a href="#features"><span>02</span> 协作能力</a><a href="#preview"><span>03</span> 工作台预览</a></nav>
      <div className="lp-header-actions"><Link to="/login" className="lp-login-link">登录</Link><Link to="/register" className="lp-register-link">注册 <ArrowRight size={14} /></Link></div>
    </header>
    <section className="lp-hero lp-container">
      <div className="lp-hero-copy lp-rise"><p className="lp-kicker"><span className="lp-kicker-dot" /> AI 合著者，已就位</p><h1>把一个念头，<br /><em>写成完整世界。</em></h1><p className="lp-hero-description">从一句话灵感到可持续推进的长篇作品，AI 帮你搭好结构，守住人物和文风，把写作重新交还给你。</p><div className="lp-hero-actions"><Link to="/dashboard" className="lp-primary-button">进入创作工作台 <ArrowRight size={18} /></Link><a href="#method" className="lp-text-link">看看怎么写 <ArrowDown size={16} /></a></div><p className="lp-hero-note">适合小说、剧本与长期写作计划 <span>·</span> 随时保存你的每一个版本</p></div>
      <div className="lp-hero-art lp-rise lp-rise--delay-2" aria-label="小说创作工作台预览"><div className="lp-art-label">CURRENT DRAFT <span>● LIVE</span></div><div className="lp-manuscript"><div className="lp-manuscript-top"><span>novel / 001</span><span>保存于 04:18</span></div><div className="lp-manuscript-body"><div className="lp-outline"><div className="lp-outline-title"><BookOpen size={15} /> 雨季来信</div><p className="is-active">序章　潮湿的车站</p>{OUTLINE.map((item, index) => <p key={item}><span>0{index + 2}</span>{item}</p>)}<div className="lp-outline-add">＋ 添加章节</div></div><div className="lp-draft"><p className="lp-draft-eyebrow">CHAPTER 01 / FIRST DRAFT</p><h2>潮湿的车站</h2><p>那班凌晨四点的列车，比约定的时间晚了七分钟。站台没有人，只有雨水沿着玻璃顶棚，一道一道地落下来。</p><p className="lp-draft-muted">她在长椅下发现那只旧信封时，天还没有亮。</p><div className="lp-ai-suggestion"><Sparkles size={15} /><span>AI 正在根据人物关系提供下一段情节</span><ArrowRight size={14} /></div></div></div></div><div className="lp-art-stamp">DRAFT<br /><strong>68%</strong></div></div>
    </section>
    <section className="lp-method lp-container" id="method"><div className="lp-section-heading"><p className="lp-section-index">/ HOW IT WORKS</p><h2>写作不是一次完成，<br /><span>而是一段可持续的对话。</span></h2></div><div className="lp-method-list">{['灵感', '结构', '续写', '成稿'].map((item, index) => <div className="lp-method-step" key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < 3 && <i aria-hidden="true" />}</div>)}</div></section>
    <section className="lp-features lp-container" id="features"><div className="lp-section-heading lp-section-heading--row"><div><p className="lp-section-index">/ THE STUDIO</p><h2>你负责决定故事<br /><span>AI 负责跟上。</span></h2></div><p className="lp-section-aside">一个安静、可掌控的创作空间。没有复杂的设置，只有在需要时出现的协作。</p></div><div className="lp-feature-grid">{FEATURES.map(([number, Icon, title, description]) => <article className="lp-feature" key={number}><div className="lp-feature-top"><span>{number}</span><Icon size={20} strokeWidth={1.6} /></div><h3>{title}</h3><p>{description}</p><span className="lp-feature-arrow"><ArrowRight size={17} /></span></article>)}</div></section>
    <section className="lp-preview lp-container" id="preview"><div className="lp-preview-inner"><div><p className="lp-section-index">/ YOUR NEXT CHAPTER</p><h2>先写第一句。<br /><em>剩下的，我们一起走。</em></h2></div><div className="lp-preview-cta"><p>你的故事不需要一次想清楚。<br />从今天最想写下的那一段开始。</p><Link to="/register" className="lp-primary-button lp-primary-button--dark">开始第一章 <ArrowRight size={18} /></Link></div></div></section>
    <footer className="lp-footer lp-container"><span>AI NOVEL AGENT</span><span>WRITE WITH INTENTION / 2025</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>回到顶部 ↑</a></footer>
  </main>
}
