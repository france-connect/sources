import { Test, TestingModule } from '@nestjs/testing';

import { WalletBridgeController } from './wallet-bridge.controller';

describe('WalletBridgeController', () => {
  let controller: WalletBridgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletBridgeController],
    }).compile();

    controller = module.get<WalletBridgeController>(WalletBridgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('walletBridge()', () => {
    it('should return a string', () => {
      expect(controller.walletBridge()).toStrictEqual('Eh coucou !');
    });
  });
});
