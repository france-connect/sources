import React from 'react';
import { FormSpy } from 'react-final-form';

import { useScrollToElement } from '@fc/common';

interface FormErrorScrollComponentProps {
  active?: boolean;
}

export const FormErrorScrollComponent = React.memo(
  ({ active = false }: FormErrorScrollComponentProps) => {
    const scrollToElement = useScrollToElement('.fr-message--error');

    return <FormSpy subscription={{ submitFailed: active }} onChange={scrollToElement} />;
  },
);

FormErrorScrollComponent.displayName = 'FormErrorScrollComponent';
