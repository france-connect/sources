import { capitalize } from '../../common/helpers';
import { ChainableElement, UserClaims } from '../../common/types';
import { EidasAssuranceLevelEnum } from '../enums';

interface EidasMockConfigurationInterface {
  loa?: EidasAssuranceLevelEnum;
  loaCompareType?: 'minimum';
  nameId?: 'unspecified' | 'transient' | 'persistent';
  scopes?: string[];
  spType?: 'not provided' | 'public' | 'private';
}

interface ScopeEidasAttributesMapInterface {
  [key: string]: {
    name: string;
    transform(claims: UserClaims): string;
  };
}

interface IdentityAttributeInterface {
  name: string;
  value: string;
}

const EIDAS_SUB_CLAIM = 'PersonIdentifier';
const EIDAS_GIVEN_NAME_CLAIM = 'FirstName';

const scopeEidasAttributesMap: ScopeEidasAttributesMapInterface = {
  birthdate: {
    name: 'DateOfBirth',
    transform: (claims) => claims['birthdate'],
  },
  birthplace: {
    name: 'PlaceOfBirth',
    transform: (claims) => claims['PlaceOfBirth'],
  },
  family_name: {
    name: 'BirthName',
    transform: (claims) => claims['family_name'],
  },
  gender: {
    name: 'Gender',
    transform: (claims) => capitalize(claims['gender']),
  },
  given_name: {
    name: 'FirstName',
    transform: (claims) => claims['given_name'],
  },
  openid: {
    name: 'PersonIdentifier',
    transform: (claims) => claims['PersonIdentifier'],
  },
  preferred_username: {
    name: 'FamilyName',
    transform: (claims) =>
      claims['preferred_username'] || claims['family_name'],
  },
};

export default class SpEidasMockPage {
  configureEidasSpMock(params: EidasMockConfigurationInterface): void {
    const config = {
      loa: EidasAssuranceLevelEnum.D,
      loaCompareType: 'minimum',
      nameId: 'unspecified',
      scopes: ['openid'],
      spType: 'public',
      ...params,
    };

    cy.get('#eidasconnector_msdd').click();
    cy.get('#eidasconnector_msdd .enabled._msddli_').siblings().last().click();

    cy.get('#citizeneidas_msdd').click();
    cy.get('#citizeneidas_msdd .enabled._msddli_').contains('FR').click();

    cy.get('#eidasNameIdentifier').select(config.nameId);
    cy.get('#eidasloa').select(EidasAssuranceLevelEnum[config.loa]);
    cy.get('#eidasloaCompareType').select(config.loaCompareType);
    cy.get('#eidasSPType').select(config.spType);

    cy.get('#check_all_NoRequestEidas').click();
    cy.get('#tab2_toggle1').click();

    config.scopes
      .map((scope) => scopeEidasAttributesMap[scope]?.name)
      .forEach((attribute) => {
        cy.get(`#Mandatory_${attribute}Eidas`).click();
      });

    // Submit configuration
    cy.get('#submit_tab2').click();

    // We need to remove the target "_parent" from the form to run cypress tests that are a frame
    cy.get('#countrySelector').invoke('removeAttr', 'target');

    // Submit request
    cy.get('#submit_saml').click();
  }

  isReturnPageDisplayed(): void {
    cy.url().should('contain', '/SP/ReturnPage');
  }

  retrieveClaims(): void {
    // We need to remove the target "_parent" from the form to run cypress tests that are a frame
    cy.get('#countrySelector').invoke('removeAttr', 'target');

    // Submit request
    cy.get('#submit_saml').click();
  }

  getClaimValueLabel(claimName: string): ChainableElement {
    return cy.get('table.table-striped').contains(claimName).next();
  }

  checkClaims(
    scopes: string[],
    userClaims: UserClaims,
    eidasClaims: UserClaims,
    spName: string,
  ): void {
    const allClaims: UserClaims = {
      ...userClaims,
      ...eidasClaims,
      // Force PersonIdentifier claim for the current sp
      PersonIdentifier: eidasClaims[`PersonIdentifier-${spName}`],
    };

    const expectedIdentity = this.getExpectedIdentity(scopes, allClaims);

    expectedIdentity
      .filter(({ name }) => name !== EIDAS_GIVEN_NAME_CLAIM)
      .forEach(({ name, value }) => {
        this.getClaimValueLabel(name).should('contain', `[${value}]`);
      });

    // Dedicated check for the given names
    const expectedGivenName =
      expectedIdentity.find(({ name }) => name === EIDAS_GIVEN_NAME_CLAIM)
        ?.value ?? '';
    this.checkGivenNameClaim(expectedGivenName);
  }

  checkSubStartWith(text: string): void {
    this.getClaimValueLabel(EIDAS_SUB_CLAIM).should('contain', `[${text}`);
  }

  /**
   * Checks all given names returned by FranceConnect are listed in the eIDAS sp mock
   * regardless of their orders (display bug on the eIDAS sp mock side)
   * @param expectedValue given names of the user separated by space characters
   */
  private checkGivenNameClaim(expectedValue: string): void {
    const expectedGivenNames = expectedValue.split(' ');
    this.getClaimValueLabel(EIDAS_GIVEN_NAME_CLAIM)
      .invoke('text')
      .then((text) => {
        // Retrieve an array of given names from the eIDAS sp mock
        const actualGivenNames = text.trim().replace(/[[\]]/g, '').split(', ');
        expect(actualGivenNames).to.have.length(expectedGivenNames.length);
        expectedGivenNames.forEach((givenName) =>
          expect(
            actualGivenNames,
            `${JSON.stringify(
              actualGivenNames,
            )} doesn't contain the expected given name '${givenName}'`,
          ).to.include(givenName),
        );
      });
  }

  private getExpectedIdentity(
    scopes: string[],
    claims: UserClaims,
  ): IdentityAttributeInterface[] {
    // Add empty string preferred_username claim when scope not requested
    const PREFERRED_USERNAME_SCOPE = 'preferred_username';
    if (!scopes.includes(PREFERRED_USERNAME_SCOPE)) {
      claims[PREFERRED_USERNAME_SCOPE] = '';
      scopes.push(PREFERRED_USERNAME_SCOPE);
    }

    // Retrieve the expected value for the eIDAS claims
    const identity: IdentityAttributeInterface[] = scopes.map((scope) => {
      expect(scopeEidasAttributesMap[scope]).to.exist;
      const { name, transform } = scopeEidasAttributesMap[scope];

      return {
        name,
        value: transform(claims),
      };
    });

    return identity;
  }
}
