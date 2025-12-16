import React from 'react';

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg';
  weight?: '300' | '400' | '500' | '600' | '700';
  color?: string;
  center?: boolean;
  noWrap?: boolean;
  className?: string;
}

export default function Text({
  children,
  size = 'sm',
  weight = '400',
  color,
  center = false,
  noWrap = false,
  className = '',
}: TextProps) {
  const sizeClasses = {
    xs: 'text-[0.7rem]',
    sm: 'text-[0.8rem]',
    base: 'text-[1rem]',
    lg: 'text-[1.1rem]',
  };

  const centerClass = center ? 'text-center' : '';
  const nowrapClass = noWrap ? 'whitespace-nowrap' : '';
  const colorStyle = color ? { color } : {};

  return (
    <span
      className={`font-sans ${sizeClasses[size]} font-[${weight}] ${centerClass} ${nowrapClass} ${className}`}
      style={colorStyle}
    >
      {children}
    </span>
  );
}
