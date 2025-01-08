import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given(
  /^les traces "(FranceConnect\(v2\)|FranceConnect\(CL\)|FranceConnect\+|FranceConnect\(CL\) et FranceConnect\+)" contiennent "([^"]+)"$/,
  function (platform: string, description: string) {
    let tracksType = description;

    // Remove all tracks
    cy.task('removeAllTracks');

    // Handle mixed FC legacy and FC+ tracks
    if (platform === 'FranceConnect(CL) et FranceConnect+') {
      // Divide the connections between the 2 platforms
      const result = tracksType.match(/^(\d+) connexions?$/);
      if (result) {
        const connectionCount = parseInt(result[1], 10);
        tracksType = `${connectionCount / 2} connexions`;
      }
      cy.task('addTracks', { mockSet: 'legacy', tracksType });
      cy.task('addTracks', { mockSet: 'high', tracksType });
      return;
    }

    // Add tracks for the specific platform
    const mapping = {
      'FranceConnect(CL)': 'legacy',
      'FranceConnect(v2)': 'low',
      'FranceConnect+': 'high',
    };
    const mockSet = mapping[platform];
    cy.task('addTracks', { mockSet, tracksType });
  },
);

Given('les traces sont supprimées dans elasticsearch', function () {
  cy.task('removeAllTracks');
});

Given(
  /^les traces "FranceConnect\(v2\)" sont récupérées dans elasticsearch$/,
  function () {
    cy.task('removeTracks', { mockSet: 'low' });
    cy.task('injectTracks', { mockSet: 'low' });
  },
);
