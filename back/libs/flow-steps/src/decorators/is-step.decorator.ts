import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FLOW_STEP_IS_STEP_METADATA } from '../tokens';

export const IsStep = () => SetMetadata(FLOW_STEP_IS_STEP_METADATA, true);

IsStep.get = function (reflector: Reflector, ctx: ExecutionContext): string {
  const value = reflector.get<string>(
    FLOW_STEP_IS_STEP_METADATA,
    ctx.getHandler(),
  );

  return value;
};
