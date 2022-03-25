import React from 'react';

interface DumbComponentProps {
  className: string;
}

export const DumbComponent = React.memo(({ className }: DumbComponentProps) => {
  return <div />;
});

DumbComponent.displayName = 'DumbComponent';
