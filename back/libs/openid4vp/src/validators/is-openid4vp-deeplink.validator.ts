import { ValidateBy, ValidationOptions } from 'class-validator';

import { NestJsDependencyInjectionWrapper, validateDto } from '@fc/common';
import { LoggerService } from '@fc/logger';

import { Openid4vpDeepLinkDto } from '../dto';

export const IS_OPENID4VP_DEEP_LINK = 'IsOpenid4vpDeepLink';

export async function isOpenid4vpDeepLink(values: URL): Promise<boolean> {
  const errors = await validateDto(values, Openid4vpDeepLinkDto, {
    whitelist: true,
  });

  if (errors.length > 0) {
    const logger = NestJsDependencyInjectionWrapper.get(LoggerService);
    logger.debug({ errors });

    return false;
  }

  return true;
}

export class IsOpenid4vpDeepLinkConstraint {
  // proxy function
  /* istanbul ignore next */
  async validate(values: URL): Promise<boolean> {
    return await isOpenid4vpDeepLink(values);
  }

  defaultMessage() {
    return 'The value must be a valid OpenID4VP deep link';
  }
}

// declarative code
/* istanbul ignore next */
export function IsOpenid4vpDeepLink(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  // declarative code
  /* istanbul ignore next */
  return ValidateBy(
    {
      name: IS_OPENID4VP_DEEP_LINK,
      constraints: [],
      validator: new IsOpenid4vpDeepLinkConstraint(),
    },
    validationOptions,
  );
}
