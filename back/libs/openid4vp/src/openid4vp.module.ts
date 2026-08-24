import { Module } from '@nestjs/common';

import { CryptographyModule } from '@fc/cryptography';
import { JwtModule } from '@fc/jwt';
import { MdocModule } from '@fc/mdoc';
import { RedisModule } from '@fc/redis';
import { SessionModule } from '@fc/session';

import {
  Openid4vpCryptoService,
  Openid4vpInteractionStatusService,
  Openid4vpRequestService,
  Openid4vpResponseService,
  Openid4vpService,
  Openid4vpSessionService,
} from './services';

@Module({
  imports: [
    CryptographyModule,
    JwtModule,
    MdocModule,
    RedisModule,
    SessionModule,
  ],
  providers: [
    Openid4vpService,
    Openid4vpInteractionStatusService,
    Openid4vpRequestService,
    Openid4vpResponseService,
    Openid4vpSessionService,
    Openid4vpCryptoService,
  ],
  exports: [Openid4vpService],
})
export class Openid4vpModule {}
