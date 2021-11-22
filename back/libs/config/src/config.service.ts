import { plainToClass } from 'class-transformer';
import { isString, validateSync, ValidatorOptions } from 'class-validator';
import * as deepFreeze from 'deep-freeze';
import * as lodash from 'lodash';

import { Injectable } from '@nestjs/common';

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
    const object = plainToClass(schema, config);
    const errors = validateSync(object, validationOptions);

    if (errors.length > 0) {
      console.error('Invalid configuration Error');
      console.error(JSON.stringify(errors, null, 2));
      console.error('Exiting app');
      process.exit(1);
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
