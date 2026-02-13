import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { formatLocalDate } from '../helpers';
import {
  getElasticsearchFilter,
  searchElastic,
} from '../helpers/elasticsearch-helper';

Given(
  'je limite la recherche elasticsearch à la période de {string} à {string}',
  function (localStartDate: string, localEndDate: string) {
    this.esFilter = {
      ...this.esFilter,
      endDate: formatLocalDate(localEndDate),
      startDate: formatLocalDate(localStartDate),
    };
  },
);

When(
  /^je récupère les (traces|événements|métriques) "(FranceConnect\(v2\)|FranceConnect\(CL\)|FranceConnect\+)" dans elasticsearch$/,
  function (type: string, platform: string) {
    const filter = getElasticsearchFilter(this.esFilter, type, platform);
    searchElastic({ ...filter, size: 10000 }).as('esData');
  },
);

When(
  /^je récupère les (événements) "([^"]+)" de "(FranceConnect\(v2\)|FranceConnect\(CL\)|FranceConnect\+)" dans elasticsearch$/,
  function (type: string, eventName: string, platform: string) {
    const filter = getElasticsearchFilter(
      this.esFilter,
      type,
      platform,
      eventName,
    );
    searchElastic({ ...filter, size: 10000 }).as('esData');
  },
);

Then(
  'je vérifie les données {string} dans elasticsearch',
  function (snapshotName: string) {
    expect(this.esData, 'No Elasticsearch data saved').to.exist;
    const hits = this.esData?.hits?.hits || [];
    expect(hits.length).to.be.greaterThan(
      0,
      `No data found in Elasticsearch for ${snapshotName}`,
    );
    const value = hits.map(({ _source }) => _source);
    cy.task('matchSnapshot', { snapshotName, value });
  },
);
