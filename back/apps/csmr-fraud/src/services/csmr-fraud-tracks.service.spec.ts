import { Test, TestingModule } from '@nestjs/testing';

import { CsmrAccountClientService } from '@fc/csmr-account-client';
import { IOidcIdentity } from '@fc/oidc';
import {
  TracksAdapterElasticsearchService,
  TracksAdapterResultsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import {
  TracksFormatterOutputInterface,
  TracksTicketDataInterface,
} from '../interfaces';
import { CsmrFraudTracksService } from './csmr-fraud-tracks.service';

describe('CsmrFraudTracksService', () => {
  let service: CsmrFraudTracksService;

  const accountMock = {
    getAccountIdsFromIdentity: jest.fn(),
  };

  const tracksMock = {
    getTracksForAuthenticationEventId: jest.fn(),
  };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrFraudTracksService,
        CsmrAccountClientService,
        TracksAdapterElasticsearchService,
      ],
    })
      .overrideProvider(CsmrAccountClientService)
      .useValue(accountMock)
      .overrideProvider(TracksAdapterElasticsearchService)
      .useValue(tracksMock)
      .compile();

    service = module.get<CsmrFraudTracksService>(CsmrFraudTracksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTracksForAuthenticationEventId', () => {
    // Given
    const authenticationEventIdMock = 'IdValue';
    const identityMock = Symbol('identityMock') as unknown as IOidcIdentity;
    const accountIdsMock = ['accountIdMock'];

    const formattedTrackWithAccountMatchMock: TracksFormatterOutputInterface = {
      city: 'Paris',
      country: 'FR',
      idpName: 'Ameli',
      platform: 'FranceConnect',
      spName: 'ANTS',
      date: '08/03/1995 12:00:00',
      accountId: 'accountIdMock',
      interactionAcr: 'acr',
      spSub: 'any-string',
      idpSub: 'any-string',
      ipAddress: ['any-string'],
    };

    const trackResultWithAccountMatchMock: TracksTicketDataInterface = {
      city: 'Paris',
      country: 'FR',
      idpName: 'Ameli',
      platform: 'FranceConnect',
      spName: 'ANTS',
      date: '08/03/1995 12:00:00',
      accountIdMatch: true,
      interactionAcr: 'acr',
      spSub: 'any-string',
      idpSub: 'any-string',
      ipAddress: ['any-string'],
    };

    const formattedTrackWithoutAccountMatchMock: TracksFormatterOutputInterface =
      {
        city: 'Paris',
        country: 'FR',
        idpName: 'Ameli',
        platform: 'FranceConnect',
        spName: 'ANTS',
        date: '08/03/1995 12:00:00',
        accountId: 'any-string',
        interactionAcr: 'acr',
        spSub: 'any-string',
        idpSub: 'any-string',
        ipAddress: ['any-string'],
      };

    const trackResultWithoutAccountMatchMock: TracksTicketDataInterface = {
      city: 'Paris',
      country: 'FR',
      idpName: 'Ameli',
      platform: 'FranceConnect',
      spName: 'ANTS',
      date: '08/03/1995 12:00:00',
      accountIdMatch: false,
      interactionAcr: 'acr',
      spSub: 'any-string',
      idpSub: 'any-string',
      ipAddress: ['any-string'],
    };

    const formattedTracksMock: TracksAdapterResultsInterface<TracksFormatterOutputInterface> =
      {
        total: 2,
        payload: [
          formattedTrackWithAccountMatchMock,
          formattedTrackWithoutAccountMatchMock,
        ],
      };

    beforeEach(() => {
      accountMock.getAccountIdsFromIdentity.mockResolvedValue(accountIdsMock);
      tracksMock.getTracksForAuthenticationEventId.mockReturnValue(
        formattedTracksMock,
      );
    });

    it('should call accounformattedTracksMocktMock.getAccountIdsFromIdentity() with identity', async () => {
      // When
      await service.getTracksForAuthenticationEventId(
        identityMock,
        authenticationEventIdMock,
      );

      // Then
      expect(accountMock.getAccountIdsFromIdentity).toHaveBeenCalledTimes(1);
      expect(accountMock.getAccountIdsFromIdentity).toHaveBeenCalledWith(
        identityMock,
      );
    });

    it('should call tracks.getTracks() with authenticationEventId', async () => {
      // When
      await service.getTracksForAuthenticationEventId(
        identityMock,
        authenticationEventIdMock,
      );

      // Then
      expect(
        tracksMock.getTracksForAuthenticationEventId,
      ).toHaveBeenCalledTimes(1);
      expect(tracksMock.getTracksForAuthenticationEventId).toHaveBeenCalledWith(
        authenticationEventIdMock,
      );
    });

    it('should return an object with tracks and total', async () => {
      // When
      const tracks = await service.getTracksForAuthenticationEventId(
        identityMock,
        authenticationEventIdMock,
      );

      // Then
      expect(tracks).toEqual({
        error: '',
        tracks: [
          trackResultWithAccountMatchMock,
          trackResultWithoutAccountMatchMock,
        ],
        total: 2,
      });
    });

    it('should return an error message if no accountIds are found', async () => {
      // Given
      accountMock.getAccountIdsFromIdentity.mockResolvedValueOnce([]);

      // When
      const tracks = await service.getTracksForAuthenticationEventId(
        identityMock,
        authenticationEventIdMock,
      );

      // Then
      expect(tracks).toStrictEqual({
        error: `impossible de récupérer les account ids à partir de l’identité de l’usager`,
        total: 0,
        tracks: [],
      });
    });

    it('should return an error message if no tracks are found', async () => {
      // Given
      tracksMock.getTracksForAuthenticationEventId.mockResolvedValueOnce({
        total: 0,
        payload: Symbol('payloadMock'),
      });

      // When
      const tracks = await service.getTracksForAuthenticationEventId(
        identityMock,
        authenticationEventIdMock,
      );

      // Then
      expect(tracks).toStrictEqual({
        error: `aucune trace ne correspond au code d’identitication`,
        total: 0,
        tracks: [],
      });
    });

    it('should return an error message if an error is thrown', async () => {
      // Given
      const errorMock = new Error();
      tracksMock.getTracksForAuthenticationEventId.mockImplementationOnce(
        () => {
          throw errorMock;
        },
      );
      // When
      const tracks = await service.getTracksForAuthenticationEventId(
        identityMock,
        authenticationEventIdMock,
      );

      // Then
      expect(tracks).toStrictEqual({
        error: `impossible de récupérer les traces à partir du code d’identification`,
        total: 0,
        tracks: [],
      });
    });
  });
});
