const description = Symbol('description');

export const DEFAULT_DESCRIPTION_VALUE = 'N/A';

export function Description(value = DEFAULT_DESCRIPTION_VALUE) {
  return function (target: any) {
    Reflect.defineMetadata(description, value, target);
    return target;
  };
}

Description.getDescription = function (target: any) {
  const value = Reflect.getMetadata(description, target.constructor);
  return value || DEFAULT_DESCRIPTION_VALUE;
};
