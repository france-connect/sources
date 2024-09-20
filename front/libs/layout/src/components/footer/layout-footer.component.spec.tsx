import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { LayoutFooterBottomComponent } from './bottom';
import { LayoutFooterBrandComponent } from './brand';
import { LayoutFooterContentComponent } from './content';
import { LayoutFooterComponent } from './layout-footer.component';

jest.mock('./bottom/layout-footer.bottom');
jest.mock('./brand/layout-footer.brand');
jest.mock('./content/layout-footer.content');

describe('LayoutFooterComponent', () => {
  beforeEach(() => {
    // given
    jest.mocked(ConfigService.get).mockReturnValue({
      features: { showLicence: expect.any(Boolean) },
      footer: { navigation: expect.any(Array) },
    });
  });

  it('should call ConfigService.get with Layout config name', () => {
    // when
    render(<LayoutFooterComponent />);

    // then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should call LayoutFooterBrandComponent', () => {
    // when
    render(<LayoutFooterComponent />);

    // then
    expect(LayoutFooterBrandComponent).toHaveBeenCalledOnce();
  });

  it('should call LayoutFooterContentComponent', () => {
    // when
    render(<LayoutFooterComponent />);

    // then
    expect(LayoutFooterContentComponent).toHaveBeenCalledOnce();
  });

  it('should call LayoutFooterBottomComponent when features.showLicence is true', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValue({
      features: { showLicence: true },
      footer: { navigation: undefined },
    });

    // when
    const { container } = render(<LayoutFooterComponent />);

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutFooterBottomComponent).toHaveBeenCalledOnce();
  });

  it('should call LayoutFooterBottomComponent when footer.navigation is defined', () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValue({
      features: { showLicence: false },
      footer: { navigation: expect.any(Array) },
    });

    // when
    const { container } = render(<LayoutFooterComponent />);

    // then
    expect(container).toMatchSnapshot();
    expect(LayoutFooterBottomComponent).toHaveBeenCalledOnce();
  });
});