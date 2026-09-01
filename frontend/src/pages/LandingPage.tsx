import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  ListTree,
  PenLine,
  Users,
  Cpu,
  ArrowRight,
  Feather,
} from 'lucide-react';
import './LandingPage.css';

/* ==========================================================
   LandingPage —— AI 小说创作智能体平台落地页
   结构：顶部导航 → Hero（主副标题+双CTA）→ 核心功能卡片 → 底部 CTA → 页脚
   风格：暖色渐变玻璃拟态（紫 #7C3AED × 橙 #F97316，浅底 #FAF5FF）
   注意：本页为公开页面，不含任何业务逻辑与 API 调用
   ========================================================== */

/* 核心功能卡片数据（纯静态展示内容） */
const FEATURES = [
  {
    icon: ListTree,
    title: '智能大纲生成',
    desc: '输入一句话灵感，AI 自动拆解三幕结构与章节脉络，为你搭建完整故事骨架。',
    accent: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-[#7C3AED]',
  },
  {
    icon: PenLine,
    title: '章节智能续写',
    desc: '基于上下文与既定文风，逐章推进剧情，保持人物语气与叙事节奏的连贯统一。',
    accent: 'from-orange-500/20 to-orange-500/5',
    iconColor: 'text-[#F97316]',
  },
  {
    icon: Users,
    title: '角色与世界观管理',
    desc: '建立角色档案、关系网络与设定集，让每个角色的言行始终忠于你的世界观。',
    accent: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-[#9333EA]',
  },
  {
    icon: Cpu,
    title: '多模型支持',
    desc: '自由切换主流大模型，不同创作阶段选择最合适的"合著者"，效果与成本兼得。',
    accent: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-[#EA580C]',
  },
];

/* Hero 区墨点粒子（位置、大小、延迟均为纯静态装饰参数） */
const INK_DOTS = [
  { left: '12%', top: '62%', size: 10, delay: '0s', duration: '9s' },
  { left: '28%', top: '78%', size: 6, delay: '-2s', duration: '11s' },
  { left: '55%', top: '70%', size: 12, delay: '-4s', duration: '8s' },
  { left: '74%', top: '60%', size: 8, delay: '-1s', duration: '10s' },
  { left: '88%', top: '76%', size: 6, delay: '-5s', duration: '12s' },
  { left: '42%', top: '84%', size: 9, delay: '-3s', duration: '9.5s' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FAF5FF] via-white to-[#FFF7ED] text-foreground">
      {/* ========== 背景装饰：浮动光斑 ========== */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {/* 紫色主光斑 */}
        <div
          className="lp-orb lp-orb-slow w-[520px] h-[520px] -top-40 -left-32"
          style={{ background: 'radial-gradient(circle, #C4B5FD 0%, transparent 70%)' }}
        />
        {/* 橙色辅光斑 */}
        <div
          className="lp-orb lp-orb-fast w-[460px] h-[460px] top-24 -right-40"
          style={{ background: 'radial-gradient(circle, #FDBA74 0%, transparent 70%)' }}
        />
        {/* 底部紫色光晕 */}
        <div
          className="lp-orb lp-orb-slow w-[600px] h-[600px] -bottom-64 left-1/3"
          style={{ background: 'radial-gradient(circle, #DDD6FE 0%, transparent 70%)' }}
        />
      </div>

      {/* ================= 顶部导航 ================= */}
      <header className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#F97316] flex items-center justify-center shadow-lg shadow-purple-500/25">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-[#7C3AED] to-[#F97316] bg-clip-text text-transparent">
              AI 小说创作平台
            </h1>
            <p className="text-xs text-muted-foreground">AI Novel Agent</p>
          </div>
        </div>

        {/* 导航操作 */}
        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-[#7C3AED] hover:text-[#6D28D9] rounded-full hover:bg-[#7C3AED]/5 transition-colors"
          >
            登录
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9D5CFF] shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
          >
            免费开始
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>

      {/* ================= Hero 区 ================= */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 text-center">
        {/* 墨点粒子（随背景缓缓上浮） */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {INK_DOTS.map((dot, i) => (
            <span
              key={i}
              className="lp-ink"
              style={{
                left: dot.left,
                top: dot.top,
                width: dot.size,
                height: dot.size,
                animationDelay: dot.delay,
                animationDuration: dot.duration,
              }}
            />
          ))}
        </div>

        {/* 顶部徽章 */}
        <div className="lp-rise lp-rise-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-[#7C3AED]/15 shadow-soft">
          <Sparkles className="h-4 w-4 text-[#F97316]" />
          <span className="text-sm font-medium text-[#6D28D9]">
            你的 AI 合著者，已就位
          </span>
        </div>

        {/* 主标题 */}
        <h2 className="lp-rise lp-rise-2 mt-8 text-4xl md:text-6xl font-bold tracking-tight leading-tight text-gray-900">
          让灵感落笔成章
          <br className="md:hidden" />
          <span className="relative inline-block md:ml-3">
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#F97316] bg-clip-text text-transparent">
              AI 陪你写完一部小说
            </span>
            {/* 墨滴式下划线装饰 */}
            <span
              aria-hidden
              className="lp-underline absolute left-0 -bottom-2 h-1.5 w-full rounded-full bg-gradient-to-r from-[#7C3AED]/60 to-[#F97316]/60 blur-[1px]"
            />
          </span>
        </h2>

        {/* 副标题 */}
        <p className="lp-rise lp-rise-3 mt-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          从一句话灵感到完整长篇：智能大纲、章节续写、角色管理一站搞定。
          <br className="hidden md:block" />
          多模型自由切换，你负责想象，剩下的交给 AI。
        </p>

        {/* 双 CTA */}
        <div className="lp-rise lp-rise-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* 主 CTA：进入创作工作台（未登录会被路由守卫引导至登录页） */}
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white rounded-full bg-gradient-to-r from-[#7C3AED] to-[#F97316] shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <Feather className="h-5 w-5" />
            进入创作工作台
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          {/* 次 CTA：已有账号直接登录 */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-[#7C3AED] rounded-full bg-white/70 backdrop-blur-xl border border-[#7C3AED]/20 shadow-soft hover:bg-white hover:border-[#7C3AED]/40 hover:-translate-y-0.5 transition-all"
          >
            我已有账号，去登录
          </Link>
        </div>
      </section>

      {/* ================= 核心功能展示 ================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        {/* 区块标题 */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-[#F97316] uppercase">
            Core Features
          </p>
          <h3 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
            为长篇创作打造的完整能力
          </h3>
        </div>

        {/* 功能卡片：桌面端 2×2 栅格，移动端单列 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-3xl p-8 bg-white/60 backdrop-blur-xl border border-white/70 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* 卡片内部柔和渐变底 */}
              <div
                aria-hidden
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.accent} opacity-60 group-hover:opacity-100 transition-opacity`}
              />
              {/* 内容层（保证文字在渐变之上） */}
              <div className="relative">
                {/* 图标 */}
                <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur border border-white flex items-center justify-center shadow-soft">
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                {/* 标题与描述 */}
                <h4 className="mt-5 text-lg font-bold text-gray-900">{feature.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 底部 CTA ================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] px-8 py-14 md:py-16 text-center bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#F97316] shadow-2xl shadow-purple-500/30">
          {/* 玻璃高光层 */}
          <div
            aria-hidden
            className="absolute inset-0 bg-white/10 backdrop-blur-2xl"
          />
          {/* 内部柔光装饰 */}
          <div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none"
          />
          <div className="relative">
            <h3 className="text-2xl md:text-4xl font-bold text-white">
              你的下一个故事，从今天开始
            </h3>
            <p className="mt-4 text-sm md:text-base text-white/80 max-w-xl mx-auto">
              免费注册，几分钟内即可生成第一份故事大纲。无需写作经验，灵感即可启程。
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 px-10 py-4 text-base font-bold text-[#7C3AED] rounded-full bg-white shadow-xl hover:bg-[#FAF5FF] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
            >
              立即免费创作
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 页脚 ================= */}
      <footer className="relative z-10 border-t border-[#7C3AED]/10 bg-white/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-[#7C3AED]" />
            <span>© 2026 AI Novel Agent · AI 小说创作智能体平台</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-[#7C3AED] transition-colors">
              登录
            </Link>
            <Link to="/register" className="hover:text-[#7C3AED] transition-colors">
              注册
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}