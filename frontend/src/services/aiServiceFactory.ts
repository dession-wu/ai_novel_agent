// src/services/aiServiceFactory.ts

import { AIServiceConfig } from './aiConfigService';

// 统一AI服务接口
export interface AIService {
  /**
   * 生成文本内容
   * @param prompt 提示词
   * @param options 生成选项
   */
  generateText(
    prompt: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      stopSequences?: string[];
    }
  ): Promise<string>;

  /**
   * 生成流式文本内容
   * @param prompt 提示词
   * @param options 生成选项
   * @param onChunk  chunk回调函数
   */
  generateTextStream(
    prompt: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      stopSequences?: string[];
    },
    onChunk: (chunk: string) => void
  ): Promise<void>;

  /**
   * 测试连接是否正常
   */
  testConnection(): Promise<boolean>;

  /**
   * 获取服务名称
   */
  getServiceName(): string;
}

// OpenAI客户端实现
class OpenAIClient implements AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async generateText(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }): Promise<string> {
    const response = await fetch(this.config.baseUrl || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
        temperature: options?.temperature || this.config.temperature || 0.7,
        stop: options?.stopSequences,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateTextStream(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch(this.config.baseUrl || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
        temperature: options?.temperature || this.config.temperature || 0.7,
        stop: options?.stopSequences,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') break;
          
          try {
            const data = JSON.parse(dataStr);
            if (data.choices[0].delta.content) {
              onChunk(data.choices[0].delta.content);
            }
          } catch (e) {
            console.error('解析OpenAI流数据失败:', e);
          }
        }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateText('Hello, test connection!', { maxTokens: 1 });
      return true;
    } catch (error) {
      console.error('OpenAI连接测试失败:', error);
      return false;
    }
  }

  getServiceName(): string {
    return 'OpenAI';
  }
}

// Anthropic客户端实现
class AnthropicClient implements AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async generateText(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }): Promise<string> {
    const response = await fetch(this.config.baseUrl || 'https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
        temperature: options?.temperature || this.config.temperature || 0.7,
        stop_sequences: options?.stopSequences,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async generateTextStream(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch(this.config.baseUrl || 'https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
        temperature: options?.temperature || this.config.temperature || 0.7,
        stop_sequences: options?.stopSequences,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') break;
          
          try {
            const data = JSON.parse(dataStr);
            if (data.type === 'content_block_delta' && data.delta.text) {
              onChunk(data.delta.text);
            }
          } catch (e) {
            console.error('解析Anthropic流数据失败:', e);
          }
        }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateText('Hello, test connection!', { maxTokens: 1 });
      return true;
    } catch (error) {
      console.error('Anthropic连接测试失败:', error);
      return false;
    }
  }

  getServiceName(): string {
    return 'Anthropic';
  }
}

// Gemini客户端实现
class GeminiClient implements AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async generateText(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }): Promise<string> {
    const response = await fetch(this.config.baseUrl || `https://generativelanguage.googleapis.com/v1/models/${this.config.model || 'gemini-pro'}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: options?.maxTokens || this.config.maxTokens || 1000,
          temperature: options?.temperature || this.config.temperature || 0.7,
          stopSequences: options?.stopSequences,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async generateTextStream(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }, onChunk: (chunk: string) => void): Promise<void> {
    // Gemini的流式API实现
    const response = await fetch(this.config.baseUrl || `https://generativelanguage.googleapis.com/v1/models/${this.config.model || 'gemini-pro'}:streamGenerateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: options?.maxTokens || this.config.maxTokens || 1000,
          temperature: options?.temperature || this.config.temperature || 0.7,
          stopSequences: options?.stopSequences,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') break;
          
          try {
            const data = JSON.parse(dataStr);
            if (data.candidates && data.candidates[0].content.parts[0].text) {
              onChunk(data.candidates[0].content.parts[0].text);
            }
          } catch (e) {
            console.error('解析Gemini流数据失败:', e);
          }
        }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateText('Hello, test connection!', { maxTokens: 1 });
      return true;
    } catch (error) {
      console.error('Gemini连接测试失败:', error);
      return false;
    }
  }

  getServiceName(): string {
    return 'Google Gemini';
  }
}

