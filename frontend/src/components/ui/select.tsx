// src/components/ui/select.tsx

import React, { useState, useRef, useEffect } from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

// 基础Select组件
const Select: React.FC<SelectProps> = ({ value, onValueChange, children, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 提取子组件
  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray.find(child => React.isValidElement(child) && child.type.name === 'SelectTrigger') as React.ReactElement<SelectTriggerProps>;
  const content = childrenArray.find(child => React.isValidElement(child) && child.type.name === 'SelectContent') as React.ReactElement<SelectContentProps>;

  // 提取选项
  const items = content ? React.Children.toArray(content.props.children).filter(child => React.isValidElement(child) && child.type.name === 'SelectItem') as React.ReactElement<SelectItemProps>[] : [];

  // 找到当前选中的值
  const selectedItem = items.find(item => item.props.value === value);
  
  // 找到SelectValue组件并更新其内容
  let updatedTrigger = trigger;
  if (trigger) {
    const triggerChildren = React.Children.toArray(trigger.props.children);
    const selectValue = triggerChildren.find(child => React.isValidElement(child) && child.type.name === 'SelectValue') as React.ReactElement<SelectValueProps>;
    
    if (selectValue) {
      // 找到选中项的显示内容
      let selectedContent = selectValue.props.placeholder;
      if (selectedItem) {
        // 处理复杂的选项内容，只提取主要文本
        if (React.isValidElement(selectedItem.props.children)) {
          // 检查是否是包含label和description的结构
          if (selectedItem.props.children.props && selectedItem.props.children.props.children) {
            const childrenArray = React.Children.toArray(selectedItem.props.children.props.children);
            // 找到第一个span元素作为显示内容
            const labelElement = childrenArray.find(child => 
              React.isValidElement(child) && child.type === 'span'
            );
            if (labelElement) {
              selectedContent = labelElement.props.children;
            }
          }
        } else {
          selectedContent = selectedItem.props.children;
        }
      }
      
      // 更新SelectValue组件
      const updatedSelectValue = React.cloneElement(selectValue, {
        children: selectedContent
      });
      
      // 更新trigger组件
      updatedTrigger = React.cloneElement(trigger, {
        children: React.Children.map(trigger.props.children, child => {
          if (React.isValidElement(child) && child.type.name === 'SelectValue') {
            return updatedSelectValue;
          }
          return child;
        })
      });
    }
  }

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {React.cloneElement(updatedTrigger, {
        onClick: () => setIsOpen(!isOpen),
        className: `${updatedTrigger.props.className || ''} ${isOpen ? 'border-blue-500' : ''}`,
      })}
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg overflow-hidden">
          {React.cloneElement(content, {
            children: items.map(item => React.cloneElement(item, {
              onClick: () => {
                onValueChange(item.props.value);
                setIsOpen(false);
              },
              className: `${item.props.className || ''} ${item.props.value === value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`,
            }))
          })}
        </div>
      )}
    </div>
  );
};

// SelectTrigger组件
const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
      {...props}
    >
      {children}
      <span className="ml-2 h-4 w-4 text-gray-500">▼</span>
    </button>
  );
};

// SelectValue组件
const SelectValue: React.FC<SelectValueProps> = ({ placeholder, children, className }) => {
  return (
    <span className={`block truncate ${className || ''}`}>
      {children || placeholder}
    </span>
  );
};

// SelectContent组件
const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  return (
    <div className={`max-h-60 overflow-y-auto ${className || ''}`}>
      {children}
    </div>
  );
};

// SelectItem组件
const SelectItem: React.FC<SelectItemProps> = ({ value, children, className, ...props }) => {
  return (
    <button
      className={`flex w-full items-center px-3 py-2 text-sm text-gray-700 transition-colors ${className || ''}`}
      value={value}
      {...props}
    >
      {children}
    </button>
  );
};

// 导出组件
export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
