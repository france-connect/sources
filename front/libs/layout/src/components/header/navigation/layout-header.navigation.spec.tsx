import { render } from '@testing-library/react';
import { NavLink } from 'react-router';

import { LayoutHeaderNavigationComponent } from './layout-header.navigation';

describe('LayoutHeaderNavigationComponent', () => {
  // Given
  const navigationMock = [
    {
      href: 'any-href-mock-1',
      label: 'any-label-mock-1',
      title: 'any-title-mock-1',
    },
    {
      href: 'any-href-mock-2',
      label: 'any-label-mock-2',
      title: 'any-title-mock-2',
    },
  ];

  it('should match the snapshot, with default props', () => {
    // When
    const { container } = render(<LayoutHeaderNavigationComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with navigation defined', () => {
    // When
    const { container } = render(<LayoutHeaderNavigationComponent navigation={navigationMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with navigation and without title', () => {
    // When
    const { container } = render(
      <LayoutHeaderNavigationComponent
        navigation={[
          {
            href: 'any-href-mock-without-title',
            label: 'any-label-mock-without-title',
          },
        ]}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call react router Link 2 times', () => {
    // When
    render(<LayoutHeaderNavigationComponent navigation={navigationMock} />);

    // Then
    expect(NavLink).toHaveBeenCalledTimes(2);
    expect(NavLink).toHaveBeenNthCalledWith(
      1,
      {
        children: navigationMock[0].label,
        className: 'fr-nav__link',
        onClick: undefined,
        target: '_self',
        title: navigationMock[0].title,
        to: navigationMock[0].href,
      },
      undefined,
    );
    expect(NavLink).toHaveBeenNthCalledWith(
      2,
      {
        children: navigationMock[1].label,
        className: 'fr-nav__link',
        onClick: undefined,
        target: '_self',
        title: navigationMock[1].title,
        to: navigationMock[1].href,
      },
      undefined,
    );
  });
});
