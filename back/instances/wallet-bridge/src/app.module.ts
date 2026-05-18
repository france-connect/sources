import { Module } from '@nestjs/common';

import { WalletBridgeModule } from '@fc/wallet-bridge';

@Module({
  imports: [WalletBridgeModule],
})
export class AppModule {}
