import React from 'react';

const Skeleton = ({ className, variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-gray-200';

  const variants = {
    rectangular: '',
    circular: 'rounded-full',
    text: 'h-4 rounded',
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
    />
  );
};

export default Skeleton;