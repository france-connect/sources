import React from 'react';

interface MessageErrorElementProps {
  error: string | string[];
  id: string;
  dataTestId?: string;
}

export const MessageErrorElement = React.memo((props: MessageErrorElementProps) => {
  const { dataTestId, error, id } = props;
  const errors = Array.isArray(error) ? error : [error];

  return errors.map((err, index) => {
    const key = `message-error-element-${id}-${index}`;
    return (
      <p
        key={key}
        className="fr-message fr-message--error"
        data-testid={dataTestId}
        id={`${id}-messages`}>
        {err}
      </p>
    );
  });
});

MessageErrorElement.displayName = 'MessageErrorElement';
