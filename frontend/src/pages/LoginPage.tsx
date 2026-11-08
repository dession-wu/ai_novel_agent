import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Feather, Loader2, LockKeyhole, PenLine } from 'lucide-react';
import { authApi } from '../api/api';
import apiClient from '../api/api';
import StoryAuth from './StoryAuth';

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

  return <StoryAuth><h2>登录</h2><p className="story-auth-caption">打开你的作品，接着写下去。</p>
    <form onSubmit={handleSubmit} className="story-auth-form">
      <div className="story-auth-field"><label htmlFor="username">用户名</label><input id="username" name="username" autoComplete="username" placeholder="输入用户名" value={username} onChange={e => setUsername(e.target.value)} required /></div>
      <div className="story-auth-field"><label htmlFor="password">密码</label><div className="story-auth-password"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="输入密码" value={password} onChange={e => setPassword(e.target.value)} required /><button type="button" className="story-auth-icon" aria-label={showPassword ? '隐藏密码' : '显示密码'} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
      {error && <p className="story-auth-error" role="alert">{error}</p>}
      <button type="submit" className="story-auth-submit" disabled={isLoading} aria-busy={isLoading}>{isLoading ? <><Loader2 size={16} className="story-auth-spinner" />登录中…</> : <>进入创作空间 <ArrowRight size={16} /></>}</button>
    </form><p className="story-auth-switch">还没有账号？<Link to="/register">注册账号</Link></p>
  </StoryAuth>;
};
export default LoginPage;
