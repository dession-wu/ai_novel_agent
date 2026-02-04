import React from "react"

// 优化的Button组件实现
const Button = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
  // 基础样式 - 添加更精致的过渡和阴影
  const baseStyles = `
    inline-flex items-center justify-center whitespace-nowrap 
    rounded-lg text-sm font-medium 
    transition-all duration-200 ease-out
    focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-primary/50 focus-visible:ring-offset-2 
    disabled:pointer-events-none disabled:opacity-50
    active:scale-[0.98]
    shadow-sm hover:shadow-md
  `;
  
  // 变体样式 - 优化颜色和效果
  const variantStyles = {
    default: `
      bg-gradient-to-r from-primary to-primary/90 
      text-primary-foreground 
      hover:from-primary/90 hover:to-primary/80
      shadow-primary/25 hover:shadow-primary/30
      btn-shine
    `,
    destructive: `
      bg-gradient-to-r from-red-600 to-red-500 
      text-white 
      hover:from-red-500 hover:to-red-400
      shadow-red-500/25 hover:shadow-red-500/30
    `,
    outline: `
      border-2 border-border bg-background 
      hover:bg-accent hover:border-primary/30
      text-foreground
      shadow-none hover:shadow-sm
    `,
    secondary: `
      bg-gradient-to-r from-secondary to-secondary/80 
      text-secondary-foreground 
      hover:from-secondary/80 hover:to-secondary/60
      shadow-secondary/20 hover:shadow-secondary/30
    `,
    ghost: `
      hover:bg-accent hover:text-accent-foreground
      shadow-none
    `,
    link: `
      text-primary underline-offset-4 hover:underline
      shadow-none hover:shadow-none
      hover:scale-100
    `
  };
  
  // 尺寸样式 - 优化圆角和padding
  const sizeStyles = {
    default: 'h-10 px-5 py-2',
    sm: 'h-9 rounded-md px-4 text-xs',
    lg: 'h-12 rounded-xl px-8 text-base',
    icon: 'h-10 w-10 rounded-lg'
  };
  
  // 组合样式
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`;
  
  return (
    <button
      className={combinedStyles}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button"

export { Button }
