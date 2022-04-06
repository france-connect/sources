import { NavLink } from 'react-router-dom';

import { renderWithRouter } from '@fc/tests-utils';

import { NavigationLinksComponent } from './navigation-links.component';

jest.mock('react-router-dom');

describe('NavigationLinksComponent', () => {
  // given
  const navigationLinksMock = [
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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the labels of the two links', () => {
    // when
    const { getByText } = renderWithRouter(
      <NavigationLinksComponent items={navigationLinksMock} />,
    );
    const firstElement = getByText('any-label-mock-1');
    const secondElement = getByText('any-label-mock-2');
    // then
    expect(firstElement).toBeInTheDocument();
    expect(secondElement).toBeInTheDocument();
  });

  it('should call NavLink two times with default props', () => {
    // when
    renderWithRouter(<NavigationLinksComponent items={navigationLinksMock} />);
    // then
    expect(NavLink).toHaveBeenCalledTimes(2);
    expect(NavLink).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        activeClassName: 'current is-blue-france',
        'aria-current': 'page',
        className:
          'NavigationLinkComponent is-g700 no-underline is-relative is-inline-block fs14 lh24',
        onClick: undefined,
        title: 'any-a11y-mock-1',
        to: 'any-href-mock-1',
      }),
      {},
    );
    expect(NavLink).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        activeClassName: 'current is-blue-france',
        'aria-current': 'page',
        className:
          'NavigationLinkComponent is-g700 no-underline is-relative is-inline-block fs14 lh24',
        onClick: undefined,
        title: 'any-a11y-mock-2',
        to: 'any-href-mock-2',
      }),
      {},
    );
  });

  it('should call NavLink with the defined onClick callback', () => {
    // given
    const clickMock = jest.fn();
    // when
    renderWithRouter(
      <NavigationLinksComponent items={navigationLinksMock} onItemClick={clickMock} />,
    );
    // then
    expect(NavLink).toHaveBeenCalledTimes(2);
    expect(NavLink).toHaveBeenNthCalledWith(1, expect.objectContaining({ onClick: clickMock }), {});
    expect(NavLink).toHaveBeenNthCalledWith(2, expect.objectContaining({ onClick: clickMock }), {});
  });
});
