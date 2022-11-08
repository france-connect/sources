import {
  basicSuccessScenarioEuSpFrIdp,
  basicSuccessScenarioFrSpEuIdp,
  checkInformationsEuSpFrIdp,
  checkInformationsFrSpEuIdp,
} from './mire.utils';

describe('Successful scenarios (FR Citizen / EU Service Provider)', () => {
  it('should connect the female user', () => {
    basicSuccessScenarioEuSpFrIdp({
      logWith: {
        idpId: 'fip1-high',
      },
    });
    checkInformationsEuSpFrIdp();
  });

  it('should connect the male user', () => {
    basicSuccessScenarioEuSpFrIdp({
      logWith: {
        idpId: 'fip1-high',
        login: 'plusieurs_prénoms_3',
      },
    });
    checkInformationsEuSpFrIdp({
      expectedIdentity: [
        { name: 'BirthName', value: '[DUBIGNOT]' },
        { name: 'FamilyName', value: '[DUBIGNOT]' },
        { name: 'FirstName', value: '[Philippe, Arnaud, Jean]' },
        { name: 'DateOfBirth', value: '[1943-06-15]' },
        { name: 'Gender', value: '[Male]' },
        {
          name: 'PersonIdentifier',
          value:
            '[FR/CB/9b0faf78b68fbc6aa46367d520d1aa5f1138a72e1cdb4737b183ce962be62362v1]',
        },
        {
          name: 'PlaceOfBirth',
          value: '[Paris 9e Arrondissement - 75109, FRANCE (FR)]',
        },
      ],
    });
  });

  it('should connect the user with special characters', () => {
    basicSuccessScenarioEuSpFrIdp({
      logWith: {
        idpId: 'fip1-high',
        login: 'caractères_spéciaux',
      },
    });
    checkInformationsEuSpFrIdp({
      expectedIdentity: [
        { name: 'BirthName', value: '[DUBINÔRE]' },
        { name: 'FamilyName', value: '[DUBINÔRE]' },
        { name: 'FirstName', value: '[Joëlle, Françoise]' },
        { name: 'DateOfBirth', value: '[1992-08-15]' },
        { name: 'Gender', value: '[Female]' },
        {
          name: 'PersonIdentifier',
          value:
            '[FR/CB/4c48ec450b43404aa190ceae188831c2a5bb277c7a57debe07646b0d1c857d11v1]',
        },
        {
          name: 'PlaceOfBirth',
          value: '[Paris 17e Arrondissement - 75117, FRANCE (FR)]',
        },
      ],
    });
  });

  it('should connect the user with composed first name', () => {
    basicSuccessScenarioEuSpFrIdp({
      logWith: {
        idpId: 'fip1-high',
        login: 'prénom_composé',
      },
    });
    checkInformationsEuSpFrIdp({
      expectedIdentity: [
        { name: 'BirthName', value: '[HUCHE]' },
        { name: 'FamilyName', value: '[HUCHE]' },
        { name: 'FirstName', value: '[Anne-Laure]' },
        { name: 'DateOfBirth', value: '[1945-09-30]' },
        { name: 'Gender', value: '[Female]' },
        {
          name: 'PersonIdentifier',
          value:
            '[FR/CB/8f63b4639d8b1a72c35d99e7fe4d888c262d58dcf5c2a1ace568303560290ad8v1]',
        },
        { name: 'PlaceOfBirth', value: '[Toulouse - 31555, FRANCE (FR)]' },
      ],
    });
  });

  it('should connect the user with family name over 50 characters', () => {
    basicSuccessScenarioEuSpFrIdp({
      logWith: {
        idpId: 'fip1-high',
        login: 'nom_50+_caractères',
      },
    });
    checkInformationsEuSpFrIdp({
      expectedIdentity: [
        {
          name: 'BirthName',
          value: '[AZERTYUIOPMLKJHGFDSQWXCVBNAZERTYUIOPMLKJHGFDSQWXCVBN]',
        },
        {
          name: 'FamilyName',
          value: '[AZERTYUIOPMLKJHGFDSQWXCVBNAZERTYUIOPMLKJHGFDSQWXCVBN]',
        },
        { name: 'FirstName', value: '[Cyril, Bertrand]' },
        { name: 'DateOfBirth', value: '[2000-03-01]' },
        { name: 'Gender', value: '[Male]' },
        {
          name: 'PersonIdentifier',
          value:
            '[FR/CB/281ca116a31836f14ca477289cad82c6e02e6815a50cf7a8a932dcd1ce69fb6dv1]',
        },
        {
          name: 'PlaceOfBirth',
          value: '[Paris 19e Arrondissement - 75119, FRANCE (FR)]',
        },
      ],
    });
  });

  it('should connect the user not born in France presumed day', () => {
    basicSuccessScenarioEuSpFrIdp({
      logWith: {
        idpId: 'fip1-high',
        login: 'étranger_présumé_né_jour',
      },
    });
    checkInformationsEuSpFrIdp({
      expectedIdentity: [
        {
          name: 'BirthName',
          value: '[FLEURET]',
        },
        {
          name: 'FamilyName',
          value: '[FLEURET]',
        },
        { name: 'FirstName', value: '[Jean]' },
        { name: 'DateOfBirth', value: '[1992-11-01]' },
        { name: 'Gender', value: '[Male]' },
        {
          name: 'PersonIdentifier',
          value:
            '[FR/CB/cbf12654369156563d7ab8aae18295501693804c81ec78191ca324e19bca626ev1]',
        },
        { name: 'PlaceOfBirth', value: '[JAPON (JP)]' },
      ],
    });
  });

  it('should connect the user not born in France presumed day and month', () => {
    basicSuccessScenarioEuSpFrIdp({
      logWith: {
        idpId: 'fip1-high',
        login: 'étranger_présumé_né_jour_et_mois',
      },
    });
    checkInformationsEuSpFrIdp({
      expectedIdentity: [
        {
          name: 'BirthName',
          value: '[TARGE]',
        },
        {
          name: 'FamilyName',
          value: '[TARGE]',
        },
        { name: 'FirstName', value: '[Jean]' },
        { name: 'DateOfBirth', value: '[1992-01-01]' },
        { name: 'Gender', value: '[Male]' },
        {
          name: 'PersonIdentifier',
          value:
            '[FR/CB/16b7591901ff97c176159512f070366a6da0ea1d719e135738661a0ab59b4d73v1]',
        },
        { name: 'PlaceOfBirth', value: '[JAPON (JP)]' },
      ],
    });
  });
});

describe('Successful scenarios (EU Citizen / FR Service Provider)', () => {
  it('should connect the user through eIDAS', () => {
    basicSuccessScenarioFrSpEuIdp();
    checkInformationsFrSpEuIdp();
  });
});
