import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | string;
  weight?: '400' | '500' | '600' | '700' | string;
  color?: string;
  center?: boolean;
  noWrap?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Title({
  children,
  size = 'xl',
  weight = '700',
  color,
  center = false,
  noWrap = false,
  className = '',
  onClick,
}: TitleProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'text-[1rem]',
    base: 'text-[1.1rem]',
    lg: 'text-[1.3rem]',
    xl: 'text-[1.5rem]',
    '2xl': 'text-[1.8rem]',
    '3xl': 'text-[2rem]',
  };

  const weightClasses: Record<string, string> = {
    '400': 'font-normal',
    '500': 'font-medium',
    '600': 'font-semibold',
    '700': 'font-bold',
  };

  const centerClass = center ? 'text-center' : '';
  const nowrapClass = noWrap ? 'whitespace-nowrap' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';
  
  // Handle custom size (like "1.3rem") vs predefined size
  const isCustomSize = size.includes('rem') || size.includes('px');
  const sizeClass = isCustomSize ? '' : (sizeClasses[size] || sizeClasses.xl);
  const customSizeStyle = isCustomSize ? { fontSize: size } : {};
  
  // Handle weight
  const weightClass = weightClasses[weight] || 'font-bold';
  
  const colorStyle = color ? { color } : {};

  return (
    <span
      className={`font-sans ${sizeClass} ${weightClass} ${centerClass} ${nowrapClass} ${clickClass} ${className}`}
      style={{ ...colorStyle, ...customSizeStyle }}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
