import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useNotification } from './NotificationContext';

const Notification = ({ notification }) => {
  const { removeNotification } = useNotification();
  const notificationRef = useRef(null);

  // 获取通知类型对应的样式
  const getNotificationStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          border: 'border-green-600',
          icon: '✅'
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          border: 'border-red-600',
          icon: '❌'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          text: 'text-white',
          border: 'border-yellow-600',
          icon: '⚠️'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          border: 'border-blue-600',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getNotificationStyles();

  // 自动移除通知
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration, removeNotification]);

  return (
    <div
      ref={notificationRef}
      className={cn(
        'flex items-center justify-between gap-4 p-4 rounded-lg border shadow-lg transition-all duration-500 ease-in-out transform scale-100 translate-y-0 opacity-100 animate-slideIn',
        styles.bg,
        styles.text,
        styles.border
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* 通知内容 */}
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xl">{styles.icon}</span>
        <span className="font-medium text-sm md:text-base">{notification.message}</span>
      </div>

      {/* 通知操作按钮 */}
      {notification.action && (
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 text-xs md:text-sm"
          onClick={() => {
            notification.action?.onClick();
            removeNotification(notification.id);
          }}
        >
          {notification.action.label}
        </Button>
      )}

      {/* 关闭按钮 */}
      <button
        onClick={() => removeNotification(notification.id)}
        className="p-1.5 rounded-full hover:bg-white/20 transition-all hover:scale-110"
        aria-label="关闭通知"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            removeNotification(notification.id);
          }
        }}
      >
        <span className="text-white text-sm">✕</span>
      </button>
    </div>
  );
};

// 通知容器组件
const NotificationContainer = () => {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-4 max-w-md w-full">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

// 添加全局动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateY(-20px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    to {
      transform: translateY(-20px) scale(0.95);
      opacity: 0;
    }
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease-out forwards;
  }
  
  .animate-slideOut {
    animation: slideOut 0.3s ease-in forwards;
  }
`;
document.head.appendChild(style);

export default NotificationContainer;
