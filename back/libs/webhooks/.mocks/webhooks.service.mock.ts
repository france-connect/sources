export function getWebhooksServiceMock() {
  return {
    sign: jest.fn(),
    verifySignature: jest.fn(),
  };
}
