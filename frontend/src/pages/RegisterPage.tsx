import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StoryAuth from './StoryAuth';
import { ArrowRight } from 'lucide-react';
import { authApi } from '../api/api';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register({
        username,
        email,
        password
      });
      
      // Navigate to login page on success
      navigate('/login');
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return <StoryAuth register><h2>创建账号</h2><p className="story-auth-caption">为你的第一部作品留一个位置。</p>
    <form onSubmit={handleSubmit} className="story-auth-form">
      <div className="story-auth-field"><label htmlFor="username">用户名</label><input id="username" name="username" autoComplete="username" placeholder="设置用户名" value={username} onChange={e => setUsername(e.target.value)} required /></div>
      <div className="story-auth-field"><label htmlFor="email">电子邮箱</label><input id="email" name="email" type="email" autoComplete="email" placeholder="输入邮箱地址" value={email} onChange={e => setEmail(e.target.value)} required /></div>
      <div className="story-auth-field"><label htmlFor="password">密码</label><input id="password" name="password" type="password" autoComplete="new-password" placeholder="设置密码" value={password} onChange={e => setPassword(e.target.value)} required /></div>
      <div className="story-auth-field"><label htmlFor="confirmPassword">确认密码</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" placeholder="再次输入密码" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></div>
      {error && <p className="story-auth-error" role="alert">{error}</p>}
      <button type="submit" className="story-auth-submit" disabled={isLoading} aria-busy={isLoading}>{isLoading ? '注册中…' : <>创建账号 <ArrowRight size={16} /></>}</button>
    </form><p className="story-auth-switch">已有账号？<Link to="/login">直接登录</Link></p>
  </StoryAuth>;
};
export default RegisterPage;
