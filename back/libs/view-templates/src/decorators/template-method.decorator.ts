import { Instantiable } from '@fc/common';

import { ViewTemplateConflictingAliasException } from '../exceptions';
import { InternalMappingInterface } from '../interfaces';

export function TemplateMethod(alias: string): MethodDecorator {
  return (provider: Instantiable | object, methodName: string): void => {
    TemplateMethod.checkConflictingAliasName(alias);

    TemplateMethod.internalMapping.push({ alias, provider, methodName });
  };
}

TemplateMethod.checkConflictingAliasName = function (newAlias: string): void {
  const isConflictingAlias = TemplateMethod.internalMapping.some(
    ({ alias }) => alias === newAlias,
  );

  if (isConflictingAlias) {
    throw new ViewTemplateConflictingAliasException(newAlias);
  }
};

TemplateMethod.internalMapping = [] as InternalMappingInterface[];
TemplateMethod.getList = (): InternalMappingInterface[] =>
  TemplateMethod.internalMapping;
