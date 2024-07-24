import { renderHook } from '@testing-library/react';
import { useMediaQuery } from 'usehooks-ts';

import { objectToMediaQuery } from '../../helpers';
import { useStylesQuery } from './styles-query.hook';

jest.mock('usehooks-ts');
jest.mock('../../helpers/object-to-media-query/object-to-media-query.helper');

describe('useStylesQuery', () => {
  it('should call objectToMediaQuery with params', () => {
    // given
    const query = {
      maxWidth: '1024px',
      minWidth: '768px',
    };

    // when
    renderHook(() => useStylesQuery(query));

    // then
    expect(objectToMediaQuery).toHaveBeenCalledWith(query);
  });

  it('should call useMediaQuery with the correct media query', () => {
    // given
    jest.mocked(objectToMediaQuery).mockReturnValue('(min-width: 768px) and (max-width: 1024px)');

    // when
    renderHook(() => useStylesQuery(expect.any(Object)));

    // then
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 768px) and (max-width: 1024px)');
  });

  it('should return a boolean as result of useMediaQuery', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValue(true);

    // when
    const { result } = renderHook(() => useStylesQuery(expect.any(Object)));

    // then
    expect(result.current).toBeTrue();
  });
});
