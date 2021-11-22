import { Test, TestingModule } from '@nestjs/testing';

import { EidasCountryServiceInterface } from './eidas-country.service';
import { IEidasCountryElement } from './interfaces';

/**
 * Allow to import dynamically the service and mock the data
 * @returns {EidasCountryService}
 */
async function getServiceMock(): Promise<EidasCountryServiceInterface> {
  const { EidasCountryService } = await import('./eidas-country.service');
  const module: TestingModule = await Test.createTestingModule({
    providers: [EidasCountryService],
  }).compile();

  return module.get(EidasCountryService);
}

describe('EidasCountryService', () => {
  let service: EidasCountryServiceInterface;
  const mockCountryList: IEidasCountryElement[] = [
    {
      iso: 'iso1Value',
      name: 'name1Value',
      icon: 'icon1Value',
    },
    {
      iso: 'iso2Value',
      name: 'name2Value',
      icon: 'icon2Value',
    },
  ];

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should be defined', async () => {
    service = await getServiceMock();
    expect(service).toBeDefined();
  });

  describe('getListByIso()', () => {
    it('should get the countries list for eidas based on iso label', async () => {
      // Given
      jest.doMock('./data', () => ({ eidasCountryListData: mockCountryList }));

      const [firstCountry] = mockCountryList;
      service = await getServiceMock();
      // When
      const result = await service.getListByIso(['iso1Value']);
      // Then
      expect(result).toStrictEqual([firstCountry]);
    });

    it('should get an empty countries list', async () => {
      // Given
      jest.doMock('./data', () => ({ eidasCountryListData: [] }));

      service = await getServiceMock();
      // When
      const result = await service.getListByIso(['iso1Value']);
      // Then
      expect(result).toStrictEqual([]);
    });
  });
});
