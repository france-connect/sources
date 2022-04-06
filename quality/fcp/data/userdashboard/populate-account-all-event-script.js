/* eslint-disable @typescript-eslint/no-var-requires */

const { DateTime } = require('luxon');

const accountId = 'test_TRACE_USER';

const badEvents = [
  'FC_AUTHORIZE_INITIATED',
  'FC_SHOWED_IDP_CHOICE',
  'IDP_CHOSEN',
  'IDP_REQUESTED_FC_JWKS',
  'IDP_CALLEDBACK',
  'FC_REQUESTED_IDP_TOKEN',
  'FC_REQUESTED_IDP_USERINFO',
  'FC_REQUESTED_RNIPP',
  'FC_RECEIVED_RNIPP',
  'FC_FAILED_RNIPP',
  'FC_RECEIVED_VALID_RNIPP',
  'FC_RECEIVED_DECEASED_RNIPP',
  'FC_RECEIVED_INVALID_RNIPP',
  'FC_SHOWED_CONSENT',
  'FC_DATATRANSFER_INFORMATION_ANONYMOUS',
  'FC_DATATRANSFER_INFORMATION_IDENTITY',
  'FC_REDIRECTED_TO_SP',
  'SP_REQUESTED_FC_JWKS',
  'SP_REQUESTED_FC_TOKEN',
  'SP_REQUESTED_FC_USERINFO',
  'SP_REQUESTED_LOGOUT',
];

const goodEvents = [
  'FC_VERIFIED',
  'FC_DATATRANSFER_CONSENT_IDENTITY',
  'FC_DATATRANSFER_CONSENT_DATA',
  'DP_REQUESTED_FC_CHECKTOKEN',
];

// help to trace false logs generated in ES
const TRACE_MARK = '::mock::';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function datesFromLimit(month = 6) {
  const now = DateTime.now().toUTC();
  const justBeforeNow = now.minus({ day: 1 });
  const justBefore = now.minus({ month }).plus({ day: 1 });
  const justAfter = now.minus({ month }).minus({ day: getRandomInt(1, 100) });
  const dates = [justBeforeNow, justBefore, justAfter].map((date) =>
    date.toMillis(),
  );

  return dates;
}

const [, lessThan6Month, moreThan6Month] = datesFromLimit(6);

const baseEvent = {
  category: 'categoryValue',
  step: '5.5.5.5',

  event: 'FC_VERIFIED',
  time: lessThan6Month,
  accountId,

  spId: `42`,
  spName: 'Engie',
  spAcr: 'eidas2',

  idpId: 'idpId',
  idpAcr: 'eidas3',
  idpName: 'idp1',

  ip: '192.168.2.2',

  spSub: '42424242442242424424242',
  idpSub: '77777777777777777777777',

  interactionId: '11111111111111111111',
  level: 'info',
  pid: 123,
  hostname: 'fc',
  logId: '33333333333333333',
  '@version': TRACE_MARK,
};

const datamock = [];

// KO: too old
goodEvents.forEach((event) => {
  datamock.push({
    ...baseEvent,
    event,
    time: moreThan6Month,
  });
});

// KO: bad accountId
goodEvents.forEach((event) => {
  datamock.push({
    ...baseEvent,
    event,
    accountId: 'wrongAccountId',
    spName: 'SP - wrongAccountId',
  });
});

// KO: Bad event (not existing)
datamock.push({
  ...baseEvent,
  event: 'NON_EXISTING_EVENT',
  spName: 'SP - non existing event',
});

// OK
goodEvents.forEach((event) => {
  datamock.push({
    ...baseEvent,
    event,
  });
});

// KO: Bad event (existing but not relevant)
badEvents.forEach((badEvent) => {
  datamock.push({
    ...baseEvent,
    event: badEvent,
    spName: 'SP - wrongEvent',
  });
});

module.exports = datamock;
