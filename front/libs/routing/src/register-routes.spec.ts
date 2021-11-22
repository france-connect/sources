import { MissingSpecialRouteException } from './exceptions';
import {
  validateSpecialRoutes,
  registerRoutes,
  sortRouteByPathDesc,
} from './register-routes';
import { RouteItem } from './interfaces';
import { generics, homepage, notfound } from './routes.mock';

describe('validateSpecialRoutes', () => {
  it('should throw if notfound is missing', () => {
    // given
    const input = [homepage, { ...notfound, path: '/not-valid' }];
    // then
    expect(() => {
      validateSpecialRoutes(input);
    }).toThrow(MissingSpecialRouteException);
  });

  it('should throw if homepage is missing', () => {
    // given
    const input = [notfound, { ...homepage, path: '/not-valid' }];
    // then
    expect(() => {
      validateSpecialRoutes(input);
    }).toThrow(MissingSpecialRouteException);
  });

  it('should throw if both are present but not in the correct order', () => {
    // given
    const input = [notfound, homepage];
    // then
    expect(() => {
      validateSpecialRoutes(input);
    }).toThrow(MissingSpecialRouteException);
  });

  it('should not throw if both are present and in the correct order', () => {
    // given
    const input = [homepage, notfound];
    // then
    expect(() => {
      validateSpecialRoutes(input);
    }).not.toThrow();
  });
});

describe('concatApplicationRoutes', () => {
  it('should throw if homepage path is not a valid path', () => {
    // given
    const input: RouteItem[] = [
      { ...notfound, path: '/not-valid' },
      ...generics,
      homepage,
    ];
    // then
    expect(() => {
      registerRoutes(input);
    }).toThrow();
  });

  it('should return homepage and notfound entries as last entries', () => {
    // Given
    const input = [notfound, ...generics, homepage];
    // when
    const results = registerRoutes(input);
    // then
    const len = results.length;
    expect(results[len - 2].path).toStrictEqual(homepage.path);
    expect(results[len - 1].path).toStrictEqual(notfound.path);
  });
});

describe('sortRouteByPathDesc', () => {
  it('should return an array of sorted routes by path DESC, simpliest route paths always last', () => {
    // when
    const results = (generics as RouteItem[]).sort(sortRouteByPathDesc);
    // then
    const len = generics.length;
    expect(results).toHaveLength(len);
    expect(results[0].path).toStrictEqual('/mock/sub/:id');
    expect(results[1].path).toStrictEqual('/mock/:id/sub');
    expect(results[2].path).toStrictEqual('/mock/:id');
    expect(results[3].path).toStrictEqual('/mock');
    expect(results[4].path).toStrictEqual('/contact');
  });

  it('should put home and 404 pages at the end', () => {
    // Given
    const routes = [
      { path: '/abc' },
      { path: '/123' },
      { path: '/123' },
      { path: '/' },
      { path: '/*' },
      { path: '/def' },
      { path: '/GHI' },
      { path: '/5678' },
      { path: '/-foo' },
      { path: '/_bar' },
    ] as RouteItem[];
    // When
    const result = routes.sort(sortRouteByPathDesc);
    // Then
    expect(result).toEqual([
      { path: '/def' },
      { path: '/abc' },
      { path: '/_bar' },
      { path: '/GHI' },
      { path: '/5678' },
      { path: '/123' },
      { path: '/123' },
      { path: '/-foo' },
      { path: '/*' },
      { path: '/' },
    ]);
  });
});
