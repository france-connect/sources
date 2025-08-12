import { render } from '@testing-library/react';

import { SeeAlsoElement } from './see-also.element';

describe('SeeAlso', () => {
  it('should render a blank string if there is no url', () => {
    // Given
    const urlMock = undefined;

    // When
    const { container } = render(<SeeAlsoElement id="test" url={urlMock} />);

    // Then
    expect(container.textContent?.trim()).toBe('');
  });

  it('should match the snapshot', () => {
    // Given
    const urlMock = 'http://foo.bar/test';

    // When
    const { container } = render(<SeeAlsoElement id="test" url={urlMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-link');
    expect(container.firstChild).toHaveAttribute('href', urlMock);
  });
});
