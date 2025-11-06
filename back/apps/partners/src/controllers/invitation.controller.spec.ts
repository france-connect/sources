import { Test, TestingModule } from '@nestjs/testing';

import { WebhooksGuard } from '@fc/webhooks';

import { PartnersInvitationService } from '../services';
import { InvitationController } from './invitation.controller';

describe('InvitationController', () => {
  let controller: InvitationController;

  const partnerInvitationServiceMock = {
    inviteMany: jest.fn(),
  };

  const bodyMock = {
    emails: ['foo@bar.com', 'fizz@buzz.fr'],
    instances: ['instanceId1', 'instanceId2'],
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvitationController],
      providers: [PartnersInvitationService],
    })
      .overrideProvider(PartnersInvitationService)
      .useValue(partnerInvitationServiceMock)
      .overrideGuard(WebhooksGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<InvitationController>(InvitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('invite', () => {
    it('should call PartnersInvitationService.inviteMany with parameters from body', async () => {
      // When
      await controller.invite(bodyMock);

      // Then
      expect(
        partnerInvitationServiceMock.inviteMany,
      ).toHaveBeenCalledExactlyOnceWith(bodyMock.emails, bodyMock.instances);
    });
  });
});
