import React from 'react';

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | string;
  weight?: '300' | '400' | '500' | '600' | '700' | string;
  color?: string;
  center?: boolean;
  noWrap?: boolean;
  className?: string;
  mb?: string;
}

export default function Text({
  children,
  size = 'sm',
  weight = '400',
  color,
  center = false,
  noWrap = false,
  className = '',
  mb,
}: TextProps) {
  const sizeClasses: Record<string, string> = {
    xs: 'text-[0.7rem]',
    sm: 'text-[0.8rem]',
    base: 'text-[1rem]',
    lg: 'text-[1.1rem]',
  };

  const weightClasses: Record<string, string> = {
    '300': 'font-light',
    '400': 'font-normal',
    '500': 'font-medium',
    '600': 'font-semibold',
    '700': 'font-bold',
  };

  const centerClass = center ? 'text-center' : '';
  const nowrapClass = noWrap ? 'whitespace-nowrap' : '';
  
  // Handle custom size (like "0.9rem") vs predefined size
  const isCustomSize = typeof size === 'string' && (size.includes('rem') || size.includes('px'));
  const sizeClass = isCustomSize ? '' : (sizeClasses[size] || sizeClasses.sm);
  const customSizeStyle = isCustomSize ? { fontSize: size } : {};
  
  // Handle weight
  const weightClass = weightClasses[weight] || 'font-normal';
  
  const colorStyle = color ? { color } : {};
  const marginStyle = mb ? { marginBottom: mb } : {};

  return (
    <span
      className={`font-sans ${sizeClass} ${weightClass} ${centerClass} ${nowrapClass} ${className}`}
      style={{ ...colorStyle, ...customSizeStyle, ...marginStyle }}
    >
      {children}
    </span>
  );
}
