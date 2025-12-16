import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: '400' | '500' | '600' | '700';
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
  const sizeClasses = {
    sm: 'text-[1rem]',
    base: 'text-[1.1rem]',
    lg: 'text-[1.3rem]',
    xl: 'text-[1.5rem]',
    '2xl': 'text-[1.8rem]',
    '3xl': 'text-[2rem]',
  };

  const centerClass = center ? 'text-center' : '';
  const nowrapClass = noWrap ? 'whitespace-nowrap' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';
  const colorStyle = color ? { color } : {};

  return (
    <span
      className={`font-sans ${sizeClasses[size]} font-[${weight}] ${centerClass} ${nowrapClass} ${clickClass} ${className}`}
      style={colorStyle}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
