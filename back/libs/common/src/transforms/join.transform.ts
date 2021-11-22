import { TransformFnParams, TransformOptions } from 'class-transformer';
/**
 * @todo Remove this internal API coupling or make it reliable
 * The defaultMetadataStorage is a class-transformer internal API that can be broken at any time.
 * An issue is open on github to ask the maintainer to give a public API for this purpose,
 * @see https://github.com/typestack/class-transformer/issues/563
 */
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';

export function doJoin(joiner = ',') {
  return ({ value }: Partial<TransformFnParams>) => {
    return !!value || value === false ? Array.from(value).join(joiner) : null;
  };
}

// declarative code
/* istanbul ignore next */
export function Join(
  joiner: string,
  options: TransformOptions = {},
): PropertyDecorator {
  const transformFn = doJoin(joiner);

  return function (target: any, propertyName: string | symbol): void {
    defaultMetadataStorage.addTransformMetadata({
      target: target.constructor,
      propertyName: propertyName as string,
      transformFn,
      options,
    });
  };
}
