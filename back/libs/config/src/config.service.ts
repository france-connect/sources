import { plainToInstance } from 'class-transformer';
import { isString, validateSync, ValidatorOptions } from 'class-validator';
import * as deepFreeze from 'deep-freeze';
import * as lodash from 'lodash';

import { Injectable } from '@nestjs/common';

/**
 * Config service being manually instanciated (in main.ts), nest dependencies
 * are not working, therefore, we can't go through barrel files,
 * but need to specify the full path to the helper
 */
import { AppHelper } from '@fc/app/helpers/app-helper';
import { getDtoErrors } from '@fc/common/helpers/dto-validation';

import { UnknownConfigurationNameError } from './errors';
import { IConfigOptions } from './interfaces';

export const validationOptions: ValidatorOptions = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  skipMissingProperties: false,
  whitelist: true,
};

@Injectable()
export class ConfigService {
  private readonly configuration: unknown;

  constructor({ config, schema }: IConfigOptions) {
    ConfigService.validate(config, schema);

    // No one should be able to override configuration after startup
    this.configuration = deepFreeze(config);
  }

  private static validate(config, schema) {
    const object = plainToInstance(schema, config);
    const errors = validateSync(object, validationOptions);

    if (errors.length > 0) {
      console.error('Invalid configuration Error');
      console.error(getDtoErrors(errors));
      console.error('Exiting app');
      AppHelper.shutdown();
    }
  }

  /**
   * Public getter
   * Specify type in order to have static binding while using returned object
   * @param paths
   */
  get<T>(paths: string): T {
    const isValidPaths = isString(paths) && paths.length > 0;
    const config = lodash.get(this.configuration, paths, null);
    if (!isValidPaths || !config) {
      const msg = `Asked unknown configuration: <${paths}>`;
      throw new UnknownConfigurationNameError(msg);
    }
    return config;
  }
}
