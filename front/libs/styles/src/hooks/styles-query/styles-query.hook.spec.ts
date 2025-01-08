import { renderHook } from '@testing-library/react';
import { useMediaQuery } from 'usehooks-ts';

import { objectToMediaQuery } from '../../helpers';
import { useStylesQuery } from './styles-query.hook';

jest.mock('../../helpers/object-to-media-query/object-to-media-query.helper');

describe('useStylesQuery', () => {
  it('should call objectToMediaQuery with params', () => {
    // Given
    const query = {
      maxWidth: '1024px',
      minWidth: '768px',
    };

    // When
    renderHook(() => useStylesQuery(query));

    // Then
    expect(objectToMediaQuery).toHaveBeenCalledWith(query);
  });

  it('should call useMediaQuery with the correct media query', () => {
    // Given
    jest.mocked(objectToMediaQuery).mockReturnValue('(min-width: 768px) and (max-width: 1024px)');

    // When
    renderHook(() => useStylesQuery(expect.any(Object)));

    // Then
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 768px) and (max-width: 1024px)');
  });

  it('should return a boolean as result of useMediaQuery', () => {
    // Given
    jest.mocked(useMediaQuery).mockReturnValue(true);

    // When
    const { result } = renderHook(() => useStylesQuery(expect.any(Object)));

    // Then
    expect(result.current).toBeTrue();
  });
});
