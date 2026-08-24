import { EudiCogInvalidResolverNameException } from '../exceptions';
import { BaseResolver } from './base.resolver';

class TestResolver extends BaseResolver {
  knownMethod(): string {
    return 'ok';
  }
}

describe('BaseResolver', () => {
  let resolver: TestResolver;

  beforeEach(() => {
    resolver = new TestResolver();
  });

  describe('getResolver', () => {
    it('should return a bound function when the resolver exists', () => {
      const fn = resolver.getResolver('knownMethod');

      expect(typeof fn).toBe('function');
      expect(fn()).toBe('ok');
    });

    it('should throw EudiCogInvalidResolverNameException when the resolver does not exist', () => {
      expect(() => resolver.getResolver('unknownMethod')).toThrow(
        EudiCogInvalidResolverNameException,
      );
    });
  });
});
