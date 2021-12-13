/* eslint-disable @typescript-eslint/no-var-requires */
const placeholders = require('../enums/placeholders.enum');

const accountId = '3ec64565-a907-4284-935a-0ff0213cc120';
let count = 0;
const datamock = [
  {
    event: 'FC_REQUESTED_IDP_USERINFO',
    date: placeholders.MORE_THAN_6_MONTHS,
    accountId,
    spId: `00${++count}`,
    spName: 'EDF',
    spAcr: 'eidas2',
    country: 'FR',
    city: 'Paris',
  },
  {
    event: 'not_relevant_event',
    date: placeholders.LESS_THAN_6_MONTHS,
    accountId,
    spId: `00${++count}`,
    spName: 'France Telecom',
    spAcr: 'eidas3',
    country: 'FR',
    city: 'Paris',
  },
  {
    event: 'SP_REQUESTED_FC_USERINFO',
    date: placeholders.LESS_THAN_6_MONTHS,
    accountId,
    spId: `00${++count}`,
    spName: 'LaPoste',
    spAcr: 'eidas3',
    country: 'FR',
    city: 'Paris',
  },
];

module.exports = datamock;
