import { ModuleRef } from '@nestjs/core';

import { Instantiable } from '@fc/common';

import {
  FeatureHandlerEmptyException,
  FeatureHandlerUnregisteredException,
} from '../exceptions';
import { FeatureHandlerNoHandler } from '../handlers';
import { IFeatureHandler } from '../interfaces';
import { isNotValidFeatureHandlerKey } from '../utils';

// Register all Class used for Feature in apps
const internalMapping = new Map<string, Instantiable<IFeatureHandler>>();

/**
 * Decorator to register class
 * @param key {string} key to register the Feature
 */
export function FeatureHandler<K extends string>(
  key: K,
): <TFunction extends Instantiable<IFeatureHandler>>(
  target: TFunction,
) => void | TFunction {
  return (target) => {
    internalMapping.set(key, target);
    return target;
  };
}

/**
 * Retrieve the instatiated class of a given feature handler key.
 *
 * @param {string} key Unique feature handler mapped name.
 * @param {object} ctx context given by te parent caller, usally = this.
 * @returns {IFeatureHandler} Instatiated class with IFeatureHandler
 */

FeatureHandler.get = function <T extends IFeatureHandler>(
  key: string,
  ctx: { moduleRef: ModuleRef },
): T {
  if (isNotValidFeatureHandlerKey(key)) {
    throw new FeatureHandlerEmptyException();
  }

  if (key === null) {
    return new FeatureHandlerNoHandler() as T;
  }

  const klass = internalMapping.get(key);
  if (!klass) {
    throw new FeatureHandlerUnregisteredException();
  }
  return ctx.moduleRef.get(klass);
};

/**
 * Retrieve the decorator declarations mapping.
 *
 * @returns {Array<string>}
 */
FeatureHandler.getAll = function (): Array<string> {
  return Array.from(internalMapping.keys());
};

FeatureHandler.getInternalMappingForTestingPurposes =
  function (): typeof internalMapping {
    return internalMapping;
  };
