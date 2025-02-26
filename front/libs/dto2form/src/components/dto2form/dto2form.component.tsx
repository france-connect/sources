import { useMemo } from 'react';

import { sortByKey } from '@fc/common';
import { ConfigService } from '@fc/config';
import type { FormInterface } from '@fc/forms';
import { FormComponent } from '@fc/forms';

import { Options } from '../../enums';
import { useFormPreSubmit } from '../../hooks';
import type { BaseAttributes, DTO2FormConfig, FieldAttributes } from '../../interfaces';
import type { SchemaFieldType } from '../../types';
import { DTO2InputComponent } from '../dto2input/dto2input.component';
import { DTO2SectionComponent } from '../dto2section';

interface DTO2FormComponentProps<T> extends FormInterface<T> {
  // @TODO this should be refactored
  schema: BaseAttributes[];
}

export function DTO2FormComponent<T extends Record<string, unknown>>({
  config,
  initialValues,
  onSubmit,
  onValidate,
  schema,
}: DTO2FormComponentProps<T>) {
  const { validateOnSubmit } = ConfigService.get<DTO2FormConfig>(Options.CONFIG_NAME);
  const validateFunc = validateOnSubmit ? onValidate : undefined;

  const preSubmitHandler = useFormPreSubmit(onSubmit);

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
  }, [schema, config.id]);

  return (
    <FormComponent
      config={config}
      initialValues={initialValues}
      onSubmit={preSubmitHandler}
      onValidate={validateFunc}>
      {fields}
    </FormComponent>
  );
}
