import { ValidationArguments, getMetadataStorage } from 'class-validator';

/**
 * Helper to mock validator in class-validator
 *
 * Heavily inspired from this github issue:
 * @see https://github.com/typestack/class-validator/issues/494
 *
 * @param target DTO class
 * @param property object's property name
 * @param name Constraint class name, typically the name of the validator + "Constraint"
 * @example
 *
 *  to mock the ̀`MyDecorator`  validator on the  `myPropertyName`  property of  `MyClassDTO`  DTO, use:
 *
 *  mockValidator(
 *   MyClassDTO,
 *   'myPropertyName',
 *   'MyDecoratorConstraint',
 * ).mockImplementation(() => true);
 *
 *
 * @returns jest.SpyInstance
 */
export function mockValidator<
  T extends abstract new (...args: unknown[]) => unknown,
>(
  target: T,
  property: keyof InstanceType<T>,
  name: string,
): jest.SpyInstance<boolean, [unknown, ValidationArguments]> {
  const storage = getMetadataStorage();
  const metadata = storage.getTargetValidationMetadatas(
    target,
    target.name,
    true,
    true,
  );

  const metadatum = metadata.find((a) => {
    const cls = storage.getTargetValidatorConstraints(a.constraintCls);

    return a.propertyName === property && cls.find((a) => a.name === name);
  });

  if (!metadatum) {
    throw new Error(
      `No metadata found for ${target.name} with ${name}, 
      check your arguments (is the constraint name correct?)`,
    );
  }

  return jest.spyOn(
    metadatum.constraintCls.prototype,
    'validate',
  ) as jest.SpyInstance<boolean, [unknown, ValidationArguments]>;
}