// 豆包客户端实现
class DoubaoClient implements AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async generateText(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }): Promise<string> {
    const response = await fetch(this.config.baseUrl || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'ep-20240127144401-nc25k',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
        temperature: options?.temperature || this.config.temperature || 0.7,
        stop: options?.stopSequences,
      }),
    });

    if (!response.ok) {
      throw new Error(`豆包API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateTextStream(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch(this.config.baseUrl || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'ep-20240127144401-nc25k',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
        temperature: options?.temperature || this.config.temperature || 0.7,
        stop: options?.stopSequences,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`豆包API error: ${response.status} ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') break;
          
          try {
            const data = JSON.parse(dataStr);
            if (data.choices[0].delta.content) {
              onChunk(data.choices[0].delta.content);
            }
          } catch (e) {
            console.error('解析豆包流数据失败:', e);
          }
        }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateText('Hello, test connection!', { maxTokens: 1 });
      return true;
    } catch (error) {
      console.error('豆包连接测试失败:', error);
      return false;
    }
  }

  getServiceName(): string {
    return '豆包';
  }
}

// DeepSeek客户端实现
class DeepSeekClient implements AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async generateText(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }): Promise<string> {
    const response = await fetch(this.config.baseUrl || 'https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
        temperature: options?.temperature || this.config.temperature || 0.7,
        stop: options?.stopSequences,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateTextStream(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch(this.config.baseUrl || 'https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
        temperature: options?.temperature || this.config.temperature || 0.7,
        stop: options?.stopSequences,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') break;
          
          try {
            const data = JSON.parse(dataStr);
            if (data.choices[0].delta.content) {
              onChunk(data.choices[0].delta.content);
            }
          } catch (e) {
            console.error('解析DeepSeek流数据失败:', e);
          }
        }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateText('Hello, test connection!', { maxTokens: 1 });
      return true;
    } catch (error) {
      console.error('DeepSeek连接测试失败:', error);
      return false;
    }
  }

  getServiceName(): string {
    return 'DeepSeek';
  }
}

// Qwen客户端实现
class QwenClient implements AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async generateText(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }): Promise<string> {
    const response = await fetch(this.config.baseUrl || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'qwen-max',
        input: {
          prompt: prompt,
        },
        parameters: {
          max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
          temperature: options?.temperature || this.config.temperature || 0.7,
          stop: options?.stopSequences,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return data.output.text;
  }

  async generateTextStream(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch(this.config.baseUrl || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'qwen-max',
        input: {
          prompt: prompt,
        },
        parameters: {
          max_tokens: options?.maxTokens || this.config.maxTokens || 1000,
          temperature: options?.temperature || this.config.temperature || 0.7,
          stop: options?.stopSequences,
          stream: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status} ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') break;
          
          try {
            const data = JSON.parse(dataStr);
            if (data.output?.text) {
              onChunk(data.output.text);
            }
          } catch (e) {
            console.error('解析Qwen流数据失败:', e);
          }
        }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateText('Hello, test connection!', { maxTokens: 1 });
      return true;
    } catch (error) {
      console.error('Qwen连接测试失败:', error);
      return false;
    }
  }

  getServiceName(): string {
    return '通义千问';
  }
}

// AI服务工厂类
export class AIServiceFactory {
  /**
   * 创建AI服务实例
   * @param config AI服务配置
   */
  static createService(config: AIServiceConfig): AIService {
    switch (config.serviceType) {
      case 'openai':
        return new OpenAIClient(config);
      case 'anthropic':
        return new AnthropicClient(config);
      case 'gemini':
        return new GeminiClient(config);
      case 'doubao':
        return new DoubaoClient(config);
      case 'deepseek':
        return new DeepSeekClient(config);
      case 'qwen':
        return new QwenClient(config);
      case 'custom':
        // 这里可以添加自定义服务客户端实现
        throw new Error('Custom service not implemented yet');
      default:
        throw new Error(`Unsupported AI service type: ${config.serviceType}`);
    }
  }

  /**
   * 获取支持的AI服务列表
   */
  static getSupportedServices(): Array<{
    value: AIServiceConfig['serviceType'];
    label: string;
    description: string;
  }> {
    return [
      {
        value: 'openai',
        label: 'OpenAI',
        description: '支持GPT-3.5, GPT-4等模型',
      },
      {
        value: 'anthropic',
        label: 'Anthropic',
        description: '支持Claude 3等模型',
      },
      {
        value: 'gemini',
        label: 'Google Gemini',
        description: '支持Gemini Pro等模型',
      },
      {
        value: 'doubao',
        label: '豆包',
        description: '支持豆包大模型等',
      },
      {
        value: 'deepseek',
        label: 'DeepSeek',
        description: '支持DeepSeek-R1等模型',
      },
      {
        value: 'qwen',
        label: '通义千问',
        description: '支持Qwen 2等模型',
      },
      {
        value: 'custom',
        label: '自定义服务',
        description: '连接到自定义AI服务',
      },
    ];
  }
}
