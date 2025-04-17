import { TicketTracksDataInterface } from '../interfaces';
import { getTracksByIdpName, getTracksBySpName } from './group-tracks.util';

describe('group-tracks.util', () => {
  const sampleTracks: TicketTracksDataInterface[] = [
    {
      accountIdMatch: true,
      platform: 'FC',
      idpName: 'Idp1',
      spName: 'Sp1',
      date: '1995-03-08',
      city: 'City',
      country: 'Country',
      idpSub: 'IdpSub',
      spSub: 'SpSub',
      interactionAcr: 'Acr',
      ipAddress: ['any-string'],
    },
    {
      accountIdMatch: false,
      platform: 'FC',
      idpName: 'Idp2',
      spName: 'Sp1',
      date: '1995-03-08',
      city: 'City',
      country: 'Country',
      idpSub: 'IdpSub',
      spSub: 'SpSub',
      interactionAcr: 'Acr',
      ipAddress: ['any-string'],
    },
    {
      accountIdMatch: true,
      platform: 'FC',
      idpName: 'Idp1',
      spName: 'Sp2',
      date: '1995-03-08',
      city: 'City',
      country: 'Country',
      idpSub: 'IdpSub',
      spSub: 'SpSub',
      interactionAcr: 'Acr',
      ipAddress: ['any-string'],
    },
  ];

  describe('getTracksBySpName', () => {
    it('should group tracks by spName and remove idpSub and accountIdMatch properties', () => {
      const expectedResult = {
        Sp1: [
          {
            platform: 'FC',
            spName: 'Sp1',
            date: '1995-03-08',
            city: 'City',
            country: 'Country',
            spSub: 'SpSub',
            interactionAcr: 'Acr',
            ipAddress: ['any-string'],
          },
          {
            platform: 'FC',
            spName: 'Sp1',
            date: '1995-03-08',
            city: 'City',
            country: 'Country',
            spSub: 'SpSub',
            interactionAcr: 'Acr',
            ipAddress: ['any-string'],
          },
        ],
        Sp2: [
          {
            platform: 'FC',
            spName: 'Sp2',
            date: '1995-03-08',
            city: 'City',
            country: 'Country',
            spSub: 'SpSub',
            interactionAcr: 'Acr',
            ipAddress: ['any-string'],
          },
        ],
      };

      const result = getTracksBySpName(sampleTracks);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTracksByIdpName', () => {
    it('should group tracks by idpName and remove spSub and accountIdMatch properties', () => {
      const expectedResult = {
        Idp1: [
          {
            platform: 'FC',
            idpName: 'Idp1',
            date: '1995-03-08',
            city: 'City',
            country: 'Country',
            idpSub: 'IdpSub',
            interactionAcr: 'Acr',
            ipAddress: ['any-string'],
          },
          {
            platform: 'FC',
            idpName: 'Idp1',
            date: '1995-03-08',
            city: 'City',
            country: 'Country',
            idpSub: 'IdpSub',
            interactionAcr: 'Acr',
            ipAddress: ['any-string'],
          },
        ],
        Idp2: [
          {
            platform: 'FC',
            idpName: 'Idp2',
            date: '1995-03-08',
            city: 'City',
            country: 'Country',
            idpSub: 'IdpSub',
            interactionAcr: 'Acr',
            ipAddress: ['any-string'],
          },
        ],
      };

      const result = getTracksByIdpName(sampleTracks);
      expect(result).toEqual(expectedResult);
    });
  });
});
