import { render } from '@testing-library/react';

import { useSafeContext } from '@fc/common';
import { ConfigService } from '@fc/config';

import { LayoutHeaderBrandComponent } from './brand';
import { LayoutHeaderComponent } from './layout-header.component';
import { LayoutHeaderMenuComponent } from './menu';
import { LayoutHeaderToolsComponent } from './tools';

jest.mock('./menu/layout-header.menu');
jest.mock('./tools/layout-header.tools');
jest.mock('./brand/layout-header.brand');

describe('LayoutHeaderComponent', () => {
  beforeEach(() => {
    // given
    jest.mocked(ConfigService.get).mockReturnValue(expect.any(Object));
    jest.mocked(useSafeContext).mockReturnValue({
      isUserConnected: true,
    });
  });

  it('should match the snapshot when user is connected', () => {
    // given
    const navigationItemsMock = jest.fn();
    jest.mocked(ConfigService.get).mockReturnValue({
      navigation: navigationItemsMock,
    });

    // when
    const { container } = render(<LayoutHeaderComponent />);

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderBrandComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderBrandComponent).toHaveBeenCalledWith({}, {});
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledWith({}, {});
    expect(LayoutHeaderMenuComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderMenuComponent).toHaveBeenCalledWith(
      {
        navigation: navigationItemsMock,
      },
      {},
    );
  });

  it('should match the snapshot when user is not connected', () => {
    // given
    jest.mocked(useSafeContext).mockReturnValue({
      isUserConnected: false,
    });

    // when
    const { container } = render(<LayoutHeaderComponent />);

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutHeaderBrandComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderBrandComponent).toHaveBeenCalledWith({}, {});
    expect(LayoutHeaderToolsComponent).not.toHaveBeenCalledOnce();
    expect(LayoutHeaderMenuComponent).not.toHaveBeenCalledOnce();
  });
});
