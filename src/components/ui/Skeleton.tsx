import React from 'react';
import { Box, Flex } from '@radix-ui/themes';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <Flex direction="column" gap="2">
        {Array.from({ length: lines }).map((_, index) => (
          <Box
            key={index}
            className={`${baseClasses} ${variantClasses.text} ${className}`}
            style={{
              width: index === lines - 1 ? '75%' : width,
              height
            }}
          />
        ))}
      </Flex>
    );
  }

  return (
    <Box
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

// Specialized skeleton components for common use cases
export const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="p-3">
        <Skeleton height="1.25rem" />
      </td>
    ))}
  </tr>
);

export const CardSkeleton: React.FC = () => (
  <Box className="p-6 border border-gray-700 rounded-lg bg-gray-800">
    <Skeleton height="1.5rem" width="60%" className="mb-4" />
    <Skeleton variant="text" lines={3} />
  </Box>
);

export const StatCardSkeleton: React.FC = () => (
  <Box className="p-4 border border-gray-700 rounded-lg bg-gray-800">
    <Skeleton height="1rem" width="40%" className="mb-2" />
    <Skeleton height="2rem" width="80%" />
  </Box>
);

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = '300px' }) => (
  <Box className="p-4 border border-gray-700 rounded-lg bg-gray-800">
    <Skeleton height="1.5rem" width="50%" className="mb-4" />
    <Skeleton height={height} className="rounded" />
  </Box>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <Flex direction="column" gap="3">
    {Array.from({ length: items }).map((_, index) => (
      <Flex key={index} align="center" gap="3" className="p-3 border border-gray-700 rounded">
        <Skeleton variant="circular" width="40px" height="40px" />
        <Flex direction="column" gap="2" style={{ flex: 1 }}>
          <Skeleton height="1rem" width="60%" />
          <Skeleton height="0.875rem" width="40%" />
        </Flex>
      </Flex>
    ))}
  </Flex>
);