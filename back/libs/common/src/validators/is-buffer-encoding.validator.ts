import { ValidateBy } from 'class-validator';

export class IsBufferEncodingConstraint {
  validate(value: any): boolean {
    return Buffer.isEncoding(value);
  }
}

// declarative code
/* istanbul ignore next */
export function IsBufferEncoding(): PropertyDecorator {
  return ValidateBy({
    name: 'IsBufferEncoding',
    validator: IsBufferEncodingConstraint,
  });
}
