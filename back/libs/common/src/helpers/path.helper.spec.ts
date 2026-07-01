import { parameterizedPath } from './path.helper';

describe('parameterizedPath', () => {
  it('should replace a single parameter with its value', () => {
    // When
    const result = parameterizedPath('/request/:id', { id: '123' });

    // Then
    expect(result).toBe('/request/123');
  });

  it('should replace multiple parameters with their values', () => {
    // When
    const result = parameterizedPath('/users/:userId/posts/:postId', {
      userId: 'u1',
      postId: 'p2',
    });

    // Then
    expect(result).toBe('/users/u1/posts/p2');
  });

  it('should leave the placeholder unchanged when no matching key is provided', () => {
    // When
    const result = parameterizedPath('/request/:id', {});

    // Then
    expect(result).toBe('/request/:id');
  });

  it('should leave the placeholder unchanged when its value is an empty string', () => {
    // When
    const result = parameterizedPath('/request/:id', { id: '' });

    // Then
    expect(result).toBe('/request/:id');
  });

  it('should return the input path unchanged when there is no placeholder', () => {
    // When
    const result = parameterizedPath('/static/path', { id: '123' });

    // Then
    expect(result).toBe('/static/path');
  });

  it('should ignore params that do not match any placeholder', () => {
    // When
    const result = parameterizedPath('/request/:id', {
      id: '123',
      extra: 'ignored',
    });

    // Then
    expect(result).toBe('/request/123');
  });

  it('should replace placeholders that appear multiple times in the path', () => {
    // When
    const result = parameterizedPath('/:id/foo/:id', { id: '42' });

    // Then
    expect(result).toBe('/42/foo/42');
  });
});
