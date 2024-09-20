import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { LayoutHeaderAccountComponent } from '../account';
import { LayoutHeaderLogoutButton } from '../logout';
import { LayoutHeaderToolsComponent } from './layout-header.tools';

jest.mock('../logout/layout-header.logout');
jest.mock('../account/layout-header.account');

describe('LayoutHeaderToolsComponent', () => {
  beforeEach(() => {
    // given
    jest
      .mocked(ConfigService.get)
      .mockReturnValue({ endpoints: { logout: 'any logout url mock' } });
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutHeaderToolsComponent />);

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderAccountComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderAccountComponent).toHaveBeenCalledWith({}, {});
    expect(LayoutHeaderLogoutButton).toHaveBeenCalledOnce();
    expect(LayoutHeaderLogoutButton).toHaveBeenCalledWith(
      { endSessionUrl: 'any logout url mock' },
      {},
    );
  });

  it('should call ConfigService.get with AccountConfig name', () => {
    // when
    render(<LayoutHeaderToolsComponent />);

    // then
    expect(ConfigService.get).toHaveBeenCalledWith('Account');
  });

  it('should match the snapshot, when AccountConfig?.endpoints are undefined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({});

    // when
    const { container } = render(<LayoutHeaderToolsComponent />);

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderLogoutButton).not.toHaveBeenCalled();
  });

  it('should match the snapshot, when AccountConfig?.endpoints.logout is undefined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValueOnce({ endpoints: {} });

    // when
    const { container } = render(<LayoutHeaderToolsComponent />);

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderLogoutButton).not.toHaveBeenCalled();
  });
});
