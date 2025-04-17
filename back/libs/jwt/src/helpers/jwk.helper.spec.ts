import { JwkHelper } from './jwk.helper';

describe('JwkHelper', () => {
  describe('publicFromPrivate', () => {
    it('should return public key from private key', async () => {
      const privateJwk = {
        e: 'AQAB',
        n: 'foo',
        d: 'aq4WJ6Z-yQc3vrI4wXHJt1VzkCSfIJvC7BGj_y9nFOYap87nZNMkAFIhe6a5FF-4g090C2-cXXiW5VXkza_hw7jpI20RtBQTpIvIkCoUe-I6hFg-pGqfxXYm-YfooyrSC8m9F_8HT6xpSBKIEC1XgQtGe8m5rM9wxMKl0TWiz_jkMfzxFmILO0KQBCJvlkVvW9Fc7eFo4hrtKCc8grcVgiltV4gv4DGcqKQBTslI_PnUylfqFxedVl8FFT-MShIdYa_-JwMU-BF_DBJFGlN7fo5ss6972QD6JNfMBgChMcNgNs8NwnTT7spISfSuGAIDKKmOLFCmB6xg9lH9INMhoQ',
        p: '39Ccclk7AVkRVSfeMyHtWadYSVJZo20hhVRPQrAs_5JbdiejNqOgMm__aRoh9TePGElA8FDtAWCR53P7AQO8U_wZ0w32gn77IGOyAN6WZkfMHRIS0JgERr-9OKYkZ4sCMfOLxqwcyKkNudyizyG9plUdRiY1dnWi_Ag7SuVrst0',
        q: '1aYj86jBmttuL-85Tna543pIKgbL5xRYzjcVbSAtCDC-aLIuVfGFCcVyTXtIRbPqTE_M2n6W2RE3Eh7shkaMRP8gREuhM6SxVr2PkVjE5w2OKugJgs4bGPamWYWVVu_cRWlt9xwZJUKOhNX2soeBt_SIrCURGwaWFfePy3wFFwU',
        dp: 'DtFt-jgkKvOtrRiloncFkuD8fGZCXwqTpJMvaDfn0sfq3EjFipGMwqodm-TKCMUz6SS4cvC4sFWnc05_eNK5fkn7n7iV8I_dqohPObWC-aSZQ_d1XXAjIFgDfCOr11shuxLn1zB_-10N9pdABDy0pLWP6ZwQABbLwqn82vmThtU',
        dq: 'DnK926x960sLmJJE_dlpmMicOLtc7rOhjdCL0mVqpjMlrU7fc1Bx_scrg7HioVQZdC-xWtVUvjk70C3nMO10bvYR6Ix0yllI5OTM4LdwGXABPUWT3xSxIG8NsOAnyUlPTCJlHWD5Elv9513Q4SHo09flpj6beYhoffPP9aLddUE',
        qi: 'jjbChoLdsQKinsDnichWtwyQ_M3F8ygncwVBBvbmHGUFCxZCDUc-zOA-Wipb9DxYCyu65FUpUGnxXo4yYLwtibd9ler1_7rLyZxtpAspuFvBRrScJh0x_lMvyhhf_YsNTWsOgM7YPBwU-Fis44kapNX1-AXIacgSfyspzGf-EEA',
        kty: 'RSA',
        alg: 'RSA-OAEP',
        kid: 'test-key',
        use: 'enc',
      };

      const publicJwk = await JwkHelper.publicFromPrivate(privateJwk);

      expect(publicJwk).toEqual({
        kty: 'RSA',
        kid: 'test-key',
        use: 'enc',
        alg: 'RSA-OAEP',
        n: 'foo',
        e: 'AQAB',
      });
    });
  });
});
