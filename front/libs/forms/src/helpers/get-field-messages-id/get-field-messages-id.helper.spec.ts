import { getFieldMessagesId } from './get-field-messages-id.helper';

describe('getFieldMessagesId', () => {
  it('should build messages group id from field name', () => {
    // When
    const result = getFieldMessagesId('email');

    // Then
    expect(result).toBe('email-messages');
  });
});
