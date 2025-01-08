import type { FieldTypes } from '@fc/forms';

import type { FieldAttributes } from '../interfaces/field-attributes.interface';
import type {
  SelectAttributes,
  SelectAttributesOption,
} from '../interfaces/select-attributes.interface';

export type JSONFieldType = (SelectAttributes | FieldAttributes) & {
  type: FieldTypes;
  disabled?: boolean;
  options?: SelectAttributesOption[];
};
