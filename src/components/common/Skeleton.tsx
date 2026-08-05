import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  height?: string | number;
  width?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  height,
  width,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-3/4 rounded-md';
      case 'circular':
        return 'rounded-full w-10 h-10';
      case 'card':
        return 'rounded-2xl h-32 w-full';
      case 'rectangular':
      default:
        return 'rounded-xl h-20 w-full';
    }
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 ${getVariantStyles()} ${className}`}
      style={{
        height: height,
        width: width,
      }}
    />
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between h-38">
      <div className="flex items-center justify-between">
        <Skeleton width="40%" height={16} />
        <Skeleton variant="circular" width={36} height={36} />
      </div>
      <div className="space-y-2 mt-3">
        <Skeleton width="70%" height={32} />
        <Skeleton width="50%" height={14} />
      </div>
    </div>
  );
};

export const CardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl glass-panel space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="circular" width={32} height={32} />
          </div>
          <Skeleton height={28} width="60%" />
          <Skeleton variant="text" width="80%" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full glass-panel rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <Skeleton width="200px" height="36px" className="rounded-xl" />
        <Skeleton width="120px" height="36px" className="rounded-xl" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton variant="circular" width={36} height={36} />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="50%" />
          </div>
          <Skeleton width="80px" height="24px" className="rounded-lg" />
        </div>
      ))}
    </div>
  );
};
