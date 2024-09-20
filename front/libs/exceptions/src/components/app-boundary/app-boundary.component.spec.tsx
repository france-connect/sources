import { render } from '@testing-library/react';
import { useDocumentTitle } from 'usehooks-ts';

import { AppBoundaryComponent } from './app-boundary.component';

describe('AppBoundaryComponent', () => {
  beforeEach(() => {
    // @NOTE
    // prevent console.error to be displayed in the console
    // due to SVG Logo as string into img.src attribute
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should match the snapshot', () => {
    // given
    const errorMock = {
      message: 'any error with message mock',
      stack: 'any error with stack mock',
    };

    // when
    const { container } = render(
      <AppBoundaryComponent error={errorMock} resetErrorBoundary={expect.any(Function)} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call useDocumentTitle with the correct title', () => {
    // when
    render(
      <AppBoundaryComponent
        error={new Error('any error with message mock')}
        resetErrorBoundary={expect.any(Function)}
      />,
    );

    // then
    expect(useDocumentTitle).toHaveBeenCalledOnce();
    expect(useDocumentTitle).toHaveBeenCalledWith('FranceConnect - Erreur');
  });
});
