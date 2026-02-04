import React, { createContext, useContext, useState, ReactNode } from 'react';

// 加载状态类型
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// 加载状态上下文类型
export interface LoadingContextType {
  loading: LoadingState;
  setLoading: (loading: boolean, message?: string) => void;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

// 创建加载状态上下文
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// 加载状态提供者组件
interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: undefined
  });

  // 设置加载状态
  const setLoading = (isLoading: boolean, message?: string) => {
    setLoadingState({ isLoading, message });
  };

  // 显示加载状态
  const showLoading = (message?: string) => {
    setLoadingState({ isLoading: true, message });
  };

  // 隐藏加载状态
  const hideLoading = () => {
    setLoadingState({ isLoading: false, message: undefined });
  };

  return (
    <LoadingContext.Provider value={{ loading, setLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// 自定义钩子，用于访问加载状态上下文
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
