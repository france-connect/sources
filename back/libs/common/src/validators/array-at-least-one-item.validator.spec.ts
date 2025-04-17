import { IsNumber, IsString } from 'class-validator';

import {
  arrayAtLeastOneItem,
  ArrayAtLeastOneItemConstraint,
} from './array-at-least-one-item.validator';

class ItemDto {
  constructor(args: Record<string, unknown>) {
    Object.entries(args).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  @IsString()
  readonly foo: string;

  @IsNumber()
  readonly bar: number;

  [key: string]: unknown;
}

const validItem1 = new ItemDto({
  foo: 'tball',
  bar: 2,
  other: 'value',
});
const validItem2 = new ItemDto({
  foo: 'tball',
  bar: 2,
});
const invalidItem1 = new ItemDto({
  foo: 'tball',
});
const invalidItem2 = new ItemDto({
  foo: 0,
  bar: 'rage',
});

describe('arrayAtLeastOneItem', () => {
  it('should return "true" if the array includes one valid item', () => {
    // Given
    const array = [validItem1];

    // When
    const valid = arrayAtLeastOneItem(array);

    // Then
    expect(valid).toStrictEqual(true);
  });

  it('should return "true" if the array includes one valid item and one invalid item', () => {
    // Given
    const array = [invalidItem1, validItem1];

    // When
    const valid = arrayAtLeastOneItem(array);

    // Then
    expect(valid).toStrictEqual(true);
  });

  it(`should return "false" if the array doesn't include a valid item`, () => {
    // Given
    const array = [invalidItem1, invalidItem2];

    // When
    const valid = arrayAtLeastOneItem(array);

    // Then
    expect(valid).toStrictEqual(false);
  });

  it('should return "false" if the array is empty', () => {
    // Given
    const array = [];

    // When
    const valid = arrayAtLeastOneItem(array);

    // Then
    expect(valid).toStrictEqual(false);
  });

  it(`should return "false" if the array doesn't contain an object`, () => {
    // Given
    const array = ['test'] as unknown as object[];

    // When
    const valid = arrayAtLeastOneItem(array);

    // Then
    expect(valid).toStrictEqual(false);
  });
});

describe('ArrayAtLeastOneItemConstraint', () => {
  let constraint;

  beforeEach(() => {
    constraint = new ArrayAtLeastOneItemConstraint();
  });

  describe('validate', () => {
    it('should return "true" if the array includes one valid item', () => {
      // Given
      const value = [validItem1];

      // When
      const valid = constraint.validate(value);

      // Then
      expect(valid).toStrictEqual(true);
    });

    it('should return "true" if the array includes only valid items', () => {
      // Given
      const value = [validItem1, validItem2];

      // When
      const valid = constraint.validate(value);

      // Then
      expect(valid).toStrictEqual(true);
    });

    it('should return "true" if the array includes a valid item and other invalid item', () => {
      // Given
      const value = [validItem1, invalidItem2];

      // When
      const valid = constraint.validate(value);

      // Then
      expect(valid).toStrictEqual(true);
    });

    it(`should return "false" if the array doesn't include a valid item`, () => {
      // Given
      const value = [invalidItem1, invalidItem2];

      // When
      const valid = constraint.validate(value);

      // Then
      expect(valid).toStrictEqual(false);
    });

    it('should return "false" the value is not an array', () => {
      // Given
      const value = 'Not an array';

      // When
      const valid = constraint.validate(value);

      // Then
      expect(valid).toStrictEqual(false);
    });

    it('should return "false" the value is an empty array', () => {
      // Given
      const value = [];

      // When
      const valid = constraint.validate(value);

      // Then
      expect(valid).toStrictEqual(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return an error message', () => {
      // When
      const message = constraint.defaultMessage();

      // Then
      expect(message).toStrictEqual("The array doesn't contain a valid item.");
    });
  });
});
