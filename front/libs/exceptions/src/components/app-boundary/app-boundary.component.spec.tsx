import { render } from '@testing-library/react';
import { useDocumentTitle } from 'usehooks-ts';

import { isErrorLike } from '@fc/common';

import { AppBoundaryComponent } from './app-boundary.component';

describe('AppBoundaryComponent', () => {
  beforeEach(() => {
    // @NOTE
    // prevent console.error to be displayed in the console
    // due to SVG Logo as string into img.src attribute
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  it('should match the snapshot', () => {
    // Given
    const errorMock = {
      message: 'any error with message mock',
      stack: 'any error with stack mock',
    };
    jest.mocked(isErrorLike).mockReturnValueOnce(true);

    // When
    const { container } = render(
      <AppBoundaryComponent error={errorMock} resetErrorBoundary={expect.any(Function)} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render with String(error) when error is not error-like', () => {
    // Given
    const errorMock = 'any string error mock';
    jest.mocked(isErrorLike).mockReturnValueOnce(false);

    // When
    const { getByTestId, getByText } = render(
      <AppBoundaryComponent error={errorMock} resetErrorBoundary={expect.any(Function)} />,
    );
    const titleElt = getByText('any string error mock');

    // Then
    expect(titleElt).toBeInTheDocument();
    expect(() => {
      getByTestId('app-boundary-error-stack');
    }).toThrow();
  });

  it('should call useDocumentTitle with the correct title', () => {
    // Given
    jest.mocked(isErrorLike).mockReturnValueOnce(true);

    // When
    render(
      <AppBoundaryComponent
        error={new Error('any error with message mock')}
        resetErrorBoundary={expect.any(Function)}
      />,
    );

    // Then
    expect(useDocumentTitle).toHaveBeenCalledOnce();
    expect(useDocumentTitle).toHaveBeenCalledWith('FranceConnect - Erreur');
  });

  it('should call isErrorLike with the correct error', () => {
    // Given
    jest.mocked(isErrorLike).mockReturnValueOnce(true);

    // When
    render(
      <AppBoundaryComponent
        error={new Error('any error with message mock')}
        resetErrorBoundary={expect.any(Function)}
      />,
    );

    // Then
    expect(isErrorLike).toHaveBeenCalledOnce();
    expect(isErrorLike).toHaveBeenCalledWith(new Error('any error with message mock'));
  });
});
