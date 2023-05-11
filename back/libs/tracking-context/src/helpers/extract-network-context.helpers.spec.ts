import { TrackingMissingNetworkContextException } from '../exceptions';
import { NetworkContextInterface } from '../interfaces';
import { extractNetworkInfoFromHeaders } from './extract-network-context.helper';

describe('extractNetworkInfoFromHeaders', () => {
  const ipMock = '123.123.123.123';
  const sourcePortMock = '443';
  const xForwardedForOriginalMock = '123.123.123.123, 124.124.124.124';

  it('should throw if header is missing', () => {
    // Given
    const contextMock = { req: { fc: { interactionId: 'foo' } } };
    // Then
    expect(() => extractNetworkInfoFromHeaders(contextMock)).toThrow(
      TrackingMissingNetworkContextException,
    );
  });

  it('should retrieve network information from the provided context.', () => {
    // Given
    const contextMock = {
      req: {
        headers: {
          'x-forwarded-for': ipMock,
          'x-forwarded-source-port': sourcePortMock,
          'x-forwarded-for-original': xForwardedForOriginalMock,
        },
        fc: { interactionId: 'foo' },
      },
    };
    const expected: NetworkContextInterface = {
      address: ipMock,
      port: sourcePortMock,
      // logs filter and analyses need this format
      // eslint-disable-next-line @typescript-eslint/naming-convention
      original_addresses: xForwardedForOriginalMock,
    };
    // When
    const result = extractNetworkInfoFromHeaders(contextMock);
    // Then
    expect(result).toEqual(expected);
  });
});
