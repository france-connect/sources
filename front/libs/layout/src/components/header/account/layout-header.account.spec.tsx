import { render } from '@testing-library/react';

import { useSafeContext } from '@fc/common';

import { LayoutContext } from '../../../context';
import { LayoutHeaderAccountComponent } from './layout-header.account';

describe('LayoutHeaderAccountComponent', () => {
  beforeEach(() => {
    // given
    jest.mocked(useSafeContext).mockReturnValue({
      userinfos: {
        firstname: 'any firstname mock',
        lastname: 'any lastname mock',
      },
    });
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutHeaderAccountComponent />);

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-btn fr-icon-account-line');
  });

  it('should call useSafeContext', () => {
    // when
    render(<LayoutHeaderAccountComponent />);

    // then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(LayoutContext);
  });

  it('should render null when userinfos is not defined', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValue({});

    // when
    const { container } = render(<LayoutHeaderAccountComponent />);

    // then
    expect(container.firstChild).toBeNull();
  });

  it('should render lastname and firstname', () => {
    // when
    const { getByText } = render(<LayoutHeaderAccountComponent />);
    const elementText = getByText('any firstname mock any lastname mock');

    // then
    expect(elementText).toBeInTheDocument();
  });
});
