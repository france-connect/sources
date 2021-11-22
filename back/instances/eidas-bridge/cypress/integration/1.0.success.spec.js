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
            '[FR/UK/8b6b83e889da9cdfd7fcf2b6711eb76d19ec0f5efff59519b87c133aa3696761v1]',
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
            '[FR/UK/78b6eaf25004bd40b8105be6281d633552fd59b8c941ae23bbdcd0e2fbcb6bdev1]',
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
            '[FR/UK/064dad4319eaedf9ac46ded64c06c8b66beea51d7f52e6ecd9e5d89800c1bdbfv1]',
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
            '[FR/UK/7426f67d93243ce4ef90c65a0584cb76e72778cb5086b29f998df4b7d0d37c78v1]',
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
            '[FR/UK/943a6546c0b61652bf5bd4151e40065414e06a942b32dcf858c5835433a22085v1]',
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
            '[FR/UK/ea20614e1c76ec0b65b53e92e51a243a257d4246a5ba0820e8452fd472f7e31bv1]',
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
