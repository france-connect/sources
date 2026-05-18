import { render } from '@testing-library/react';
import { Navigate } from 'react-router';

import { useHasServiceProviders } from '@fc/core-partners';

import { HomePage } from './home.page';

describe('HomePage', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<HomePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useHasServiceProviders hook', () => {
    // When
    render(<HomePage />);

    // Then
    expect(useHasServiceProviders).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call navigate to /instances when user has no service providers', () => {
    // Given
    jest.mocked(useHasServiceProviders).mockReturnValueOnce(false);

    // When
    render(<HomePage />);

    // Then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith({ replace: true, to: '/instances' }, undefined);
  });

  it('should call navigate to /fournisseurs-de-service when user has service providers', () => {
    // Given
    jest.mocked(useHasServiceProviders).mockReturnValueOnce(true);

    // When
    render(<HomePage />);

    // Then
    expect(Navigate).toHaveBeenCalledOnce();
    expect(Navigate).toHaveBeenCalledWith(
      { replace: true, to: '/fournisseurs-de-service' },
      undefined,
    );
  });
});
