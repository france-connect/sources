import { IGroupedClaims, IRichClaim } from '../interfaces';
import {
  groupByDataProvider,
  groupByDataProviderReducer,
  oneToOneScopeFromClaims,
} from './scopes.helper';

describe('scopeHelpers', () => {
  describe('oneToOneScopeFromClaims', () => {
    const inputMock = { foo: 'fooValue', bar: 'barValue' };

    it('should return an object with a key by entries of the array', () => {
      // When
      const result = oneToOneScopeFromClaims(inputMock);
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          fooValue: expect.any(Array),
          barValue: expect.any(Array),
        }),
      );
    });

    it('should return an object with values being arrays with one element being the key', () => {
      // When
      const result = oneToOneScopeFromClaims(inputMock);
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          fooValue: ['fooValue'],
          barValue: ['barValue'],
        }),
      );
    });
  });

  describe('groupByDataProviderReducer', () => {
    const input = {
      provider: {
        label: 'dataProvider Label',
        key: 'dataProviderName',
      },
      identifier: '',
      label: 'Claim Label',
    } as IRichClaim;

    it('should return accumulator containing a key for data provider and given claim', () => {
      // Given
      const accumulator = {} as IGroupedClaims;
      // When
      const result = groupByDataProviderReducer(accumulator, input);
      // Then
      expect(result).toEqual({
        [input.provider.key]: {
          label: input.provider.label,
          claims: [input.label],
        },
      });
    });

    it('should return accumulator with claim appended to existing  key', () => {
      // Given
      const accumulator = {
        [input.provider.key]: {
          label: input.provider.label,
          claims: ['foo'],
        },
      } as IGroupedClaims;
      // When
      const result = groupByDataProviderReducer(accumulator, input);
      // Then
      expect(result).toEqual({
        [input.provider.key]: {
          label: input.provider.label,
          claims: ['foo', input.label],
        },
      });
    });
  });

  describe('groupClaimsByDataProvider', () => {
    it('should call reduce with reducer', () => {
      // Given
      const claimsMock = [] as IRichClaim[];
      claimsMock.reduce = jest.fn();
      // When
      groupByDataProvider(claimsMock);
      // Then
      expect(claimsMock.reduce).toHaveBeenCalledTimes(1);
      expect(claimsMock.reduce).toHaveBeenCalledWith(
        groupByDataProviderReducer,
        expect.any(Object),
      );
    });

    it('should return result from reduce call', () => {
      // Given
      const claimsMock = [] as IRichClaim[];
      const reduceMockedReturn = {};
      claimsMock.reduce = jest.fn().mockReturnValueOnce(reduceMockedReturn);
      // When
      const result = groupByDataProvider(claimsMock);
      // Then
      expect(result).toBe(reduceMockedReturn);
    });
  });
});
