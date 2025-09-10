import React from 'react';
import { Spinner as RadixSpinner } from '@radix-ui/themes';

type SpinnerProps = {
  size?: '1' | '2' | '3';
  centered?: boolean;
};

export function Spinner({ size = '3', centered = true }: SpinnerProps) {
  if (centered) {
    return (
      <div className="flex justify-center items-center py-12">
        <RadixSpinner size={size} />
      </div>
    );
  }
  
  return <RadixSpinner size={size} />;
}