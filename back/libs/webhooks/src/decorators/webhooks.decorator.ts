import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { WEBHOOKS_METADATA_TOKEN } from '../tokens';

export const Webhooks = (hookName: string) =>
  SetMetadata(WEBHOOKS_METADATA_TOKEN, hookName);

Webhooks.get = function (
  reflector: Reflector,
  ctx: ExecutionContext,
): string | null {
  const value = reflector.get<string>(
    WEBHOOKS_METADATA_TOKEN,
    ctx.getHandler(),
  );

  return value || null;
};
