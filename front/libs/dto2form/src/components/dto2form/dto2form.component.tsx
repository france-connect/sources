import { useMemo } from 'react';

import { sortByKey } from '@fc/common';
import type { FormInterface } from '@fc/forms';
import { FormComponent, FormConfigContext } from '@fc/forms';
import type { HttpClientDataInterface } from '@fc/http-client';

import { useFormSubmit } from '../../hooks';
import type { BaseAttributes, FieldAttributes } from '../../interfaces';
import type { SchemaFieldType } from '../../types';
import { Dto2InputComponent } from '../dto2input/dto2input.component';
import { Dto2SectionComponent } from '../dto2section';

interface Dto2FormComponentProps<T extends HttpClientDataInterface> extends FormInterface<T> {
  schema: BaseAttributes[];
}

export const Dto2FormComponent = <T extends HttpClientDataInterface>({
  config,
  initialValues,
  onPostSubmit,
  onPreSubmit,
  onSubmit,
  onValidate,
  schema,
}: Dto2FormComponentProps<T>) => {
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
        return <Dto2SectionComponent key={key} field={field} />;
      }
      // @TODO this should be refactored
      const fieldObject = field as FieldAttributes;
      return <Dto2InputComponent key={key} field={fieldObject} />;
    });
  }, [schema, config]);

  return (
    <FormConfigContext.Provider value={config}>
      <FormComponent<T>
        config={config}
        initialValues={initialValues}
        onSubmit={submitHandler}
        onValidate={validateFunc}>
        {fields}
      </FormComponent>
    </FormConfigContext.Provider>
  );
};
