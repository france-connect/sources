import { render } from '@testing-library/react';
import { Link, matchPath } from 'react-router-dom';

import { LayoutHeaderNavigationComponent } from './layout-header-navigation.component';

describe('LayoutHeaderNavigationComponent', () => {
  // given
  const navigationItemsMock = [
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
    // when
    const { container } = render(<LayoutHeaderNavigationComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with navigationItems defined', () => {
    // when
    const { container } = render(
      <LayoutHeaderNavigationComponent navigationItems={navigationItemsMock} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with navigationItems and without title', () => {
    // when
    const { container } = render(
      <LayoutHeaderNavigationComponent
        navigationItems={[
          {
            href: 'any-href-mock-without-title',
            label: 'any-label-mock-without-title',
          },
        ]}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with className defined', () => {
    // when
    const { container } = render(
      <LayoutHeaderNavigationComponent
        className="any-classname"
        navigationItems={navigationItemsMock}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call react router Link 2 times', () => {
    // when
    render(<LayoutHeaderNavigationComponent navigationItems={navigationItemsMock} />);

    // then
    expect(Link).toHaveBeenCalledTimes(2);
    expect(Link).toHaveBeenNthCalledWith(
      1,
      {
        children: navigationItemsMock[0].label,
        className: 'fr-nav__link',
        onClick: undefined,
        target: '_self',
        title: navigationItemsMock[0].title,
        to: navigationItemsMock[0].href,
      },
      {},
    );
    expect(Link).toHaveBeenNthCalledWith(
      2,
      {
        children: navigationItemsMock[1].label,
        className: 'fr-nav__link',
        onClick: undefined,
        target: '_self',
        title: navigationItemsMock[1].title,
        to: navigationItemsMock[1].href,
      },
      {},
    );
  });

  it('should call the second Link with aria-current equal page', () => {
    // given
    jest.mocked(matchPath).mockReturnValueOnce(null).mockReturnValueOnce(expect.any(Object));

    // when
    render(<LayoutHeaderNavigationComponent navigationItems={navigationItemsMock} />);

    // then
    expect(Link).toHaveBeenNthCalledWith(
      2,
      {
        // @NOTE unable to create a eslint rule to match this case
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'aria-current': 'page',
        children: navigationItemsMock[1].label,
        className: 'fr-nav__link',
        onClick: undefined,
        target: '_self',
        title: navigationItemsMock[1].title,
        to: navigationItemsMock[1].href,
      },
      {},
    );
  });
});
