import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FLOW_STEP_FORBID_REFRESH_METADATA } from '../tokens';

export const ForbidRefresh = () =>
  SetMetadata(FLOW_STEP_FORBID_REFRESH_METADATA, true);

ForbidRefresh.get = function (
  reflector: Reflector,
  ctx: ExecutionContext,
): string {
  const value = reflector.get<string>(
    FLOW_STEP_FORBID_REFRESH_METADATA,
    ctx.getHandler(),
  );

  return value;
};
