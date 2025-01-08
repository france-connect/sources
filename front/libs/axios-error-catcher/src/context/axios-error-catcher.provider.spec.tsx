import { render } from '@testing-library/react';
import axios from 'axios';
import React from 'react';

import { AxiosErrorCatcherProvider } from './axios-error-catcher.provider';

jest.mock('./axios-error-catcher.context');

describe('AxiosErrorCatcherProvider', () => {
  // Given
  const Provider = () => (
    <AxiosErrorCatcherProvider>
      <div data-testid="ChildComponent" />
    </AxiosErrorCatcherProvider>
  );

  beforeEach(() => {
    // Given
    jest
      .spyOn(React, 'useState')
      .mockReturnValue([{ codeError: undefined, hasError: false, initialized: false }, jest.fn()]);
  });

  it('should return null, if not initialized', () => {
    // Given
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ initialized: false }, jest.fn()]);

    // When
    const { container } = render(<Provider />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toBeNull();
  });

  it('should render the child component, if initialized', () => {
    // Given
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ initialized: true }, jest.fn()]);

    // When
    const { container, getByTestId } = render(<Provider />);
    const element = getByTestId('ChildComponent');

    // Then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
  });

  it('should initialize the state', () => {
    // Given
    const useStateMock = jest.spyOn(React, 'useState');

    // When
    render(<Provider />);

    // Then
    expect(useStateMock).toHaveBeenCalledOnce();
    expect(useStateMock).toHaveBeenCalledWith({
      codeError: undefined,
      hasError: false,
      initialized: false,
    });
  });

  it('should initialize axios interceptors on first render only', () => {
    // Given
    const useEffectMock = jest.spyOn(React, 'useEffect');

    // When
    const { rerender } = render(<Provider />);
    // @NOTE
    // excessive multiple rerenders (6)
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);

    // Then
    expect(useEffectMock).toHaveBeenCalledTimes(6);
    expect(useEffectMock).toHaveBeenCalledWith(expect.any(Function), []);

    expect(axios.interceptors.request.use).toHaveBeenCalledOnce();
    expect(axios.interceptors.request.use).toHaveBeenCalledWith(expect.any(Function), undefined);
    expect(axios.interceptors.response.use).toHaveBeenCalledOnce();
    expect(axios.interceptors.response.use).toHaveBeenCalledWith(undefined, expect.any(Function));
  });

  it('should eject axios interceptors on unmount', () => {
    // Given
    const interceptorNumber = Symbol(123) as unknown as number;
    jest.mocked(axios.interceptors.request.use).mockReturnValue(interceptorNumber);
    jest.mocked(axios.interceptors.response.use).mockReturnValue(interceptorNumber);

    // When
    const { unmount } = render(<Provider />);
    unmount();

    // Then
    expect(axios.interceptors.request.eject).toHaveBeenCalledOnce();
    expect(axios.interceptors.request.eject).toHaveBeenCalledWith(interceptorNumber);
    expect(axios.interceptors.response.eject).toHaveBeenCalledOnce();
    expect(axios.interceptors.response.eject).toHaveBeenCalledWith(interceptorNumber);
  });

  it('should update the state on first render only', () => {
    // Given
    const setStateMock = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([expect.any(Object), setStateMock]);

    // When
    const { rerender } = render(<Provider />);
    // @NOTE
    // excessive multiple rerenders
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);
    rerender(<Provider />);

    // Then
    expect(setStateMock).toHaveBeenCalledOnce();
    expect(setStateMock).toHaveBeenCalledWith(expect.any(Function));

    // When
    // Check the function passed to setState
    const callback = setStateMock.mock.calls[0][0];
    const result = callback({ codeError: undefined, hasError: false, initialized: false });

    // Then
    expect(result).toStrictEqual({ codeError: undefined, hasError: false, initialized: true });
  });
});
