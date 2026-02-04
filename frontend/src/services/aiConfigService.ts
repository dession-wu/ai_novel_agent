// src/services/aiConfigService.ts

// AI服务类型定义
export type AIServiceType = 'openai' | 'anthropic' | 'gemini' | 'doubao' | 'deepseek' | 'qwen' | 'custom';

// AI服务配置接口
export interface AIServiceConfig {
  serviceType: AIServiceType;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// AI配置服务类
class AIConfigService {
  private readonly STORAGE_KEY = 'ai_service_config';
  private readonly ENCRYPTION_KEY_NAME = 'ai_config_encryption_key';

  /**
   * 生成加密密钥
   */
  private async generateEncryptionKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * 获取或创建加密密钥
   */
  private async getEncryptionKey(): Promise<CryptoKey> {
    // 检查密钥是否已存在
    const keyJson = localStorage.getItem(this.ENCRYPTION_KEY_NAME);
    if (keyJson) {
      return await crypto.subtle.importKey(
        'jwk',
        JSON.parse(keyJson),
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    }

    // 生成新密钥并存储
    const key = await this.generateEncryptionKey();
    const keyJwk = await crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(this.ENCRYPTION_KEY_NAME, JSON.stringify(keyJwk));
    return key;
  }

  /**
   * 加密数据
   */
  private async encrypt(data: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM需要12字节IV
    const encoder = new TextEncoder();
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encoder.encode(data)
    );

    // 将IV和密文合并为一个字符串，用冒号分隔
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);
    return btoa(String.fromCharCode(...combined));
  }

  /**
   * 解密数据
   */
  private async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const combined = new Uint8Array([...atob(encryptedData)].map(char => char.charCodeAt(0)));
    
    // 提取IV和密文
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  /**
   * 保存AI服务配置
   */
  public async saveConfig(config: AIServiceConfig): Promise<void> {
    try {
      // 加密API密钥
      const encryptedApiKey = await this.encrypt(config.apiKey);
      
      // 创建要存储的配置对象（不含明文密钥）
      const configToStore = {
        ...config,
        apiKey: encryptedApiKey,
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configToStore));
    } catch (error) {
      console.error('保存AI配置失败:', error);
      throw new Error('Failed to save AI configuration');
    }
  }

  /**
   * 获取AI服务配置
   */
  public async getConfig(): Promise<AIServiceConfig | null> {
    try {
      const storedConfig = localStorage.getItem(this.STORAGE_KEY);
      if (!storedConfig) {
        return null;
      }
      
      const config = JSON.parse(storedConfig);
      if (!config.apiKey) {
        return null;
      }
      
      // 解密API密钥
      const decryptedApiKey = await this.decrypt(config.apiKey);
      
      return {
        ...config,
        apiKey: decryptedApiKey,
      };
    } catch (error) {
      console.error('获取AI配置失败:', error);
      return null;
    }
  }

  /**
   * 更新AI服务配置
   */
  public async updateConfig(updates: Partial<AIServiceConfig>): Promise<AIServiceConfig> {
    const currentConfig = await this.getConfig();
    if (!currentConfig) {
      throw new Error('No existing AI configuration found');
    }
    
    const newConfig = {
      ...currentConfig,
      ...updates,
    };
    
    await this.saveConfig(newConfig);
    return newConfig;
  }

  /**
   * 删除AI服务配置
   */
  public deleteConfig(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 验证API密钥格式
   */
  public validateApiKey(serviceType: AIServiceType, apiKey: string): boolean {
    switch (serviceType) {
      case 'openai':
        // OpenAI API密钥格式：sk-开头，后跟51个字符
        return /^sk-[a-zA-Z0-9]{48}$/.test(apiKey);
      case 'anthropic':
        // Anthropic API密钥格式：sk-ant-api开头
        return /^sk-ant-api[a-zA-Z0-9_-]+$/.test(apiKey);
      case 'gemini':
        // Gemini API密钥格式：AIza开头
        return /^AIza[a-zA-Z0-9_-]+$/.test(apiKey);
      case 'doubao':
        // 豆包API密钥格式：lk-开头
        return /^lk-[a-zA-Z0-9_-]+$/.test(apiKey);
      case 'deepseek':
        // DeepSeek API密钥格式：sk-开头
        return /^sk-[a-zA-Z0-9_-]+$/.test(apiKey);
      case 'qwen':
        // Qwen API密钥格式：sk-开头
        return /^sk-[a-zA-Z0-9_-]+$/.test(apiKey);
      case 'custom':
        // 自定义服务，只要不是空字符串即可
        return apiKey.trim().length > 0;
      default:
        return false;
    }
  }
}

// 导出单例实例
export const aiConfigService = new AIConfigService();