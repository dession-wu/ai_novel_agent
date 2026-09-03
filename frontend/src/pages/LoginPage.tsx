import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Feather, Loader2, LockKeyhole, PenLine } from 'lucide-react';
import { authApi } from '../api/api';
import apiClient from '../api/api';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      const response = await authApi.login(params as any);
      apiClient.setToken(response.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '登录失败，请检查用户名和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="novel-auth-page" id="top">
      <div className="novel-auth-noise" aria-hidden="true" />
      <div className="novel-auth-rule novel-auth-rule-left" aria-hidden="true" />
      <div className="novel-auth-rule novel-auth-rule-right" aria-hidden="true" />
      <header className="novel-auth-header">
        <Link to="/" className="novel-auth-brand" aria-label="返回 AI Novel Agent 首页">
          <span className="novel-auth-brand-mark"><Feather size={17} /></span>
          <span><strong>AI NOVEL AGENT</strong><small>WRITING STUDIO / LOGIN</small></span>
        </Link>
        <span className="novel-auth-status"><i /> WRITING ROOM / READY</span>
      </header>
      <main className="novel-auth-main">
        <section className="novel-auth-intro" aria-labelledby="login-title">
          <p className="novel-auth-kicker"><span>01</span> YOUR STORY CONTINUES</p>
          <h1 id="login-title">回到你的<br /><em>故事现场。</em></h1>
          <p className="novel-auth-lede">打开保存过的章节、人物和灵感，让每一次登录都从上一次停下的地方继续。</p>
          <div className="novel-auth-index" aria-label="创作空间包含的内容">
            <div><PenLine size={15} /><span>持续写作</span><b>01</b></div>
            <div><LockKeyhole size={15} /><span>版本留存</span><b>02</b></div>
            <div><Feather size={15} /><span>AI 合著</span><b>03</b></div>
          </div>
        </section>
        <section className="novel-auth-sheet" aria-label="登录表单">
          <div className="novel-auth-sheet-top"><span>MANUSCRIPT ACCESS</span><span>LEAF / 001</span></div>
          <div className="novel-auth-sheet-body">
            <p className="novel-auth-label">/ SIGN IN</p>
            <h2>欢迎回来，作者。</h2>
            <p className="novel-auth-caption">输入账号，继续你的创作工作。</p>
            <form onSubmit={handleSubmit} className="novel-auth-form">
              <div className="novel-auth-field">
                <label htmlFor="username">用户名</label>
                <input id="username" name="username" type="text" autoComplete="username" placeholder="输入用户名…" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="novel-auth-field">
                <label htmlFor="password">密码</label>
                <div className="novel-auth-password">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="输入密码…" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className="novel-auth-icon" aria-label={showPassword ? '隐藏密码' : '显示密码'} onClick={() => setShowPassword((visible) => !visible)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <p className="novel-auth-error" role="alert">{error}</p>}
              <button type="submit" className="novel-auth-submit" disabled={isLoading} aria-busy={isLoading}>
                {isLoading ? <><Loader2 size={16} className="novel-auth-spinner" /> 登录中…</> : <>进入创作工作台 <ArrowRight size={17} /></>}
              </button>
            </form>
            <p className="novel-auth-register">还没有账号？ <Link to="/register">创建你的第一章 <ArrowRight size={13} /></Link></p>
          </div>
          <div className="novel-auth-sheet-foot"><span>PRIVATE DRAFT SPACE</span><span>© AI NOVEL AGENT</span></div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
