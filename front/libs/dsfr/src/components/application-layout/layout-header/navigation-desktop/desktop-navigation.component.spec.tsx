import { render } from '@testing-library/react';

import { NavigationLinksComponent } from '../navigation-links';
import { DesktopNavigationComponent } from './desktop-navigation.component';

jest.mock('../navigation-links/navigation-links.component');

describe('DesktopNavigationComponent', () => {
  // given
  const navigationLinksMock = [expect.any(Object), expect.any(Object)];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call NavigationLinksComponent with navigation links', () => {
    // when
    render(<DesktopNavigationComponent navigationLinks={navigationLinksMock} />);
    // then
    expect(NavigationLinksComponent).toHaveBeenCalledTimes(1);
    expect(NavigationLinksComponent).toHaveBeenCalledWith(
      expect.objectContaining({ items: navigationLinksMock }),
      {},
    );
  });

  it('should call NavigationLinksComponent with classes', () => {
    // when
    render(<DesktopNavigationComponent navigationLinks={navigationLinksMock} />);
    // then
    expect(NavigationLinksComponent).toHaveBeenCalledTimes(1);
    expect(NavigationLinksComponent).toHaveBeenCalledWith(
      expect.objectContaining({ className: 'DesktopNavigationComponent-item p16' }),
      {},
    );
  });
});
