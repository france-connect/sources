import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import {
  InvalidHttpAuthTokenException,
  MissingHttpAuthTokenException,
} from '../exceptions';

const BEARER_PATTERN = /^Bearer ([\w-_.=+]{10,64})$/;

export function extractHttpAuthToken(value: string): undefined | string {
  const extract = value.match(BEARER_PATTERN);

  return extract ? extract[1] : undefined;
}

export const HttpAuthTokenDecorator = (
  _data: unknown,
  ctx: ExecutionContext,
) => {
  const { headers } = ctx.switchToHttp().getRequest();

  if (!headers.authorization) {
    throw new MissingHttpAuthTokenException();
  }

  const token = extractHttpAuthToken(headers.authorization);

  if (!token) {
    throw new InvalidHttpAuthTokenException();
  }

  return token;
};

export const HttpAuthToken = createParamDecorator(HttpAuthTokenDecorator);
