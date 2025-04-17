import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { ArrayAtLeastOneStringConstraint } from '@fc/common';
import { ConfigService } from '@fc/config';

import { OidcProviderConfig } from '../dto';
import { OidcProviderPrompt } from '../enums';

@ValidatorConstraint()
@Injectable()
export class IsValidPromptConstraint extends ArrayAtLeastOneStringConstraint {
  configValues: OidcProviderPrompt[];
  constructor(public readonly config: ConfigService) {
    super();
    const { allowedPrompt } =
      this.config.get<OidcProviderConfig>('OidcProvider');
    this.configValues = allowedPrompt;
  }

  getAllowedList(_args: ValidationArguments): string[] {
    return this.configValues;
  }
}

export function IsValidPrompt(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsValidPrompt',
      constraints: [],
      validator: IsValidPromptConstraint,
    },
    validationOptions,
  );
}
