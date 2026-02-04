// src/components/AIServiceConfig.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, HelpCircle, Info, Brain } from 'lucide-react';
import { aiConfigService, AIServiceConfig } from '../services/aiConfigService';
import { AIServiceFactory } from '../services/aiServiceFactory';

interface AIServiceConfigProps {
  onConfigChange?: (config: AIServiceConfig) => void;
}

const AIServiceConfigComponent: React.FC<AIServiceConfigProps> = ({ onConfigChange }) => {
  // 状态管理
  const [selectedService, setSelectedService] = useState<AIServiceConfig['serviceType']>('openai');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 加载现有配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await aiConfigService.getConfig();
        if (config) {
          setSelectedService(config.serviceType);
          setApiKey(config.apiKey);
          setBaseUrl(config.baseUrl || '');
          setModel(config.model || '');
          setConnectionStatus('connected');
        }
      } catch (error) {
        console.error('加载配置失败:', error);
        setConnectionStatus('disconnected');
      }
    };
    loadConfig();
  }, []);

  // 当服务类型改变时，更新默认baseUrl和model
  useEffect(() => {
    switch (selectedService) {
      case 'openai':
        setBaseUrl('https://api.openai.com/v1');
        setModel('gpt-3.5-turbo');
        break;
      case 'anthropic':
        setBaseUrl('https://api.anthropic.com/v1');
        setModel('claude-3-sonnet-20240229');
        break;
      case 'gemini':
        setBaseUrl('https://generativelanguage.googleapis.com/v1');
        setModel('gemini-pro');
        break;
      case 'doubao':
        setBaseUrl('https://ark.cn-beijing.volces.com/api/v3/chat/completions');
        setModel('ep-20240127144401-nc25k');
        break;
      case 'deepseek':
        setBaseUrl('https://api.deepseek.com/v1/chat/completions');
        setModel('deepseek-chat');
        break;
      case 'qwen':
        setBaseUrl('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation');
        setModel('qwen-max');
        break;
      default:
        setBaseUrl('');
        setModel('');
    }
    // 重置测试结果和验证错误
    setTestResult('idle');
    setValidationError('');
  }, [selectedService]);

  // 验证API密钥
  const validateApiKey = () => {
    if (!apiKey.trim()) {
      setValidationError('API密钥不能为空');
      return false;
    }
    
    const isValid = aiConfigService.validateApiKey(selectedService, apiKey);
    if (!isValid) {
      setValidationError('API密钥格式不正确');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  // 测试连接
  const handleTestConnection = async () => {
    if (!validateApiKey()) return;
    
    setIsTesting(true);
    setTestResult('idle');
    setConnectionStatus('connecting');
    setIsSubmitting(true);
    
    try {
      const config: AIServiceConfig = {
        serviceType: selectedService,
        apiKey,
        baseUrl: baseUrl || undefined,
        model: model || undefined,
      };
      
      const service = AIServiceFactory.createService(config);
      const success = await service.testConnection();
      
      setTestResult(success ? 'success' : 'error');
      setConnectionStatus(success ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('连接测试失败:', error);
      setTestResult('error');
      setConnectionStatus('disconnected');
    } finally {
      // 添加一个小延迟，让用户看到加载状态
      setTimeout(() => {
        setIsTesting(false);
        setIsSubmitting(false);
      }, 500);
    }
  };

  // 保存配置
  const handleSaveConfig = async () => {
    if (!validateApiKey()) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    setIsSubmitting(true);
    
    try {
      const config: AIServiceConfig = {
        serviceType: selectedService,
        apiKey,
        baseUrl: baseUrl || undefined,
        model: model || undefined,
      };
      
      await aiConfigService.saveConfig(config);
      setSaveStatus('success');
      setConnectionStatus('connected');
      
      if (onConfigChange) {
        onConfigChange(config);
      }
      
      // 3秒后重置保存状态
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('保存配置失败:', error);
      setSaveStatus('error');
      
      // 3秒后重置保存状态
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      // 添加一个小延迟，让用户看到加载状态
      setTimeout(() => {
        setIsSaving(false);
        setIsSubmitting(false);
      }, 500);
    }
  };

  // 获取连接状态显示
  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="flex items-center gap-2 text-green-600 transition-all duration-300 ease-in-out">
            <CheckCircle className="h-4 w-4" />
            <span>已连接</span>
          </div>
        );
      case 'connecting':
        return (
          <div className="flex items-center gap-2 text-yellow-600 transition-all duration-300 ease-in-out">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>连接中...</span>
          </div>
        );
      case 'disconnected':
        return (
          <div className="flex items-center gap-2 text-red-600 transition-all duration-300 ease-in-out">
            <XCircle className="h-4 w-4" />
            <span>未连接</span>
          </div>
        );
    }
  };

  return (
    <Card className={`max-w-4xl mx-auto transition-all duration-300 ease-in-out ${isSubmitting ? 'scale-[0.99]' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          AI服务配置
        </CardTitle>
        <CardDescription>管理您的AI服务连接和API密钥，以启用AI辅助写作功能</CardDescription>
      </CardHeader>
      <CardContent>
        {/* 连接状态 */}
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-between transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">AI服务连接状态</span>
          </div>
          {getConnectionStatusDisplay()}
        </div>

        {/* 服务选择 */}
        <div className="space-y-4">
          <div className="space-y-2 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between">
              <Label htmlFor="service-type">AI服务提供商</Label>
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200" title="选择您要使用的AI服务提供商" />
            </div>
            <Select
              value={selectedService}
              onValueChange={(value) => setSelectedService(value as AIServiceConfig['serviceType'])}
            >
              <SelectTrigger id="service-type" className="transition-all duration-200 ease-in-out">
                <SelectValue placeholder="选择AI服务" />
              </SelectTrigger>
              <SelectContent>
                {AIServiceFactory.getSupportedServices().map((service) => (
                  <SelectItem key={service.value} value={service.value} className="transition-all duration-150 ease-in-out hover:bg-accent">
                    <div className="flex flex-col">
                      <span className="font-medium">{service.label}</span>
                      <span className="text-xs text-muted-foreground">{service.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* API密钥输入 */}
          <div className="space-y-2 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key">API密钥</Label>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200" title="输入您的AI服务API密钥" />
                {testResult === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-500 transition-all duration-300 ease-in-out" title="API密钥有效" />
                )}
                {testResult === 'error' && (
                  <XCircle className="h-4 w-4 text-red-500 transition-all duration-300 ease-in-out" title="API密钥无效" />
                )}
              </div>
            </div>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                placeholder="输入您的API密钥"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setValidationError('');
                  setTestResult('idle');
                }}
                className={`pr-10 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationError ? 'border-red-500' : ''} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                onBlur={validateApiKey}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                onClick={() => setShowApiKey(!showApiKey)}
                title={showApiKey ? '隐藏API密钥' : '显示API密钥'}
                disabled={isSubmitting}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {validationError && (
              <div className="flex items-center gap-1 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition-all duration-300 ease-in-out animate-slide-in">
                <XCircle className="h-3 w-3 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* 高级配置 */}
          <div className="space-y-2 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2">
              <Label htmlFor="base-url">API基础URL</Label>
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200" title="自定义API基础URL（可选）" />
            </div>
            <Input
              id="base-url"
              placeholder="https://api.openai.com/v1"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2">
              <Label htmlFor="model">默认模型</Label>
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors duration-200" title="设置默认使用的模型（可选）" />
            </div>
            <Input
              id="model"
              placeholder="gpt-3.5-turbo"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              不同的模型具有不同的能力和价格，请根据您的需求选择合适的模型
            </p>
          </div>

          <Separator />

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 transition-all duration-300 ease-in-out">
            <Button
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim() || isSubmitting}
              className="flex-1 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  测试连接中...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  测试连接
                </>
              )}
            </Button>

            <Button
              onClick={handleSaveConfig}
              disabled={isSaving || !apiKey.trim() || validationError || isSubmitting}
              className="flex-1 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
              variant="default"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  保存配置
                </>
              )}
            </Button>
          </div>

          {/* 保存状态反馈 */}
          {saveStatus !== 'idle' && (
            <div className="flex items-center gap-2 text-sm mt-2 transition-all duration-300 ease-in-out animate-slide-in">
              {saveStatus === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">配置保存成功！AI服务已就绪。</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">配置保存失败，请检查API密钥后重试。</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* 使用帮助 */}
        <Separator className="my-6" />
        <div className="space-y-4 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">使用帮助</h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-2 bg-muted/50 p-4 rounded-lg">
            <p>• 选择您要使用的AI服务提供商，然后输入相应的API密钥</p>
            <p>• 点击"测试连接"按钮验证API密钥是否有效</p>
            <p>• 点击"保存配置"按钮保存您的设置</p>
            <p>• API密钥将被加密存储在您的浏览器本地存储中，不会被发送到我们的服务器</p>
            <p>• 如果您没有API密钥，请访问相应服务提供商的网站进行注册和获取</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIServiceConfigComponent;
