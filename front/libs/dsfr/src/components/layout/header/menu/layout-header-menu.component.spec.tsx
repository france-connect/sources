import { render } from '@testing-library/react';

import { LayoutHeaderToolsComponent } from '../tools';
import { LayoutHeaderMenuComponent } from './layout-header-menu.component';
import { LayoutHeaderNavigationComponent } from './layout-header-navigation.component';

jest.mock('./layout-header-navigation.component');
jest.mock('../tools/layout-header-tools.component');

describe('LayoutHeaderMenuComponent', () => {
  const navigationItemsMock = [
    {
      a11y: 'any-a11y-mock-1',
      href: 'any-href-mock-1',
      label: 'any-label-mock-1',
    },
    {
      a11y: 'any-a11y-mock-2',
      href: 'any-href-mock-2',
      label: 'any-label-mock-2',
    },
    {
      a11y: 'any-a11y-mock-3',
      href: 'any-href-mock-3',
      label: 'any-label-mock-3',
    },
  ];

  it('should match the snapshot', () => {
    // given
    const onCloseMock = jest.fn();

    // when
    const { container } = render(
      <LayoutHeaderMenuComponent
        firstname="any-firstname-mock"
        isMobile={false}
        lastname="any-lastname-mock"
        opened={false}
        onClose={onCloseMock}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when opened is true', () => {
    // given
    const onCloseMock = jest.fn();

    // when
    const { container } = render(
      <LayoutHeaderMenuComponent
        opened
        firstname="any-firstname-mock"
        isMobile={false}
        lastname="any-lastname-mock"
        onClose={onCloseMock}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call LayoutHeaderToolsComponent', () => {
    // given
    const onCloseMock = jest.fn();

    // when
    render(
      <LayoutHeaderMenuComponent
        opened
        firstname="any-firstname-mock"
        isMobile={false}
        lastname="any-lastname-mock"
        onClose={onCloseMock}
      />,
    );

    // then
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderToolsComponent).toHaveBeenCalledWith(
      {
        firstname: 'any-firstname-mock',
        isModalMenu: true,
        lastname: 'any-lastname-mock',
      },
      {},
    );
  });

  it('should match the snapshot, when navigationItems is defined', () => {
    // given
    const onCloseMock = jest.fn();

    // when
    const { container } = render(
      <LayoutHeaderMenuComponent
        opened
        firstname="any-firstname-mock"
        isMobile={false}
        lastname="any-lastname-mock"
        navigationItems={navigationItemsMock}
        onClose={onCloseMock}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call LayoutHeaderNavigationComponent when navigationItems is defined', () => {
    // given
    const onCloseMock = jest.fn();

    // when
    render(
      <LayoutHeaderMenuComponent
        firstname="any-firstname-mock"
        isMobile={false}
        lastname="any-lastname-mock"
        navigationItems={navigationItemsMock}
        opened={false}
        onClose={onCloseMock}
      />,
    );

    // then
    expect(LayoutHeaderNavigationComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderNavigationComponent).toHaveBeenCalledWith(
      {
        navigationItems: navigationItemsMock,
        onItemClick: onCloseMock,
      },
      {},
    );
  });

  it('should call LayoutHeaderNavigationComponent with className when is mobile viewport', () => {
    // given
    const onCloseMock = jest.fn();

    // when
    render(
      <LayoutHeaderMenuComponent
        isMobile
        firstname="any-firstname-mock"
        lastname="any-lastname-mock"
        navigationItems={navigationItemsMock}
        opened={false}
        onClose={onCloseMock}
      />,
    );

    // then
    expect(LayoutHeaderNavigationComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderNavigationComponent).toHaveBeenCalledWith(
      {
        className: expect.any(String),
        navigationItems: navigationItemsMock,
        onItemClick: onCloseMock,
      },
      {},
    );
  });

  it('should call LayoutHeaderNavigationComponent without className when is not mobile viewport', () => {
    // given
    const onCloseMock = jest.fn();

    // when
    render(
      <LayoutHeaderMenuComponent
        firstname="any-firstname-mock"
        isMobile={false}
        lastname="any-lastname-mock"
        navigationItems={navigationItemsMock}
        opened={false}
        onClose={onCloseMock}
      />,
    );

    // then
    expect(LayoutHeaderNavigationComponent).toHaveBeenCalledOnce();
    expect(LayoutHeaderNavigationComponent).toHaveBeenCalledWith(
      {
        className: undefined,
        navigationItems: navigationItemsMock,
        onItemClick: onCloseMock,
      },
      {},
    );
  });
});
