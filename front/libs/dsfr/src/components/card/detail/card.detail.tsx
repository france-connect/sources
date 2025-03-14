import classnames from 'classnames';
import React from 'react';

interface CardDetailComponentProps {
  content: string;
  dataTestId?: string | undefined;
  className?: string | undefined;
}

export const CardDetailComponent = React.memo(
  ({ className = undefined, content, dataTestId = undefined }: CardDetailComponentProps) => (
    <div className={classnames('fr-card__detail', className)} data-testid={dataTestId}>
      {content}
    </div>
  ),
);

CardDetailComponent.displayName = 'CardDetailComponent';
