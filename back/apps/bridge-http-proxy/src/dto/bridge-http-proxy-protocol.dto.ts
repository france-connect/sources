/* istanbul ignore file */

// Declarative code
import { IsEnum, IsNotEmptyObject } from 'class-validator';

import { BridgeProtocol, MessageType } from '@fc/hybridge-http-proxy';

export class BridgeHttpProxyProtocolDto implements BridgeProtocol<object> {
  @IsEnum(MessageType)
  readonly type: MessageType;

  @IsNotEmptyObject()
  readonly data: object;
}
