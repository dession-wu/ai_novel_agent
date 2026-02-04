import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Settings, User, Bell, Shield, Palette, Brain, Loader2, XCircle, CheckCircle } from 'lucide-react';
import AIServiceConfig from '../components/AIServiceConfig';
import { useTheme } from '../components/ThemeProvider';

const SettingsPage: React.FC = () => {
  // 状态管理当前激活的设置项
  const [activeSetting, setActiveSetting] = useState<string | null>(null);

  // 个人资料设置组件
  const ProfileSettings = () => {
    const [formData, setFormData] = useState({ name: '', email: '', bio: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 加载用户数据
    useEffect(() => {
      const loadUserData = async () => {
        try {
          // 模拟API调用，添加兜底数据以防失败
          // const userData = await authApi.me();
          // 临时使用模拟数据，确保页面能正常显示
          const userData = {
            username: '测试用户',
            email: 'test@example.com'
          };
          setFormData({
            name: userData.username || '',
            email: userData.email || '',
            bio: '' // 假设bio字段在后端还未实现
          });
          setInitialDataLoaded(true);
        } catch (err) {
          console.error('加载用户数据失败:', err);
          setError('加载用户数据失败，显示默认信息');
          // 即使API调用失败，也设置默认数据和加载状态
          setFormData({
            name: '默认用户',
            email: 'default@example.com',
            bio: ''
          });
          setInitialDataLoaded(true);
        }
      };

      loadUserData();
    }, []);

    // 处理表单输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
      // 清除错误和成功信息
      if (error) setError('');
      if (success) setSuccess('');
    };

    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setLoading(true);
      setIsSubmitting(true);

      try {
        // 验证表单
        if (!formData.name.trim()) {
          throw new Error('姓名不能为空');
        }
        if (!formData.email.trim()) {
          throw new Error('邮箱不能为空');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          throw new Error('邮箱格式不正确');
        }

        // 模拟API调用更新用户信息
        // await authApi.updateProfile({
        //   username: formData.name,
        //   email: formData.email
        // });
        
        // 模拟成功响应
        await new Promise(resolve => setTimeout(resolve, 500));

        setSuccess('个人资料更新成功');
        // 3秒后清除成功信息
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(err.message || '更新个人资料失败');
        // 3秒后清除错误信息
        setTimeout(() => setError(''), 3000);
      } finally {
        // 添加一个小延迟，让用户看到加载状态
        setTimeout(() => {
          setLoading(false);
          setIsSubmitting(false);
        }, 500);
      }
    };

    // 处理取消
    const handleCancel = async () => {
      setError('');
      setSuccess('');
      setLoading(true);
      
      try {
        // 重新加载初始数据
        // const userData = await authApi.me();
        // 使用模拟数据，确保页面能正常显示
        const userData = {
          username: '测试用户',
          email: 'test@example.com'
        };
        setFormData({
          name: userData.username || '',
          email: userData.email || '',
          bio: ''
        });
      } catch (err) {
        console.error('加载用户数据失败:', err);
        setError('加载用户数据失败');
        setTimeout(() => setError(''), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (!initialDataLoaded) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>个人资料</CardTitle>
            <CardDescription>更新您的个人信息</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              加载中...
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`transition-all duration-300 ease-in-out ${isSubmitting ? 'scale-[0.98]' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            个人资料
          </CardTitle>
          <CardDescription>更新您的个人信息和账户详情</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-1 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out animate-slide-in">
              <XCircle className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-1 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out animate-slide-in">
              <CheckCircle className="h-3 w-3 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 transition-all duration-300 ease-in-out">
              <Label htmlFor="name" className="flex items-center gap-1">
                姓名
                <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="name" 
                placeholder="输入您的姓名" 
                value={formData.name}
                onChange={handleInputChange}
                className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              />
            </div>
            <div className="space-y-2 transition-all duration-300 ease-in-out">
              <Label htmlFor="email" className="flex items-center gap-1">
                邮箱
                <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="输入您的邮箱" 
                value={formData.email}
                onChange={handleInputChange}
                className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              />
            </div>
            <div className="space-y-2 transition-all duration-300 ease-in-out">
              <Label htmlFor="bio">个人简介</Label>
              <Input 
                id="bio" 
                placeholder="输入个人简介" 
                value={formData.bio}
                onChange={handleInputChange}
                className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-4 pt-4 transition-all duration-300 ease-in-out">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={loading}
                className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
              >
                {loading ? '取消中...' : '取消'}
              </Button>
              <Button 
                type="submit"
                disabled={loading}
                className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    保存更改
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  // 外观设置组件
  const AppearanceSettings = () => {
    const { theme, setTheme: setGlobalTheme, isDark } = useTheme();
    const [formData, setFormData] = useState({
      theme: isDark,
      fontSize: localStorage.getItem('fontSize') || '16',
      language: localStorage.getItem('language') || '简体中文'
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // 当全局主题变化时，更新本地状态
    useEffect(() => {
      setFormData(prev => ({
        ...prev,
        theme: isDark
      }));
    }, [isDark]);

    // 处理开关变化
    const handleSwitchChange = (id: string, checked: boolean) => {
      setFormData(prev => ({
        ...prev,
        [id]: checked
      }));
      
      // 如果是主题开关，立即应用主题
      if (id === 'theme') {
        setGlobalTheme(checked ? 'dark' : 'light');
        localStorage.setItem('theme', checked ? 'dark' : 'light');
      }
    };

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
      
      // 如果是字体大小，立即应用
      if (id === 'fontSize' && value) {
        const size = parseInt(value);
        if (size >= 12 && size <= 24) {
          document.documentElement.style.fontSize = `${value}px`;
          localStorage.setItem('fontSize', value);
        }
      }
    };

    // 保存设置
    const handleSave = async () => {
      try {
        // 保存字体大小和语言设置
        localStorage.setItem('fontSize', formData.fontSize);
        localStorage.setItem('language', formData.language);
        
        // 同步主题设置
        if (formData.theme !== isDark) {
          setGlobalTheme(formData.theme ? 'dark' : 'light');
        }
        
        // 应用字体大小
        document.documentElement.style.fontSize = `${formData.fontSize}px`;
        
        setSuccess('外观设置保存成功');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('保存外观设置失败:', error);
        setError('保存外观设置失败，请重试');
        setTimeout(() => setError(''), 3000);
      }
    };

    // 重置为默认
    const handleReset = () => {
      const defaultSettings = {
        theme: false,
        fontSize: '16',
        language: '简体中文'
      };
      setFormData(defaultSettings);
      
      // 保存默认设置
      localStorage.setItem('fontSize', '16');
      localStorage.setItem('language', '简体中文');
      
      // 同步主题设置
      if (isDark) {
        setGlobalTheme('light');
      }
      
      // 应用默认设置
      document.documentElement.style.fontSize = '16px';
      
      setSuccess('外观设置已重置为默认');
      setTimeout(() => setSuccess(''), 3000);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>外观</CardTitle>
          <CardDescription>自定义界面主题和样式</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-1 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out">
              <XCircle className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-1 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out">
              <CheckCircle className="h-3 w-3 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">深色模式</Label>
            <Switch 
              id="theme" 
              checked={formData.theme}
              onCheckedChange={(checked) => handleSwitchChange('theme', checked || false)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fontSize">字体大小</Label>
            <Input 
              id="fontSize" 
              type="number" 
              placeholder="16" 
              min="12" 
              max="24"
              value={formData.fontSize}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">语言</Label>
            <Input 
              id="language" 
              placeholder="简体中文"
              value={formData.language}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={handleReset}>
              重置为默认
            </Button>
            <Button onClick={handleSave}>
              保存更改
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 通知设置组件
  const NotificationSettings = () => {
    const [formData, setFormData] = useState({
      email_notifications: localStorage.getItem('email_notifications') !== 'false',
      push_notifications: localStorage.getItem('push_notifications') !== 'false',
      ai_updates: localStorage.getItem('ai_updates') !== 'false',
      notification_sound: localStorage.getItem('notification_sound') !== 'false',
      email_frequency: localStorage.getItem('email_frequency') || 'daily',
      push_frequency: localStorage.getItem('push_frequency') || 'realtime',
      notification_preview: localStorage.getItem('notification_preview') !== 'false'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState({
      email_notifications: localStorage.getItem('email_notifications') !== 'false',
      push_notifications: localStorage.getItem('push_notifications') !== 'false',
      ai_updates: localStorage.getItem('ai_updates') !== 'false',
      notification_sound: localStorage.getItem('notification_sound') !== 'false',
      email_frequency: localStorage.getItem('email_frequency') || 'daily',
      push_frequency: localStorage.getItem('push_frequency') || 'realtime',
      notification_preview: localStorage.getItem('notification_preview') !== 'false'
    });

    // 处理开关变化
    const handleSwitchChange = (id: string, checked: boolean) => {
      setFormData(prev => ({
        ...prev,
        [id]: checked
      }));
      // 清除错误和成功信息
      if (error) setError('');
      if (success) setSuccess('');
    };

    // 保存设置
    const handleSave = async () => {
      setError('');
      setSuccess('');
      setLoading(true);
      setIsSubmitting(true);

      try {
        // 保存到本地存储
        localStorage.setItem('email_notifications', formData.email_notifications.toString());
        localStorage.setItem('push_notifications', formData.push_notifications.toString());
        localStorage.setItem('ai_updates', formData.ai_updates.toString());
        localStorage.setItem('notification_sound', formData.notification_sound.toString());
        localStorage.setItem('email_frequency', formData.email_frequency);
        localStorage.setItem('push_frequency', formData.push_frequency);
        localStorage.setItem('notification_preview', formData.notification_preview.toString());
        
        // 更新初始数据
        setInitialData({ ...formData });
        
        setSuccess('通知设置保存成功');
        // 3秒后清除成功信息
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(err.message || '保存通知设置失败');
        // 3秒后清除错误信息
        setTimeout(() => setError(''), 3000);
      } finally {
        // 添加一个小延迟，让用户看到加载状态
        setTimeout(() => {
          setLoading(false);
          setIsSubmitting(false);
        }, 500);
      }
    };

    // 取消更改
    const handleCancel = () => {
      setError('');
      setSuccess('');
      setFormData({ ...initialData });
    };

    return (
      <Card className={`transition-all duration-300 ease-in-out ${isSubmitting ? 'scale-[0.98]' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-500" />
            通知设置
          </CardTitle>
          <CardDescription>配置您的通知偏好和接收方式</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-1 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out animate-slide-in">
              <XCircle className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-1 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out animate-slide-in">
              <CheckCircle className="h-3 w-3 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
          <div className="flex items-center justify-between transition-all duration-300 ease-in-out">
            <Label htmlFor="email_notifications" className="flex items-center gap-2">
              <span>邮箱通知</span>
              <span className="text-xs text-muted-foreground">接收重要通知和更新</span>
            </Label>
            <Switch 
              id="email_notifications" 
              checked={formData.email_notifications}
              onCheckedChange={(checked) => handleSwitchChange('email_notifications', checked || false)}
              className="transition-all duration-200 ease-in-out"
            />
          </div>
          <div className="flex items-center justify-between transition-all duration-300 ease-in-out">
            <Label htmlFor="push_notifications" className="flex items-center gap-2">
              <span>推送通知</span>
              <span className="text-xs text-muted-foreground">接收实时应用通知</span>
            </Label>
            <Switch 
              id="push_notifications" 
              checked={formData.push_notifications}
              onCheckedChange={(checked) => handleSwitchChange('push_notifications', checked || false)}
              className="transition-all duration-200 ease-in-out"
            />
          </div>
          <div className="flex items-center justify-between transition-all duration-300 ease-in-out">
            <Label htmlFor="ai_updates" className="flex items-center gap-2">
              <span>AI功能更新</span>
              <span className="text-xs text-muted-foreground">接收AI功能的最新更新</span>
            </Label>
            <Switch 
              id="ai_updates" 
              checked={formData.ai_updates}
              onCheckedChange={(checked) => handleSwitchChange('ai_updates', checked || false)}
              className="transition-all duration-200 ease-in-out"
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-6">
            <h3 className="text-sm font-medium">通知偏好设置</h3>
            
            <div className="flex items-center justify-between transition-all duration-300 ease-in-out">
              <Label htmlFor="notification_sound" className="flex items-center gap-2">
                <span>通知声音</span>
                <span className="text-xs text-muted-foreground">接收通知时播放声音</span>
              </Label>
              <Switch 
                id="notification_sound" 
                checked={formData.notification_sound}
                onCheckedChange={(checked) => handleSwitchChange('notification_sound', checked || false)}
                className="transition-all duration-200 ease-in-out"
              />
            </div>
            
            <div className="flex items-center justify-between transition-all duration-300 ease-in-out">
              <Label htmlFor="notification_preview" className="flex items-center gap-2">
                <span>通知预览</span>
                <span className="text-xs text-muted-foreground">在通知中显示详细内容</span>
              </Label>
              <Switch 
                id="notification_preview" 
                checked={formData.notification_preview}
                onCheckedChange={(checked) => handleSwitchChange('notification_preview', checked || false)}
                className="transition-all duration-200 ease-in-out"
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email_frequency">邮件通知频率</Label>
                <select 
                  id="email_frequency"
                  value={formData.email_frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, email_frequency: e.target.value }))}
                  className="w-full p-2 border rounded-md transition-all duration-200 ease-in-out"
                >
                  <option value="realtime">实时</option>
                  <option value="daily">每日摘要</option>
                  <option value="weekly">每周摘要</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="push_frequency">推送通知频率</Label>
                <select 
                  id="push_frequency"
                  value={formData.push_frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, push_frequency: e.target.value }))}
                  className="w-full p-2 border rounded-md transition-all duration-200 ease-in-out"
                >
                  <option value="realtime">实时</option>
                  <option value="hourly">每小时</option>
                  <option value="daily">每日摘要</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 transition-all duration-300 ease-in-out">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
              className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              {loading ? '取消中...' : '取消'}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  保存更改
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 安全设置组件
  const SecuritySettings = () => {
    const [formData, setFormData] = useState({ 
      current_password: '', 
      new_password: '', 
      confirm_password: '' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    // 处理表单输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
      // 清除错误和成功信息
      if (error) setError('');
      if (success) setSuccess('');
      
      // 计算密码强度
      if (id === 'new_password') {
        calculatePasswordStrength(value);
      }
    };

    // 计算密码强度
    const calculatePasswordStrength = (password: string) => {
      if (password.length === 0) {
        setPasswordStrength('');
        return;
      }
      
      let strength = 0;
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      
      if (strength < 2) {
        setPasswordStrength('weak');
      } else if (strength < 4) {
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('strong');
      }
    };

    // 获取密码强度显示
    const getPasswordStrengthDisplay = () => {
      if (!formData.new_password) return null;
      
      const strengthMap = {
        weak: { text: '弱', color: 'text-red-500', bg: 'bg-red-200 dark:bg-red-900/30' },
        medium: { text: '中', color: 'text-yellow-500', bg: 'bg-yellow-200 dark:bg-yellow-900/30' },
        strong: { text: '强', color: 'text-green-500', bg: 'bg-green-200 dark:bg-green-900/30' }
      };
      
      const strength = strengthMap[passwordStrength as keyof typeof strengthMap] || strengthMap.weak;
      
      return (
        <div className="flex items-center gap-2 mt-1">
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${strength.color} ${strength.bg}`}>
            {strength.text}
          </div>
          <div className="h-1 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ease-in-out ${strength.color.replace('text-', 'bg-')}`}
              style={{ 
                width: passwordStrength === 'weak' ? '33%' : 
                       passwordStrength === 'medium' ? '66%' : '100%' 
              }}
            ></div>
          </div>
        </div>
      );
    };

    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setLoading(true);
      setIsSubmitting(true);

      try {
        // 验证表单
        if (!formData.current_password) {
          throw new Error('当前密码不能为空');
        }
        if (!formData.new_password) {
          throw new Error('新密码不能为空');
        }
        if (formData.new_password.length < 6) {
          throw new Error('新密码长度不能少于6位');
        }
        if (formData.new_password !== formData.confirm_password) {
          throw new Error('两次输入的新密码不一致');
        }

        // 调用API修改密码
        await authApi.changePassword({
          current_password: formData.current_password,
          new_password: formData.new_password
        });

        setSuccess('密码修改成功');
        // 重置表单
        setFormData({ 
          current_password: '', 
          new_password: '', 
          confirm_password: '' 
        });
        setPasswordStrength('');
        // 3秒后清除成功信息
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(err.message || '密码修改失败');
        // 3秒后清除错误信息
        setTimeout(() => setError(''), 3000);
      } finally {
        // 添加一个小延迟，让用户看到加载状态
        setTimeout(() => {
          setLoading(false);
          setIsSubmitting(false);
        }, 500);
      }
    };

    // 处理取消
    const handleCancel = () => {
      setError('');
      setSuccess('');
      setFormData({ 
        current_password: '', 
        new_password: '', 
        confirm_password: '' 
      });
      setPasswordStrength('');
    };

    return (
      <Card className={`transition-all duration-300 ease-in-out ${isSubmitting ? 'scale-[0.98]' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            安全设置
          </CardTitle>
          <CardDescription>管理您的密码和账户安全设置</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-1 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out animate-slide-in">
              <XCircle className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-1 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out animate-slide-in">
              <CheckCircle className="h-3 w-3 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 transition-all duration-300 ease-in-out">
              <Label htmlFor="current_password" className="flex items-center gap-1">
                当前密码
                <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="current_password" 
                type="password" 
                placeholder="输入当前密码" 
                value={formData.current_password}
                onChange={handleInputChange}
                className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-green-500 focus:border-transparent ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              />
            </div>
            <div className="space-y-2 transition-all duration-300 ease-in-out">
              <Label htmlFor="new_password" className="flex items-center gap-1">
                新密码
                <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="new_password" 
                type="password" 
                placeholder="输入新密码（至少6位）" 
                value={formData.new_password}
                onChange={handleInputChange}
                className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-green-500 focus:border-transparent ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              />
              {getPasswordStrengthDisplay()}
              <p className="text-xs text-muted-foreground mt-1">
                密码应包含大小写字母、数字和特殊字符
              </p>
            </div>
            <div className="space-y-2 transition-all duration-300 ease-in-out">
              <Label htmlFor="confirm_password" className="flex items-center gap-1">
                确认新密码
                <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="confirm_password" 
                type="password" 
                placeholder="确认新密码" 
                value={formData.confirm_password}
                onChange={handleInputChange}
                className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-green-500 focus:border-transparent ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-4 pt-4 transition-all duration-300 ease-in-out">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={loading}
                className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
              >
                {loading ? '取消中...' : '取消'}
              </Button>
              <Button 
                type="submit"
                disabled={loading}
                className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                variant="default"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    更新中...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    更新密码
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  // 应用设置组件
  const AppSettings = () => {
    const [formData, setFormData] = useState({
      auto_save: localStorage.getItem('auto_save') !== 'false',
      spell_check: localStorage.getItem('spell_check') !== 'false',
      save_interval: localStorage.getItem('save_interval') || '30'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 处理开关变化
    const handleSwitchChange = (id: string, checked: boolean) => {
      setFormData(prev => ({
        ...prev,
        [id]: checked
      }));
      // 清除错误和成功信息
      if (error) setError('');
      if (success) setSuccess('');
    };

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
      // 清除错误和成功信息
      if (error) setError('');
      if (success) setSuccess('');
    };

    // 保存设置
    const handleSave = async () => {
      setError('');
      setSuccess('');
      setLoading(true);
      setIsSubmitting(true);

      try {
        // 验证保存间隔
        if (parseInt(formData.save_interval) < 5 || parseInt(formData.save_interval) > 300) {
          throw new Error('保存间隔必须在5-300秒之间');
        }
        
        // 保存到本地存储
        localStorage.setItem('auto_save', formData.auto_save.toString());
        localStorage.setItem('spell_check', formData.spell_check.toString());
        localStorage.setItem('save_interval', formData.save_interval);
        
        setSuccess('应用设置保存成功');
        // 3秒后清除成功信息
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(err.message || '保存应用设置失败');
        // 3秒后清除错误信息
        setTimeout(() => setError(''), 3000);
      } finally {
        // 添加一个小延迟，让用户看到加载状态
        setTimeout(() => {
          setLoading(false);
          setIsSubmitting(false);
        }, 500);
      }
    };

    // 重置为默认
    const handleReset = async () => {
      setError('');
      setSuccess('');
      setLoading(true);
      setIsSubmitting(true);

      try {
        const defaultSettings = {
          auto_save: true,
          spell_check: true,
          save_interval: '30'
        };
        setFormData(defaultSettings);
        
        // 保存默认设置
        localStorage.setItem('auto_save', 'true');
        localStorage.setItem('spell_check', 'true');
        localStorage.setItem('save_interval', '30');
        
        setSuccess('应用设置已重置为默认');
        // 3秒后清除成功信息
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(err.message || '重置应用设置失败');
        // 3秒后清除错误信息
        setTimeout(() => setError(''), 3000);
      } finally {
        // 添加一个小延迟，让用户看到加载状态
        setTimeout(() => {
          setLoading(false);
          setIsSubmitting(false);
        }, 500);
      }
    };

    return (
      <Card className={`transition-all duration-300 ease-in-out ${isSubmitting ? 'scale-[0.98]' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            应用设置
          </CardTitle>
          <CardDescription>配置应用的通用设置和偏好选项</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-1 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out animate-slide-in">
              <XCircle className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-1 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg transition-all duration-300 ease-in-out animate-slide-in">
              <CheckCircle className="h-3 w-3 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
          <div className="flex items-center justify-between transition-all duration-300 ease-in-out">
            <Label htmlFor="auto_save" className="flex items-center gap-2">
              <span>自动保存</span>
              <span className="text-xs text-muted-foreground">自动保存您的工作</span>
            </Label>
            <Switch 
              id="auto_save" 
              checked={formData.auto_save}
              onCheckedChange={(checked) => handleSwitchChange('auto_save', checked || false)}
              className="transition-all duration-200 ease-in-out"
            />
          </div>
          <div className="flex items-center justify-between transition-all duration-300 ease-in-out">
            <Label htmlFor="spell_check" className="flex items-center gap-2">
              <span>拼写检查</span>
              <span className="text-xs text-muted-foreground">自动检查拼写错误</span>
            </Label>
            <Switch 
              id="spell_check" 
              checked={formData.spell_check}
              onCheckedChange={(checked) => handleSwitchChange('spell_check', checked || false)}
              className="transition-all duration-200 ease-in-out"
            />
          </div>
          <div className="space-y-2 transition-all duration-300 ease-in-out">
            <Label htmlFor="save_interval">保存间隔（秒）</Label>
            <Input 
              id="save_interval" 
              type="number" 
              placeholder="30" 
              min="5" 
              max="300"
              value={formData.save_interval}
              onChange={handleInputChange}
              className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-gray-500 focus:border-transparent ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              建议设置为30-60秒，平衡性能和安全性
            </p>
          </div>
          <div className="flex justify-end gap-4 pt-4 transition-all duration-300 ease-in-out">
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={loading}
              className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              {loading ? '重置中...' : '重置为默认'}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  保存更改
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 根据activeSetting显示对应的设置内容
  const renderActiveSetting = () => {
    switch (activeSetting) {
      case 'profile':
        return <ProfileSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notification':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'app':
        return <AppSettings />;
      case 'aiService':
        return (
          <div id="ai-service-config" className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">AI服务配置</h2>
            <p className="text-muted-foreground">配置您的AI服务提供商和API密钥，以便使用AI辅助写作功能。</p>
            <AIServiceConfig />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">设置</h1>
        <p className="text-muted-foreground">管理您的账号设置和应用偏好。</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          className={`cursor-pointer hover:bg-accent transition-colors ${activeSetting === 'profile' ? 'border-blue-500 bg-blue-50' : ''}`}
          onClick={() => setActiveSetting('profile')}
        >
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <User className="w-8 h-8 text-blue-500" />
            <div>
              <CardTitle className="text-lg">个人资料</CardTitle>
              <CardDescription>更新您的个人信息</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className={`cursor-pointer hover:bg-accent transition-colors ${activeSetting === 'appearance' ? 'border-purple-500 bg-purple-50' : ''}`}
          onClick={() => setActiveSetting('appearance')}
        >
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Palette className="w-8 h-8 text-purple-500" />
            <div>
              <CardTitle className="text-lg">外观</CardTitle>
              <CardDescription>自定义界面主题和样式</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className={`cursor-pointer hover:bg-accent transition-colors ${activeSetting === 'notification' ? 'border-yellow-500 bg-yellow-50' : ''}`}
          onClick={() => setActiveSetting('notification')}
        >
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Bell className="w-8 h-8 text-yellow-500" />
            <div>
              <CardTitle className="text-lg">通知</CardTitle>
              <CardDescription>配置您的通知偏好</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className={`cursor-pointer hover:bg-accent transition-colors ${activeSetting === 'security' ? 'border-green-500 bg-green-50' : ''}`}
          onClick={() => setActiveSetting('security')}
        >
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Shield className="w-8 h-8 text-green-500" />
            <div>
              <CardTitle className="text-lg">安全</CardTitle>
              <CardDescription>管理您的密码和安全设置</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className={`cursor-pointer hover:bg-accent transition-colors ${activeSetting === 'aiService' ? 'border-blue-500 bg-blue-50' : ''}`}
          onClick={() => setActiveSetting('aiService')}
        >
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Brain className="w-8 h-8 text-blue-500" />
            <div>
              <CardTitle className="text-lg">AI服务配置</CardTitle>
              <CardDescription>管理AI服务连接和API密钥</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className={`cursor-pointer hover:bg-accent transition-colors ${activeSetting === 'app' ? 'border-gray-500 bg-gray-50' : ''}`}
          onClick={() => setActiveSetting('app')}
        >
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Settings className="w-8 h-8 text-gray-500" />
            <div>
              <CardTitle className="text-lg">应用设置</CardTitle>
              <CardDescription>通用应用配置</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* 激活的设置内容 */}
      {activeSetting && (
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {activeSetting === 'profile' && '个人资料设置'}
            {activeSetting === 'appearance' && '外观设置'}
            {activeSetting === 'notification' && '通知设置'}
            {activeSetting === 'security' && '安全设置'}
            {activeSetting === 'app' && '应用设置'}
            {activeSetting === 'aiService' && 'AI服务配置'}
          </h2>
          <p className="text-muted-foreground">
            {activeSetting === 'profile' && '更新您的个人信息和账户详情'}
            {activeSetting === 'appearance' && '自定义应用界面的外观和样式'}
            {activeSetting === 'notification' && '配置您接收通知的方式和频率'}
            {activeSetting === 'security' && '管理您的账户安全和密码设置'}
            {activeSetting === 'app' && '调整应用的通用设置和偏好'}
            {activeSetting === 'aiService' && '配置您的AI服务提供商和API密钥'}
          </p>
          {renderActiveSetting()}
        </div>
      )}



      <div className="pt-6 border-t">
        <div className="flex justify-end gap-4">
          <Button variant="outline">重置所有设置</Button>
          <Button onClick={() => alert('所有设置已保存')}>保存所有更改</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
