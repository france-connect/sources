import { Injectable } from '@nestjs/common';

import { FunctionSafe } from '@fc/common';

import { EudiCogInvalidResolverNameException } from '../exceptions';

@Injectable()
export abstract class BaseResolver {
  getResolver(resolverName: string): FunctionSafe {
    if (typeof this[resolverName] !== 'function') {
      throw new EudiCogInvalidResolverNameException(resolverName);
    }

    return this[resolverName].bind(this);
  }
}
