import {
  afterSuccessScenario,
  basicSuccessScenario,
  beforeSuccessScenario,
  checkInformations,
  checkInStringifiedJson,
} from './mire.utils';

describe('Successful scenarios', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const sp1 = `${Cypress.env('SP_NAME')}1-low`;
  const sp2 = `${Cypress.env('SP_NAME')}2-low`;
  const idp1 = '9c716f61-b8a1-435c-a407-ef4d677ec270';
  const idp4 = '87762a76-7da0-442d-8243-5785f859b88b';

  // 4 different subs for the same agent
  const SUB_SP1_IDP1 =
    '4a897042fa9e7a1098a1951a7a3f461db54be2105c400f8594ce0eeb03cc5756';
  const SUB_SP2_IDP1 =
    '3ff73e7fa55d48533a434b52b8ffc8c223660775c1fad17022ae8feedcc63ce4';
  const SUB_SP1_IDP4 =
    'e6a77535107e54fd686adc431153ce39507170c43ea6bc0c33c34055c9674fc0';

  it('should redirect to AC website', () => {
    cy.request({
      followRedirect: false,
      method: 'GET',
      url: `${Cypress.env('FC_ROOT_URL')}/api/v2`,
    }).then((response) => {
      expect(response.status).to.eq(301);
      expect(response.headers.location).to.eq('https://agentconnect.gouv.fr');
    });
  });

  it('should log in to Service Provider Example', () => {
    const params = {
      acrValues: 'eidas1',
      idpId: idp1,
      password: '123',
      sp: sp1,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idp1);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB_SP1_IDP1);
  });

  it('should log in to Service Provider Example with POST /authorize', () => {
    const params = {
      acrValues: 'eidas1',
      idpId: idp1,
      method: 'POST',
      password: '123',
      sp: sp1,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idp1);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB_SP1_IDP1);
  });

  it('should use another sub when using another Servicer Provider', () => {
    const params = {
      acrValues: 'eidas1',
      idpId: idp1,
      method: 'GET',
      password: '123',
      sp: sp2,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idp1);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB_SP2_IDP1);
  });

  it('should use another sub when using another Identity Provider', () => {
    const params = {
      acrValues: 'eidas1',
      idpId: idp4,
      method: 'GET',
      password: '123',
      sp: sp1,
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idp4);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB_SP1_IDP4);
  });
});
