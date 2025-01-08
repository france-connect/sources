import { useMemo } from 'react';

import { sortByKey } from '@fc/common';
import type { FormPropsInterface } from '@fc/forms';
import { FormComponent } from '@fc/forms';

import type { JSONFieldType } from '../../types';
import { DTO2FieldComponent } from '../dto2field/dto2field.component';

interface DTO2FormComponentProps<T> extends FormPropsInterface<T> {
  schema: JSONFieldType[];
}

export function DTO2FormComponent<T>({
  config,
  initialValues,
  onSubmit,
  onValidate,
  schema,
}: DTO2FormComponentProps<T>) {
  const fields = useMemo(() => {
    const sorter = sortByKey<JSONFieldType>('order');
    return schema.sort(sorter).map((field) => {
      const key = `form::${config.id}::field::${field.type}::${field.name}`;
      return <DTO2FieldComponent key={key} field={field} />;
    });
  }, [schema, config.id]);

  return (
    <FormComponent
      config={config}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onValidate={onValidate}>
      {fields}
    </FormComponent>
  );
}
