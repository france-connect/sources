import deepFreeze from 'deep-freeze';
import { get, has, isString } from 'lodash';

import { NotYetInitialized, UnknownConfigurationNameError } from '../errors';
import { Config } from '../interfaces';

export class ConfigService {
  private static appConfig: Config | undefined;

  static initialize(appConfig: Config): void {
    if (!ConfigService.appConfig) {
      // No one should be able to override configuration after startup
      ConfigService.appConfig = deepFreeze(appConfig);
    }
  }

  /**
   * Public getter
   * Specify type in order to have static binding while using returned object
   * @param paths
   */
  static get<T>(paths: string): T {
    if (!ConfigService.appConfig) {
      throw new NotYetInitialized();
    }

    const isValidPaths = paths && isString(paths) && has(ConfigService.appConfig, paths);
    if (!isValidPaths) {
      throw new UnknownConfigurationNameError(paths);
    }

    const config = get(ConfigService.appConfig, paths);
    return config;
  }
}
