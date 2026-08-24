import { decodeJwt } from 'jose';

import { extractClientId } from './extract-client-id.helper';

jest.mock('jose', () => ({
  decodeJwt: jest.fn(),
}));

describe('extractClientId', () => {
  const decodeJwtMock = jest.mocked(decodeJwt);

  const queryTokenMock = 'query-token';
  const bodyTokenMock = 'body-token';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the client_id from query when present', () => {
    // Given
    const request = {
      query: { client_id: 'query-client-id' },
      body: { client_id: 'body-client-id' },
    };

    // When
    const result = extractClientId(request);

    // Then
    expect(result).toBe('query-client-id');
  });

  it('should return the client_id from body when query has no client_id', () => {
    // Given
    const request = {
      query: {},
      body: { client_id: 'body-client-id' },
    };

    // When
    const result = extractClientId(request);

    // Then
    expect(result).toBe('body-client-id');
  });

  it('should return the client_id from body when query is undefined', () => {
    // Given
    const request = {
      body: { client_id: 'body-client-id' },
    };

    // When
    const result = extractClientId(request);

    // Then
    expect(result).toBe('body-client-id');
  });

  it('should return undefined when neither query nor body have a client_id', () => {
    // Given
    const request = {
      query: {},
      body: {},
    };

    // When
    const result = extractClientId(request);

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined when request has no query and no body', () => {
    // Given
    const request = {};

    // When
    const result = extractClientId(request);

    // Then
    expect(result).toBeUndefined();
  });

  it('should return undefined when the client_id is not a string', () => {
    // Given
    const request = {
      query: { client_id: ['first-client-id', 'second-client-id'] },
      body: {},
    };

    // When
    const result = extractClientId(request);

    // Then
    expect(result).toBeUndefined();
  });

  it('should fall back to the body when the query client_id is an empty string', () => {
    // Given
    const request = {
      query: { client_id: '' },
      body: { client_id: 'body-client-id' },
    };

    // When
    const result = extractClientId(request);

    // Then
    expect(result).toBe('body-client-id');
  });

  it('should fall back to the id_token_hint when the client_id is an empty string', () => {
    // Given
    decodeJwtMock.mockReturnValue({ aud: 'aud-query-mock' });
    const request = {
      query: { client_id: '', id_token_hint: queryTokenMock },
      body: {},
    };

    // When
    const result = extractClientId(request);

    // Then
    expect(result).toBe('aud-query-mock');
  });

  it('should not decode any token when a client_id is present', () => {
    // Given
    const request = {
      query: { client_id: 'query-client-id', id_token_hint: queryTokenMock },
      body: {},
    };

    // When
    extractClientId(request);

    // Then
    expect(decodeJwtMock).not.toHaveBeenCalled();
  });

  describe('id_token_hint fallback', () => {
    it('should decode the id_token_hint from query', () => {
      // Given
      decodeJwtMock.mockReturnValue({ aud: 'aud-mock' });
      const request = {
        query: { id_token_hint: queryTokenMock },
        body: {},
      };

      // When
      extractClientId(request);

      // Then
      expect(decodeJwtMock).toHaveBeenCalledExactlyOnceWith(queryTokenMock);
    });

    it('should return the aud from the query id_token_hint when aud is a string', () => {
      // Given
      decodeJwtMock.mockReturnValue({ aud: 'aud-query-mock' });
      const request = {
        query: { id_token_hint: queryTokenMock },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('aud-query-mock');
    });

    it('should return the first aud from the query id_token_hint when aud is an array', () => {
      // Given
      decodeJwtMock.mockReturnValue({
        aud: ['first-aud-mock', 'second-aud-mock'],
      });
      const request = {
        query: { id_token_hint: queryTokenMock },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('first-aud-mock');
    });

    it('should return undefined when the id_token_hint aud is an empty array', () => {
      // Given
      decodeJwtMock.mockReturnValue({ aud: [] });
      const request = {
        query: { id_token_hint: queryTokenMock },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return undefined when the id_token_hint payload has no aud', () => {
      // Given
      decodeJwtMock.mockReturnValue({ sub: 'sub-mock' });
      const request = {
        query: { id_token_hint: queryTokenMock },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return the aud from the body id_token_hint when query has none', () => {
      // Given
      decodeJwtMock.mockReturnValue({ aud: 'aud-body-mock' });
      const request = {
        query: {},
        body: { id_token_hint: bodyTokenMock },
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('aud-body-mock');
    });

    it('should return the aud from the body id_token_hint when query is undefined', () => {
      // Given
      decodeJwtMock.mockReturnValue({ aud: 'aud-body-mock' });
      const request = {
        body: { id_token_hint: bodyTokenMock },
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('aud-body-mock');
    });

    it('should return undefined when the id_token_hint is not a string', () => {
      // Given
      const request = {
        query: { id_token_hint: [queryTokenMock, bodyTokenMock] },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBeUndefined();
    });

    it('should not decode the id_token_hint when it is not a string', () => {
      // Given
      const request = {
        query: { id_token_hint: [queryTokenMock, bodyTokenMock] },
        body: {},
      };

      // When
      extractClientId(request);

      // Then
      expect(decodeJwtMock).not.toHaveBeenCalled();
    });

    it('should return undefined when the id_token_hint is a malformed JWT', () => {
      // Given
      decodeJwtMock.mockImplementation(() => {
        throw new Error('Invalid JWT');
      });
      const request = {
        query: { id_token_hint: 'malformed-token' },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('client_assertion fallback', () => {
    it('should decode the client_assertion from query', () => {
      // Given
      decodeJwtMock.mockReturnValue({ sub: 'sub-mock' });
      const request = {
        query: { client_assertion: queryTokenMock },
        body: {},
      };

      // When
      extractClientId(request);

      // Then
      expect(decodeJwtMock).toHaveBeenCalledExactlyOnceWith(queryTokenMock);
    });

    it('should return the sub from the query client_assertion', () => {
      // Given
      decodeJwtMock.mockReturnValue({ sub: 'sub-query-mock' });
      const request = {
        query: { client_assertion: queryTokenMock },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('sub-query-mock');
    });

    it('should return the sub from the body client_assertion when query has none', () => {
      // Given
      decodeJwtMock.mockReturnValue({ sub: 'sub-body-mock' });
      const request = {
        query: {},
        body: { client_assertion: bodyTokenMock },
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('sub-body-mock');
    });

    it('should return the sub from the body client_assertion when query is undefined', () => {
      // Given
      decodeJwtMock.mockReturnValue({ sub: 'sub-body-mock' });
      const request = {
        body: { client_assertion: bodyTokenMock },
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('sub-body-mock');
    });

    it('should return undefined when the client_assertion payload has no sub', () => {
      // Given
      decodeJwtMock.mockReturnValue({ aud: 'aud-mock' });
      const request = {
        query: { client_assertion: queryTokenMock },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return undefined when the client_assertion is not a string', () => {
      // Given
      const request = {
        query: { client_assertion: [queryTokenMock, bodyTokenMock] },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBeUndefined();
    });

    it('should not decode the client_assertion when it is not a string', () => {
      // Given
      const request = {
        query: { client_assertion: [queryTokenMock, bodyTokenMock] },
        body: {},
      };

      // When
      extractClientId(request);

      // Then
      expect(decodeJwtMock).not.toHaveBeenCalled();
    });

    it('should return undefined when the client_assertion is a malformed JWT', () => {
      // Given
      decodeJwtMock.mockImplementation(() => {
        throw new Error('Invalid JWT');
      });
      const request = {
        query: { client_assertion: 'malformed-token' },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('precedence between sources', () => {
    it('should prefer the query client_id over the query id_token_hint aud', () => {
      // Given
      decodeJwtMock.mockReturnValue({ aud: 'aud-query-mock' });
      const request = {
        query: { client_id: 'query-client-id', id_token_hint: queryTokenMock },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('query-client-id');
    });

    it('should prefer the query id_token_hint aud over the query client_assertion sub', () => {
      // Given
      decodeJwtMock.mockImplementation((token) =>
        token === queryTokenMock
          ? { aud: 'aud-query-mock' }
          : { sub: 'sub-query-mock' },
      );
      const request = {
        query: {
          id_token_hint: queryTokenMock,
          client_assertion: bodyTokenMock,
        },
        body: {},
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('aud-query-mock');
    });

    it('should prefer any query source over any body source', () => {
      // Given
      decodeJwtMock.mockReturnValue({ sub: 'sub-query-mock' });
      const request = {
        query: { client_assertion: queryTokenMock },
        body: { client_id: 'body-client-id' },
      };

      // When
      const result = extractClientId(request);

      // Then
      expect(result).toBe('sub-query-mock');
    });
  });
});
