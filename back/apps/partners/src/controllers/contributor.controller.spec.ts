import { Test, TestingModule } from '@nestjs/testing';

import { AccessControlGuard } from '@fc/access-control';
import { CsrfTokenGuard } from '@fc/csrf';
import {
  Dto2FormI18nService,
  FormValidationPipe,
  MetadataFormService,
} from '@fc/dto2form';

import { getSessionServiceMock } from '@mocks/session';

import { AddContributorInputDto } from '../dto';
import { PartnersContributorService } from '../services';
import { ContributorController } from './contributor.controller';

describe('ContributorController', () => {
  let controller: ContributorController;

  const partnersContributorServiceMock = {
    addOne: jest.fn(),
  };

  const metadataFormServiceMock = {
    getDtoMetadata: jest.fn(),
  };

  const partnersI18nServiceMock = {
    translation: jest.fn(),
  };

  const formValidationPipeMock = {
    transform: () => true,
  };

  const accessControlGuardMock = {
    canActivate: () => true,
  };

  const csrfTokenGuardMock = {
    canActivate: () => true,
  };

  const serviceProviderIdMock = 'service-provider-id-mock';
  const bodyMock = {
    email: 'foo@bar.com',
  };
  const firstnameMock = 'Jean';
  const lastnameMock = 'Dupont';
  const sessionPartnersAccountMock = getSessionServiceMock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContributorController],
      providers: [
        PartnersContributorService,
        MetadataFormService,
        Dto2FormI18nService,
      ],
    })
      .overrideProvider(PartnersContributorService)
      .useValue(partnersContributorServiceMock)
      .overrideProvider(MetadataFormService)
      .useValue(metadataFormServiceMock)
      .overrideProvider(Dto2FormI18nService)
      .useValue(partnersI18nServiceMock)
      .overrideGuard(AccessControlGuard)
      .useValue(accessControlGuardMock)
      .overrideGuard(CsrfTokenGuard)
      .useValue(csrfTokenGuardMock)
      .overridePipe(FormValidationPipe)
      .useValue(formValidationPipeMock)
      .compile();

    controller = module.get<ContributorController>(ContributorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addContributor', () => {
    beforeEach(() => {
      sessionPartnersAccountMock.get.mockReturnValue({
        identity: { firstname: firstnameMock, lastname: lastnameMock },
      });
    });

    it('should call PartnersContributorService.addOne with the email, the serviceProviderId and the connected admin identity', async () => {
      // When
      await controller.addContributor(
        serviceProviderIdMock,
        bodyMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(
        partnersContributorServiceMock.addOne,
      ).toHaveBeenCalledExactlyOnceWith(bodyMock.email, serviceProviderIdMock, {
        firstname: firstnameMock,
        lastname: lastnameMock,
      });
    });
  });

  describe('getFormMetadata', () => {
    const payloadMock = Symbol('payload');
    const payloadI18nMock = Symbol('payloadI18n');

    beforeEach(() => {
      metadataFormServiceMock.getDtoMetadata.mockReturnValueOnce(payloadMock);
      partnersI18nServiceMock.translation.mockReturnValueOnce(payloadI18nMock);
    });

    it('should call getDtoMetadata with the AddContributorInputDto', () => {
      // When
      controller.getFormMetadata();

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(AddContributorInputDto);
    });

    it('should translate the metadata payload', () => {
      // When
      controller.getFormMetadata();

      // Then
      expect(
        partnersI18nServiceMock.translation,
      ).toHaveBeenCalledExactlyOnceWith(payloadMock);
    });

    it('should return the translated payload', () => {
      // When
      const result = controller.getFormMetadata();

      // Then
      expect(result).toEqual(payloadI18nMock);
    });
  });
});
