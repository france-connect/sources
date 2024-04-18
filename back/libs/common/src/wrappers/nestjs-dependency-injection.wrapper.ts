import { useContainer } from 'class-validator';

import { INestApplicationContext } from '@nestjs/common';

import { TypeOrToken } from '../types';

export class NestJsDependencyInjectionWrapper {
  static container: INestApplicationContext;

  /**
   * Set the NestJS dependency injection container
   */
  static use(container: INestApplicationContext) {
    NestJsDependencyInjectionWrapper.container = container;

    NestJsDependencyInjectionWrapper.initiateClassValidator(container);
  }

  /**
   * Get a dependency from NestJS dependency injection container
   */
  static get<T>(typeOrToken: TypeOrToken<T>, strict: boolean = false): T {
    return NestJsDependencyInjectionWrapper.container.get<T>(typeOrToken, {
      strict,
    });
  }

  static initiateClassValidator(container: INestApplicationContext) {
    /**
     * Tell the module "class-validator" to use NestJS dependency injection
     * @see https://github.com/typestack/class-validator#using-service-container
     * @see https://github.com/nestjs/nest/issues/528#issuecomment-382330137
     * @see https://github.com/nestjs/nest/issues/528#issuecomment-403212561
     */
    useContainer(container, { fallbackOnErrors: true });
  }
}
