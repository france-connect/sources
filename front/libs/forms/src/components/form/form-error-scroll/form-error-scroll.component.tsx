import React from 'react';
import { FormSpy } from 'react-final-form';

import { useScrollToElement } from '@fc/common';

interface FormErrorScrollComponentProps {
  active?: boolean;
  elementClassName: string;
}

export const FormErrorScrollComponent = React.memo(
  ({ active = false, elementClassName }: FormErrorScrollComponentProps) => {
    const scrollToElement = useScrollToElement(elementClassName);

    return <FormSpy subscription={{ submitFailed: active }} onChange={scrollToElement} />;
  },
);

FormErrorScrollComponent.displayName = 'FormErrorScrollComponent';
