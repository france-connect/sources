import { useMemo } from 'react';

import { sortByKey } from '@fc/common';
import type { FormInterface } from '@fc/forms';
import { FormComponent, FormConfigContext } from '@fc/forms';
import type { HttpClientDataInterface } from '@fc/http-client';

import { useFormSubmit } from '../../hooks';
import type { BaseAttributes, FieldAttributes } from '../../interfaces';
import type { SchemaFieldType } from '../../types';
import { DTO2InputComponent } from '../dto2input/dto2input.component';
import { DTO2SectionComponent } from '../dto2section';

interface DTO2FormComponentProps<T extends HttpClientDataInterface> extends FormInterface<T> {
  // @TODO this should be refactored
  schema: BaseAttributes[];
  submitLabel?: string;
}

export const DTO2FormComponent = <T extends HttpClientDataInterface>({
  config,
  initialValues,
  onPostSubmit,
  onPreSubmit,
  onSubmit,
  onValidate,
  schema,
  submitLabel = undefined,
}: DTO2FormComponentProps<T>) => {
  const validateFunc = config.validateOnSubmit ? onValidate : undefined;

  const submitHandler = useFormSubmit(onSubmit, onPreSubmit, onPostSubmit);

  const fields = useMemo(() => {
    const sorter = sortByKey<SchemaFieldType>('order');
    return schema.sort(sorter).map((field) => {
      // @TODO this should be refactored
      // The way the section are built should be the same as the fields
      const isSection = field.type === 'section';
      const key = `dto2form::${config.id}::field::${field.type}::${field.name}`;
      if (isSection) {
        return <DTO2SectionComponent key={key} field={field} />;
      }
      // @TODO this should be refactored
      const fieldObject = field as FieldAttributes;
      return <DTO2InputComponent key={key} field={fieldObject} />;
    });
  }, [schema, config]);

  return (
    <FormConfigContext.Provider value={config}>
      <FormComponent<T>
        config={config}
        initialValues={initialValues}
        submitLabel={submitLabel}
        onSubmit={submitHandler}
        onValidate={validateFunc}>
        {fields}
      </FormComponent>
    </FormConfigContext.Provider>
  );
};
