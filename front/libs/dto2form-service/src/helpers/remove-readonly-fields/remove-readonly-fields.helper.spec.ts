import type { SchemaFieldType } from '@fc/dto2form';

import { removeReadOnlyFields } from './remove-readonly-fields.helper';

describe('removeReadOnlyFields', () => {
  it('should remove fields with readonly property set to true', () => {
    // Given
    const schema = [
      { name: 'field1', readonly: true },
      { name: 'field2', readonly: false },
      { name: 'field3' },
    ] as SchemaFieldType[];

    // When
    const result = removeReadOnlyFields(schema);

    // Then
    expect(result).toEqual([{ name: 'field2', readonly: false }, { name: 'field3' }]);
  });

  it('should keep fields without readonly property', () => {
    // Given
    const schema = [{ name: 'field1' }, { name: 'field2', readonly: false }] as SchemaFieldType[];

    // When
    const result = removeReadOnlyFields(schema);

    // Then
    expect(result).toEqual([{ name: 'field1' }, { name: 'field2', readonly: false }]);
  });
});
