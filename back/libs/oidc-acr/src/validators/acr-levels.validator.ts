import { registerDecorator } from 'class-validator';

export function validate(value: unknown) {
  if (typeof value === 'object') {
    return Object.values(value).every((level) => typeof level === 'number');
  }
  return false;
}

// This is a declarative function with no logic to test
/* istanbul ignore next */
export function AcrLevels() {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'AcrLevels',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { message: 'Invalid ACR levels' },
      validator: {
        validate,
      },
    });
  };
}
