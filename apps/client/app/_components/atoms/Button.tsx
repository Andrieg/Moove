"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'transparent';
  size?: 'small' | 'default';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  noShadow?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'secondary',
  size = 'default',
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
  noShadow = false,
}: ButtonProps) {
  const baseClasses = 'font-semibold uppercase transition-all duration-200 outline-none font-sans border-0';
  
  const variantClasses = {
    primary: `bg-gradient-to-br from-[#429FBA] to-[#217E9A] text-white ${noShadow ? '' : 'shadow-[0px_4px_20px_rgba(59,152,179,0.3)]'}`,
    secondary: `bg-white text-[#308FAB] ${noShadow ? '' : 'shadow-[0px_4px_20px_rgba(59,152,179,0.3)]'}`,
    outline: 'bg-transparent border-2 border-white text-white shadow-none',
    transparent: 'bg-transparent border border-[#308FAB] text-[#308FAB] shadow-none',
  };

  const sizeClasses = {
    small: 'px-4 py-1.5 text-[0.8rem] rounded-full',
    default: 'px-6 py-3 text-[1rem] rounded-full',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]';

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
}
