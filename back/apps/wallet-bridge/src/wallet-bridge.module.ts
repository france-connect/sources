import { Module } from '@nestjs/common';

import { WalletBridgeController } from './controllers/wallet-bridge.controller';

@Module({
  controllers: [WalletBridgeController],
})
export class WalletBridgeModule {}
