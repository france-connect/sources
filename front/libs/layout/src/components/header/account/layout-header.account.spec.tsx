import { render } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import { LayoutContext } from '../../../context';
import { LayoutHeaderAccountComponent } from './layout-header.account';

describe('LayoutHeaderAccountComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(useSafeContext).mockReturnValue({
      userinfos: {
        firstname: 'any firstname mock',
        lastname: 'any lastname mock',
      },
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<LayoutHeaderAccountComponent />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-btn fr-icon-account-line');
  });

  it('should call useSafeContext', () => {
    // When
    render(<LayoutHeaderAccountComponent />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(LayoutContext);
  });

  it('should render null when userinfos is not defined', () => {
    // Given
    jest.mocked(useSafeContext).mockReturnValue({});

    // When
    const { container } = render(<LayoutHeaderAccountComponent />);

    // Then
    expect(container.firstChild).toBeNull();
  });

  it('should render lastname and firstname', () => {
    // When
    const { getByText } = render(<LayoutHeaderAccountComponent />);
    const elementText = getByText('any firstname mock any lastname mock');

    // Then
    expect(elementText).toBeInTheDocument();
  });
});
