import React from 'react';
import { FormSpy } from 'react-final-form';

import { useScrollToElement } from '@fc/common';

export const FormErrorScrollComponent = React.memo(() => {
  const { scrollToElement } = useScrollToElement('.fr-message--error');

  return (
    <FormSpy
      subscription={{ modifiedSinceLastSubmit: true, submitFailed: true }}
      onChange={() => {
        scrollToElement();
      }}
    />
  );
});

FormErrorScrollComponent.displayName = 'FormErrorScrollComponent';
