import { registerDecorator, ValidationOptions } from 'class-validator';

export function validateCog(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  return /^(?:2[AB]|[0-9]{2})[0-9]{3}$/.test(value);
}

/**
 * Check if the field is a "COG" @see https://www.data.gouv.fr/fr/datasets/code-officiel-geographique-cog/
 * @param validationOptions
 */
export function IsCog(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isCog',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: validateCog,
      },
    });
  };
}
