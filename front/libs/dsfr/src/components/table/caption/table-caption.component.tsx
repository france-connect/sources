import React from 'react';

interface TableCaptionComponentProps {
  caption: string;
}

export const TableCaptionComponent = React.memo(({ caption }: TableCaptionComponentProps) => (
  <caption>{caption}</caption>
));

TableCaptionComponent.displayName = 'TableCaptionComponent';
