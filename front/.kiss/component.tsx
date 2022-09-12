import React from 'react';

interface DumbComponentProps {
  className: string;
}

export const DumbComponent: React.FC<DumbComponentProps> = React.memo(
  ({ className }: DumbComponentProps) => {
    return <div />;
  },
);

DumbComponent.displayName = 'DumbComponent';
