import { TransformFnParams } from 'class-transformer';

import { Openid4vpDeepLinkInterface } from '../interfaces';

type Value = Pick<TransformFnParams, 'value'>;

export function openId4vpDeepLink({
  value,
}: Value): Openid4vpDeepLinkInterface | undefined {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    return undefined;
  }
  const { protocol, searchParams } = parsed;

  const deepLink = {
    protocol,
    clientId: searchParams.get('client_id'),
    requestUri: searchParams.get('request_uri'),
    responseType: searchParams.get('response_type'),
    toString: () => value,
  };

  return deepLink as Openid4vpDeepLinkInterface;
}
