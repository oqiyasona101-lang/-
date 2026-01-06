import React from 'react';

interface BallProps {
  num: number;
  color: 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

export const Ball: React.FC<BallProps> = ({ num, color, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base font-bold',
  };

  const colorClasses = {
    red: 'bg-red-500 text-white shadow-red-200',
    blue: 'bg-blue-500 text-white shadow-blue-200',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full flex items-center justify-center 
        shadow-md shrink-0 font-mono
      `}
    >
      {num.toString().padStart(2, '0')}
    </div>
  );
};