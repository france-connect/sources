import React from 'react';

import { getFieldMessagesId } from '../../../helpers';
import type { FieldMessage } from '../../../interfaces';
import { MessageElement } from '../message';

interface MessagesElementProps {
  id: string;
  messages?: FieldMessage[];
}

export const MessagesElement = React.memo(({ id, messages = [] }: MessagesElementProps) => {
  let filteredMessages: FieldMessage[] = [];

  if (messages.length > 0) {
    const maxPriority = Math.max(...messages.map((m) => m.priority));
    filteredMessages = messages.filter((m) => m.priority === maxPriority);
  }

  const messagesId = getFieldMessagesId(id);

  return (
    <div
      aria-live="assertive"
      className="fr-messages-group"
      data-testid={messagesId}
      id={messagesId}>
      {filteredMessages.map((message, index) => {
        const { content, level } = message;
        const messageId = `${id}-${level}-desc-${index}`;
        const key = `message-${level}-element-${id}-${index}`;
        return (
          <MessageElement
            key={key}
            content={content}
            dataTestId={messageId}
            id={messageId}
            level={level}
          />
        );
      })}
    </div>
  );
});

MessagesElement.displayName = 'MessagesElement';
