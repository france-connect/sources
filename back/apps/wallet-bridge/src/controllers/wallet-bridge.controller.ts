import { Controller, Get } from '@nestjs/common';

@Controller()
export class WalletBridgeController {
  @Get()
  walletBridge(): string {
    return 'Eh coucou !';
  }
}
