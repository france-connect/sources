import { act, renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';
import { mocked } from 'ts-jest/utils';

import { getSlugFromSearchTerm, searchByTerm } from '../core/search';
import { useSearch } from './use-search.hook';

const ministries = {
  identityProviders: [
    {
      active: true,
      display: true,
      name: 'pompiers',
      uid: '1.1',
    },
  ],
  ministries: [
    {
      id: 'ministere-defense',
      identityProviders: ['1.1', '1.2', '1.3'],
      name: ' Ministère de la Défense',
      sort: 1,
    },
  ],
};

jest.mock('../core/search');

let mockUseSelector;

describe('useSearch', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    mockUseSelector = jest.spyOn(reactRedux, 'useSelector');
    mockUseSelector.mockReturnValue(ministries);
  });

  it('should check default returned values on first render', () => {
    // when
    const { result } = renderHook(() => useSearch());
    // then
    expect(result.current.results).toStrictEqual([]);
    expect(result.current.searchTerm).toBeUndefined();
    expect(typeof result.current.onFormChange).toBe('function');
  });

  it('should update searchTerm state when onFormChange is triggered', () => {
    // when
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.onFormChange('any value');
    });
    // then
    expect(result.current.searchTerm).toBe('any value');
  });

  it('should call getSlugFromSearchTerm when onFormChange is triggered', () => {
    // given
    const searchTerm = 'any value with accent éè';
    const spy = mocked(getSlugFromSearchTerm, true);
    // when
    const { result } = renderHook(() => useSearch());
    act(() => result.current.onFormChange(searchTerm));
    // then
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(searchTerm);
  });

  it('should call searchByTerm when onFormChange is triggered', () => {
    // given

    const searchTerm = 'defense';
    const spy = mocked(searchByTerm, true);

    const mockGetSlugFromSearchTerm = mocked(getSlugFromSearchTerm, true);
    mockGetSlugFromSearchTerm.mockReturnValueOnce(searchTerm);

    // when
    const { result } = renderHook(() => useSearch());
    act(() => result.current.onFormChange(searchTerm));
    // then
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ministries, searchTerm);
  });
});
