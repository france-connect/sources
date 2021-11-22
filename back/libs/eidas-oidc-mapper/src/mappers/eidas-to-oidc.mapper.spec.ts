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
        // setup
        const expected = {
          sub: '57770c28716497d912e64399024b0d70acd9f7e325198f04df29ce0d0572d50fv2',
        };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.PERSON_IDENTIFIER](
            attributesMock,
          );

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should call getSub with the eidas attributes and return an undefined sub if not present', () => {
        // setup
        const emptyAttributesMock = {};
        const expected = {
          sub: undefined,
        };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.PERSON_IDENTIFIER](
            emptyAttributesMock,
          );

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getGender', () => {
      it('should call getGender with the eidas attributes and return the gender', () => {
        // setup
        const expected = { gender: 'female' };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.GENDER](attributesMock);

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should call getGender with the eidas attributes and return an undefined gender if not present', () => {
        // setup
        const emptyAttributesMock = {};
        const expected = {
          gender: undefined,
        };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.GENDER](emptyAttributesMock);

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getBirthdate', () => {
      it('should call getBirthdate with the eidas attributes and return the birthdate', () => {
        // setup
        const expected = { birthdate: '1962-08-24' };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.DATE_OF_BIRTH](attributesMock);

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should call getBirthdate with the eidas attributes and return an undefined birthdate if not present', () => {
        // setup
        const emptyAttributesMock = {};
        const expected = {
          birthdate: undefined,
        };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.DATE_OF_BIRTH](
            emptyAttributesMock,
          );

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getBirthplace', () => {
      it('should call getBirthplace with the eidas attributes and return the birthplace', () => {
        // setup
        const expected = { birthplace: 'Tokyo' };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.PLACE_OF_BIRTH](attributesMock);

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should call getBirthplace with the eidas attributes and return an undefined birthplace if not present', () => {
        // setup
        const emptyAttributesMock = {};
        const expected = {
          birthplace: undefined,
        };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.PLACE_OF_BIRTH](
            emptyAttributesMock,
          );

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getGivenNames', () => {
      it('should call getGivenNames with the eidas attributes and return the given names', () => {
        // setup
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const expected = { given_name: 'Angela Claire Louise' };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.CURRENT_GIVEN_NAME](
            attributesMock,
          );

        // expect
        expect(result).toStrictEqual(expected);
      });

      it('should call getGivenNames with the eidas attributes and return an undefined given_name if not present', () => {
        // setup
        const emptyAttributesMock = {};
        const expected = {
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: undefined,
        };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.CURRENT_GIVEN_NAME](
            emptyAttributesMock,
          );

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('getFamilyName', () => {
      it('should call with the eidas attributes and return the family name', () => {
        // setup
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const expected = { family_name: 'DUBOIS' };

        // action
        const result =
          AttributesToClaimsMap[EidasAttributes.CURRENT_FAMILY_NAME](
            attributesMock,
          );

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    it('should call getFamilyName with the eidas attributes and return an undefined family_name if not present', () => {
      // setup
      const emptyAttributesMock = {};
      const expected = {
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        family_name: undefined,
      };

      // action
      const result =
        AttributesToClaimsMap[EidasAttributes.CURRENT_FAMILY_NAME](
          emptyAttributesMock,
        );

      // expect
      expect(result).toStrictEqual(expected);
    });
  });
});
