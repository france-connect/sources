import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { LayoutHeaderAccountComponent } from '../account';
import { LayoutHeaderLogoutButton } from '../logout';
import { LayoutHeaderToolsComponent } from './layout-header.tools';

jest.mock('../logout/layout-header.logout');
jest.mock('../account/layout-header.account');

describe('LayoutHeaderToolsComponent', () => {
  beforeEach(() => {
    // Given
    jest
      .mocked(ConfigService.get)
      .mockReturnValue({ endpoints: { logout: 'any logout url mock' } });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<LayoutHeaderToolsComponent />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderAccountComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderAccountComponent).toHaveBeenCalledWith({}, undefined);
    expect(LayoutHeaderLogoutButton).toHaveBeenCalledOnce();
    expect(LayoutHeaderLogoutButton).toHaveBeenCalledWith(
      { endSessionUrl: 'any logout url mock' },
      undefined,
    );
  });

  it('should call ConfigService.get with AccountConfig name', () => {
    // When
    render(<LayoutHeaderToolsComponent />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledWith('Account');
  });

  it('should match the snapshot, when AccountConfig?.endpoints are undefined', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({});

    // When
    const { container } = render(<LayoutHeaderToolsComponent />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderLogoutButton).not.toHaveBeenCalled();
  });

  it('should match the snapshot, when AccountConfig?.endpoints.logout is undefined', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({ endpoints: {} });

    // When
    const { container } = render(<LayoutHeaderToolsComponent />);

    // Then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderLogoutButton).not.toHaveBeenCalled();
  });
});
