/* eslint-disable @typescript-eslint/no-var-requires */
const { DateTime } = require('luxon');
const { Client } = require('@elastic/elasticsearch');
const datamock = require('../mocks/account-traces.mock');
const placeholders = require('../enums/placeholders.enum');

const ELASTIC_TRACKS_INDEX = process.env.Elasticsearch_TRACKS_INDEX;
const ELASTIC_PROTOCOL = process.env.Elasticsearch_PROTOCOL;
const ELASTIC_HOST = process.env.Elasticsearch_HOST;
const ELASTIC_PORT = process.env.Elasticsearch_PORT;

/**
 * Start the populate script by instantiating the class:
 * > new PopulateAccountTraces();
 *
 * The class is instantiated at the bottom of these file.
 */
class PopulateAccountTraces {
  esClient;
  mock;

  constructor(datamock) {
    this.mock = datamock;
  }

  async run() {
    this.initElasticsearchClient();

    const formatedDatamock = this.getFormatedMockData();

    await this.deleteIndex();
    await this.setIndex();
    await this.save(formatedDatamock);

    await this.displayData();
  }

  /**
   * Setup the local elasticsearch database connection.
   *
   * @see https://localhost:9200
   * @see /fc-docker/compose/fc-core.yml:152
   * - Elasticsearch_PROTOCOL
   * - Elasticsearch_HOST
   * - Elasticsearch_PORT
   * @returns {void}
   */
  initElasticsearchClient() {
    const host = `${ELASTIC_PROTOCOL}://${ELASTIC_HOST}:${ELASTIC_PORT}`;
    this.esClient = new Client({ node: host });
  }

  /**
   * Replace placeholders from data-mock by up-to-date info.
   *
   * @see https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-plus
   * @returns {ICsmrTracksOutputTrack[]}
   */
  getFormatedMockData() {
    const formatedDataMock = this.mock.map((el) => {
      switch (el.date) {
        // -- expired date
        case placeholders.MORE_THAN_6_MONTHS:
          el.date = DateTime.now().plus({
            month: this.getRandomBetween(7, 11),
          });
          break;
        // -- valid date
        case placeholders.LESS_THAN_6_MONTHS:
          el.date = DateTime.now().plus({
            month: this.getRandomBetween(1, 5),
          });
          break;
      }
      return el;
    });

    console.log('PopulateAccountTraces.getFormatedMockData()', {
      formatedDataMock,
    });

    return formatedDataMock;
  }

  async deleteIndex() {
    try {
      await this.esClient.indices.delete({
        index: ELASTIC_TRACKS_INDEX,
      });
    } catch (error) {
      console.warn('PopulateAccountTraces.deleteIndex().catch()', error);
    }
  }

  async setIndex() {
    try {
      await this.esClient.indices.create(
        {
          index: ELASTIC_TRACKS_INDEX,
          body: {
            mappings: {
              properties: {
                event: { type: 'keyword' },
                spId: { type: 'text' },
                date: { type: 'date' },
                accountId: { type: 'text' },
                spName: { type: 'text' },
                spAcr: { type: 'keyword' },
                country: { type: 'keyword' },
                city: { type: 'keyword' },
              },
            },
          },
        },
        { ignore: [400] },
      );
    } catch (error) {
      console.warn('PopulateAccountTraces.setIndex().catch()', error);
    }
  }

  /**
   * save traces in elasticsearch.
   *
   * To display database traces:
   * @see http://localhost:9200/_cat/indices/
   * @link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/examples.html
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line complexity
  async save() {
    try {
      const header = { index: { _index: ELASTIC_TRACKS_INDEX } };
      const body = this.mock.flatMap((doc) => [header, doc]);

      const { body: bulkResponse } = await this.esClient.bulk({
        refresh: true,
        body,
      });

      // -- if an error occured
      if (bulkResponse.errors) {
        // eslint-disable-next-line max-depth
        if (erroredDocuments.length > 0) {
          console.warn('PopulateAccountTraces.save()', {
            error: 'Error while importing document',
            errors: bulkResponse.errors,
          });
        }
      }

      // -- control if the datamock have been correctly imported.
      const { body: total } = await this.esClient.count({
        index: ELASTIC_TRACKS_INDEX,
      });
      if (total.count !== this.mock.length) {
        console.warn('PopulateAccountTraces.save()', {
          error: 'All mocks were not imported',
          count: total.count,
          datamockLength: this.mock.length,
        });
      }
    } catch (error) {
      console.warn('PopulateAccountTraces.save().catch()', error);
    }

    return true;
  }

  async displayData() {
    let result;
    try {
      result = await this.esClient.cat.indices({ format: 'json' });

      console.log('PopulateAccountTraces.displayData()', {
        result: result.body,
      });
    } catch (error) {
      console.warn('PopulateAccountTraces.displayData().catch()', error);
    }
  }

  /**
   * Get a random integer between two values, inclusive:
   * The maximum is inclusive and the minimum is inclusive.
   *
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  getRandomBetween(min, max) {
    const _min = Math.ceil(min);
    const _max = Math.ceil(max);
    return Math.floor(Math.random() * (_max - _min) + _min);
  }
}

new PopulateAccountTraces(datamock).run();
