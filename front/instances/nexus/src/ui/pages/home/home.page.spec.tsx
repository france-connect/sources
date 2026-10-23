import { render } from '@testing-library/react';
import { useLoaderData } from 'react-router';

import { HomePage } from './home.page';

describe('HomePage', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useLoaderData).mockReturnValue({ data: { status: 'OK' } });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<HomePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call loaderData', () => {
    // When
    render(<HomePage />);

    // Then
    expect(useLoaderData).toHaveBeenCalledOnce();
  });

  it('should render the status returned by the loader in the title', () => {
    // Given
    jest.mocked(useLoaderData).mockReturnValueOnce({ data: { status: 'any-status-mock' } });

    // When
    const { getByTestId } = render(<HomePage />);
    const titleElt = getByTestId('home-page-title');

    // Then
    expect(titleElt).toBeInTheDocument();
    expect(titleElt).toHaveTextContent('any-status-mock');
  });
});
