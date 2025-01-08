import { renderHook } from '@testing-library/react';

import { renderWithScrollToElement } from '@fc/testing-library';

import { useScrollToElement } from './scroll-to-element.hook';

describe('useScrollToElement', () => {
  // Given
  const classname = '.any-classname-mock';

  it('should return an object with a scrollTo function', () => {
    // When
    const { result } = renderHook(() => useScrollToElement(classname));

    // Then
    expect(result.current.scrollToElement).toBeInstanceOf(Function);
  });

  it('should throw an error if classname argument is undefined', () => {
    // Given
    jest.spyOn(console, 'error').mockImplementationOnce(() => undefined);

    // Then
    expect(() => {
      // When
      renderHook(() => {
        const cssclass = undefined as unknown as string;
        return useScrollToElement(cssclass);
      });
    }).toThrow('classname is required');
  });

  it('should call document.querySelector after a 200ms timeout with the classname in argument', () => {
    // Given
    jest.useFakeTimers();
    const querySelectorSpy = jest.spyOn(document, 'querySelector');

    // When
    const { result } = renderHook(() => useScrollToElement(classname));
    result.current.scrollToElement();

    // Then
    expect(querySelectorSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);

    expect(querySelectorSpy).toHaveBeenCalledWith(classname);
  });

  it('should not call scrollIntoView if parent element do not exist', () => {
    // Given
    jest.useFakeTimers();
    jest
      .spyOn(document, 'querySelector')
      .mockImplementationOnce(() => undefined as unknown as HTMLElement);
    const scrollIntoViewMock = jest.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    // When
    const { result } = renderWithScrollToElement(
      () => useScrollToElement(classname),
      classname.slice(1),
    );
    result.current.scrollToElement();

    // Then
    jest.advanceTimersByTime(200);

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('should call scrollIntoView if scrollBehavior is supported', () => {
    // Given
    jest.useFakeTimers();

    const scrollIntoViewMock = jest.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    const scrollBySpy = jest.spyOn(window, 'scrollBy').mockImplementationOnce(() => jest.fn());

    // When
    const { result } = renderWithScrollToElement(
      () => useScrollToElement(classname),
      classname.slice(1),
    );
    result.current.scrollToElement();

    // Then
    jest.advanceTimersByTime(200);

    expect(scrollBySpy).not.toHaveBeenCalled();
    expect(scrollIntoViewMock).toHaveBeenCalledOnce();
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should call window.scrollBy if scrollBehavior is not supported', () => {
    // Given
    jest.useFakeTimers();
    const topPositionMock = 100;
    const scrollBySpy = jest.spyOn(window, 'scrollBy').mockImplementationOnce(() => jest.fn());
    document.documentElement.scrollIntoView = undefined as unknown as () => void;
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementationOnce(() => ({ top: topPositionMock }) as DOMRect);

    // When
    const { result } = renderWithScrollToElement(
      () => useScrollToElement(classname),
      classname.slice(1),
    );
    result.current.scrollToElement();

    // Then
    jest.advanceTimersByTime(500);

    expect(scrollBySpy).toHaveBeenCalledOnce();
    expect(scrollBySpy).toHaveBeenCalledWith({ behavior: 'smooth', left: 0, top: 100 });
  });
});
