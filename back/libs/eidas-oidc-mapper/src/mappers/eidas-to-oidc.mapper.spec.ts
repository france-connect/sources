import { EidasAttributes } from '@fc/eidas';

import { AttributesToClaimsMap } from './eidas-to-oidc.mapper';

describe('EidasToOidcMapper', () => {
  describe('AttributesToClaimsMap', () => {
    const attributesMock = {
      [EidasAttributes.PERSON_IDENTIFIER]: [
        '57770c28716497d912e64399024b0d70acd9f7e325198f04df29ce0d0572d50fv2',
      ],
      [EidasAttributes.GENDER]: ['Female'],
      [EidasAttributes.DATE_OF_BIRTH]: ['1962-08-24'],
      [EidasAttributes.PLACE_OF_BIRTH]: ['Tokyo'],
      [EidasAttributes.CURRENT_GIVEN_NAME]: ['Angela', 'Claire', 'Louise'],
      [EidasAttributes.CURRENT_FAMILY_NAME]: ['DUBOIS'],
    };

    describe('getSub', () => {
      it('should call getSub with the eidas attributes and return the sub', () => {
        // Given
        const expected = {
          sub: '57770c28716497d912e64399024b0d70acd9f7e325198f04df29ce0d0572d50fv2',
        };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.PERSON_IDENTIFIER](
            attributesMock,
          );

        // Then
        expect(result).toStrictEqual(expected);
      });

      it('should call getSub with the eidas attributes and return an undefined sub if not present', () => {
        // Given
        const emptyAttributesMock = {};
        const expected = {
          sub: undefined,
        };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.PERSON_IDENTIFIER](
            emptyAttributesMock,
          );

        // Then
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getGender', () => {
      it('should call getGender with the eidas attributes and return the gender', () => {
        // Given
        const expected = { gender: 'female' };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.GENDER](attributesMock);

        // Then
        expect(result).toStrictEqual(expected);
      });

      it('should call getGender with the eidas attributes and return an undefined gender if not present', () => {
        // Given
        const emptyAttributesMock = {};
        const expected = {
          gender: undefined,
        };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.GENDER](emptyAttributesMock);

        // Then
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getBirthdate', () => {
      it('should call getBirthdate with the eidas attributes and return the birthdate', () => {
        // Given
        const expected = { birthdate: '1962-08-24' };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.DATE_OF_BIRTH](attributesMock);

        // Then
        expect(result).toStrictEqual(expected);
      });

      it('should call getBirthdate with the eidas attributes and return an undefined birthdate if not present', () => {
        // Given
        const emptyAttributesMock = {};
        const expected = {
          birthdate: undefined,
        };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.DATE_OF_BIRTH](
            emptyAttributesMock,
          );

        // Then
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getBirthplace', () => {
      it('should call getBirthplace with the eidas attributes and return the birthplace', () => {
        // Given
        const expected = { birthplace: 'Tokyo' };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.PLACE_OF_BIRTH](attributesMock);

        // Then
        expect(result).toStrictEqual(expected);
      });

      it('should call getBirthplace with the eidas attributes and return an undefined birthplace if not present', () => {
        // Given
        const emptyAttributesMock = {};
        const expected = {
          birthplace: undefined,
        };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.PLACE_OF_BIRTH](
            emptyAttributesMock,
          );

        // Then
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getGivenNames', () => {
      it('should call getGivenNames with the eidas attributes and return the given names', () => {
        // Given
        const expected = { given_name: 'Angela Claire Louise' };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.CURRENT_GIVEN_NAME](
            attributesMock,
          );

        // Then
        expect(result).toStrictEqual(expected);
      });

      it('should call getGivenNames with the eidas attributes and return an undefined given_name if not present', () => {
        // Given
        const emptyAttributesMock = {};
        const expected = {
          given_name: undefined,
        };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.CURRENT_GIVEN_NAME](
            emptyAttributesMock,
          );

        // Then
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getFamilyName', () => {
      it('should call with the eidas attributes and return the family name and the preferred_username', () => {
        // Given
        const expected = {
          family_name: 'DUBOIS',
          preferred_username: 'DUBOIS',
        };

        // When
        const result =
          AttributesToClaimsMap[EidasAttributes.CURRENT_FAMILY_NAME](
            attributesMock,
          );

        // Then
        expect(result).toStrictEqual(expected);
      });
    });

    it('should call getFamilyName with the eidas attributes and return undefined family_name and preferred_username if not present', () => {
      // Given
      const emptyAttributesMock = {};
      const expected = {
        family_name: undefined,
        preferred_username: undefined,
      };

      // When
      const result =
        AttributesToClaimsMap[EidasAttributes.CURRENT_FAMILY_NAME](
          emptyAttributesMock,
        );

      // Then
      expect(result).toStrictEqual(expected);
    });
  });
});
