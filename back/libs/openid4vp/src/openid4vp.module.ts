import { Module } from '@nestjs/common';

import { CryptographyModule } from '@fc/cryptography';
import { JwtModule } from '@fc/jwt';
import { MdocModule } from '@fc/mdoc';
import { RedisModule } from '@fc/redis';

import {
  Openid4vpCryptoService,
  Openid4vpRequestService,
  Openid4vpResponseService,
  Openid4vpService,
  Openid4vpSessionService,
} from './services';

@Module({
  imports: [RedisModule, CryptographyModule, JwtModule, MdocModule],
  providers: [
    Openid4vpService,
    Openid4vpRequestService,
    Openid4vpResponseService,
    Openid4vpSessionService,
    Openid4vpCryptoService,
  ],
  exports: [Openid4vpService],
})
export class Openid4vpModule {}
