import classnames from 'classnames';
import React from 'react';

import classes from './message.module.scss';

interface MessageElementProps {
  content: string;
  id: string;
  level: string;
  dataTestId?: string;
}

export const MessageElement = React.memo(
  ({ content, dataTestId, id, level }: MessageElementProps) => (
    <p
      className={classnames(classes.message, `fr-message fr-message--${level}`)}
      data-testid={dataTestId}
      id={`${id}-messages`}>
      {content}
    </p>
  ),
);

MessageElement.displayName = 'MessageElement';
