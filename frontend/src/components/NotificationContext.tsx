import React, { createContext, useContext, useState, ReactNode } from 'react';

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// 通知数据结构
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 通知上下文类型
export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// 创建通知上下文
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 通知提供者组件
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 添加通知
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000 // 默认5秒后自动消失
    };

    setNotifications(prev => [...prev, newNotification]);

    // 自动移除通知
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  // 移除通知
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // 清除所有通知
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// 自定义钩子，用于访问通知上下文
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
