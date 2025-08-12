import React from 'react';

import type { FieldMessage } from '../../../interfaces';
import { MessageElement } from '../message';

interface MessagesElementProps {
  id: string;
  dataTestId?: string;
  messages?: FieldMessage[];
}

export const MessagesElement = React.memo(
  ({ dataTestId = undefined, id, messages = [] }: MessagesElementProps) => {
    const maxPriority = Math.max(...messages.map((m) => m.priority));

    const filteredMessages = messages.filter((m) => m.priority === maxPriority);

    return (
      <div aria-live="assertive" className="fr-messages-group" id={id}>
        {filteredMessages.map((message, index) => {
          const { content, level } = message;
          const key = `message-${level}-element-${id}-${index}`;
          return (
            <MessageElement
              key={key}
              content={content}
              dataTestId={dataTestId}
              id={id}
              level={level}
            />
          );
        })}
      </div>
    );
  },
);

MessagesElement.displayName = 'MessagesElement';
